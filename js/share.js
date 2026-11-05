// share.js: Share text, result image, saving the image.

// ---------- sharing ----------
let toastTimer = 0;
function toast(msg) {
  $('toast').textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('toast').textContent = ''; }, 4000);
}
function shareText(r) {
  return `${t('share.text', Store.name, r, r.level === 'hard')}\n${SHARE_URL}`;
}
$('share').addEventListener('click', async () => {
  if (!lastRun) return;
  const text = shareText(lastRun);
  const box = $('share-text');
  if (navigator.share) {
    try { await navigator.share({ text }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast(t('toast.copied'));
  } catch (e) {
    box.value = text; box.hidden = false; box.focus(); box.select();
    toast(t('toast.select'));
  }
});

function resultImage(r) {
  const c = document.createElement('canvas');
  c.width = 1080; c.height = 1080;
  const g = c.getContext('2d');
  const fb = fontBody(), fd = getComputedStyle(document.documentElement).getPropertyValue('--font-display');
  g.fillStyle = '#d3e5d9'; g.fillRect(0, 0, 1080, 1080);
  g.strokeStyle = '#bdd4c5'; g.lineWidth = 4;
  for (let i = 0; i <= 1080; i += 60) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 1080); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(1080, i); g.stroke(); }
  g.fillStyle = '#a8231b'; g.fillRect(80, 80, 920, 200);
  g.fillStyle = '#f4c55a'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `900 110px ${fd}`; g.fillText(t('sign.title'), 540, 185);
  g.fillStyle = '#fbfbf8'; g.fillRect(80, 320, 920, 680);
  g.fillStyle = '#2b1f17';
  g.font = `700 48px ${fb}`; g.fillText((Store.name || t('img.subtitle')) + (r.level === 'hard' ? t('img.hard') : ''), 540, 410);
  g.font = `900 260px ${fd}`; g.fillText(String(r.score), 540, 600);
  g.font = `700 48px ${fb}`; g.fillStyle = '#6d625a'; g.fillText(t('unit.pts'), 540, 750);
  g.font = `400 40px ${fb}`;
  g.fillText(t('img.stats', r), 540, 830);
  g.fillStyle = '#a8231b'; g.font = `700 40px ${fb}`; g.fillText(t('img.cta'), 540, 920);
  // a little stick of fishballs
  g.fillStyle = '#d9b877'; g.fillRect(930, 340, 10, 260);
  for (let i = 0; i < 6; i++) {
    const y = 370 + i * 38, grd = g.createRadialGradient(925, y - 8, 2, 935, y, 20);
    grd.addColorStop(0, '#fde9b0'); grd.addColorStop(0.6, '#e2a845'); grd.addColorStop(1, '#a8661d');
    g.fillStyle = grd; g.beginPath(); g.arc(935, y, 19, 0, TAU); g.fill();
  }
  return new Promise((res) => c.toBlob((b) => res(b), 'image/png'));
}
// save the result image as a PNG file on the player's device
$('save-img').addEventListener('click', async () => {
  if (!lastRun) return;
  const blob = await resultImage(lastRun);
  if (!blob) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = t('img.file', lastRun.score);
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  toast(t('toast.imgSaved'));
});
