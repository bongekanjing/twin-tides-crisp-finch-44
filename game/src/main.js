// Entry point. One job: wire the canvas, size the stage, and let ?shot= pick a
// frozen state so a screenshot is a URL rather than a hand-drawn frame.

import { createGame, STAGE_W, STAGE_H } from './loop.js';
import { makeShots } from './shots.js';
import { makeRng } from './random.js';

const canvas = document.getElementById('stage');
canvas.width = STAGE_W;
canvas.height = STAGE_H;

const params = new URLSearchParams(location.search);
const seed = Number(params.get('seed') ?? 1);
const shot = params.get('shot');

const game = createGame(canvas, { seed });

if (shot) {
  const shots = makeShots(canvas);
  if (shots[shot]) {
    shots[shot](game);
    // Paint one frame synchronously, then hold it: a screenshot must not race the loop.
    game.draw();
    requestAnimationFrame(() => game.draw());
  }
}

// A quiet demo mode for the title screen: gently pulse a hint so the first frame
// is not a still.
const rng = makeRng(seed);
if (!shot) {
  let t = 0;
  setInterval(() => {
    t += 1;
    if (game.state.phase === 'playing' && game.state.hints > 0 && t % 5 === 0) {
      const left = game.state.level.diffs.filter((d) => !game.state.found.has(d.id));
      if (left.length) {
        game.state.hintId = left[rng.int(0, left.length - 1)].id;
        game.state.hintUntil = game.state.time + 1.6;
      }
    }
  }, 1000);
}

window.twinTides = game;
