# 篤魚蛋 Poke Fishballs

A one-minute browser game inspired by after-school curry fishballs (咖喱魚蛋) in Macau.

Open `index.html` in a browser (desktop or phone). No build step.

- Press on a fishball to poke it, release to lift the stick.
- Each customer wants 6 fishballs. Count them yourself, then drag the stick up to the counter (or flick it up) and let go to hand it over. Exactly 6 scores 6 + 2 bonus; fewer scores only what's on the stick; extra fishballs are given away for free (still 6 points). A stick holds at most 8.
- Where you hit the fishball is where it sits on the stick. Off-centre pokes make crooked sticks; hitting the very edge makes it slip away.
- Fishballs drift in a square pot of simmering curry and get pushed around by your pokes.
- Leaderboard and personal history: shared online when played as a claude.ai artifact, saved in the browser when the file is opened directly.

## Leaderboard and sharing

Players type a name for the all-time leaderboard; the record holder stays on top until someone beats them. Results can be shared as text (with the game link) or saved as an image.

## Record benchmarks (bot playing the real game, 60 s)

| Player model | Time between pokes | Score |
|---|---|---|
| Frame-perfect bot | none (limited by pot refill) | 336 |
| Elite human | ~0.18 s aim | 240 |
| Skilled human | ~0.3 s aim | 160 |
| Casual player | ~0.55 s aim | 96 |
