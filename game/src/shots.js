// Screenshot routes. One job: put the game in a named, repeatable state so the
// same URL always renders the same frame — that is what screenshots/ is made of.

import { createGame } from './loop.js';

export function makeShots(canvas) {
  return {
    start(game) {
      // The intro card, with the first scene painted behind it.
      game.startLevel(0);
      game.state.phase = 'intro';
      game.state.found = new Set();
      game.state.banner = '';
    },

    play(game) {
      // Mid-hunt: some found, some left, a hint and a miss on screen.
      game.startLevel(0);
      const diffs = game.state.level.diffs;
      const solve = Math.min(3, diffs.length - 2);
      for (let i = 0; i < solve; i++) game.state.found.add(diffs[i].id);
      game.state.score = 1100;
      game.state.secondsLeft = 62;
      game.state.hints = 2;
      game.state.combo = 2;
      game.state.lastFindAt = game.state.time;
      const target = diffs[solve];
      game.state.hintId = target.id;
      game.state.hintUntil = game.state.time + 60;
      const miss = diffs[diffs.length - 1];
      game.state.misses = [{ side: 1, wx: miss.cx + 8, wy: miss.cy + 10, at: game.state.time - 0.1 }];
      game.state.phase = 'playing';
    },

    later(game) {
      // A deeper scene, four found, so the second screenshot is not the same plate.
      game.startLevel(1);
      const diffs = game.state.level.diffs;
      for (let i = 0; i < 4 && i < diffs.length - 3; i++) game.state.found.add(diffs[i].id);
      game.state.score = 2400;
      game.state.secondsLeft = 74;
      game.state.hints = 1;
      game.state.phase = 'playing';
    },

    clear(game) {
      game.startLevel(2);
      game.solveAll();
      game.state.score = 4180;
      game.state.phase = 'cleared';
    },

    // Cover: a busy plate, most finds marked, a hint and a miss on screen, so the
    // sheet reads as a spot-the-difference game at a glance.
    cover(game) {
      game.startLevel(4);                        // harbour, 12 differences
      const diffs = game.state.level.diffs;
      const solve = Math.min(7, diffs.length - 4);
      for (let i = 0; i < solve; i++) game.state.found.add(diffs[i].id);
      game.state.score = 3140;
      game.state.secondsLeft = 78;
      game.state.hints = 2;
      game.state.combo = 3;
      game.state.lastFindAt = game.state.time;
      game.state.hintId = diffs[solve].id;
      game.state.hintUntil = game.state.time + 90;
      const miss = diffs[diffs.length - 1];
      game.state.misses = [{ side: 1, wx: miss.cx + 6, wy: miss.cy + 8, at: game.state.time - 0.1 }];
      game.state.phase = 'playing';
    },

    // A second scene, fewer found, so the other screenshots are not the same plate.
    deep(game) {
      game.startLevel(7);                        // glasshouse, 12 differences
      const diffs = game.state.level.diffs;
      for (let i = 0; i < 5; i++) game.state.found.add(diffs[i].id);
      game.state.score = 5260;
      game.state.secondsLeft = 96;
      game.state.hints = 1;
      game.state.phase = 'playing';
    },

    // The end card: every scene cleared, with the running total.
    finish(game) {
      game.startLevel(7);
      game.solveAll();
      game.state.score = 8410;
      game.state.levelIndex = 7;
      game.state.phase = 'done';
      game.state.banner = '';
    },
  };
}
