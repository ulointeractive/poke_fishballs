// draw.js: Drawing each frame: the stick, the pot, the items, steam, the aim marker.

// tip at (tx,ty); balls positioned by .off (fraction of r, sideways) and .rel (px above the tip)
function drawSkewer(tx, ty, list, k, ang) {
  const r = L.r, w = Math.max(3, r * 0.2), len = r * (1.3 + (STICK_CAP - 1) * 1.86) + r * 3.4;
  ctx.save();
  ctx.translate(tx, ty); ctx.rotate(ang); ctx.scale(k, k);
  const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  g.addColorStop(0, '#a77e40'); g.addColorStop(0.5, '#ecd29a'); g.addColorStop(1, '#9c733a');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(w / 2, -r * 0.8); ctx.lineTo(w / 2, -len); ctx.lineTo(-w / 2, -len); ctx.lineTo(-w / 2, -r * 0.8);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(110,78,36,0.55)';
  ctx.fillRect(-w / 2 - 0.5, -len * 0.9, w + 1, Math.max(1.5, w * 0.35));
  for (const b of list) drawItem(-b.off * r, b.rel, b.kind || 'fish', b.v, 'stick');
  ctx.restore();
}

// round stainless pot, seen from the front and above
function drawPot() {
  const { cx, cy, R, sq } = L, depth = R * L.depth;
  ctx.fillStyle = 'rgba(40,40,40,0.22)';
  ctx.beginPath(); ctx.ellipse(cx, cy + depth + 4, R * 1.05, R * sq * 0.55, 0, 0, TAU); ctx.fill();
  const body = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
  body.addColorStop(0, '#5f6664'); body.addColorStop(0.18, '#d9dddb'); body.addColorStop(0.42, '#8e9593');
  body.addColorStop(0.7, '#f0f2f1'); body.addColorStop(1, '#5b6260');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(cx - R, cy);
  ctx.lineTo(cx - R * 0.97, cy + depth);
  ctx.ellipse(cx, cy + depth, R * 0.97, R * sq * 0.97, 0, Math.PI, 0, true);
  ctx.lineTo(cx + R, cy);
  ctx.closePath(); ctx.fill();
  // handles
  ctx.fillStyle = '#6c7371';
  rr(cx - R - R * 0.1, cy + depth * 0.25, R * 0.12, R * 0.07, 3); ctx.fill();
  rr(cx + R - R * 0.02, cy + depth * 0.25, R * 0.12, R * 0.07, 3); ctx.fill();
  // rim
  const rim = ctx.createLinearGradient(cx - R, cy - R * sq, cx + R, cy + R * sq);
  rim.addColorStop(0, '#f4f6f5'); rim.addColorStop(0.5, '#9ca3a1'); rim.addColorStop(1, '#e6e9e8');
  ctx.fillStyle = rim;
  ctx.beginPath(); ctx.ellipse(cx, cy, R, R * sq, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#737a78';
  ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.955, R * sq * 0.955, 0, 0, TAU); ctx.fill();
  // curry
  const liq = ctx.createRadialGradient(cx - R * 0.2, cy - R * sq * 0.3, R * 0.05, cx, cy, R * 0.95);
  liq.addColorStop(0, '#eaa53c'); liq.addColorStop(0.55, '#c8761f'); liq.addColorStop(1, '#7c3f0d');
  ctx.fillStyle = liq;
  ctx.beginPath(); ctx.ellipse(cx, cy, L.lrx, L.lry, 0, 0, TAU); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.ellipse(cx, cy, L.lrx, L.lry, 0, 0, TAU); ctx.clip();
  for (let i = 0; i < 6; i++) {
    const a = tNow * 0.18 + i * 1.05, d = R * (0.25 + 0.1 * (i % 3));
    ctx.fillStyle = `rgba(255,${190 + i * 6},90,0.10)`;
    ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d * sq, R * 0.18, R * 0.05, a * 0.5, 0, TAU); ctx.fill();
  }
  // boiling bubbles: swell, then pop into a little ring
  for (const q of bubbles) {
    const k = q.t / q.life, bx = cx + q.x, by = cy + q.y * sq, rr0 = L.r * q.s;
    if (k < 0.75) {
      const rad = rr0 * (0.4 + k);
      ctx.fillStyle = 'rgba(255,214,150,0.35)';
      ctx.strokeStyle = 'rgba(255,236,200,0.75)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(bx, by, rad, rad * 0.8, 0, 0, TAU); ctx.fill(); ctx.stroke();
    } else {
      const p = (k - 0.75) / 0.25, rad = rr0 * (1.2 + p * 1.6);
      ctx.strokeStyle = `rgba(255,236,200,${0.6 * (1 - p)})`; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(bx, by, rad, rad * sq, 0, 0, TAU); ctx.stroke();
    }
  }
  for (const rp of ripples) {
    const k = rp.t / 0.7, rad = L.r * (0.6 + k * 3.2);
    ctx.strokeStyle = `rgba(255,225,170,${0.55 * (1 - k)})`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx + rp.x, cy + rp.y * sq, rad, rad * sq, 0, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}

