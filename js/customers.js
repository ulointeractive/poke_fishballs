// customers.js: The queue of customers: who they are, how they look and react.

// ---------- customers ----------
// anyone from the neighbourhood: kids, grown-ups, office workers, grandparents
const SHIRTS = ['#f7f7f2', '#d64545', '#3b6fb6', '#e8b84a', '#3f8f5f', '#8c5aa8', '#f08a5d', '#5b6770', '#c8d3e0', '#e6d2b5'];
const BOTTOMS = ['#23365e', '#3b3b46', '#6b5a45', '#2f4a3a', '#8a8f96', '#4a3b5c', '#1f2a36'];
const BAGS = ['#d24b3a', '#3a7bd2', '#e0a230', '#6a4bd2', '#2f9e6e', '#5a3a28'];
const HAIR = ['#1d1612', '#2b1e16', '#3a2a1c', '#4a3222'];
const GREY = ['#9a9a9a', '#cfcfcf', '#e6e6e6'];
const SKIN = ['#f1c9a5', '#e6b48f', '#d9a17a', '#f5d3b4', '#c68e66'];
function slotX(i) { return W * 0.82 - i * Math.max(64, W * 0.2); }
function spawnCustomer(x) {
  const r = Math.random();
  const type = r < 0.45 ? 'adult' : r < 0.65 ? 'elder' : r < 0.82 ? 'office' : 'kid';
  const c = { x: x ?? -40, tx: 0, type,
    shirt: type === 'office' ? pick(['#f7f7f2', '#c8d3e0', '#eef3f8']) : pick(SHIRTS),
    bottom: pick(BOTTOMS), skin: pick(SKIN),
    hair: type === 'elder' ? pick(GREY) : pick(HAIR),
    bag: Math.random() < (type === 'kid' ? 0.5 : 0.35) ? pick(BAGS) : null,
    backpack: type === 'kid',
    tie: type === 'office' && Math.random() < 0.7 ? pick(['#7a1f1f', '#23365e', '#2f4a3a']) : null,
    glasses: type === 'elder' ? Math.random() < 0.6 : Math.random() < 0.15,
    hs: type === 'kid' ? rand(0.72, 0.8) : type === 'elder' ? rand(0.86, 0.96) : rand(0.92, 1.08),
    phase: Math.random() * TAU, skirt: Math.random() < 0.4, served: false };
  customers.push(c);
  customers.forEach((q, i) => { q.tx = slotX(i); });
  return c;
}
function custScale(c) { return (L.top / 165) * c.hs; }
function handPos(c) { const s = custScale(c); return { x: c.x - 20 * s, y: L.top - 56 * s }; }

