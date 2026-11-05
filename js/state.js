// state.js: Page elements, small helpers, and the live game state shared by every other file.

const $ = (id) => document.getElementById(id);
const cv = $('pot');
const ctx = cv.getContext('2d');
const stage = $('stage');
const hudTime = $('hud-time'), hudScore = $('hud-score'), hudSticks = $('hud-sticks');
const timebar = $('timebar');
const dotsEl = $('dots');
for (let i = 0; i < STICK_CAP; i++) { const d = document.createElement('span'); d.className = 'dot'; dotsEl.appendChild(d); }
const dotEls = [...dotsEl.children];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fontBody = () => getComputedStyle(document.documentElement).getPropertyValue('--font-body');

// ---------- state ----------
let W = 0, H = 0, dpr = 1;
const L = {};
let balls = [], ripples = [], pops = [], steam = [], flyers = [], customers = [], leavers = [];
let state = 'ready';
let timeLeft = GAME_TIME, score = 0, sticks = 0, served = 0, perfects = 0, slips = 0, wrong = 0;
let level = 'normal', playLevel = 'normal', lbLevel = 'normal';
let tNow = 0, refillTimer = 0;
let bg = null, sprites = null;
let lastRun = null;
const stick = {
  balls: [], depth: 0, pressed: false, resolved: false, x: 0, y: 0, hasPointer: false,
  needLift: false,   // the stick must come back up before it can poke again
};
