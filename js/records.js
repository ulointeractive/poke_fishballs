// records.js: The player's games and name, kept only in this browser on this device.
//
// Privacy rule: nothing is ever sent anywhere. "My games" lists this device's games ranked by score,
// and "Delete all my data" (or clearing the browser's site data) removes everything.
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
  // remove every trace of the game from this browser: games, name and language choice
  clearAll() {
    try { Object.keys(localStorage).filter((k) => k.startsWith('fishball-')).forEach((k) => localStorage.removeItem(k)); } catch (e) {}
    this.history = []; this.name = '';
    syncNameInputs();
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
function showIntroRecord(text) {
  const line = $('intro-record');
  line.textContent = text || '';
  line.hidden = !text;
}

// "My games": this device's games for one level, best first
function renderBoards() {
  $('rec-normal').setAttribute('aria-pressed', String(recLevel === 'normal'));
  $('rec-hard').setAttribute('aria-pressed', String(recLevel === 'hard'));
  const runs = Store.runsFor(recLevel).sort((a, b) => b.score - a.score || a.at - b.at);
  const best = runs.length ? runs[0].score : 0;
  $('h-games').textContent = runs.length;
  $('h-best').textContent = best;
  $('h-avg').textContent = runs.length ? Math.round(runs.reduce((s, x) => s + x.score, 0) / runs.length) : 0;
  const list = $('rec-list');
  if (!runs.length) list.replaceChildren(emptyRow(t('hist.empty')));
  else list.replaceChildren(...runs.map((x, i) => {
    const el = li(x === lastRun ? 'me' : '');
    const pos = document.createElement('span'); pos.className = 'pos'; pos.textContent = i + 1;
    const who = document.createElement('span'); who.className = 'who';
    who.textContent = fmtDate(x.at) + (x.name ? ' · ' + x.name : '');
    const sub = document.createElement('small'); sub.textContent = t('hist.sub', x, recLevel === 'hard'); who.appendChild(sub);
    const bar = document.createElement('div'); bar.className = 'bar'; bar.style.width = `${best ? Math.max(4, (x.score / best) * 100) : 0}%`; who.appendChild(bar);
    const p = document.createElement('span'); p.className = 'pts'; p.textContent = x.score;
    const u = document.createElement('small'); u.textContent = t('unit.pts'); p.appendChild(u);
    el.append(pos, who, p);
    return el;
  }));
  const b = Store.localBest(level);
  showIntroRecord(b ? t('intro.local', levelLabel(level), b) : '');
}

function openBoard(lv) {
  if (lv) recLevel = lv;
  $('del-confirm').hidden = true; $('del-all').hidden = false;
  $('rec-note').textContent = t('rec.note');
  $('board').hidden = false;
  renderBoards();
}
$('open-history').addEventListener('click', () => openBoard());
$('r-board').addEventListener('click', () => openBoard(playLevel));
$('rec-normal').addEventListener('click', () => { recLevel = 'normal'; renderBoards(); });
$('rec-hard').addEventListener('click', () => { recLevel = 'hard'; renderBoards(); });

// delete everything this game stored on the device, after a confirm step
$('del-all').addEventListener('click', () => { $('del-all').hidden = true; $('del-confirm').hidden = false; });
$('del-no').addEventListener('click', () => { $('del-confirm').hidden = true; $('del-all').hidden = false; });
$('del-yes').addEventListener('click', () => {
  Store.clearAll();
  $('del-confirm').hidden = true; $('del-all').hidden = false;
  $('rec-note').textContent = t('rec.deleted');
  renderBoards();
});
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
