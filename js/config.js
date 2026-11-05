// config.js: Game settings: timings, scoring, levels, item names, leaderboard switch.

const TAU = Math.PI * 2;
const STICK_CAP = 6;          // fishballs per stick; a full stick is handed over automatically
const CENTER_BONUS = 1;       // extra point for a fishball poked dead centre
const GAME_TIME = 60;
const REFILL_EVERY = 0.25;    // seconds between new items dropped into the pot
const WRONG_PENALTY = 2;      // challenge level: poking anything that isn't a fishball
const LEVELS = {
  normal: { label: '普通', count: 30, others: 0, flow: 1 },
  // 挑戰 gets harder with every stick: more non-fishball items join the pot
  hard:   { label: '挑戰', count: 34, others: 0.4, flow: 1.35, rampOthers: 0.03, maxOthers: 0.7, rampCount: 1, maxExtra: 10, dropPerStick: 2 },
};
const KINDS = { fish: '魚蛋', radish: '白蘿蔔', beef: '牛丸', cuttle: '墨魚丸', skin: '豬皮' };
const OTHER_KINDS = ['radish', 'beef', 'cuttle', 'skin'];
const COLLECTION = { normal: 'scores', hard: 'scoresHard' };
const HISTORY_MAX = 50;
const SHARE_URL = 'https://claude.ai/artifact/Q3pvQLryEHuyTrhSmoiqeC';
// Test mode switch. false = scores are NOT written to the shared leaderboard (personal history still saves).
// Change to true when the game is published.
const SAVE_RANKING = false;
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
