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
    'btn.history': '我嘅紀錄',
    'pot.aria': '魚蛋煲',
    'intro.title': '篤魚蛋',
    'intro.lead': '街坊排緊隊等食咖喱魚蛋。一分鐘內，你篤得到幾多粒？',
    'intro.step1': '對準魚蛋，㩒落去篤',
    'intro.step2': '放手提起竹籤，再篤下一粒',
    'intro.step3': '一串六粒，自動交俾客人',
    'intro.boil': '時間越少，湯滾得越勁，魚蛋會郁得越快！',
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
    'btn.start': '開檔！',
    'result.new': '新紀錄！', 'unit.pts': '分',
    'r.sticks': '交咗俾客人', 'r.served': '篤到魚蛋', 'r.perfect': '正中紅心', 'r.slip': '滑走咗',
    'r.wrong': '篤錯嘢', 'r.best': '你嘅最佳', 'r.place': '排名',
    'btn.share': '分享成績', 'btn.saveImg': '儲存成績圖', 'share.aria': '成績文字',
    'btn.again': '再篤過', 'btn.menu': '換關卡',
    'pause.title': '暫停咗', 'btn.restart': '重新開始', 'btn.quit': '返主頁',
    'lb.levelAria': '關卡',
   
    'h.games': '玩咗幾多局',
    'btn.close': '關閉', 'btn.cancel': '取消',
    'rec.title': '我嘅紀錄', 'h.best': '最高', 'h.avg': '平均',
    'rec.note': '紀錄只儲存喺呢部機，最多保留最近 50 局。',
    'rec.delete': '刪除所有紀錄', 'rec.deleteAsk': '確定？呢部機所有紀錄都會刪除，冇得復原。',
    'rec.deleteYes': '確定刪除', 'rec.deleted': '已刪除所有紀錄。',
    'hint': '㩒低篤魚蛋，放手提起竹籤',

    'n.pts': (n) => `${n} 分`, 'n.sticks': (n) => `${n} 串`, 'n.balls': (n) => `${n} 粒`,
    'n.times': (n) => `${n} 次`, 'n.items': (n) => `${n} 件`,
    'level.name': (lv) => `${lv}關`,
    'pause.info': (lv, t, s) => `${lv}關 · 仲有 ${t} 秒 · ${s} 分`,
    'rank.0': '傳說級魚蛋佬', 'rank.1': '魚蛋師傅', 'rank.2': '熟手學徒', 'rank.3': '新嚟幫手', 'rank.4': '篤到手軟',
    'pop.timeUp': '時間到！', 'pop.air': '篤空氣', 'pop.miss': '冇中', 'pop.slip': '滑走咗！',
    'pop.wrong': (kind, p) => `篤錯${kind}！−${p}`, 'pop.perfect': (p) => `正中！+${p}`,
    // what customers say. A line written as (k) => `...${k}...` mentions the wrong item that was poked.
    'say.great': ['正呀！', '好靚！', '一流！', '串得好靚仔', '師傅好手勢！'],
    'say.ok': ['唔該！', '多謝！', '唔該晒', '幾好吖'],
    'say.bad': ['咁歪嘅…', '歪咗喎', '歪到好似比薩斜塔咁', '你篤得咁歪嘅？', '串到成條蛇咁'],
    'say.wrong': [(k) => `咁正！要魚蛋俾${k}`, '大佬，我要魚蛋喎', '我要魚蛋呀！', (k) => `點解有${k}嘅？`, (k) => `${k}？我冇叫喎`],
    'say.air': ['唔好篤空氣啦', '篤邊度呀？', '喂，煲喺下面呀', '空氣唔使錢㗎咩？'],
    'say.miss': ['睇真啲先篤啦', '又冇中？', '魚蛋走晒去邊？'],
    'say.slow': ['快手啲', '快啲啦，我趕時間', '等到頸都長', '師傅，好肚餓呀', '仲未得呀？'],
    'r.rank': (n) => `呢部機第 ${n} 名`, 'r.privacy': '呢局只儲存喺你部機。',
    'hist.empty': '未有紀錄，玩一局先！',
    'intro.local': (lv, best) => `你喺呢部機${lv}關嘅最高分：${best} 分`,
    'rec.sub': (r) => `${r.served ?? 0} 粒 · ${r.sticks} 串`,
    'share.text': (r, hard) => `我喺「篤魚蛋」${hard ? '挑戰關' : ''}一分鐘攞咗 ${r.score} 分！篤咗 ${r.served} 粒魚蛋，交咗 ${r.sticks} 串，正中 ${r.perfects} 次。你破唔破到？`,
    'toast.copied': '成績已複製，貼去 WhatsApp 或者 IG 啦！', 'toast.select': '揀晒段文字再複製。',
    'img.subtitle': '一分鐘挑戰', 'img.hard': ' · 挑戰關', 'img.stats': (r) => `${r.served} 粒 · ${r.sticks} 串 · 正中 ${r.perfects} 次`,
    'img.cta': '你破唔破到？', 'img.file': (s) => `poke-fishballs-${s}.png`,   // plain-English file name: some phones reject Chinese file names
    'toast.imgSaved': '成績圖已儲存。',
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
    'btn.history': 'My games',
    'pot.aria': 'Pot of curry fishballs',
    'intro.title': 'Poke Fishballs',
    'intro.lead': 'Hungry customers are queuing for curry fishballs. How many can you poke in one minute?',
    'intro.step1': 'Press down on a fishball to poke it',
    'intro.step2': 'Release to lift the stick, then poke the next one',
    'intro.step3': 'Six per stick, handed to the customer automatically',
    'intro.boil': 'The less time left, the harder the curry boils, and the faster the fishballs move!',
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
    'btn.start': 'Open the stall!',
    'result.new': 'New best!', 'unit.pts': 'pts',
    'r.sticks': 'Sticks served', 'r.served': 'Fishballs poked', 'r.perfect': 'Centre hits', 'r.slip': 'Slipped',
    'r.wrong': 'Wrong items', 'r.best': 'Your best', 'r.place': 'Rank',
    'btn.share': 'Share result', 'btn.saveImg': 'Save image', 'share.aria': 'Result text',
    'btn.again': 'Play again', 'btn.menu': 'Change level',
    'pause.title': 'Paused', 'btn.restart': 'Restart', 'btn.quit': 'Main menu',
    'lb.levelAria': 'Level',
   
    'h.games': 'Games played',
    'btn.close': 'Close', 'btn.cancel': 'Cancel',
    'rec.title': 'My games', 'h.best': 'Best', 'h.avg': 'Average',
    'rec.note': 'Saved on this device only, up to the last 50 games.',
    'rec.delete': 'Delete all records', 'rec.deleteAsk': "Sure? All your games on this device will be deleted. This can't be undone.",
    'rec.deleteYes': 'Delete', 'rec.deleted': 'All your data was deleted.',
    'hint': 'Press to poke, release to lift',

    'n.pts': (n) => `${n} pts`, 'n.sticks': (n) => `${n} ${n === 1 ? 'stick' : 'sticks'}`,
    'n.balls': (n) => `${n}`, 'n.times': (n) => `${n}`, 'n.items': (n) => `${n}`,
    'level.name': (lv) => `${lv} level`,
    'pause.info': (lv, t, s) => `${lv} · ${t}s left · ${s} pts`,
    'rank.0': 'Fishball Legend', 'rank.1': 'Fishball Master', 'rank.2': 'Skilled Apprentice', 'rank.3': 'New Helper', 'rank.4': 'Sore Arms',
    'pop.timeUp': "Time's up!", 'pop.air': 'Poked the air', 'pop.miss': 'Miss', 'pop.slip': 'Slipped!',
    'pop.wrong': (kind, p) => `${kind}! −${p}`, 'pop.perfect': (p) => `Centre! +${p}`,
    'say.great': ['Perfect!', 'Beautiful!', 'Top class!', 'What a neat stick!', 'Nice hands, boss!'],
    'say.ok': ['Thanks!', 'Cheers!', 'Thanks a lot', 'Not bad'],
    'say.bad': ['So crooked…', 'Bit wonky…', 'Leaning like the Tower of Pisa', 'How did it get this crooked?', 'Wiggly as a snake'],
    'say.wrong': [(k) => `Great. I asked for fishballs and got ${k.toLowerCase()}`, 'Boss, I wanted fishballs!', 'I wanted fishballs!', (k) => `Why is there ${k.toLowerCase()}?`, (k) => `${k}? I didn't order that!`],
    'say.air': ['Stop poking the air!', 'Where are you poking?', "Hey, the pot's down there!", 'Is air free now?'],
    'say.miss': ['Look before you poke!', 'Missed again?', 'Where did the fishballs go?'],
    'say.slow': ['Hurry up!', "Quick, I'm in a rush!", "I've been waiting forever!", "Boss, I'm starving!", 'Not ready yet?'],
    'r.rank': (n) => `#${n} on this device`, 'r.privacy': 'This game is saved on your device only.',
    'hist.empty': 'No games yet. Play one first!',
    'intro.local': (lv, best) => `Your best ${lv} score on this device: ${best} pts`,
    'rec.sub': (r) => `${r.served ?? 0} fishballs · ${r.sticks} sticks`,
    'share.text': (r, hard) => `I scored ${r.score} pts in one minute of Poke Fishballs${hard ? ' (Challenge)' : ''}! ${r.served} fishballs, ${r.sticks} sticks served, ${r.perfects} centre hits. Can you beat it?`,
    'toast.copied': 'Result copied. Paste it into a chat!', 'toast.select': 'Select the text and copy it.',
    'img.subtitle': 'One-minute challenge', 'img.hard': ' · Challenge', 'img.stats': (r) => `${r.served} fishballs · ${r.sticks} sticks · ${r.perfects} centre hits`,
    'img.cta': 'Can you beat it?', 'img.file': (s) => `poke-fishballs-${s}.png`,
    'toast.imgSaved': 'Image saved.',
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
