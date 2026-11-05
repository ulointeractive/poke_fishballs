// records.js: Leaderboard, personal history and player names (online in claude.ai, browser storage otherwise).

// ---------- records: shared leaderboard + personal history ----------
// Online (inside claude.ai): leaderboard in `scores/<viewer id>`, history private in `data/users/<id>/history`.
// Offline (file opened directly): this browser's localStorage only.
const Store = {
  mode: 'local', db: null, user: null, uid: null, canSave: true,
  leaders: { normal: [], hard: [] }, lbLoaded: { normal: false, hard: false }, lbTimedOut: false,
  history: [], mine: { normal: null, hard: null }, name: '',

  async init() {
    this.loadLocal();
    try { this.name = cleanName(localStorage.getItem('fishball-name') || ''); } catch (e) {}
    syncNameInputs();
    try {
      if (window.claude && typeof window.claude.use === 'function') {
        const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
        const uid = db && user ? await user.id() : null;
        if (db && uid) {
          Object.assign(this, { db, user, uid, mode: 'cloud' });
          this.subscribe();
        }
      }
    } catch (e) { /* stay local */ }
    renderBoards();
  },
  localBest(lv) {
    return this.history.filter((r) => (r.level || 'normal') === lv).reduce((m, r) => Math.max(m, r.score), 0);
  },
  loadLocal() {
    try { this.history = JSON.parse(localStorage.getItem('fishball-history') || '[]') || []; } catch (e) { this.history = []; }
    for (const lv of ['normal', 'hard']) {
      const best = this.localBest(lv);
      this.mine[lv] = best ? { best } : null;
    }
  },
  subscribe() {
    const timer = setTimeout(() => {
      if (!this.lbLoaded.normal || !this.lbLoaded.hard) { this.lbTimedOut = true; renderBoards(); }
    }, 10000);
    for (const lv of ['normal', 'hard']) {
      this.db.collection(COLLECTION[lv]).orderBy('best', 'desc').limit(50).onSnapshot((snap) => {
        this.leaders[lv] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (!snap.metadata.fromCache || this.leaders[lv].length) this.lbLoaded[lv] = true;
        if (this.lbLoaded.normal && this.lbLoaded.hard) clearTimeout(timer);
        renderBoards();
      }, () => { this.lbTimedOut = true; renderBoards(); });
      this.db.doc(COLLECTION[lv] + '/' + this.uid).onSnapshot((d) => {
        this.mine[lv] = d.exists ? d.data() : null;
        if (!this.name && this.mine[lv] && this.mine[lv].name) { this.name = cleanName(this.mine[lv].name); syncNameInputs(); }
        renderBoards();
      }, () => {});
    }
    this.db.doc('data/users/' + this.uid + '/history').onSnapshot((d) => {
      this.history = (d.exists && Array.isArray(d.data().runs)) ? d.data().runs : [];
      renderBoards();
    }, () => {});
  },
  async saveRun(run) {
    if (!this.name) {
      this.name = randomName();
      try { localStorage.setItem('fishball-name', this.name); } catch (e) {}
      syncNameInputs();
    }
    const lv = run.level;
    const mine = this.mine[lv];
    const prevBest = Math.max(mine ? mine.best || 0 : 0, this.localBest(lv));
    const isNew = run.score > prevBest;
    const runs = [run, ...this.history].slice(0, HISTORY_MAX);
    if (this.mode === 'cloud' && this.canSave) {
      try {
        await this.db.doc('data/users/' + this.uid + '/history').set({ runs });
        if (!SAVE_RANKING) {
          this.history = runs;
          return { isNew, saved: 'test' };
        }
        const games = (mine && mine.games || 0) + 1;
        const top = isNew ? { best: run.score, sticks: run.sticks, served: run.served, perfects: run.perfects, wrong: run.wrong, at: run.at }
          : { best: prevBest, sticks: mine.sticks || 0, served: mine.served || 0, perfects: mine.perfects || 0, wrong: mine.wrong || 0, at: mine.at || run.at };
        const doc = { ...top, games, name: this.name };
        await this.db.doc(COLLECTION[lv] + '/' + this.uid).set(doc);
        this.history = runs;
        this.mine[lv] = doc;
        return { isNew, saved: 'cloud' };
      } catch (e) {
        this.canSave = false;
      }
    }
    this.history = runs;
    this.mine[lv] = { best: Math.max(prevBest, run.score) };
    try { localStorage.setItem('fishball-history', JSON.stringify(runs)); } catch (e) {}
    return { isNew, saved: this.mode === 'cloud' ? 'readonly' : 'local' };
  },
  async setName(raw) {
    this.name = cleanName(raw);
    try { localStorage.setItem('fishball-name', this.name); } catch (e) {}
    syncNameInputs();
    if (this.mode === 'cloud' && this.canSave && SAVE_RANKING) {
      for (const lv of ['normal', 'hard']) {
        if (!this.mine[lv] || this.mine[lv].games == null) continue;
        try {
          const doc = { ...this.mine[lv], name: this.name };
          await this.db.doc(COLLECTION[lv] + '/' + this.uid).set(doc);
          this.mine[lv] = doc;
        } catch (e) { this.canSave = false; return false; }
      }
    }
    renderBoards();
    return true;
  },
  place(lv) {
    const mine = this.mine[lv];
    if (this.mode !== 'cloud' || !mine) return null;
    const list = this.leaders[lv];
    const i = list.findIndex((r) => r.id === this.uid);
    if (i >= 0) return i + 1;
    return list.filter((r) => r.best > mine.best).length + 1;
  },
};

