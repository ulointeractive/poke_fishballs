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
// icon buttons: the picture shows the state, the label (for screen readers and mouse hover) says what a tap does
const ICONS = {
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  soundOn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5a1 1 0 0 0 1 1h3l4.4 3.7a.8.8 0 0 0 1.3-.6V5.4a.8.8 0 0 0-1.3-.6L8 8.5H5a1 1 0 0 0-1 1z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5a1 1 0 0 0 1 1h3l4.4 3.7a.8.8 0 0 0 1.3-.6V5.4a.8.8 0 0 0-1.3-.6L8 8.5H5a1 1 0 0 0-1 1z"/><path d="M16.5 9.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};
function setIconButton(el, icon, label) {
  el.innerHTML = ICONS[icon];
  el.setAttribute('aria-label', label);
  el.title = label;
}

const fontBody = () => getComputedStyle(document.documentElement).getPropertyValue('--font-body');

// ---------- state ----------
let W = 0, H = 0, dpr = 1;
const L = {};
let balls = [], ripples = [], pops = [], steam = [], flyers = [], customers = [], leavers = [];
let state = 'ready';
let timeLeft = GAME_TIME, score = 0, sticks = 0, served = 0, perfects = 0, slips = 0, wrong = 0;
let level = 'normal', playLevel = 'normal', recLevel = 'normal';
let tNow = 0, refillTimer = 0;
let bubbles = [];   // boiling bubbles on the curry surface
let lastHitT = 0, lastNagT = {};   // for customers who get impatient or comment on bad pokes
let bg = null, sprites = null;
let lastRun = null;
const stick = {
  balls: [], depth: 0, pressed: false, resolved: false, x: 0, y: 0, hasPointer: false,
  poking: false,     // a touch started a poke that hasn't reached the curry yet
};
