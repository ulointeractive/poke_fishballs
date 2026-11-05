// config.js: Game settings: timings, scoring, levels, item names, share link.

const TAU = Math.PI * 2;
const STICK_CAP = 6;          // fishballs per stick; a full stick is handed over automatically
const CENTER_BONUS = 1;       // extra point for a fishball poked dead centre
const GAME_TIME = 60;
// the curry boils harder as time runs out: at the last second, the current is this many times faster
const BOIL_MAX = 3.4;
const REFILL_EVERY = 0.25;    // seconds between new items rising up into the pot
const WRONG_PENALTY = 2;      // challenge level: poking anything that isn't a fishball
const LEVELS = {
  normal: { count: 30, others: 0, flow: 1 },
  // 挑戰: half fishballs, half other items; the pot gets busier with every stick
  hard:   { count: 34, others: 0.5, flow: 1.35, rampCount: 1, maxExtra: 10, dropPerStick: 2 },
};
// the items that can be in the pot (their names, in both languages, are in js/i18n.js)
const KINDS = { fish: 'fish', radish: 'radish', beef: 'beef', cuttle: 'cuttle', skin: 'skin' };
const OTHER_KINDS = ['radish', 'beef', 'cuttle', 'skin'];
const HISTORY_MAX = 50;
// the link added to shared results (the GitHub Pages address once Pages is turned on)
const SHARE_URL = 'https://ulouwm.github.io/poke_fishballs/';
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
