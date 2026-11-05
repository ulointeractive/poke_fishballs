// sound.js: Sound effects and background music, made with the Web Audio API (no audio files).

// ---------- sound ----------
let ac = null, muted = false;
let splashBuf = null, noiseBuf = null, sfxOut = null, musicOut = null;
function initAudio() {
  if (ac) return;
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    // everything goes through a limiter, so music and sound effects together never distort
    const limiter = ac.createDynamicsCompressor();
    limiter.threshold.value = -10; limiter.ratio.value = 8; limiter.connect(ac.destination);
    sfxOut = ac.createGain(); sfxOut.connect(limiter);
    musicOut = ac.createGain(); musicOut.gain.value = muted ? 0 : MUSIC_VOL; musicOut.connect(limiter);
    const nl = Math.floor(ac.sampleRate * 0.5);
    noiseBuf = ac.createBuffer(1, nl, ac.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nl; i++) nd[i] = Math.random() * 2 - 1;
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
  o.connect(g).connect(sfxOut);
  o.start(t); o.stop(t + 0.1);
  if (splashBuf) {
    const src = ac.createBufferSource(), bp = ac.createBiquadFilter(), ng = ac.createGain();
    src.buffer = splashBuf; bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8; ng.gain.value = 0.06;
    src.connect(bp).connect(ng).connect(sfxOut); src.start(t);
  }
}
function tone(type, f0, f1, dur, vol, delay = 0, out = sfxOut) {
  const t = ac.currentTime + delay;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out);
  o.start(t); o.stop(t + dur + 0.02);
}
// a short burst of filtered noise: whooshes, the cash-drawer clack, the pot thump in the music
function noise(type, f0, f1, dur, vol, delay = 0, out = sfxOut, at = null) {
  if (!noiseBuf) return;
  const t = at ?? ac.currentTime + delay;
  const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  src.buffer = noiseBuf; f.type = type; f.Q.value = 1.2;
  f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.03, dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(out); src.start(t); src.stop(t + dur + 0.02);
}
// a bell: a bright tone with a ringing overtone
function bell(f, vol, delay) { tone('sine', f, f, 0.5, vol, delay); tone('sine', f * 2.76, f * 2.76, 0.18, vol * 0.35, delay); }
// a stick handed over: "ka-ching" and a happy run of bells for a neat stick, a sad "wah-wah" for a bad one
function serveSound(mood) {
  if (mood >= 1) {
    noise('highpass', 3000, 6000, 0.06, 0.18);            // cash drawer clack
    tone('square', 2400, 2400, 0.05, 0.05, 0.01);
    const run = mood === 2 ? [1175, 1480, 1760, 2349] : [1175, 1760];
    run.forEach((f, i) => bell(f, 0.13, 0.06 + i * 0.07));
    if (mood === 2) noise('bandpass', 5000, 9000, 0.35, 0.05, 0.3);   // sparkle
  } else {
    tone('triangle', 392, 370, 0.22, 0.16);
    tone('triangle', 330, 262, 0.4, 0.16, 0.22);
  }
}
function sound(kind) {
  if (!ac || muted) return;
  if (kind === 'poke') tone('sine', 520, 160, 0.1, 0.3);
  // dead centre: a clean poke and a bright, rising "ting-ting!"
  else if (kind === 'perfect') { tone('sine', 620, 200, 0.08, 0.3); bell(1568, 0.2, 0.03); bell(2349, 0.18, 0.1); }
  // off-centre: a dull, wobbly "bonk" with no chime
  else if (kind === 'off') { tone('square', 150, 105, 0.16, 0.1); tone('sine', 210, 120, 0.2, 0.3); noise('lowpass', 500, 150, 0.1, 0.12); }
  // slipped off: a wet slide down the side of the fishball and a little splash
  else if (kind === 'slip') { noise('bandpass', 2600, 380, 0.38, 0.22); tone('sine', 900, 260, 0.3, 0.12); setTimeout(() => { if (ac && !muted) droplet(); }, 300); }
  // poked the wrong item: a buzzer, "eh-eh"
  else if (kind === 'wrong') { tone('sawtooth', 180, 170, 0.13, 0.12); tone('sawtooth', 180, 165, 0.2, 0.12, 0.17); tone('sine', 140, 90, 0.25, 0.25); }
  else if (kind === 'whoosh') noise('bandpass', 500, 2400, 0.28, 0.14);
  else if (kind === 'serve0') serveSound(0);
  else if (kind === 'serve1') serveSound(1);
  else if (kind === 'serve2') serveSound(2);
  else if (kind === 'plop') tone('sine', 180, 320, 0.08, 0.05);   // an item bobbing up to the surface
  else if (kind === 'drip') droplet();
}
$('mute').addEventListener('click', () => {
  muted = !muted;
  if (musicOut) musicOut.gain.setTargetAtTime(muted ? 0 : MUSIC_VOL, ac.currentTime, 0.05);
  updateMuteButton();
  $('mute').setAttribute('aria-pressed', String(muted));
});
function updateMuteButton() { setIconButton($('mute'), muted ? 'soundOff' : 'soundOn', t(muted ? 'btn.unmute' : 'btn.mute')); }
updateMuteButton();
langListeners.push(updateMuteButton);

