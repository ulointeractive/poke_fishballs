// sound.js: Sound effects, made with the Web Audio API (no audio files).

// ---------- sound ----------
let ac = null, muted = false;
let splashBuf = null;
function initAudio() {
  if (ac) return;
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    const len = Math.floor(ac.sampleRate * 0.12);
    splashBuf = ac.createBuffer(1, len, ac.sampleRate);
    const d = splashBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.025));
  } catch (e) { ac = null; }
}
// a stick dipping into liquid: a soft wet "plip" that rises in pitch, over a tiny muffled splash
function droplet() {
  const t = ac.currentTime, f = 650 + Math.random() * 250;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * 2.4, t + 0.06);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  o.connect(g).connect(ac.destination);
  o.start(t); o.stop(t + 0.1);
  if (splashBuf) {
    const src = ac.createBufferSource(), bp = ac.createBiquadFilter(), ng = ac.createGain();
    src.buffer = splashBuf; bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8; ng.gain.value = 0.06;
    src.connect(bp).connect(ng).connect(ac.destination); src.start(t);
  }
}
function tone(type, f0, f1, dur, vol, delay = 0) {
  const t = ac.currentTime + delay;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ac.destination);
  o.start(t); o.stop(t + dur + 0.02);
}
function sound(kind) {
  if (!ac || muted) return;
  if (kind === 'poke') tone('sine', 520, 160, 0.1, 0.3);
  else if (kind === 'perfect') { tone('sine', 520, 160, 0.1, 0.3); tone('triangle', 1400, 1800, 0.12, 0.08, 0.04); }
  else if (kind === 'ding') { tone('sine', 1320, 1320, 0.25, 0.12); tone('sine', 1760, 1760, 0.35, 0.1, 0.09); }
  else if (kind === 'plop') tone('sine', 300, 120, 0.08, 0.08);
  else if (kind === 'drip') droplet();
}
$('mute').addEventListener('click', () => {
  muted = !muted;
  $('mute').textContent = muted ? '聲音 關' : '聲音 開';
  $('mute').setAttribute('aria-pressed', String(muted));
});
