# 篤魚蛋 Poke Fishballs

**Mini games to poke the most fishballs in one minute.**

A one-minute browser game about a street-stall favourite: curry fishballs (咖喱魚蛋) on a bamboo stick. You run the stall. Poke as many fishballs as you can, fill each stick with six, and serve the queue before time runs out.

The game was inspired by the creator's childhood memory of buying curry fishballs after school in Macau.

---

## Contents

- [How to play](#how-to-play)
- [Rules](#rules)
- [Levels](#levels)
- [Scoring](#scoring)
- [Rank titles](#rank-titles)
- [Pausing and restarting](#pausing-and-restarting)
- [Names, leaderboard and history](#names-leaderboard-and-history)
- [Sharing results](#sharing-results)
- [Sound](#sound)
- [Language](#language)
- [Devices and screen sizes](#devices-and-screen-sizes)
- [Privacy, data and security](#privacy-data-and-security)
- [Running the game](#running-the-game)
- [For developers](#for-developers)
- [Score benchmarks](#score-benchmarks)

---

## How to play

1. Pick a level on the start screen: **普通** or **挑戰**.
2. Optionally type a name for the leaderboard, or tap **隨機** for a random one.
3. Tap **開檔！ Start**. You have **60 seconds**.
4. **Press** on a fishball in the pot to poke it with the bamboo stick.
5. **Release** to lift the stick, then press again to poke the next one.
6. When a stick has **6 items** on it, lifting the stick hands it to the next customer automatically, and you get a fresh stick.

Works with a mouse or a touch screen. The dots next to **呢串** show how many items are on the current stick.

---

## Rules

### The stick

- Every poke must go **down, then up, then down again**. You can't poke a second time without lifting the stick first.
- **Where you hit the item is where it sits on the stick.** Hit a fishball left of centre and it sits off to the side, so the stick looks crooked.
- A stick holds **6 items**. Once it's full, lifting it hands it over automatically.

### Hitting and missing

| What happens | Result |
|---|---|
| Poke within the centre 18% of a fishball's width (**正中**) | Fishball goes on the stick, worth 2 points |
| Poke elsewhere on a fishball | Fishball goes on the stick, worth 1 point, and sits crooked |
| Poke the outer edge of an item (more than 72% of the way from the centre) | It **slips away** (滑走咗) and is pushed aside. 0 points, nothing on the stick |
| Poke the curry but miss everything (**冇中**) | Nothing happens, apart from a ripple and a water-drop sound |
| Poke outside the pot (**篤空氣**) | Nothing happens |
| Poke an item that isn't a fishball (挑戰 only) | It goes on the stick and takes up a space, and you **lose 2 points** |

When items overlap, the poke hits the one in front.

### The pot

- Fishballs float and drift in a slow swirl of simmering curry.
- Every poke pushes nearby items away with a ripple. Dragging the stick while it's down in the pot stirs the items around it.
- The stall keeps topping up the pot: a new item drops in about every 0.25 seconds whenever the pot is below its target.

### Customers

- The queue is made up of everyday people: adults, office workers, grandparents, kids.
- When a stick is handed over, the customer reacts to it:
  - A neat stick, with fishballs close to the centre: "正呀！" or "好靚！"
  - An average stick: "唔該！" or "多謝！"
  - A crooked stick: "咁歪嘅…" or "歪咗喎"
  - A stick with anything other than fishballs (挑戰): "我要魚蛋呀！" or "點解有豬皮嘅？"
- Reactions are for fun and don't change the score.

### Time

- Each game is **60 seconds**. The timer turns gold in the last 10 seconds.
- Fishballs left on a stick that hasn't been handed over when time runs out still count. Points are scored when an item is poked, not when the stick is handed over.

---

## Levels

| | 普通 (Normal) | 挑戰 (Challenge) |
|---|---|---|
| What's in the pot | Only fishballs | Fishballs mixed with 白蘿蔔 (white radish), 牛丸 (beef balls), 墨魚丸 (cuttlefish balls) and 豬皮 (pig skin) |
| Items in the pot | 30 | Starts at 34 and grows by 1 per stick, up to 44 |
| Share that isn't fishball | 0% | Starts at 40% and rises by 3% per stick, up to 70% |
| Extra drops | None | Every stick handed over drops 2 more non-fishball items in ("加料！雜嘢多咗") |
| Curry current | Normal | 35% faster |
| Wrong items | Not possible | −2 points each, and it takes up a space on the stick |
| Leaderboard | 普通 board | Separate 挑戰 board |

In 挑戰, fishballs are always topped up first, so the pot always has at least 13 of them.

---

## Scoring

| Event | Points |
|---|---|
| Fishball poked off-centre | **+1** |
| Fishball poked dead centre (正中) | **+2** |
| Non-fishball item poked (挑戰 only) | **−2** (and it uses up a space on the stick) |
| Slip, miss, or poking outside the pot | 0 |

- Your score never goes below 0.
- Each player's best score per level goes on the leaderboard.

The result screen shows your score, sticks served, fishballs poked, centre hits, slips, wrong items (挑戰), your personal best and your leaderboard position.

---

## Rank titles

Shown at the end of each game:

| Title | 普通 | 挑戰 |
|---|---|---|
| 傳說級魚蛋佬 | 320+ | 240+ |
| 魚蛋師傅 | 240+ | 180+ |
| 熟手學徒 | 160+ | 120+ |
| 新嚟幫手 | 80+ | 60+ |
| 篤到手軟 | under 80 | under 60 |

---

## Pausing and restarting

- Press the **pause** button (two bars) in the top bar during a game. It turns into a play button while paused. **Esc** or **P** on a keyboard also work.
- The game pauses on its own if you switch to another app or tab.
- While paused, the clock and the pot are frozen. The pause screen shows the level, time left and score, with three choices:
  - **繼續**: carry on.
  - **重新開始**: restart the same level from 60 seconds.
  - **返主頁**: back to the start screen. That game is **not** saved.
- After a game, **再篤過** replays the same level and **換關卡** goes back to pick a level.

---

## Names, leaderboard and history

### Names

- Players can type a name of up to 24 characters, on the start screen or after a game.
- Anyone who leaves it blank gets a random name when their first game finishes, in the language they're playing in: for example 無影竹籤刺客 or 午夜咖喱忍者, or Shadow Curry Ninja or Iron Stick Samurai.
- Tap **隨機** to roll a new random name at any time. It saves right away.
- Names come only from what the player types or the random generator. No account names, device names or other personal details are used.

### Leaderboard (排行榜)

- Each level has its own **all-time** leaderboard showing the top 50 players. Use the 普通 / 挑戰 buttons to switch between them.
- Each player appears once per level, with their best score.
- The **record holder** (紀錄保持者) is shown in a red banner at the top and stays there until someone beats them. The start screen also shows the current record for the selected level.

### Personal history (我嘅紀錄)

- Your last 50 games, each tagged 普通 or 挑戰, with date, score, fishballs, sticks, centre hits, slips and wrong items.
- Summary: games played, best 普通 score, best 挑戰 score.
- Only you can see your own history.

### Where records are kept

| How the game is opened | Leaderboard | Personal history |
|---|---|---|
| As the claude.ai artifact | Shared online with everyone who can open it | Saved online, private to each player |
| `index.html` opened directly | Only this browser's own scores | Saved in this browser only |

To save scores to the shared leaderboard, a player needs at least **Contributor** access to the artifact. Anyone with less access can play and see the leaderboard, but their scores stay on their own device, and the result screen tells them so.

---

## Sharing results

On the result screen:

- **分享成績** opens the phone's share sheet, or copies a message like this, ready to paste into a chat:
  > 無影竹籤刺客喺「篤魚蛋」挑戰關一分鐘攞咗 172 分！篤咗 103 粒魚蛋，交咗 18 串，正中 76 次。你破唔破到？
  >
  > followed by the game link

  If copying isn't allowed, the text appears in a box to copy by hand.
- **儲存成績圖** saves a square result image with your name, score, level and stats.

Anyone opening the shared link needs access to the artifact. Set its sharing (organisation, or a public link) from the artifact's Share menu.

---

## Sound

| Moment | Sound |
|---|---|
| Fishball poked | Soft "pop" |
| Centre hit | Pop plus a bright chime |
| Stick handed over | Two-note "ding" |
| New item drops into the pot | Small "plop" |
| Miss into the curry | Water-drop "plip" with a tiny splash |
| Slip, wrong item, poking outside the pot | Silent |

The **speaker** button turns all sound on or off; it shows a crossed-out speaker while muted. Sound starts after the first tap, as browsers require. On iPhone, the side silent switch also mutes the game.

---

## Language

- The **EN / 粵** button, at the top right of the instructions panel, switches the whole game between Cantonese (Traditional Chinese) and English: every screen, button, pop-up message, customer line, rank title, share message and result image.
- On a player's first visit, the game picks Cantonese if their browser language is Chinese, and English otherwise. After that it remembers the player's choice on that device.
- Random names come out in the current language. Names already saved stay as they are.
- All text lives in `js/i18n.js`. To change a word, edit it there.

---

## Devices and screen sizes

The game runs in any modern web browser. Nothing to install.

| Platform | Supported browsers |
|---|---|
| iPhone / iPad | Safari, Chrome and others (iOS / iPadOS 15 or newer) |
| Android phones and tablets | Chrome, Samsung Internet, Firefox (Android 8 or newer, current browser) |
| Desktop | Chrome, Edge, Safari, Firefox (current versions) |

Works with touch, mouse or pen. On a keyboard, Esc or P pauses.

**Screen layouts**

- **All layouts:** the title is on the left, with time, score and sticks always in the top-right corner. The buttons (pause, sound, leaderboard, my games) line up on the right.
- **Phones held upright:** the top bar and buttons sit above the pot. On narrow phones (320 px wide, like iPhone SE), the buttons wrap onto a second line, still aligned right.
- **Phones held sideways:** the score and buttons move into a column on the left, and the pot fills the rest of the screen.
- **Tablets and desktops:** the game sits in a centred column up to 760 px wide.
- The pot, items and customers redraw to fit whenever the screen size or orientation changes.

Tested by emulating these screens in Chromium: iPhone SE, iPhone 15 Pro Max, iPhone 15 sideways, Pixel 7 upright and sideways, Galaxy S9+, iPad Pro 11 upright and sideways, desktop at 1440×900 and 1024×640, and a 320×568 phone. None scroll sideways or up and down, and the start screen fits on all of them.

Not yet tested on real Safari, the browser engine used on every iPhone and iPad. A real-device check before launch is recommended.

**Phone details handled**

- No double-tap zoom, no long-press menus, and no text selection while playing.
- No pull-to-refresh while dragging the stick.
- Sound starts on the first tap, as iOS requires, and comes back after a phone call or app switch.
- Leaving the app or tab pauses the game automatically.
- Layouts respect the iPhone notch and home bar.

---

## Privacy, data and security

### Outside services the game contacts

| Service | Why | What it receives |
|---|---|---|
| Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) | Downloads the two Chinese fonts | The player's IP address and browser details, as with any web font. No game data. |
| claude.ai artifact services (only when played as the artifact) | Leaderboard, history, saving the result image | See "What is stored" below |

There are no analytics, ads, tracking pixels, cookies, API keys or passwords anywhere in the code. The game doesn't use the camera, microphone, location, contacts or photos.

The claude.ai artifact link appears in the code only as text in the share message.

### What is stored

| Where | What | Who can see it |
|---|---|---|
| Online leaderboard (`scores`, `scoresHard`) | For each player: an opaque claude.ai id, the leaderboard name they chose or were given, best score and its stats, number of games, date of the best game | Everyone who can open the artifact |
| Online history (`data/users/<id>/history`) | The player's last 50 games: level, score, stats, date | Only that player, not even the owner |
| The browser's local storage | `fishball-lang` (language), `fishball-name` (leaderboard name), `fishball-history` (history when played offline or without save permission) | Only that browser |

- **Player identity:** the game asks claude.ai only for an opaque player id, a random-looking code used to keep each player's scores separate. It does **not** request names, photos or email addresses.
- **Names:** come only from what the player typed or the random generator.

### Browser features used, only when the player taps

- **Clipboard:** copies the share message. The game only writes; it never reads the clipboard.
- **Share sheet:** on phones that support it.
- **File download:** saves the result image. The player confirms first.

### Things to be aware of

- **Scores can be faked.** The game runs entirely in the player's browser, so a technically skilled player with save permission could write a fake best score for themselves. They can't change anyone else's score. The artifact owner can delete any entry, which Claude can do on request.
- **Names aren't moderated.** A player could type something rude. The owner can remove it the same way.
- **Who can save:** only people with Contributor access or higher can write to the leaderboard. Viewers can play and see it, but their scores stay on their own device.
- **Google Fonts:** if you'd rather the game contacted no outside service, the fonts can be bundled with the game instead.

---

## Running the game

- **As a claude.ai artifact:** open the artifact link. It's private until shared from its Share menu.
- **Locally:** open `index.html` in any modern browser on desktop or phone. There's no build step and nothing to install. Fonts load from Google Fonts, with system fonts as a fallback.

---

## For developers

### Files

```
index.html        page structure: top bar, start / result / pause / leaderboard screens
css/style.css     all colours, fonts and layout (including phone and sideways layouts)
js/config.js      game settings: time, scoring, levels, SAVE_RANKING switch
js/i18n.js        every on-screen text in Cantonese and English, and the language switch
js/state.js       page elements, small helpers, live game state
js/records.js     leaderboard, personal history, player names
js/share.js       share text and result image
js/sound.js       sound effects
js/layout.js      fitting the scene to the screen, street background
js/items.js       what's in the pot: item artwork, which items appear, floating physics
js/poke.js        poking, hits and misses, scoring, handing sticks to customers
js/customers.js   the queue of customers: looks and reactions
js/draw.js        drawing each frame: stick, pot, items, steam
js/game.js        main loop, controls, start / pause / end of a game, start-up
```

Where to look for common changes:

| To change… | Edit |
|---|---|
| Game length, points, penalty, refill speed, level settings, the leaderboard switch | `js/config.js` |
| Any text in either language (screens, buttons, messages, customer lines, rank titles, random names) | `js/i18n.js` |
| Colours, fonts, button styles | `css/style.css` |
| Random names, leaderboard behaviour | `js/records.js` |
| When customers say each line | `js/poke.js` (`handOut`) |
| How customers look | `js/customers.js` |
| How fishballs and other items look | `js/items.js` (`paintItem`) |
| Sounds | `js/sound.js` |
| Rank title score thresholds | `js/game.js` (`rankFor`) |

The scripts are plain scripts, not modules, so the game works when you double-click `index.html`. They load in the order listed in `index.html`. Each file can use anything the files before it defined, so keep that order when adding files.

### Test mode: `SAVE_RANKING`

In `js/config.js`:

```js
const SAVE_RANKING = false;
```

- **`false` (current):** test mode. Games still go into each player's personal history, but **nothing is written to the shared leaderboard**. The result screen shows "測試模式：呢局冇上排行榜。"
- **`true`:** scores go onto the leaderboard. Switch to this when the game is published.

### Tuning values

All in `js/config.js`:

| Constant | Value | Meaning |
|---|---|---|
| `GAME_TIME` | 60 | Seconds per game |
| `STICK_CAP` | 6 | Items per stick |
| `CENTER_BONUS` | 1 | Extra point for a centre hit |
| `WRONG_PENALTY` | 2 | Points lost for a non-fishball item |
| `REFILL_EVERY` | 0.25 | Seconds between items dropped into the pot |
| `LEVELS.normal` | 30 items, 0% other items | 普通 settings |
| `LEVELS.hard` | 34→44 items, 40%→70% other items, 1.35× current, +2 items per stick | 挑戰 settings |
| `HISTORY_MAX` | 50 | Games kept in personal history |

### Online data (claude.ai artifact)

| Path | Contents | Who can write |
|---|---|---|
| `scores/<player id>` | 普通 best: `best`, `sticks`, `served`, `perfects`, `wrong`, `games`, `name`, `at` | Only that player, or the owner |
| `scoresHard/<player id>` | Same, for 挑戰 | Only that player, or the owner |
| `data/users/<player id>/history` | `runs`: last 50 games | Only that player (private) |

Everyone who can open the artifact can read both leaderboards. The player id is an opaque id from claude.ai, and no profile names are read.

### Publishing checklist

1. Set `SAVE_RANKING` to `true` in `js/config.js`.
2. Publish the updated page.
3. Share the artifact so players can open it and save scores: organisation access or a public link, with at least Contributor access.

---

## Score benchmarks

Measured by a bot playing the real game for 60 seconds. The human rows are simulated players with different aiming speeds. For 挑戰, they also take extra time to recognise each item (0.08–0.25 s) and occasionally pick the wrong one (3–12%). Treat them as estimates of what people can do, not measured scores.

| Player | 普通 | 挑戰 |
|---|---|---|
| Frame-perfect bot (limited by how fast the pot refills) | ~500 | ~463 |
| Elite human (~0.18 s to aim each poke) | ~363 | ~238 |
| Skilled human (~0.3 s) | ~270 | ~161 |
| Casual player (~0.55 s) | ~135 | ~60 |

A score close to the bot's ceiling is very unlikely from a person.
