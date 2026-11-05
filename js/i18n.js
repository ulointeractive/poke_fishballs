// i18n.js: every piece of on-screen text, in Cantonese (zh) and English (en), and the language switch.
//
// To change a word: edit it in STRINGS below. Plain text is a string; text with numbers or names in it
// is a small function. Elements in index.html point at a key with data-i18n (text), data-i18n-ph
// (placeholder) or data-i18n-aria (screen-reader label).

const STRINGS = {
  zh: {
    'doc.title': '篤魚蛋',
    'sign.title': '咖喱魚蛋',
    'hud.time': '時間', 'hud.score': '分數', 'hud.sticks': '串',
    'btn.pause': '暫停', 'btn.resume': '繼續',
    'btn.mute': '靜音', 'btn.unmute': '開聲',
    'btn.lang': 'EN', 'btn.langAria': 'Switch to English',
    'meter.stick': '呢串', 'meter.dotsAria': '呢串魚蛋數量',
    'btn.board': '排行榜', 'btn.history': '我嘅紀錄',
    'pot.aria': '魚蛋煲',
    'intro.title': '篤魚蛋',
    'intro.lead': '街坊排緊隊等食咖喱魚蛋。一分鐘內，你篤得到幾多粒？',
    'intro.step1': '對準魚蛋，㩒落去篤',
    'intro.step2': '放手提起竹籤，再篤下一粒',
    'intro.step3': '一串六粒，自動交俾客人',
    'level.pick': '揀關卡',
    'level.normal': '普通', 'level.normalDesc': '成煲都係魚蛋',
    'level.hard': '挑戰', 'level.hardDesc': '雜錦煲，篤錯會扣分',
    'legend.hardTitle': '挑戰關：淨係篤魚蛋！',
    'legend.hardAria': '白蘿蔔、牛丸、墨魚丸、豬皮',
    'legend.hardNote': '篤到其他嘢：扣 2 分，仲會佔咗竹籤一個位。每交一串，煲裡面嘅雜嘢就會多啲，湯都滾得快啲。',
    'legend.centerTitle': '篤邊度最好？篤中心！',
    'legend.centerAria': '篤正中心 2 分，篤偏咗 1 分，篤太邊會滑走 0 分',
    'legend.c1t': '正中', 'legend.c1': '每粒 2 分',
    'legend.c2t': '篤偏咗', 'legend.c2': '每粒 1 分，魚蛋會歪',
    'legend.c3t': '篤太邊', 'legend.c3': '滑走咗，0 分',
    'kind.fish': '魚蛋', 'kind.radish': '白蘿蔔', 'kind.beef': '牛丸', 'kind.cuttle': '墨魚丸', 'kind.skin': '豬皮',
    'name.label': '排行榜用嘅名', 'name.ph': '唔填就幫你改個名', 'name.roll': '隨機', 'name.save': '儲存',
    'btn.start': '開檔！',
    'result.new': '新紀錄！', 'unit.pts': '分',
    'r.sticks': '交咗俾客人', 'r.served': '篤到魚蛋', 'r.perfect': '正中紅心', 'r.slip': '滑走咗',
    'r.wrong': '篤錯嘢', 'r.best': '你嘅最佳', 'r.place': '排行榜',
    'btn.share': '分享成績', 'btn.saveImg': '儲存成績圖', 'share.aria': '成績文字',
    'btn.again': '再篤過', 'btn.menu': '換關卡',
    'pause.title': '暫停咗', 'btn.restart': '重新開始', 'btn.quit': '返主頁',
    'tab.board': '排行榜', 'tab.hist': '我嘅紀錄', 'lb.levelAria': '關卡',
    'champ.label': '紀錄保持者',
    'h.games': '玩咗幾多局', 'h.bestN': '普通最高', 'h.bestH': '挑戰最高',
    'btn.back': '返去',
    'hint': '㩒低篤魚蛋，放手提起竹籤',

    'n.pts': (n) => `${n} 分`, 'n.sticks': (n) => `${n} 串`, 'n.balls': (n) => `${n} 粒`,
    'n.times': (n) => `${n} 次`, 'n.items': (n) => `${n} 件`,
    'level.name': (lv) => `${lv}關`,
    'pause.info': (lv, t, s) => `${lv}關 · 仲有 ${t} 秒 · ${s} 分`,
    'rank.0': '傳說級魚蛋佬', 'rank.1': '魚蛋師傅', 'rank.2': '熟手學徒', 'rank.3': '新嚟幫手', 'rank.4': '篤到手軟',
    'pop.timeUp': '時間到！', 'pop.air': '篤空氣', 'pop.miss': '冇中', 'pop.slip': '滑走咗！',
    'pop.wrong': (kind, p) => `篤錯${kind}！−${p}`, 'pop.perfect': (p) => `正中！+${p}`, 'pop.more': '加料！雜嘢多咗',
    'say.wrong': [() => '我要魚蛋呀！', (kind) => `點解有${kind}嘅？`],
    'say.great': ['正呀！', '好靚！'], 'say.ok': ['唔該！', '多謝！'], 'say.bad': ['咁歪嘅…', '歪咗喎'],
    'r.saving': '儲存緊…', 'r.test': '測試模式', 'r.rank': (n) => `第 ${n} 名`, 'r.localOnly': '只計呢部機',
    'r.readonly': '你嘅分數只儲存喺呢部機：你冇權限寫入排行榜。',
    'r.testNote': '測試模式：呢局冇上排行榜。',
    'lb.note': '每人每關只計最高分。',
    'lb.readonly': '你可以睇排行榜，但冇權限儲存分數。請叫分享者俾你「Contributor」權限。',
    'lb.offline': '而家係離線模式：排行榜只計呢部機玩過嘅分數。',
    'lb.unreachable': '暫時連唔到排行榜，遲啲再試。', 'lb.loading': '載入緊…',
    'lb.empty': '未有人上榜，你做第一個！', 'hist.empty': '未有紀錄，玩一局先！',
    'anon': '無名英雄', 'you.tag': (n) => `${n}（你）`, 'you': '你',
    'lb.subNormal': (s, p) => `${s} 串 · 正中 ${p} 次`,
    'lb.subHard': (s, p, w) => `${s} 串 · 正中 ${p} · 篤錯 ${w}`,
    'intro.record': (lv, name, best) => `${lv}關現時紀錄：${name}，${best} 分。你破唔破到？`,
    'intro.local': (lv, best) => `你喺呢部機${lv}關嘅最高分：${best} 分`,
    'hist.sub': (r, hard) => `${r.served != null ? r.served + ' 粒 · ' : ''}${r.sticks} 串 · 正中 ${r.perfects} · 滑走 ${r.slips}${hard ? ` · 篤錯 ${r.wrong || 0}` : ''}`,
    'toast.nameSaved': (n) => `已儲存：${n}`, 'toast.nameCleared': '已清除名', 'toast.nameFail': '儲存唔到名：你冇權限寫入排行榜。',
    'share.text': (name, r, hard) => `${name ? name + '喺' : '我喺'}「篤魚蛋」${hard ? '挑戰關' : ''}一分鐘攞咗 ${r.score} 分！篤咗 ${r.served} 粒魚蛋，交咗 ${r.sticks} 串，正中 ${r.perfects} 次。你破唔破到？`,
    'toast.copied': '成績已複製，貼去 WhatsApp 或者 IG 啦！', 'toast.select': '揀晒段文字再複製。',
    'img.subtitle': '一分鐘挑戰', 'img.hard': ' · 挑戰關', 'img.stats': (r) => `${r.served} 粒 · ${r.sticks} 串 · 正中 ${r.perfects} 次`,
    'img.cta': '你破唔破到？', 'img.file': (s) => `篤魚蛋-${s}分.png`,
    'toast.imgSaved': '成績圖已儲存。', 'toast.imgSkipped': '冇儲存成績圖。',
    'names.epithets': ['無影', '閃電', '傳說', '暗黑', '爆裂', '究極', '神級', '隱世', '狂熱', '超速', '鐵腕', '天才', '一擊', '午夜'],
    'names.roles': ['篤蛋手', '竹籤刺客', '魚蛋獵人', '咖喱忍者', '魚蛋狙擊手', '竹籤武士', '魚蛋怪盜', '篤篤教主',
      '魚蛋特務', '咖喱魔術師', '魚蛋收割機', '串燒大將', '咖喱旋風', '魚蛋終結者', '竹籤劍聖'],
    'names.join': '',
    'date.locale': 'zh-HK',
  },
  en: {
    'doc.title': 'Poke Fishballs',
    'sign.title': 'Curry Fishballs',
    'hud.time': 'Time', 'hud.score': 'Score', 'hud.sticks': 'Sticks',
    'btn.pause': 'Pause', 'btn.resume': 'Resume',
    'btn.mute': 'Mute', 'btn.unmute': 'Unmute',
    'btn.lang': '粵', 'btn.langAria': '轉做廣東話',
    'meter.stick': 'Stick', 'meter.dotsAria': 'Fishballs on this stick',
    'btn.board': 'Leaderboard', 'btn.history': 'My games',
    'pot.aria': 'Pot of curry fishballs',
    'intro.title': 'Poke Fishballs',
    'intro.lead': 'Hungry customers are queuing for curry fishballs. How many can you poke in one minute?',
    'intro.step1': 'Press down on a fishball to poke it',
    'intro.step2': 'Release to lift the stick, then poke the next one',
    'intro.step3': 'Six per stick, handed to the customer automatically',
    'level.pick': 'Choose a level',
    'level.normal': 'Normal', 'level.normalDesc': 'Only fishballs in the pot',
    'level.hard': 'Challenge', 'level.hardDesc': 'Mixed pot, wrong pokes cost points',
    'legend.hardTitle': 'Challenge: poke fishballs only!',
    'legend.hardAria': 'White radish, beef ball, cuttlefish ball, pig skin',
    'legend.hardNote': 'Poking anything else costs 2 points and still takes a place on the stick. Every stick you serve adds more of the other stuff, and the curry swirls faster.',
    'legend.centerTitle': 'Where to poke? Dead centre!',
    'legend.centerAria': 'Centre hit 2 points, off-centre 1 point, edge slips off for 0 points',
    'legend.c1t': 'Centre', 'legend.c1': '2 points each',
    'legend.c2t': 'Off-centre', 'legend.c2': '1 point, sits crooked',
    'legend.c3t': 'Edge', 'legend.c3': 'Slips off, 0 points',
    'kind.fish': 'Fishball', 'kind.radish': 'White radish', 'kind.beef': 'Beef ball', 'kind.cuttle': 'Cuttlefish ball', 'kind.skin': 'Pig skin',
    'name.label': 'Leaderboard name', 'name.ph': 'Leave blank for a random name', 'name.roll': 'Random', 'name.save': 'Save',
    'btn.start': 'Open the stall!',
    'result.new': 'New best!', 'unit.pts': 'pts',
    'r.sticks': 'Sticks served', 'r.served': 'Fishballs poked', 'r.perfect': 'Centre hits', 'r.slip': 'Slipped',
    'r.wrong': 'Wrong items', 'r.best': 'Your best', 'r.place': 'Leaderboard',
    'btn.share': 'Share result', 'btn.saveImg': 'Save image', 'share.aria': 'Result text',
    'btn.again': 'Play again', 'btn.menu': 'Change level',
    'pause.title': 'Paused', 'btn.restart': 'Restart', 'btn.quit': 'Main menu',
    'tab.board': 'Leaderboard', 'tab.hist': 'My games', 'lb.levelAria': 'Level',
    'champ.label': 'Record holder',
    'h.games': 'Games played', 'h.bestN': 'Best (Normal)', 'h.bestH': 'Best (Challenge)',
    'btn.back': 'Back',
    'hint': 'Press to poke, release to lift',

    'n.pts': (n) => `${n} pts`, 'n.sticks': (n) => `${n} ${n === 1 ? 'stick' : 'sticks'}`,
    'n.balls': (n) => `${n}`, 'n.times': (n) => `${n}`, 'n.items': (n) => `${n}`,
    'level.name': (lv) => `${lv} level`,
    'pause.info': (lv, t, s) => `${lv} · ${t}s left · ${s} pts`,
    'rank.0': 'Fishball Legend', 'rank.1': 'Fishball Master', 'rank.2': 'Skilled Apprentice', 'rank.3': 'New Helper', 'rank.4': 'Sore Arms',
    'pop.timeUp': "Time's up!", 'pop.air': 'Poked the air', 'pop.miss': 'Miss', 'pop.slip': 'Slipped!',
    'pop.wrong': (kind, p) => `${kind}! −${p}`, 'pop.perfect': (p) => `Centre! +${p}`, 'pop.more': 'More mixed in!',
    'say.wrong': [() => 'I wanted fishballs!', (kind) => `Why is there ${kind.toLowerCase()}?`],
    'say.great': ['Perfect!', 'Beautiful!'], 'say.ok': ['Thanks!', 'Cheers!'], 'say.bad': ['So crooked…', 'Bit wonky…'],
    'r.saving': 'Saving…', 'r.test': 'Test mode', 'r.rank': (n) => `#${n}`, 'r.localOnly': 'This device only',
    'r.readonly': "Your score was saved on this device only: you don't have permission to write to the leaderboard.",
    'r.testNote': 'Test mode: this game was not added to the leaderboard.',
    'lb.note': "Each player's best score per level.",
    'lb.readonly': "You can view the leaderboard but can't save scores. Ask whoever shared the game for Contributor access.",
    'lb.offline': 'Offline: this leaderboard only shows scores from this device.',
    'lb.unreachable': "Can't reach the leaderboard right now. Try again later.", 'lb.loading': 'Loading…',
    'lb.empty': 'No scores yet. Be the first!', 'hist.empty': 'No games yet. Play one first!',
    'anon': 'Unnamed hero', 'you.tag': (n) => `${n} (you)`, 'you': 'You',
    'lb.subNormal': (s, p) => `${s} sticks · ${p} centre hits`,
    'lb.subHard': (s, p, w) => `${s} sticks · ${p} centre · ${w} wrong`,
    'intro.record': (lv, name, best) => `${lv} record: ${name}, ${best} pts. Can you beat it?`,
    'intro.local': (lv, best) => `Your best ${lv} score on this device: ${best} pts`,
    'hist.sub': (r, hard) => `${r.served != null ? r.served + ' fishballs · ' : ''}${r.sticks} sticks · ${r.perfects} centre · ${r.slips} slipped${hard ? ` · ${r.wrong || 0} wrong` : ''}`,
    'toast.nameSaved': (n) => `Saved: ${n}`, 'toast.nameCleared': 'Name cleared', 'toast.nameFail': "Couldn't save the name: you don't have permission to write to the leaderboard.",
    'share.text': (name, r, hard) => `${name || 'I'} scored ${r.score} pts in one minute of Poke Fishballs${hard ? ' (Challenge)' : ''}! ${r.served} fishballs, ${r.sticks} sticks served, ${r.perfects} centre hits. Can you beat it?`,
    'toast.copied': 'Result copied. Paste it into a chat!', 'toast.select': 'Select the text and copy it.',
    'img.subtitle': 'One-minute challenge', 'img.hard': ' · Challenge', 'img.stats': (r) => `${r.served} fishballs · ${r.sticks} sticks · ${r.perfects} centre hits`,
    'img.cta': 'Can you beat it?', 'img.file': (s) => `poke-fishballs-${s}.png`,
    'toast.imgSaved': 'Image saved.', 'toast.imgSkipped': 'Image not saved.',
    'names.epithets': ['Shadow', 'Lightning', 'Legendary', 'Midnight', 'Turbo', 'Iron', 'Hidden', 'Ultimate', 'Wild', 'Silent', 'Blazing', 'Swift'],
    'names.roles': ['Skewer', 'Ball Hunter', 'Curry Ninja', 'Stick Samurai', 'Ball Sniper', 'Poke Master', 'Curry Wizard',
      'Ball Bandit', 'Skewer Ace', 'Curry Storm', 'Stick Knight'],
    'names.join': ' ',
    'date.locale': 'en-GB',
  },
};

