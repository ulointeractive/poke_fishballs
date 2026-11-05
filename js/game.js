// game.js: Main loop, controls, start / pause / end of a game, and start-up.

// ---------- update ----------
function update(dt) {
  if (state === 'play') {
    timeLeft -= dt;
    if (timeLeft <= 0) { timeLeft = 0; endGame(); }
  }
  // a new poke has to start from a lifted stick: down -> up -> down
  if (stick.needLift && stick.depth < 0.35) stick.needLift = false;
  const plunging = stick.pressed && !stick.needLift;
  stick.depth += ((plunging ? 1 : 0) - stick.depth) * Math.min(1, dt * (plunging ? 22 : 14));
  if (plunging && !stick.resolved && stick.depth > 0.85) { stick.resolved = true; if (state === 'play') resolvePoke(); }

  stick.balls.forEach((b, i, a) => { b.rel += (slotRel(i, a.length) - b.rel) * Math.min(1, dt * 14); });

  physics(dt);

  // the stall keeps topping up: fishballs first, then the other stuff up to its share
  if (countKind(true) < wantFish() || countKind(false) < wantOthers()) {
    refillTimer += dt;
    if (refillTimer > REFILL_EVERY) {
      refillTimer = 0;
      const a = rand(Math.PI * 1.15, Math.PI * 1.85), d = rand(0.3, 0.9) * L.rin;
      balls.push(makeBall(Math.cos(a) * d, Math.sin(a) * d, 1));
    }
  } else refillTimer = 0;

  ripples.forEach((r) => (r.t += dt)); ripples = ripples.filter((r) => r.t < 0.7);
  pops.forEach((p) => (p.t += dt)); pops = pops.filter((p) => p.t < 0.9);

  if (!reduceMotion && Math.random() < dt * 8) {
    steam.push({ x: L.cx + rand(-0.7, 0.7) * L.R, y: L.cy + rand(-0.3, 0.3) * L.R * L.sq, t: 0, life: rand(1.6, 2.6), s: rand(0.8, 1.4), vx: rand(-8, 8) });
  }
  steam.forEach((p) => { p.t += dt; p.y -= dt * L.R * 0.28; p.x += p.vx * dt; });
  steam = steam.filter((p) => p.t < p.life);

  for (const f of flyers) {
    f.t += dt / 0.5;
    if (f.t >= 1) {
      const c = f.target;
      customers.splice(customers.indexOf(c), 1);
      Object.assign(c, { leaving: true, wait: 0.55, bubble: f.say, bubbleT: 1.5, held: f.balls, mood: f.mood });
      leavers.push(c);
      spawnCustomer(-40);
    }
  }
  flyers = flyers.filter((f) => f.t < 1);

  const walk = (L.top / 165) * 150 * dt;
  for (const c of customers) {
    const d = c.tx - c.x;
    c.x += Math.sign(d) * Math.min(Math.abs(d), walk);
  }
  for (const c of leavers) {
    c.bubbleT -= dt;
    if (c.wait > 0) c.wait -= dt; else c.x += walk * 0.9;
  }
  leavers = leavers.filter((c) => c.x < W + 60);

  const t = Math.max(0, timeLeft);
  hudTime.textContent = t.toFixed(1);
  hudTime.classList.toggle('low', t <= 10 && state === 'play');
  timebar.style.transform = `scaleX(${t / GAME_TIME})`;
}

function updateHUD() {
  hudScore.textContent = score;
  hudSticks.textContent = sticks;
  dotEls.forEach((d, i) => d.classList.toggle('on', i < stick.balls.length));
}

// ---------- input ----------
function setPos(e) {
  const rect = cv.getBoundingClientRect();
  const nx = e.clientX - rect.left, ny = e.clientY - rect.top;
  if (stick.pressed && stick.resolved && state === 'play') {
    // dragging a stick that is down in the pot stirs the fishballs around it
    const dx = nx - stick.x, dy = ny - stick.y, m = Math.hypot(dx, dy);
    if (m > 0.5) {
      const fx = nx - L.cx, fy = (ny - L.cy) / L.sq;
      for (const b of balls) {
        if (b.drop > 0) continue;
        if (Math.hypot(b.x - fx, b.y - fy) < L.r * 2.4) { b.vx += dx * 6; b.vy += (dy / L.sq) * 6; }
      }
    }
  }
  stick.x = nx; stick.y = ny; stick.hasPointer = true;
}
cv.addEventListener('pointermove', setPos);
cv.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  try { cv.setPointerCapture(e.pointerId); } catch (err) {}
  setPos(e);
  if (state !== 'play' || stick.pressed) return;
  stick.pressed = true; stick.resolved = false;
  if (stick.depth >= 0.35) stick.needLift = true;
});
function release() {
  if (!stick.pressed) return;
  stick.pressed = false;
  if (state === 'play' && stick.balls.length >= STICK_CAP) handOut();
  updateHUD();
}
cv.addEventListener('pointerup', release);
cv.addEventListener('pointercancel', release);

