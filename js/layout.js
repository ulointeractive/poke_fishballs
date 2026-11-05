// layout.js: Fits the scene to the screen and paints the static street background.

// ---------- layout ----------
function resize() {
  const rect = stage.getBoundingClientRect();
  dpr = Math.min(2, window.devicePixelRatio || 1);
  if (rect.width < 2 || rect.height < 2) return;   // not laid out yet; the ResizeObserver will call again
  W = rect.width; H = rect.height;
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const oldR = L.R;
  L.top = clamp(H * 0.25, 100, 170);
  L.depth = 0.4;
  const availH = H - L.top - 14;
  L.R = Math.max(70, Math.min(W * 0.47, availH / (2 * 0.58 + L.depth + 0.04)));
  // on tall (phone) screens, tilt the pot towards the player so it fills the space
  L.sq = clamp((availH / L.R - L.depth - 0.06) / 2, 0.58, 0.8);
  L.cx = W / 2;
  const total = (2 * L.sq + L.depth) * L.R;
  L.cy = L.top + Math.max(8, (availH - total) / 2) + L.sq * L.R + 4;
  L.r = L.R * 0.1;
  L.rin = L.R * 0.89 - L.r;           // item centres stay inside this circle (flat coords)
  L.lrx = L.R * 0.92; L.lry = L.R * L.sq * 0.9;   // curry surface ellipse, screen radii
  if (oldR) { const k = L.R / oldR; balls.forEach((b) => { b.x *= k; b.y *= k; }); }
  customers.forEach((c, i) => { c.tx = slotX(i); });
  if (!stick.hasPointer) { stick.x = L.cx + L.R * 0.5; stick.y = L.cy + L.R * L.sq * 0.1; }
  buildBackground();
  buildSprites();
  if (!oldR) seedBalls();   // first real layout
}

function buildBackground() {
  bg = document.createElement('canvas');
  bg.width = Math.round(W * dpr); bg.height = Math.round(H * dpr);
  const b = bg.getContext('2d');
  b.setTransform(dpr, 0, 0, dpr, 0, 0);
  const sky = b.createLinearGradient(0, 0, 0, L.top);
  sky.addColorStop(0, '#45597a'); sky.addColorStop(1, '#d28a5e');
  b.fillStyle = sky; b.fillRect(0, 0, W, L.top);
  let x = -10, seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const fronts = ['#e8c37a', '#d98b6a', '#9fc0b0', '#e6d6b8', '#c7a0b8'];
  while (x < W + 10) {
    const w = 50 + rnd() * 50, h = L.top * (0.55 + rnd() * 0.4);
    b.fillStyle = fronts[Math.floor(rnd() * fronts.length)];
    b.globalAlpha = 0.55;
    b.fillRect(x, L.top - h, w - 4, h);
    b.globalAlpha = 1;
    for (let wy = L.top - h + 10; wy < L.top - 30; wy += 22) {
      for (let wx = x + 8; wx < x + w - 16; wx += 16) {
        b.fillStyle = rnd() < 0.55 ? 'rgba(255,214,120,0.85)' : 'rgba(40,40,60,0.35)';
        b.fillRect(wx, wy, 8, 11);
      }
    }
    x += w;
  }
  b.fillStyle = '#5d6462'; b.fillRect(0, L.top - 2, W, 10);
  b.fillStyle = '#9aa2a0'; b.fillRect(0, L.top - 2, W, 3);
  const top = b.createLinearGradient(0, L.top + 8, 0, H);
  top.addColorStop(0, '#c9cecc'); top.addColorStop(1, '#9ea5a3');
  b.fillStyle = top; b.fillRect(0, L.top + 8, W, H - L.top - 8);
  b.strokeStyle = 'rgba(255,255,255,0.18)'; b.lineWidth = 1;
  for (let i = 0; i < 14; i++) { const y = L.top + 8 + i * 9; b.beginPath(); b.moveTo(0, y); b.lineTo(W, y + 30); b.stroke(); }
}
