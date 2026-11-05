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
// Original music made in code. It keeps the same tempo and the same key for the whole game. As time runs out
// it gets more intense: busier hi-hats from 20 s, and snare rolls and a ticking clock in the last 10 seconds.
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
// kick: the pitch drops almost at once to the current chord's root, two octaves down (f), so it thumps in tune
const kick = (at, vol = 0.9, f = 55) => {
  const o = ac.createOscillator(), g = ac.createGain();
  o.frequency.setValueAtTime(150, at); o.frequency.exponentialRampToValueAtTime(f, at + 0.03);
  g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
  o.connect(g).connect(musicOut); o.start(at); o.stop(at + 0.22);
};
// snare: noise plus a short body on a fixed G (196 Hz), a note in the key
const snare = (at, vol = 0.4) => { noise('bandpass', 1900, 1500, 0.14, vol, 0, musicOut, at); drum(196, 196, 0.06, vol * 0.3, at); };
const hat = (at, vol) => noise('highpass', 8000, 8000, 0.025, vol, 0, musicOut, at);
const lead = (seq, step, at, len, fn) => {
  const n = seq[step % seq.length]; if (n === null) return;
  let hold = 1; while (hold < 4 && seq[(step + hold) % seq.length] === null) hold++;
  fn(n, len * hold * 0.95);
};

// Every track is built from the same parts; each one turns parts on or off and sets its own key, chords,
// tempo, melody and sound. Melodies use the full major or minor scale with half-steps and leading notes,
// over chords with 7ths: the sound of Western pop and game music.
//   roots: one bass note per bar · chords: the chord notes for each bar · lead: 16 steps per bar (or null)
//   bass: 'pump' (root and octave in 8ths), 'soft' (round notes on the beat) or a 16-step pattern of offsets
//   kicks / snares: which 16th steps they play on · arp: a 16th-note arpeggio · pad: held chords
//   keys: steps for short chord stabs · leadHalf: the melody only plays every other 4 bars
function track(cfg) {
  return Object.assign({
    bass: 'pump', kicks: [0, 4, 8, 12], snares: [4, 12], hats: 0.12, arp: false, pad: false, keys: null,
    keysWave: 'square', keysCut: 2200, lead: null, leadHalf: false, leadWave: 'sawtooth', leadCut: 2600, leadVol: 0.1,
  }, cfg, {
    note(step, at, len, lift, tense) {
      const s = step % 16, bar = Math.floor(step / 16) % this.roots.length, r = this.roots[bar] + lift, ch = this.chords[bar];
      if (this.kicks.includes(s)) { let f = hz(r - 12); while (f > 70) f /= 2; kick(at, 0.9, f); }
      if (this.snares.includes(s)) snare(at, 0.42);
      hat(at, s % 2 ? this.hats : this.hats * 0.35);
      if (Array.isArray(this.bass)) { const o = this.bass[s]; if (o !== null) synth('square', r + 12 + o, at, len * 1.4, 0.2, 900); }
      else if (this.bass === 'soft') { if (s % 4 === 0 || s === 7 || s === 10) synth('triangle', r + 12, at, len * 2.5, 0.35, 1200); }
      else if (s % 2 === 0) synth('sawtooth', r + (s % 4 === 2 ? 12 : 0), at, len * 1.7, 0.22, 650);
      if (this.pad && s === 0) ch.forEach((n) => synth('triangle', n + lift, at, len * 16, 0.2 / ch.length, 2000));
      if (this.keys && this.keys.includes(s)) ch.forEach((n) => synth(this.keysWave, n + 12 + lift, at, len * 1.2, 0.03, this.keysCut));
      if (this.arp) synth('sawtooth', ch[[0, 1, 2, 3, 2, 1, 2, 3][s % 8]] + 12 + lift + (tense ? 12 : 0), at, len * 0.8, 0.03, 2200);
      if (this.lead && (!this.leadHalf || Math.floor(step / 64) % 2 === 1))
        lead(this.lead, step, at, len, (n, d) => synth(this.leadWave, n + lift, at, d, this.leadVol, this.leadCut, true));
    },
  });
}
const MUSIC = {
  // The game's track: a driving beat (drums, pumping bass, soft held chords), no melody, in a bright major key.
  // C major, 124 bpm. The chords C - G - Am - F three times (12 bars), voiced so their top (most audible)
  // notes make the line G E A F · C G A F · E G A F. Bar 2 is G with an added E on top (G6).
  main: track({
    bpm: 124, pad: true,
    roots: [-21, -26, -24, -28, -21, -26, -24, -28, -21, -26, -24, -28],
    chords: [
      [3, 7, 10], [2, 5, 7], [3, 7, 12], [0, 3, 8],      // C (C E G) · G6 (B D E) · Am (C E A) · F (A C F)
      [7, 10, 15], [2, 5, 10], [3, 7, 12], [0, 3, 8],    // C (E G C) · G (B D G) · Am · F
      [-2, 3, 7], [2, 5, 10], [3, 7, 12], [0, 3, 8],     // C (G C E) · G · Am · F
    ],
  }),
};
// the track the game plays (one of the keys above)
const musicStyle = 'main';

function musicNote(step, at, len) {
  const left = state === 'play' || state === 'paused' ? timeLeft : GAME_TIME;
  const tense = left <= 20, final = left <= 10;
  MUSIC[musicStyle].note(step, at, len, 0, tense);   // always the same key
  const s = step % 16;
  if (tense && s % 2 === 1) hat(at, 0.08);                // busier hi-hats
  if (final && s >= 12) noise('bandpass', 2200, 1800, 0.06, 0.2, 0, musicOut, at);   // snare roll into each bar
  if (final && s % 4 === 0) {
    // the last 10 seconds: a ticking clock
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(s === 0 ? 2093 : 1568, at);   // C and G, in the key
    g.gain.setValueAtTime(0.06, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.04);
    o.connect(g).connect(musicOut); o.start(at); o.stop(at + 0.05);
  }
}
function startMusic() {
  if (!ac || musicTimer) return;
  musicNext = ac.currentTime + 0.1; musicStep = 0;
  musicTimer = setInterval(() => {
    const len = 60 / MUSIC[musicStyle].bpm / 4;   // the same tempo all game
    while (musicNext < ac.currentTime + 0.15) { musicNote(musicStep++, musicNext, len); musicNext += len; }
  }, 25);
}
function stopMusic() { clearInterval(musicTimer); musicTimer = 0; }