// ---------- background music ----------
// An original, cheerful street-stall tune in a five-note (pentatonic) scale, played while a game runs.
// As time runs out it gets tense: faster and faster, a key change up at 20 s and again at 10 s,
// a busier beat, and a ticking clock in the last 10 seconds. Notes are semitones from A4 (440 Hz); null = rest.
const MUSIC_VOL = 1;
const TUNE = [
  5, null, 9, 12, 14, 12, 9, null,   14, null, 12, 9, 7, 9, 5, null,
  2, 5, 7, 9, 12, null, 9, 7,        5, 7, 9, 7, 5, null, 0, null,
  12, null, 14, 17, 14, 12, 9, null, 14, 12, 9, 12, 14, null, 17, null,
  9, 7, 5, 7, 9, 12, 9, 7,           5, null, null, null, 5, null, null, null,
];
const ROOTS = [-19, -22, -26, -24];   // one bass note per bar: D, B, G, A
const hz = (n) => 440 * Math.pow(2, n / 12);
let musicTimer = 0, musicStep = 0, musicNext = 0;
function musicNote(step, at) {
  const left = state === 'play' || state === 'paused' ? timeLeft : GAME_TIME;
  const lift = left <= 10 ? 3 : left <= 20 ? 2 : 0;   // key change up as time runs out
  const n0 = TUNE[step % TUNE.length], n = n0 === null ? null : n0 + lift;
  const bar = Math.floor(step / 8) % ROOTS.length, beat = step % 8, root = ROOTS[bar] + lift;
  const play = (type, f, dur, vol) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, at);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(musicOut); o.start(at); o.stop(at + dur + 0.02);
  };
  if (n !== null) { play('triangle', hz(n), 0.22, 0.2); play('square', hz(n + 12), 0.08, 0.03); }
  if (beat === 0 || beat === 6) play('triangle', hz(root), 0.3, 0.26);
  if (beat === 3) play('triangle', hz(root + 12), 0.15, 0.14);
  if (beat === 4) play('triangle', hz(root + 7), 0.25, 0.22);
  if (beat === 0 || beat === 4) noise('lowpass', 180, 60, 0.12, 0.45, 0, musicOut, at);        // pot thump
  if (beat % 2 === 1) noise('highpass', 7000, 7000, 0.03, 0.09, 0, musicOut, at);             // tick
  if (left <= 20) {
    // getting tense: a thump on every beat and a pulsing low note underneath
    if (beat === 2 || beat === 6) noise('lowpass', 200, 60, 0.1, 0.35, 0, musicOut, at);
    play('sawtooth', hz(root - 12), 0.09, 0.05);
  }
  if (left <= 10 && beat % 4 === 0) {
    // the last 10 seconds: a ticking clock
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(beat === 0 ? 2000 : 1500, at);
    g.gain.setValueAtTime(0.06, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.04);
    o.connect(g).connect(musicOut); o.start(at); o.stop(at + 0.05);
  }
}
function startMusic() {
  if (!ac || musicTimer) return;
  musicNext = ac.currentTime + 0.1;
  musicTimer = setInterval(() => {
    const boil = typeof boilLevel === 'function' ? boilLevel() : 1;
    // 128 beats a minute at the start, up to about 190 in the last seconds
    const eighth = 60 / (128 * (1 + 0.5 * (boil - 1) / (BOIL_MAX - 1))) / 2;
    while (musicNext < ac.currentTime + 0.15) { musicNote(musicStep++, musicNext); musicNext += eighth; }
  }, 30);
}
function stopMusic() { clearInterval(musicTimer); musicTimer = 0; }
