// records.js: The player's games, kept only in this browser on this device.
//
// Privacy rule: nothing is ever sent anywhere. "My games" lists this device's games ranked by score,
// and "Delete all my data" (or clearing the browser's site data) removes everything.
const Store = {
  history: [],

  init() {
    this.loadLocal();
    renderBoards();
  },
  loadLocal() {
    try { this.history = JSON.parse(localStorage.getItem('fishball-history') || '[]') || []; } catch (e) { this.history = []; }
    // tidy up data from older versions of the game, which stored a player name
    try {
      localStorage.removeItem('fishball-name');
      if (this.history.some((x) => 'name' in x)) {
        this.history.forEach((x) => { delete x.name; });
        localStorage.setItem('fishball-history', JSON.stringify(this.history));
      }
    } catch (e) {}
  },
  runsFor(lv) { return this.history.filter((x) => (x.level || 'normal') === lv); },
  localBest(lv) { return this.runsFor(lv).reduce((m, x) => Math.max(m, x.score), 0); },
  saveRun(run) {
    const isNew = run.score > this.localBest(run.level);
    this.history = [run, ...this.history].slice(0, HISTORY_MAX);
    try { localStorage.setItem('fishball-history', JSON.stringify(this.history)); } catch (e) {}
    return { isNew };
  },
  // remove every trace of the game from this browser: games and language choice
  clearAll() {
    try { Object.keys(localStorage).filter((k) => k.startsWith('fishball-')).forEach((k) => localStorage.removeItem(k)); } catch (e) {}
    this.history = [];
  },
};

const fmtDate = (ms) => {
  try { return new Date(ms).toLocaleString(t('date.locale'), { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch (e) { return ''; }
};
function li(cls) { const el = document.createElement('li'); if (cls) el.className = cls; return el; }
function emptyRow(text) { const el = li('empty'); el.textContent = text; return el; }

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
    el.classList.add('rec');
    const pos = document.createElement('span'); pos.className = 'pos'; pos.textContent = i + 1;
    // score top-left, rank title top-right, fishballs and sticks bottom-left, date and time bottom-right
    const body = document.createElement('span'); body.className = 'rec-body';
    const score = document.createElement('span'); score.className = 'rec-score'; score.textContent = x.score;
    const u = document.createElement('small'); u.textContent = t('unit.pts'); score.appendChild(u);
    const title = document.createElement('span'); title.className = 'rec-title'; title.textContent = rankFor(x.score, recLevel);
    const sub = document.createElement('span'); sub.className = 'rec-sub'; sub.textContent = t('rec.sub', x);
    const when = document.createElement('span'); when.className = 'rec-when'; when.textContent = fmtDate(x.at);
    body.append(score, title, sub, when);
    el.append(pos, body);
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
document.querySelectorAll('.lang').forEach((b) => b.addEventListener('click', () => setLang(lang === 'zh' ? 'en' : 'zh')));
langListeners.push(renderBoards);
$('r-menu').addEventListener('click', () => { $('result').hidden = true; $('intro').hidden = false; setLevel(playLevel); });
$('close-board').addEventListener('click', () => { $('board').hidden = true; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('board').hidden) $('board').hidden = true; });