function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function drawCustomer(c) {
  const s = custScale(c);
  const walking = c.leaving ? c.wait <= 0 : Math.abs(c.tx - c.x) > 1;
  const sw = walking ? Math.sin(tNow * 10 + c.phase) : 0;
  const bob = walking ? Math.abs(sw) * 3 * s : Math.sin(tNow * 2 + c.phase) * 0.8 * s;
  ctx.save();
  ctx.translate(c.x, L.top - 1 - bob);
  if (c.bag && c.backpack) { ctx.fillStyle = c.bag; rr(-18 * s, -76 * s, 36 * s, 34 * s, 6 * s); ctx.fill(); }
  ctx.fillStyle = '#3b3330';
  ctx.fillRect(-7 * s + sw * 4 * s, -28 * s, 5 * s, 28 * s);
  ctx.fillRect(2 * s - sw * 4 * s, -28 * s, 5 * s, 28 * s);
  ctx.fillStyle = c.bottom;
  if (c.skirt) { ctx.beginPath(); ctx.moveTo(-12 * s, -50 * s); ctx.lineTo(12 * s, -50 * s); ctx.lineTo(16 * s, -26 * s); ctx.lineTo(-16 * s, -26 * s); ctx.closePath(); ctx.fill(); }
  else { rr(-13 * s, -50 * s, 26 * s, 20 * s, 3 * s); ctx.fill(); }
  ctx.fillStyle = c.shirt; rr(-14 * s, -80 * s, 28 * s, 34 * s, 7 * s); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1; ctx.stroke();
  if (c.tie) { ctx.fillStyle = c.tie; ctx.beginPath(); ctx.moveTo(-2.5 * s, -78 * s); ctx.lineTo(2.5 * s, -78 * s); ctx.lineTo(1.5 * s, -62 * s); ctx.lineTo(-1.5 * s, -62 * s); ctx.fill(); }
  if (c.bag && !c.backpack) {
    // shoulder bag
    ctx.strokeStyle = c.bag; ctx.lineWidth = 1.5 * s;
    ctx.beginPath(); ctx.moveTo(-9 * s, -79 * s); ctx.lineTo(12 * s, -56 * s); ctx.stroke();
    ctx.fillStyle = c.bag; rr(8 * s, -58 * s, 13 * s, 12 * s, 3 * s); ctx.fill();
  }
  const reaching = !c.leaving && customers[0] === c && Math.abs(c.tx - c.x) < 4;
  ctx.strokeStyle = c.skin; ctx.lineCap = 'round'; ctx.lineWidth = 5 * s;
  ctx.beginPath(); ctx.moveTo(-12 * s, -74 * s);
  if (reaching || c.leaving) ctx.lineTo(-20 * s, -56 * s); else ctx.lineTo(-16 * s, -52 * s);
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12 * s, -74 * s); ctx.lineTo(16 * s, -52 * s); ctx.stroke();
  ctx.fillStyle = c.skin; ctx.beginPath(); ctx.arc(0, -93 * s, 13 * s, 0, TAU); ctx.fill();
  ctx.fillStyle = c.hair; ctx.beginPath(); ctx.arc(0, -95 * s, 13.6 * s, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
  ctx.fillRect(-13.4 * s, -97 * s, 26.8 * s, 4 * s);
  if (c.glasses) {
    ctx.strokeStyle = '#2b1f17'; ctx.lineWidth = 1.2 * s;
    ctx.beginPath(); ctx.arc(-4.5 * s, -90 * s, 3.4 * s, 0, TAU); ctx.moveTo(7.9 * s, -90 * s); ctx.arc(4.5 * s, -90 * s, 3.4 * s, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-1.1 * s, -90 * s); ctx.lineTo(1.1 * s, -90 * s); ctx.stroke();
  }
  ctx.strokeStyle = '#2b1f17'; ctx.fillStyle = '#2b1f17'; ctx.lineWidth = 1.6 * s;
  const happy = c.leaving && c.mood >= 1;
  if (happy) {
    ctx.beginPath(); ctx.arc(-4.5 * s, -90 * s, 2.4 * s, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(4.5 * s, -90 * s, 2.4 * s, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(-4.5 * s, -90 * s, 1.6 * s, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(4.5 * s, -90 * s, 1.6 * s, 0, TAU); ctx.fill();
  }
  ctx.beginPath();
  if (c.leaving && c.mood === 0) { ctx.moveTo(-3 * s, -84 * s); ctx.lineTo(3 * s, -85 * s); }
  else ctx.arc(0, -86 * s, 3 * s, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.restore();

  if (c.held) {
    const h = handPos(c);
    drawSkewer(h.x, h.y + 4 * s, c.held, (3.4 * s) / L.r, 0.15);
  }
  if (c.bubble && c.bubbleT > 0) {
    ctx.save();
    ctx.globalAlpha = clamp(c.bubbleT * 2, 0, 1);
    const fs = Math.max(12, 15 * s);
    ctx.font = `700 ${fs}px ${fontBody()}`;
    const tw = ctx.measureText(c.bubble).width + 16;
    const bx = c.x - tw / 2, by = L.top - 136 * s;
    ctx.fillStyle = '#fff'; rr(bx, by, tw, fs + 12, 8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(c.x - 5, by + fs + 11); ctx.lineTo(c.x + 3, by + fs + 20); ctx.lineTo(c.x + 6, by + fs + 11); ctx.fill();
    ctx.fillStyle = '#2b1f17'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(c.bubble, c.x, by + (fs + 12) / 2 + 1);
    ctx.restore();
  }
}
