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
    limiter.threshold.value = -12; limiter.ratio.value = 12; limiter.attack.value = 0.002; limiter.release.value = 0.1;
    const master = ac.createGain(); master.gain.value = 0.85;
    // and a soft clipper: any peak the limiter is too slow for is rounded off instead of crackling
    const clip = ac.createWaveShaper(), curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1, m = Math.abs(x); curve[i] = m <= 0.8 ? x : Math.sign(x) * (0.8 + 0.2 * Math.tanh((m - 0.8) / 0.2)); }
    clip.curve = curve;
    limiter.connect(master).connect(clip).connect(ac.destination);
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
// Five original tracks made in code; the player picks one on the start screen. Each keeps the same tempo
// for the whole game. As time runs out it gets more intense without speeding up: a key change up at 20 s
// and again at 10 s, busier hi-hats from 20 s, and snare rolls and a ticking clock in the last 10 seconds.
// Notes are semitones from A4 (440 Hz); null = rest. One step = a 16th note; 16 steps = one bar.
const MUSIC_VOL = 1;
const hz = (n) => 440 * Math.pow(2, n / 12);
let musicTimer = 0, musicStep = 0, musicNext = 0;
// one synth note: an oscillator (plus a slightly detuned twin when asked) through a low-pass filter
function synth(type, n, at, dur, vol, cutoff = 8000, twin = false, out = musicOut) {
  const f = ac.createBiquadFilter(), g = ac.createGain();
  f.type = 'lowpass'; f.frequency.setValueAtTime(cutoff, at);
  g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + 0.008);
  g.gain.setValueAtTime(vol, at + dur * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  f.connect(g).connect(out);
  for (const cents of twin ? [-8, 8] : [0]) {
    const o = ac.createOscillator();
    o.type = type; o.frequency.setValueAtTime(hz(n), at); o.detune.value = cents;
    o.connect(f); o.start(at); o.stop(at + dur + 0.02);
  }
}
function drum(f0, f1, dur, vol, at) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(f1, at + dur * 0.6);
  g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(musicOut); o.start(at); o.stop(at + dur + 0.02);
}
const kick = (at, vol = 0.9) => drum(160, 42, 0.22, vol, at);
const snare = (at, vol = 0.4) => { noise('bandpass', 1900, 1500, 0.14, vol, 0, musicOut, at); drum(220, 180, 0.07, vol * 0.3, at); };
const clap = (at, vol = 0.35) => { [0, 0.012, 0.024].forEach((d) => noise('bandpass', 1300, 1100, 0.09, vol, 0, musicOut, at + d)); };
const hat = (at, vol) => noise('highpass', 8000, 8000, 0.025, vol, 0, musicOut, at);
const chord = (type, notes, at, dur, vol, cutoff, twin, out) => notes.forEach((n) => synth(type, n, at, dur, vol, cutoff, twin, out));
// a guitar-amp style distortion, shared by everything that goes through it (made once per audio context)
function distortion() {
  if (ac.fishDist) return ac.fishDist;
  const ws = ac.createWaveShaper(), c = new Float32Array(1024), tone = ac.createBiquadFilter(), g = ac.createGain();
  for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; c[i] = Math.tanh(6 * x); }
  ws.curve = c; tone.type = 'lowpass'; tone.frequency.value = 3200; g.gain.value = 0.35;
  ws.connect(tone).connect(g).connect(musicOut);
  ac.fishDist = ws;
  return ws;
}
const lead = (seq, step, at, len, fn) => {
  const n = seq[step % seq.length]; if (n === null) return;
  let hold = 1; while (hold < 4 && seq[(step + hold) % seq.length] === null) hold++;
  fn(n, len * hold * 0.95);
};