let lang = 'zh';
try {
  const saved = localStorage.getItem('fishball-lang');
  lang = saved === 'en' || saved === 'zh' ? saved : (/^zh/i.test(navigator.language || '') ? 'zh' : 'en');
} catch (e) {
  lang = /^zh/i.test(navigator.language || '') ? 'zh' : 'en';
}

// t('key') for text, t('key', a, b) for text with values in it
function t(key, ...args) {
  const v = STRINGS[lang][key] ?? STRINGS.zh[key];
  if (v === undefined) return key;
  return typeof v === 'function' ? v(...args) : v;
}
// a level's display name, e.g. "普通" / "Normal"
function levelLabel(lv) { return t('level.' + lv); }
function kindName(k) { return t('kind.' + k); }

// fill every element marked with data-i18n / data-i18n-ph / data-i18n-aria
function applyI18n() {
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = t('doc.title');
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  const btn = document.getElementById('lang');
  if (btn) { btn.textContent = t('btn.lang'); btn.setAttribute('aria-label', t('btn.langAria')); }
}

// the other files register here to redraw their dynamic text when the language changes
const langListeners = [];
function setLang(next) {
  lang = next;
  try { localStorage.setItem('fishball-lang', lang); } catch (e) {}
  applyI18n();
  langListeners.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
}

applyI18n();