function drawBalls() {
  const { cx, cy, sq } = L;
  const list = balls.map((b) => ({ b, s: ballScreen(b) })).sort((p, o) => p.s.sy - o.s.sy);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, cy);
  ctx.ellipse(cx, cy, L.lrx, L.lry, 0, 0, TAU);
  ctx.clip();
  for (const { b, s } of list) {
    if (b.drop > 0.02) {
      ctx.fillStyle = `rgba(60,25,0,${0.25 * (1 - b.drop)})`;
      ctx.beginPath(); ctx.ellipse(cx + b.x, cy + b.y * sq + L.r * 0.3, L.r * 0.8, L.r * 0.8 * sq, 0, 0, TAU); ctx.fill();
      drawItem(s.sx, s.sy, b.kind, b.v, 'plain');
    } else {
      drawItem(s.sx, s.sy, b.kind, b.v, 'pot');
    }
  }
  ctx.restore();
}

function drawSteam() {
  for (const p of steam) {
    const k = p.t / p.life;
    ctx.fillStyle = `rgba(255,255,255,${0.09 * Math.sin(Math.PI * k)})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, L.r * (0.8 + k * 1.8) * p.s, 0, TAU); ctx.fill();
  }
}

function drawAim() {
  if (stick.pressed || !inCurry(stick.x, stick.y)) return;
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.ellipse(stick.x, stick.y, L.r * 0.32, L.r * 0.32 * L.sq, 0, 0, TAU); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(60,25,0,0.35)';
  ctx.beginPath(); ctx.ellipse(stick.x, stick.y, L.r * 0.12, L.r * 0.12 * L.sq, 0, 0, TAU); ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  if (!sprites || !W || !H) return;
  if (bg && bg.width && bg.height) ctx.drawImage(bg, 0, 0, W, H);
  const people = customers.concat(leavers).sort((a, b) => a.x - b.x);
  for (const c of people) drawCustomer(c);
  drawPot();
  drawBalls();
  drawSteam();
  drawAim();
  drawSkewer(stick.x, tipY(), stick.balls, 1, 0);
  for (const f of flyers) {
    const h = handPos(f.target);
    const e = f.t < 0.5 ? 2 * f.t * f.t : 1 - Math.pow(-2 * f.t + 2, 2) / 2;
    const x = f.x0 + (h.x - f.x0) * e;
    const y = f.y0 + (h.y - f.y0) * e - Math.sin(Math.PI * f.t) * L.R * 0.35;
    const kEnd = (3.4 * custScale(f.target)) / L.r;
    drawSkewer(x, y, f.balls, 1 + (kEnd - 1) * e, 0.15 * e);
  }
  const fb = fontBody();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const p of pops) {
    const k = p.t / 0.9;
    ctx.globalAlpha = 1 - k;
    ctx.font = `900 ${p.size}px ${fb}`;
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(60,25,10,0.75)';
    ctx.strokeText(p.text, p.x, p.y - k * 40);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y - k * 40);
  }
  ctx.globalAlpha = 1;
}
