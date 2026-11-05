// records.js: Leaderboard, history and player name, all kept only in this browser on this device.
//
// Privacy rule: nothing is ever sent anywhere. The leaderboard shows this device's best games,
// and clearing the browser's site data removes everything.
const Store = {
  history: [], name: '',

  init() {
    this.loadLocal();
    try { this.name = cleanName(localStorage.getItem('fishball-name') || ''); } catch (e) {}
    syncNameInputs();
    renderBoards();
  },
  loadLocal() {
    try { this.history = JSON.parse(localStorage.getItem('fishball-history') || '[]') || []; } catch (e) { this.history = []; }
  },
  runsFor(lv) { return this.history.filter((r) => (r.level || 'normal') === lv); },
  localBest(lv) { return this.runsFor(lv).reduce((m, r) => Math.max(m, r.score), 0); },
  ensureName() {
    if (this.name) return;
    this.name = randomName();
    try { localStorage.setItem('fishball-name', this.name); } catch (e) {}
    syncNameInputs();
  },
  saveRun(run) {
    this.ensureName();
    const isNew = run.score > this.localBest(run.level);
    run.name = this.name;   // remember who played, for this device's leaderboard
    this.history = [run, ...this.history].slice(0, HISTORY_MAX);
    try { localStorage.setItem('fishball-history', JSON.stringify(this.history)); } catch (e) {}
    return { isNew };
  },
  setName(raw) {
    this.name = cleanName(raw);
    try { localStorage.setItem('fishball-name', this.name); } catch (e) {}
    syncNameInputs();
    renderBoards();
    return true;
  },
  // this game's place among all games of the same level on this device
  place(run) {
    return this.runsFor(run.level).filter((r) => r.score > run.score).length + 1;
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

function renderBoards() {
  const lb = $('lb-list');
  const note = $('lb-note');
  $('lb-normal').setAttribute('aria-pressed', String(lbLevel === 'normal'));
  $('lb-hard').setAttribute('aria-pressed', String(lbLevel === 'hard'));
  const row = (posText, nameText, subText, pts, me) => {
    const el = li(me ? 'me' : '');
    const pos = document.createElement('span'); pos.className = 'pos'; pos.textContent = posText;
    const who = document.createElement('span'); who.className = 'who'; who.textContent = nameText;
    if (subText) { const sub = document.createElement('small'); sub.textContent = subText; who.appendChild(sub); }
    const p = document.createElement('span'); p.className = 'pts'; p.textContent = pts;
    const u = document.createElement('small'); u.textContent = t('unit.pts'); p.appendChild(u);
    el.append(pos, who, p);
    return el;
  };
  note.textContent = t('lb.note');
  const top = Store.runsFor(lbLevel).sort((a, b) => b.score - a.score || a.at - b.at).slice(0, 10);
  if (top.length) showChamp(top[0].name || Store.name || t('you'), top[0].score); else showChamp(null);
  if (!top.length) lb.replaceChildren(emptyRow(t('hist.empty')));
  else lb.replaceChildren(...top.map((r, i) => row(i + 1, r.name || Store.name || t('you'), fmtDate(r.at), r.score, r === lastRun)));
  const b = Store.localBest(level);
  showIntroRecord(b ? t('intro.local', levelLabel(level), b) : '');
  // personal history
  const h = Store.history;
  const bestN = Store.localBest('normal');
  const bestH = Store.localBest('hard');
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
function saveResultName() {
  Store.setName($('name-result').value);
  toast(Store.name ? t('toast.nameSaved', Store.name) : t('toast.nameCleared'));
}
$('save-name').addEventListener('click', saveResultName);
$('roll-intro').addEventListener('click', () => { Store.setName(randomName()); });
$('roll-result').addEventListener('click', () => { $('name-result').value = randomName(); saveResultName(); });
$('name-result').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveResultName(); } });
