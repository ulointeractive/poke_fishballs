// items.js: What is in the pot: item artwork (fishballs, radish, beef balls...), which items appear, and how they float.

// ---------- pot items: pre-rendered sprites per kind, mode and surface variant ----------
const VARIANTS = 3;
function shapePath(g, x, y, r, kind, v) {
  g.beginPath();
  if (kind === 'radish') {
    // a chunk of white radish: rounded cube seen from above
    const s = r * 0.84, a = (v - 1) * 0.35, cr = r * 0.3;
    const pts = [[-s, -s], [s, -s], [s, s], [-s, s]].map(([px, py]) => [x + px * Math.cos(a) - py * Math.sin(a), y + px * Math.sin(a) + py * Math.cos(a)]);
    g.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
    for (let i = 1; i <= 4; i++) g.arcTo(pts[i % 4][0], pts[i % 4][1], pts[(i + 1) % 4][0], pts[(i + 1) % 4][1], cr);
    g.closePath();
  } else if (kind === 'skin') {
    // a wavy piece of pig skin
    const a = (v - 1) * 0.6;
    for (let i = 0; i <= 48; i++) {
      const t = (i / 48) * TAU, wob = 1 + 0.07 * Math.sin(t * 8 + v * 2);
      const px = Math.cos(t) * r * 1.08 * wob, py = Math.sin(t) * r * 0.72 * wob;
      const qx = x + px * Math.cos(a) - py * Math.sin(a), qy = y + px * Math.sin(a) + py * Math.cos(a);
      if (i) g.lineTo(qx, qy); else g.moveTo(qx, qy);
    }
    g.closePath();
  } else {
    g.arc(x, y, kind === 'beef' ? r * 0.94 : r, 0, TAU);
  }
}
const PALETTE = {
  fish:   ['#fde9b0', '#efbd5a', '#cc8a2e', '#9c5c1b'],
  beef:   ['#b8875e', '#7a4a2b', '#55311b', '#341e10'],
  cuttle: ['#fffdf7', '#efe8d8', '#d6cbb2', '#a99a7c'],
  radish: ['#fbf4de', '#efe1b6', '#dcc286', '#b98a45'],
  skin:   ['#f6d29c', '#e2a865', '#c98845', '#99602a'],
};
function paintItem(g, x, y, r, kind, mode, v) {
  const c = PALETTE[kind];
  const base = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x, y, r * 1.1);
  base.addColorStop(0, c[0]); base.addColorStop(0.45, c[1]); base.addColorStop(0.85, c[2]); base.addColorStop(1, c[3]);
  g.fillStyle = base;
  shapePath(g, x, y, r, kind, v); g.fill();
  g.save();
  shapePath(g, x, y, r, kind, v); g.clip();
  let sd = 1234 + v * 7919 + kind.length * 104729;
  const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const specks = { fish: ['rgba(140,72,18,0.16)', 'rgba(255,244,210,0.2)', 34],
    beef: ['rgba(30,15,5,0.35)', 'rgba(210,160,120,0.25)', 46],
    cuttle: ['rgba(150,120,80,0.28)', 'rgba(240,150,110,0.25)', 30],
    radish: ['rgba(200,170,110,0.18)', 'rgba(255,255,240,0.3)', 18],
    skin: ['rgba(110,60,20,0.45)', 'rgba(255,230,190,0.25)', 60] }[kind];
  for (let i = 0; i < specks[2]; i++) {
    const a = rnd() * TAU, d = Math.sqrt(rnd()) * r * 1.05;
    g.fillStyle = rnd() < 0.6 ? specks[0] : specks[1];
    g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * (kind === 'skin' ? 0.02 : 0.025 + rnd() * 0.04), 0, TAU); g.fill();
  }
  if (kind === 'radish') {
    // fibres and a curry-stained edge
    g.strokeStyle = 'rgba(205,170,100,0.25)'; g.lineWidth = Math.max(1, r * 0.05);
    for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(x - r, y + i * r * 0.32); g.lineTo(x + r, y + i * r * 0.32 + r * 0.2); g.stroke(); }
    g.strokeStyle = 'rgba(200,120,30,0.45)'; g.lineWidth = r * 0.3;
    shapePath(g, x, y, r, kind, v); g.stroke();
  } else if (kind === 'skin') {
    g.strokeStyle = 'rgba(150,90,35,0.35)'; g.lineWidth = Math.max(1, r * 0.06);
    g.beginPath(); g.moveTo(x - r * 0.7, y - r * 0.1); g.quadraticCurveTo(x, y + r * 0.25, x + r * 0.7, y - r * 0.05); g.stroke();
  } else {
    const rim = g.createRadialGradient(x, y, r * 0.55, x, y, r);
    rim.addColorStop(0, 'rgba(190,95,15,0)');
    rim.addColorStop(1, kind === 'beef' ? 'rgba(40,20,5,0.35)' : 'rgba(160,75,10,0.38)');
    g.fillStyle = rim; g.fillRect(x - r * 1.2, y - r * 1.2, r * 2.4, r * 2.4);
  }
  if (mode === 'pot') {
    const sub = g.createLinearGradient(0, y + r * 0.3, 0, y + r);
    sub.addColorStop(0, 'rgba(178,90,16,0.92)'); sub.addColorStop(1, 'rgba(130,62,10,0.95)');
    g.fillStyle = sub; g.fillRect(x - r * 1.3, y + r * 0.3, r * 2.6, r);
    g.fillStyle = 'rgba(255,210,140,0.45)';
    g.fillRect(x - r * 1.3, y + r * 0.27, r * 2.6, Math.max(1, r * 0.08));
  } else if (mode === 'stick') {
    const glaze = g.createLinearGradient(0, y, 0, y + r);
    glaze.addColorStop(0, 'rgba(190,95,15,0)'); glaze.addColorStop(1, 'rgba(176,86,12,0.5)');
    g.fillStyle = glaze; g.fillRect(x - r * 1.3, y, r * 2.6, r);
  }
  g.restore();
  const shine = kind === 'radish' || kind === 'skin' ? 0.45 : kind === 'beef' ? 0.35 : 0.8;
  const hl = g.createRadialGradient(x - r * 0.36, y - r * 0.4, 0, x - r * 0.36, y - r * 0.4, r * 0.38);
  hl.addColorStop(0, `rgba(255,255,255,${shine})`);
  hl.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = hl;
  g.beginPath(); g.arc(x - r * 0.36, y - r * 0.4, r * 0.38, 0, TAU); g.fill();
}
function buildSprites() {
  const r = L.r, half = r * 1.3 + 2, size = Math.ceil(half * 2 * dpr);
  sprites = { half };
  for (const kind of Object.keys(KINDS)) {
    sprites[kind] = {};
    for (const mode of ['pot', 'stick', 'plain']) {
      sprites[kind][mode] = [];
      for (let v = 0; v < VARIANTS; v++) {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const g = c.getContext('2d');
        g.scale(dpr, dpr);
        paintItem(g, half, half, r, kind, mode, v);
        sprites[kind][mode].push(c);
      }
    }
  }
}
function drawItem(x, y, kind, v, mode) {
  const h = sprites.half;
  ctx.drawImage(sprites[kind][mode][v], x - h, y - h, h * 2, h * 2);
}
function drawLegend() {
  const c = $('legend-items');
  const w = c.clientWidth || 300, h = c.clientHeight || 64, d = Math.min(2, window.devicePixelRatio || 1);
  c.width = Math.round(w * d); c.height = Math.round(h * d);
  const g = c.getContext('2d');
  g.setTransform(d, 0, 0, d, 0, 0);
  g.clearRect(0, 0, w, h);
  const r = Math.min(h * 0.36, w / 11);
  OTHER_KINDS.forEach((k, i) => paintItem(g, (w / 4) * (i + 0.5), h / 2, r, k, 'plain', 1));
}

