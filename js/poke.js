// poke.js: Poking: hits, misses, slips, wrong items, scoring, handing a full stick to a customer.

// ---------- poking ----------
function addPop(text, x, y, color = '#fff', size = 18) { pops.push({ text, x, y, t: 0, color, size }); }
function inCurry(sx, sy) {
  const dx = (sx - L.cx) / L.lrx, dy = (sy - L.cy) / L.lry;
  return dx * dx + dy * dy < 1;
}

function resolvePoke() {
  const tx = stick.x, ty = stick.y;
  const fx = tx - L.cx, fy = (ty - L.cy) / L.sq;
  if (!inCurry(tx, ty)) { addPop(t('pop.air'), tx, ty - 24, '#3b3330', 15); return; }
  if (stick.balls.length >= STICK_CAP) return;
  ripples.push({ x: fx, y: fy, t: 0 });

  let hit = null, hs = null;
  for (const b of balls) {
    if (b.drop > 0.05) continue;
    const s = ballScreen(b), dx = tx - s.sx, dy = ty - s.sy;
    if (dx * dx + dy * dy < L.r * L.r && (!hit || s.sy > hs.sy)) { hit = b; hs = s; }
  }
  if (!hit) {
    impulse(fx, fy, L.r * 4, L.R * 0.55);
    sound('drip');
    addPop(t('pop.miss'), tx, ty - 24, '#fff2d6', 16);
    return;
  }
  const off = (tx - hs.sx) / L.r;
  if (Math.abs(off) > 0.72) {
    hit.vx += -Math.sign(off) * L.R * 1.1;
    impulse(fx, fy, L.r * 3.5, L.R * 0.6);
    slips++;
    addPop(t('pop.slip'), tx, ty - 24, '#ffd0c4', 17);
    return;
  }
  balls.splice(balls.indexOf(hit), 1);
  stick.balls.push({ off, rel: hs.sy - ty, v: hit.v, kind: hit.kind });
  impulse(fx, fy, L.r * 4.2, L.R * 0.75);
  if (hit.kind !== 'fish') {
    // wrong item: lose points, and it still takes a place on the stick
    wrong++;
    score = Math.max(0, score - WRONG_PENALTY);
    addPop(t('pop.wrong', kindName(hit.kind), WRONG_PENALTY), tx, ty - 30, '#ff9b8a', 20);
  } else {
    served++;
    if (Math.abs(off) < 0.18) {
      perfects++; score += 1 + CENTER_BONUS;
      sound('perfect'); addPop(t('pop.perfect', 1 + CENTER_BONUS), tx, ty - 30, '#ffe27a', 22);
    } else {
      score += 1;
      sound('poke'); addPop('+1', tx, ty - 30, '#fff', 18);
    }
  }
  updateHUD();
}

// a full stick goes to the next customer; what's on it and how neat it is decides their reaction
function handOut() {
  const n = stick.balls.length;
  if (!n) return;
  const target = customers.find((c) => !c.served);
  if (!target) return;
  target.served = true;
  const odd = stick.balls.find((b) => b.kind !== 'fish');
  const avg = stick.balls.reduce((s, b) => s + Math.abs(b.off), 0) / n;
  let say, mood;
  if (odd) { say = pick(t('say.wrong'))(kindName(odd.kind)); mood = 0; }
  else {
    say = pick(t(avg < 0.2 ? 'say.great' : avg < 0.42 ? 'say.ok' : 'say.bad'));
    mood = avg < 0.2 ? 2 : avg < 0.42 ? 1 : 0;
  }
  const list = stick.balls.map((b, i, a) => ({ off: b.off, rel: slotRel(i, a.length), v: b.v, kind: b.kind }));
  flyers.push({ balls: list, x0: stick.x, y0: tipY(), t: 0, target, say, mood });
  stick.balls = [];
  sticks++;
  sound('ding');
  const cfg = LEVELS[playLevel];
  if (cfg.dropPerStick && state === 'play') {
    // every finished stick drops more of the other stuff into the pot
    for (let i = 0; i < cfg.dropPerStick && countKind(false) < wantOthers(); i++) {
      const a = rand(Math.PI * 1.1, Math.PI * 1.9), d = rand(0.2, 0.9) * L.rin;
      const b = makeBall(Math.cos(a) * d, Math.sin(a) * d, 1);
      b.kind = pick(OTHER_KINDS);
      balls.push(b);
    }
    addPop(t('pop.more'), L.cx, L.cy - L.R * L.sq * 0.6, '#ffd0c4', 18);
  }
  updateHUD();
}

function slotRel(i, n) { return -(L.r * 1.3 + (n - 1 - i) * L.r * 1.86); }
function tipY() { return stick.y - L.r * 1.9 * (1 - stick.depth); }
