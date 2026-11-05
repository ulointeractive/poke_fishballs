# 篤魚蛋 Poke Fishballs

A one-minute browser game inspired by after-school curry fishballs (咖喱魚蛋) in Macau.

Open `index.html` in a browser (desktop or phone). No build step.

- Press on a fishball to poke it, release to lift the stick.
- Each bamboo stick holds 6 fishballs and is handed to the next customer automatically when you lift it.
- Scoring: 1 point per fishball, 2 points if you poked it dead centre. Off-centre fishballs sit crooked on the stick; hitting the very edge makes it slip away (0 points).
- A miss into the curry makes a soft water-drop sound.
- 暫停 pauses the game (Esc or P also work, and switching away pauses automatically); from there you can resume, restart, or go back to the menu without saving.
- Two levels: 普通 (only fishballs) and 挑戰 (a mixed pot with white radish, beef balls, cuttlefish balls and pig skin, plus a faster current). Poking anything that isn't a fishball costs 2 points and still takes a place on the stick. Every finished stick drops two more non-fishball items in; the pot grows from 34 to 44 items and the non-fishball share rises from 40% to 70%. Each level has its own leaderboard.
- Where you hit the fishball is where it sits on the stick. Off-centre pokes make crooked sticks; hitting the very edge makes it slip away.
- Fishballs drift in a round pot of simmering curry and get pushed around by your pokes.
- Leaderboard and personal history: shared online when played as a claude.ai artifact, saved in the browser when the file is opened directly.

## Leaderboard and sharing

Players type a name for the all-time leaderboard (anyone who leaves it blank gets a random stall-style name, e.g. 無影竹籤刺客 or 午夜咖喱忍者, re-rollable with 隨機; no account or device names are used); the record holder stays on top until someone beats them. Results can be shared as text (with the game link) or saved as an image.

## Test mode

`SAVE_RANKING` near the top of the script in `index.html` is `false` while testing: games still go into each player's own history, but nothing is written to the shared leaderboard. Set it to `true` when the game is published.

## Record benchmarks (bot playing the real game, 60 s)

| Player model | 普通 | 挑戰 |
|---|---|---|
| Frame-perfect bot (limited by pot refill) | ~500 | ~463 |
| Elite human (~0.18 s aim) | ~363 | ~238 |
| Skilled human (~0.3 s aim) | ~270 | ~161 |
| Casual player (~0.55 s aim) | ~135 | ~60 |

挑戰 human estimates add recognition time (0.08–0.25 s per poke) and an occasional wrong pick (3–12%).