// ---------- game flow ----------
function setChips(enabled) {
  $('open-board').disabled = !enabled; $('open-history').disabled = !enabled;
  $('pause').disabled = enabled;
}
function pauseGame() {
  if (state !== 'play') return;
  state = 'paused';
  stick.pressed = false; stick.needLift = false;
  $('pause-info').textContent = `${LEVELS[playLevel].label}關 · 仲有 ${timeLeft.toFixed(1)} 秒 · ${score} 分`;
  $('paused').hidden = false;
  $('pause').textContent = '暫停中';
}
function resumeGame() {
  if (state !== 'paused') return;
  $('paused').hidden = true;
  $('pause').textContent = '暫停';
  state = 'play';
}
$('pause').addEventListener('click', () => { if (state === 'play') pauseGame(); else resumeGame(); });
$('resume').addEventListener('click', resumeGame);
$('restart').addEventListener('click', () => { $('paused').hidden = true; $('pause').textContent = '暫停'; level = playLevel; startGame(); });
$('quit').addEventListener('click', () => {
  // leave without saving this game
  $('paused').hidden = true; $('pause').textContent = '暫停';
  state = 'ready'; stick.balls = []; score = 0; sticks = 0; timeLeft = GAME_TIME;
  updateHUD(); setChips(true);
  $('intro').hidden = false; setLevel(playLevel);
});
// pause by itself if the player switches away mid-game
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') { if (state === 'play') pauseGame(); else if (state === 'paused') resumeGame(); }
});
function startGame() {
  playLevel = level;
  if (cleanName($('name-intro').value) !== Store.name) Store.setName($('name-intro').value);
  initAudio();
  if (ac && ac.state === 'suspended') ac.resume();
  state = 'play';
  timeLeft = GAME_TIME; score = 0; sticks = 0; served = 0; perfects = 0; slips = 0; wrong = 0;
  stick.balls = []; stick.pressed = false; stick.needLift = false;
  flyers = []; pops = [];
  seedBalls();
  $('intro').hidden = true; $('result').hidden = true; $('board').hidden = true;
  setChips(false);
  updateHUD();
}
function rankFor(n, lv) {
  const t = lv === 'hard' ? [240, 180, 120, 60] : [320, 240, 160, 80];
  if (n >= t[0]) return '傳說級魚蛋佬';
  if (n >= t[1]) return '魚蛋師傅';
  if (n >= t[2]) return '熟手學徒';
  if (n >= t[3]) return '新嚟幫手';
  return '篤到手軟';
}
async function endGame() {
  state = 'over';
  stick.pressed = false;
  setChips(true);
  addPop('時間到！', W / 2, L.cy - L.R * 0.2, '#ffe27a', 30);
  const run = { level: playLevel, score, sticks, served, perfects, slips, wrong, at: Date.now() };
  lastRun = run;
  $('share-text').hidden = true;
  $('toast').textContent = '';
  syncNameInputs();
  $('rank').textContent = rankFor(score, playLevel);
  $('r-level').textContent = `${LEVELS[playLevel].label}關`;
  $('r-wrong').textContent = `${wrong} 件`;
  $('r-wrong').hidden = $('r-wrong-l').hidden = playLevel !== 'hard';
  $('r-score').textContent = score;
  $('r-sticks').textContent = `${sticks} 串`;
  $('r-served').textContent = `${served} 粒`;
  $('r-perfect').textContent = `${perfects} 次`;
  $('r-slip').textContent = `${slips} 次`;
  $('r-new').hidden = true;
  $('r-place').textContent = '儲存緊…';
  $('r-save').textContent = '';
  const shown = new Promise((res) => setTimeout(res, 900));
  let res = { isNew: false, saved: 'local' };
  try { res = await Store.saveRun(run); } catch (e) {}
  await shown;
  $('r-new').hidden = !res.isNew;
  $('r-best').textContent = `${Math.max(score, Store.localBest(playLevel), (Store.mine[playLevel] && Store.mine[playLevel].best) || 0)} 分`;
  const place = Store.place(playLevel);
  $('r-place').textContent = res.saved === 'test' ? '測試模式' : place ? `第 ${place} 名` : '只計呢部機';
  $('r-save').textContent = res.saved === 'readonly' ? '你嘅分數只儲存喺呢部機：你冇權限寫入排行榜。'
    : res.saved === 'test' ? '測試模式：呢局冇上排行榜。' : '';
  $('result').hidden = false;
  renderBoards();
}
$('start').addEventListener('click', startGame);
$('again').addEventListener('click', () => { level = playLevel; startGame(); });

// ---------- boot ----------
// The claude.ai viewer can swap in a new version of this page while it is open;
// booting through its update hook makes the new version start cleanly.
let booted = false;
function start() {
  if (booted) return;
  booted = true;
  resize();
  for (let i = 0; i < 4; i++) spawnCustomer(slotX(i));
  updateHUD();
  new ResizeObserver(() => resize()).observe(stage);
  Store.init();
  let last = performance.now();
  function frame(now) {
    const dt = clamp((now - last) / 1000, 0, 0.05);
    last = now; tNow += dt;
    // one bad frame must never stop the game loop
    if (L.R) { try { if (state !== 'paused') update(dt); draw(); } catch (e) { console.error(e); } }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const hot = window.claude && window.claude.hot;
try { if (hot && typeof hot.snapshot === 'function') hot.snapshot(() => ({ name: Store.name })); } catch (e) {}
try {
  if (hot && typeof hot.ready === 'function') hot.ready(start);
  else start();
} catch (e) { start(); }
// fallback in case the viewer's hook never calls back
setTimeout(start, 1500);