const MUSIC = {
  // 1. 街機 / Arcade: driving synth track in A minor (Am - F - C - G)
  arcade: {
    bpm: 140,
    bass: [-24, -28, -21, -26],
    arp: [[12, 15, 19, 24], [8, 12, 15, 20], [15, 19, 22, 27], [10, 14, 17, 22]],
    lead: [
      12, null, null, 12, 15, null, 12, null, 19, null, 17, null, 15, null, 12, null,
      null, null, 8, null, 12, null, 15, null, 17, null, 15, null, 12, null, null, null,
      15, null, null, 15, 19, null, 15, null, 22, null, 19, null, 15, null, 19, null,
      17, null, null, null, 14, null, null, null, 10, null, 14, null, 17, null, 19, null,
      24, null, 22, null, 19, null, 22, null, 24, null, null, 19, null, null, 15, null,
      17, null, 15, null, 12, null, 15, null, 17, null, 19, null, 20, null, null, null,
      19, null, null, 19, 22, null, 19, null, 15, null, 19, null, 22, null, 24, null,
      22, null, null, null, 19, null, null, null, 17, null, 14, null, 10, null, null, null,
    ],
    note(step, at, len, lift, tense) {
      const s = step % 16, bar = Math.floor(step / 16) % 4;
      if (s % 4 === 0) kick(at);
      if (s === 4 || s === 12) snare(at);
      hat(at, s % 2 ? 0.12 : 0.04);
      if (s % 2 === 0) synth('sawtooth', this.bass[bar] + lift + (s % 4 === 2 ? 12 : 0), at, len * 1.7, 0.22, 650);
      synth('square', this.arp[bar][[0, 1, 2, 3, 2, 1, 2, 3][s % 8]] + lift + (tense ? 12 : 0), at, len * 0.8, 0.035, 3200);
      lead(this.lead, step, at, len, (n, d) => synth('sawtooth', n + lift, at, d, 0.11, 2600, true));
    },
  },
  // 2. 電音 / Dance: club house in G minor (Gm - F - Eb - F), off-beat bass, open hats, piano-like stabs, plucked lead
  dance: {
    bpm: 126,
    bars: [
      { root: -26, ch: [-2, 1, 5] }, { root: -28, ch: [-4, 0, 3] },
      { root: -30, ch: [-6, -2, 1] }, { root: -28, ch: [-4, 0, 3] },
    ],
    lead: [
      17, null, 17, null, 20, null, 22, null, null, 20, null, 17, null, 15, null, null,
      17, null, null, 17, 18, null, 17, null, 15, null, null, 13, null, 15, null, null,
    ],
    note(step, at, len, lift) {
      const s = step % 16, b = this.bars[Math.floor(step / 16) % 4];
      if (s % 4 === 0) kick(at, 0.95);
      if (s === 4 || s === 12) clap(at, 0.4);
      hat(at, 0.035);
      if (s % 4 === 2) { noise('highpass', 7000, 7000, 0.14, 0.12, 0, musicOut, at); synth('sawtooth', b.root + 12 + lift, at, len * 1.8, 0.28, 520); }
      if ([2, 5, 8, 11, 14].includes(s)) chord('sawtooth', b.ch.map((n) => n + 12 + lift), at, 0.12, 0.035, 2800, true);
      lead(this.lead, step, at, len, (n, d) => { synth('triangle', n + lift, at, Math.min(d, 0.2), 0.16, 6000); synth('square', n + lift + 12, at, 0.05, 0.02, 5000); });
    },
  },
  // 3. 搖滾 / Rock: driving rock in E minor (Em - C - D - B), distorted power chords and a guitar lead
  rock: {
    bpm: 152,
    roots: [-17, -21, -19, -22],
    lead: [
      19, null, null, null, 17, null, 14, null, 12, null, 14, null, 17, null, null, null,
      15, null, null, null, 14, null, 12, null, 10, null, 12, null, 14, null, null, null,
      17, null, null, null, 19, null, 17, null, 14, null, 12, null, 14, null, null, null,
      14, null, null, null, 18, null, null, null, 21, null, null, null, 18, null, null, null,
    ],
    note(step, at, len, lift) {
      const s = step % 16, r = this.roots[Math.floor(step / 16) % 4] + lift, dist = distortion();
      if (s === 0 || s === 6 || s === 8 || s === 10) kick(at, 0.9);
      if (s === 4 || s === 12) snare(at, 0.5);
      if (s % 2 === 0) noise('highpass', 5000, 5000, 0.08, 0.07, 0, musicOut, at);   // ride
      if (s % 2 === 0) synth('square', r - 12, at, len * 1.8, 0.2, 700);              // bass
      if (s === 0 || s === 10) chord('sawtooth', [r, r + 7, r + 12], at, len * 5, 0.09, 4000, false, dist);
      else if (s % 2 === 0) chord('sawtooth', [r, r + 7], at, len * 0.9, 0.07, 1400, false, dist);   // palm-muted chugs
      if (Math.floor(step / 64) % 2 === 1) lead(this.lead, step, at, len, (n, d) => synth('sawtooth', n + lift, at, d, 0.06, 3500, true, dist));
    },
  },
  // 4. 疾速 / Rush: drum and bass in D minor (Dm - Bb - C - A), fast breakbeat and a deep, growling bass
  rush: {
    bpm: 174,
    roots: [-31, -35, -33, -36],
    lead: [
      17, null, null, 15, null, null, 12, null, null, null, 10, null, 12, null, null, null,
      13, null, null, 12, null, null, 10, null, null, null, 8, null, 10, null, null, null,
      15, null, null, 13, null, null, 10, null, null, null, 8, null, 7, null, null, null,
      16, null, null, 12, null, null, 7, null, null, null, 4, null, 7, null, null, null,
    ],
    note(step, at, len, lift) {
      const s = step % 16, r = this.roots[Math.floor(step / 16) % 4] + lift;
      if (s === 0 || s === 10) kick(at, 0.95);
      if (s === 4 || s === 12) snare(at, 0.55);
      if (s === 7 || s === 14) snare(at, 0.14);                                        // ghost snares
      if (s % 2 === 0) hat(at, 0.08); else hat(at, 0.03);
      if (s === 0 || s === 8) synth('sawtooth', r + 12, at, len * 7.5, 0.2, 380, true); // growling bass
      lead(this.lead, step, at, len, (n, d) => synth('square', n + lift, at, d, 0.06, 4200, true));
    },
  },
  // 5. 狂飆 / Turbo: Eurobeat in B minor (Bm - G - A - F#), bouncing octave bass and a bright, fast lead
  turbo: {
    bpm: 156,
    bars: [
      { root: -22, ch: [2, 5, 9] }, { root: -26, ch: [-2, 2, 5] },
      { root: -24, ch: [0, 4, 7] }, { root: -27, ch: [-3, 1, 4] },
    ],
    lead: [
      14, null, 14, 12, 14, null, 17, null, 14, null, 12, null, 9, null, 12, null,
      10, null, 10, 9, 10, null, 14, null, 10, null, 9, null, 5, null, 9, null,
      12, null, 12, 10, 12, null, 16, null, 17, null, 16, null, 12, null, 16, null,
      16, null, null, null, 13, null, null, null, 9, null, 13, null, 16, null, 21, null,
    ],
    note(step, at, len, lift) {
      const s = step % 16, b = this.bars[Math.floor(step / 16) % 4];
      if (s % 4 === 0) kick(at, 0.9);
      if (s === 4 || s === 12) snare(at, 0.45);
      if (s % 4 === 2) noise('highpass', 7000, 7000, 0.1, 0.1, 0, musicOut, at);
      if (s % 2 === 0) synth('sawtooth', b.root + 12 + (s % 4 === 2 ? 12 : 0) + lift, at, len * 1.6, 0.22, 900);
      if (s === 0 || s === 6 || s === 12) chord('sawtooth', b.ch.map((n) => n + 12 + lift), at, 0.1, 0.03, 3000, true);
      lead(this.lead, step, at, len, (n, d) => synth('sawtooth', n + 12 + lift, at, d, 0.08, 5000, true));
    },
  },
};
const MUSIC_STYLES = ['arcade', 'dance', 'rock', 'rush', 'turbo'];
let musicStyle = 'arcade';
try { const m = localStorage.getItem('fishball-music'); if (MUSIC_STYLES.includes(m)) musicStyle = m; } catch (e) {}