const fmtDate = (ms) => {
  try { return new Date(ms).toLocaleString(t('date.locale'), { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch (e) { return ''; }
};
function li(cls) { const el = document.createElement('li'); if (cls) el.className = cls; return el; }
function emptyRow(text) { const el = li('empty'); el.textContent = text; return el; }

// a random stall-style name for players who don't type one (no places or personal details)
function randomName() {
  return pick(t('names.epithets')) + t('names.join') + pick(t('names.roles'));
}
function cleanName(s) {
  return String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
}
function syncNameInputs() {
  for (const id of ['name-intro', 'name-result']) {
    const el = $(id);
    if (document.activeElement !== el) el.value = Store.name;
  }
}
// the all-time record stays on top until somebody beats it
function showChamp(name, pts) {
  const box = $('champ');
  if (name == null) { box.hidden = true; return; }
  $('champ-name').textContent = name;
  $('champ-pts').textContent = pts;
  const u = document.createElement('small'); u.textContent = ' ' + t('unit.pts'); $('champ-pts').appendChild(u);
  box.hidden = false;
}
function showIntroRecord(text) {
  const line = $('intro-record');
  line.textContent = text || '';
  line.hidden = !text;
}

let renderSeq = 0;
async function renderBoards() {
  const seq = ++renderSeq;
  const lb = $('lb-list');
  const note = $('lb-note');
  $('lb-normal').setAttribute('aria-pressed', String(lbLevel === 'normal'));
  $('lb-hard').setAttribute('aria-pressed', String(lbLevel === 'hard'));
  const row = (posText, nameText, subText, pts, me) => {
    const el = li(me ? 'me' : '');
    const pos = document.createElement('span'); pos.className = 'pos'; pos.textContent = posText;
    const who = document.createElement('span'); who.className = 'who'; who.textContent = nameText;
    const sub = document.createElement('small'); sub.textContent = subText; who.appendChild(sub);
    const p = document.createElement('span'); p.className = 'pts'; p.textContent = pts;
    const u = document.createElement('small'); u.textContent = t('unit.pts'); p.appendChild(u);
    el.append(pos, who, p);
    return el;
  };
  if (Store.mode === 'cloud') {
    note.textContent = Store.canSave ? t('lb.note') : t('lb.readonly');
    if (seq !== renderSeq) return;
    const nameOf = (r) => cleanName(r.name) || t('anon');
    const list = Store.leaders[lbLevel];
    if (!Store.lbLoaded[lbLevel]) {
      showChamp(null);
      lb.replaceChildren(emptyRow(Store.lbTimedOut ? t('lb.unreachable') : t('lb.loading')));
    } else if (!list.length) {
      showChamp(null);
      lb.replaceChildren(emptyRow(t('lb.empty')));
    } else {
      showChamp(nameOf(list[0]), list[0].best);
      lb.replaceChildren(...list.map((r, i) => row(i + 1, r.id === Store.uid ? t('you.tag', nameOf(r)) : nameOf(r),
        lbLevel === 'hard' ? t('lb.subHard', r.sticks || 0, r.perfects || 0, r.wrong || 0) : t('lb.subNormal', r.sticks || 0, r.perfects || 0),
        r.best, r.id === Store.uid)));
    }
    const top = Store.leaders[level][0];
    showIntroRecord(top ? t('intro.record', levelLabel(level), nameOf(top), top.best) : '');
  } else {
    note.textContent = t('lb.offline');
    const top = Store.history.filter((r) => (r.level || 'normal') === lbLevel).sort((a, b) => b.score - a.score).slice(0, 10);
    if (top.length) showChamp(Store.name || t('you'), top[0].score); else showChamp(null);
    if (!top.length) lb.replaceChildren(emptyRow(t('hist.empty')));
    else lb.replaceChildren(...top.map((r, i) => row(i + 1, Store.name || t('you'), fmtDate(r.at), r.score, false)));
    const b = Store.localBest(level);
    showIntroRecord(b ? t('intro.local', levelLabel(level), b) : '');
  }
  // personal history
  const h = Store.history;
  const bestN = Math.max(Store.localBest('normal'), (Store.mine.normal && Store.mine.normal.best) || 0);
  const bestH = Math.max(Store.localBest('hard'), (Store.mine.hard && Store.mine.hard.best) || 0);
  $('h-games').textContent = h.length;
  $('h-best').textContent = bestN;
  $('h-avg').textContent = bestH;
  const hl = $('hist-list');
  if (!h.length) hl.replaceChildren(emptyRow(t('hist.empty')));
  else hl.replaceChildren(...h.map((r) => {
    const lv = r.level || 'normal';
    const best = lv === 'hard' ? bestH : bestN;
    const el = li(r.score === best && best > 0 ? 'me' : '');
    const who = document.createElement('span'); who.className = 'who';
    const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = levelLabel(lv);
    who.append(tag, document.createTextNode(fmtDate(r.at)));
    const sub = document.createElement('small');
    sub.textContent = t('hist.sub', r, lv === 'hard');
    who.appendChild(sub);
    const bar = document.createElement('div'); bar.className = 'bar'; bar.style.width = `${best ? Math.max(4, (r.score / best) * 100) : 0}%`; who.appendChild(bar);
    const pts = document.createElement('span'); pts.className = 'pts'; pts.textContent = r.score;
    const u = document.createElement('small'); u.textContent = t('unit.pts'); pts.appendChild(u);
    el.append(who, pts);
    return el;
  }));
}

function openBoard(tab, lv) {
  if (lv) lbLevel = lv;
  showTab(tab);
  $('board').hidden = false;
  renderBoards();
}
function showTab(tab) {
  $('tab-lb').setAttribute('aria-selected', String(tab === 'lb'));
  $('tab-hist').setAttribute('aria-selected', String(tab === 'hist'));
  $('pane-lb').hidden = tab !== 'lb';
  $('pane-hist').hidden = tab !== 'hist';
}
$('open-board').addEventListener('click', () => openBoard('lb'));
$('open-history').addEventListener('click', () => openBoard('hist'));
$('r-board').addEventListener('click', () => openBoard('lb', playLevel));
$('lb-normal').addEventListener('click', () => { lbLevel = 'normal'; renderBoards(); });
$('lb-hard').addEventListener('click', () => { lbLevel = 'hard'; renderBoards(); });
function setLevel(lv) {
  level = lv;
  $('lv-normal').setAttribute('aria-checked', String(lv === 'normal'));
  $('lv-hard').setAttribute('aria-checked', String(lv === 'hard'));
  $('legend-hard').hidden = lv !== 'hard';
  if (lv === 'hard') drawLegend();
  renderBoards();
}
$('lv-normal').addEventListener('click', () => setLevel('normal'));
$('lv-hard').addEventListener('click', () => setLevel('hard'));
$('lang').addEventListener('click', () => setLang(lang === 'zh' ? 'en' : 'zh'));
langListeners.push(() => { renderBoards(); syncNameInputs(); });
$('r-menu').addEventListener('click', () => { $('result').hidden = true; $('intro').hidden = false; setLevel(playLevel); });
$('tab-lb').addEventListener('click', () => showTab('lb'));
$('tab-hist').addEventListener('click', () => showTab('hist'));
$('close-board').addEventListener('click', () => { $('board').hidden = true; });

// ---------- name ----------
$('name-intro').addEventListener('change', (e) => { Store.setName(e.target.value); });
async function saveResultName() {
  const ok = await Store.setName($('name-result').value);
  toast(ok ? (Store.name ? t('toast.nameSaved', Store.name) : t('toast.nameCleared')) : t('toast.nameFail'));
}
$('save-name').addEventListener('click', saveResultName);
$('roll-intro').addEventListener('click', () => { Store.setName(randomName()); });
$('roll-result').addEventListener('click', () => { $('name-result').value = randomName(); saveResultName(); });
$('name-result').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveResultName(); } });