// ---------- pot items ----------
function potCount() {
  const cfg = LEVELS[playLevel];
  return cfg.count + (cfg.rampCount ? Math.min(cfg.maxExtra, sticks * cfg.rampCount) : 0);
}
function othersShare() {
  const cfg = LEVELS[playLevel];
  return cfg.rampOthers ? Math.min(cfg.maxOthers, cfg.others + sticks * cfg.rampOthers) : cfg.others;
}
function wantFish() { return Math.round(potCount() * (1 - othersShare())); }
function wantOthers() { return potCount() - wantFish(); }
function countKind(fish) { return balls.filter((b) => (b.kind === 'fish') === fish).length; }
function pickKind() {
  if (!othersShare()) return 'fish';
  return countKind(true) < wantFish() ? 'fish' : pick(OTHER_KINDS);
}
// drop: 1 = just let go above the pot, falling in; 0 = floating in the curry
function makeBall(x, y, drop = 0) {
  const kind = pickKind();
  return { x, y, vx: 0, vy: 0, phase: Math.random() * TAU, v: Math.floor(Math.random() * VARIANTS), drop, kind,
  };
}
function seedBalls() {
  flowSeed = Math.random() * 100;   // every game's currents start somewhere different
  balls = [];
  for (let i = 0; i < LEVELS[playLevel].count; i++) {
    const a = Math.random() * TAU, d = Math.sqrt(Math.random()) * L.rin;
    balls.push(makeBall(Math.cos(a) * d, Math.sin(a) * d));
  }
  for (let k = 0; k < 60; k++) collide();
}
function ballScreen(b) {
  const bob = Math.sin(tNow * 2.3 + b.phase) * L.r * 0.07;
  // a falling item is drawn above where it will land, from a little above the pot
  return { sx: L.cx + b.x, sy: L.cy + b.y * L.sq + bob - b.drop * b.drop * L.R * 0.45 };
}
function impulse(fx, fy, radius, strength) {
  for (const b of balls) {
    if (b.drop > 0) continue;
    const dx = b.x - fx, dy = b.y - fy, d = Math.hypot(dx, dy);
    if (d < radius && d > 0.01) {
      const k = strength * (1 - d / radius);
      b.vx += (dx / d) * k; b.vy += (dy / d) * k;
    }
  }
}
function collide() {
  const min = L.r * 2.02;
  for (let i = 0; i < balls.length; i++) {
    const a = balls[i]; if (a.drop > 0) continue;
    for (let j = i + 1; j < balls.length; j++) {
      const c = balls[j]; if (c.drop > 0) continue;
      const dx = c.x - a.x, dy = c.y - a.y, dd = dx * dx + dy * dy;
      if (dd < min * min && dd > 1e-6) {
        const d = Math.sqrt(dd), o = (min - d) / 2, nx = dx / d, ny = dy / d;
        a.x -= nx * o; a.y -= ny * o; c.x += nx * o; c.y += ny * o;
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) { const im = -rv * 0.45; a.vx -= nx * im; a.vy -= ny * im; c.vx += nx * im; c.vy += ny * im; }
      }
    }
  }
  // round pot wall
  for (const b of balls) {
    const d = Math.hypot(b.x, b.y);
    if (d > L.rin) {
      const nx = b.x / d, ny = b.y / d;
      b.x = nx * L.rin; b.y = ny * L.rin;
      const vr = b.vx * nx + b.vy * ny;
      if (vr > 0) { b.vx -= 1.6 * vr * nx; b.vy -= 1.6 * vr * ny; }
    }
  }
}
// The curry's current: a few eddies that turn both ways and drift around the pot, plus a gentle
// whole-pot swirl that slowly changes direction, so fishballs wander in every direction instead of
// all circling one way. Each part is a swirl (no spot where items pile up or get pushed away).
let flowSeed = 0, flowClock = 0;
function flowAt(x, y) {
  // flowClock runs faster as the curry boils harder, so the eddies also churn and change direction faster
  const u = x / L.rin, v = y / L.rin, t = flowClock + flowSeed;
  // big eddies, side by side, turning opposite ways and drifting
  const a1 = 2.4, p1 = t * 0.23, q1 = t * 0.17 + 1.3;
  let vx = Math.sin(a1 * u + p1) * Math.cos(a1 * v + q1);
  let vy = -Math.cos(a1 * u + p1) * Math.sin(a1 * v + q1);
  // smaller eddies on a slowly turning grid
  const c = Math.cos(t * 0.05), s = Math.sin(t * 0.05), ru = c * u - s * v, rv = s * u + c * v;
  const a2 = 3.7, p2 = 2 - t * 0.31, q2 = t * 0.27 + 0.5;
  const ex = Math.sin(a2 * ru + p2) * Math.cos(a2 * rv + q2), ey = -Math.cos(a2 * ru + p2) * Math.sin(a2 * rv + q2);
  vx += 0.6 * (c * ex + s * ey); vy += 0.6 * (-s * ex + c * ey);
  // a light whole-pot swirl: clockwise for a few seconds, then anticlockwise
  const sw = 0.18 * Math.sin(t * 0.29);
  vx += -v * sw; vy += u * sw;
  return [vx, vy];
}
// 1 at the start of a game, rising to BOIL_MAX as the clock runs down
function boilLevel() {
  if (state !== 'play' && state !== 'paused') return 1;
  const done = clamp(1 - timeLeft / GAME_TIME, 0, 1);
  return 1 + (BOIL_MAX - 1) * Math.pow(done, 1.3);
}
function physics(dt) {
  const boil = boilLevel();
  const flow = L.R * 0.16 * LEVELS[playLevel].flow * boil;
  flowClock += dt * (0.6 + 0.4 * boil * boil);
  // the harder the boil, the more the items are jostled about in random directions
  const jolt = L.R * 2.2 * (boil - 1) * LEVELS[playLevel].flow;
  for (const b of balls) {
    if (b.drop > 0) {
      b.drop = Math.max(0, b.drop - dt * 2.6);
      // splash down: a ripple, a little push to whatever is floating there, and a plop
      if (b.drop === 0) { ripples.push({ x: b.x, y: b.y, t: 0 }); impulse(b.x, b.y, L.r * 3, L.R * 0.25); sound('plop'); }
      continue;
    }
    // the curry's current where this item is, plus its own small wobble
    const [fx, fy] = flowAt(b.x, b.y);
    const tx = fx * flow * 1.1 + Math.sin(tNow * 0.6 + b.phase * 3) * flow * 0.45;
    const ty = fy * flow * 1.1 + Math.cos(tNow * 0.8 + b.phase * 2) * flow * 0.45;
    const k = 1 - Math.exp(-1.1 * boil * dt);
    b.vx += (tx - b.vx) * k; b.vy += (ty - b.vy) * k;
    if (jolt > 0) { const ja = Math.random() * TAU; b.vx += Math.cos(ja) * jolt * dt; b.vy += Math.sin(ja) * jolt * dt; }
    b.x += b.vx * dt; b.y += b.vy * dt;
  }
  // rolling boil: bubbles rise at random spots, and each one bumps whatever is floating there
  const rate = 1.5 * Math.pow(boil, 2.4);
  if (Math.random() < rate * dt) {
    const a = Math.random() * TAU, d = Math.sqrt(Math.random()) * L.rin;
    const bx = Math.cos(a) * d, by = Math.sin(a) * d;
    bubbles.push({ x: bx, y: by, t: 0, life: rand(0.35, 0.7), s: rand(0.26, 0.48) * (0.8 + boil * 0.25) });
    impulse(bx, by, L.r * 2.6, L.R * 0.22 * boil);
  }
  bubbles.forEach((q) => (q.t += dt));
  bubbles = bubbles.filter((q) => q.t < q.life);
  collide(); collide();
}