function musicNote(step, at, len) {
  const left = state === 'play' || state === 'paused' ? timeLeft : GAME_TIME;
  const tense = left <= 20, final = left <= 10;
  const lift = final ? 3 : tense ? 2 : 0;               // key change up as time runs out
  MUSIC[musicStyle].note(step, at, len, lift, tense);
  const s = step % 16;
  if (tense && s % 2 === 1) hat(at, 0.08);                // busier hi-hats
  if (final && s >= 12) noise('bandpass', 2200, 1800, 0.06, 0.2, 0, musicOut, at);   // snare roll into each bar
  if (final && s % 4 === 0) {
    // the last 10 seconds: a ticking clock
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(s === 0 ? 2000 : 1500, at);
    g.gain.setValueAtTime(0.06, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.04);
    o.connect(g).connect(musicOut); o.start(at); o.stop(at + 0.05);
  }
}
let previewTimer = 0;
function startMusic() {
  if (!ac || musicTimer) return;
  clearTimeout(previewTimer);
  musicNext = ac.currentTime + 0.1; musicStep = 0;
  musicTimer = setInterval(() => {
    const len = 60 / MUSIC[musicStyle].bpm / 4;   // the same tempo all game
    while (musicNext < ac.currentTime + 0.15) { musicNote(musicStep++, musicNext, len); musicNext += len; }
  }, 25);
}
function stopMusic() { clearInterval(musicTimer); musicTimer = 0; clearTimeout(previewTimer); }

// the music picker on the start screen: tapping a track plays a short preview of it
function setMusicStyle(m, preview) {
  musicStyle = m;
  try { localStorage.setItem('fishball-music', m); } catch (e) {}
  MUSIC_STYLES.forEach((k) => $('mu-' + k).setAttribute('aria-checked', String(k === m)));
  if (!preview) return;
  initAudio();
  if (!ac) return;
  if (ac.state === 'suspended') ac.resume();
  stopMusic(); startMusic();
  previewTimer = setTimeout(() => { if (state !== 'play') stopMusic(); }, 6000);
}
MUSIC_STYLES.forEach((k) => $('mu-' + k).addEventListener('click', () => setMusicStyle(k, true)));
setMusicStyle(musicStyle, false);
