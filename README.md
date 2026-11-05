# 篤魚蛋 Poke Fishballs

A one-minute browser game inspired by after-school curry fishballs (咖喱魚蛋) in Macau.

Open `index.html` in a browser (desktop or phone). No build step.

- Press on a fishball to poke it, release to lift the stick.
- Each bamboo stick holds 6 fishballs and is handed to the next customer automatically when you lift it.
- Scoring: 1 point per fishball, 2 points if you poked it dead centre. Off-centre fishballs sit crooked on the stick; hitting the very edge makes it slip away (0 points).
- Misses are silent.
- Where you hit the fishball is where it sits on the stick. Off-centre pokes make crooked sticks; hitting the very edge makes it slip away.
- Fishballs drift in a square pot of simmering curry and get pushed around by your pokes.
- Leaderboard and personal history: shared online when played as a claude.ai artifact, saved in the browser when the file is opened directly.

## Leaderboard and sharing

Players type a name for the all-time leaderboard; the record holder stays on top until someone beats them. Results can be shared as text (with the game link) or saved as an image.

## Record benchmarks (bot playing the real game, 60 s)

| Player model | Time to aim each poke | Score |
|---|---|---|
| Frame-perfect bot | none (limited by pot refill) | 496 |
| Elite human | ~0.18 s | 363 |
| Skilled human | ~0.3 s | ~265 |
| Casual player | ~0.55 s | ~133 |
