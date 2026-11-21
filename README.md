# twin-tides-crisp-finch-44

[![make.fun · best spot the difference game](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/bongekanjing/twin-tides-crisp-finch-44/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard)

[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/bongekanjing/twin-tides-crisp-finch-44/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

**Twin Tides** is a spot the difference game: two near-identical hand-drawn harbour
scenes side by side, eight scenes, 6 to 12 differences each, a clock, a hint that
spends four seconds, a combo for streaks, and a marker on every difference you find.
Runs from static files in a desktop browser, no network.

Entry for make.fun's
[Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
bounty.

## Play

```sh
node serve.ts          # serves game/ at http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` into the output directory and writes
`dossier.json` with the kit's `buildDossier`.

## Layout

- `game/index.html` — the page shell and styles
- `game/src/main.js` — boots the canvas, dispatches `?shot=` screenshot states
- `game/src/loop.js` — the game: level flow, picking, hints, HUD composition
- `game/src/level.js` — plants differences and proves each one changes pixels
- `game/src/scenes.js`, `game/src/scenes2.js` — the four hand-drawn scenes
- `game/src/draw.js` — shape primitives
- `game/src/hud.js` — HUD, banner and card painters
- `game/src/config.js` — layout, levels, palettes, scoring
- `game/src/random.js` — seeded RNG, so a `?seed=` replays a level
- `game/src/input.js` — pointer and keyboard mapping
- `game/src/shots.js` — frozen states for the screenshots
