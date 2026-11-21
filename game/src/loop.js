// The game loop. One job: hold the round state, run the clock, and put the two
// pictures, the found markers and the HUD on the single canvas the judge sees.

import { BOARD, PANEL_GAP, LEVELS, SCORE, HINTS } from './config.js';
import { buildLevel, paintScene } from './level.js';
import { makeRng } from './random.js';
import { createInput } from './input.js';
import {
  paintMarker, paintHint, paintMiss, paintHud, paintFooter, paintCenterCard,
  paintBanner, FONT,
} from './hud.js';
import { label } from './draw.js';

export const HUD_H = 52;
export const CAPTION_H = 46;
export const PANEL_H = BOARD + CAPTION_H;
export const FOOT_H = 34;
export const STAGE_W = BOARD * 2 + PANEL_GAP;
export const STAGE_H = HUD_H + PANEL_H + FOOT_H;

export function createGame(canvas, opts = {}) {
  const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = Math.round(STAGE_W * dpr);
  canvas.height = Math.round(STAGE_H * dpr);
  canvas.style.aspectRatio = `${STAGE_W} / ${STAGE_H}`;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const plates = [document.createElement('canvas'), document.createElement('canvas')];
  for (const c of plates) {
    c.width = Math.round(BOARD * dpr);
    c.height = Math.round(BOARD * dpr);
  }

  const seedRng = makeRng((opts.seed ?? 1) * 7919 + 13);

  const state = {
    phase: 'intro',
    levelIndex: 0,
    level: null,
    found: new Set(),
    secondsLeft: 0,
    score: 0,
    hints: HINTS,
    combo: 0,
    lastFindAt: -99,
    hintId: null,
    hintUntil: 0,
    banner: '',
    bannerColour: '#7ee2a8',
    bannerAt: -99,
    misses: [],
    pulses: [],
    time: 0,
    levelScores: [],
  };

  function startLevel(index) {
    state.levelIndex = index;
    state.level = buildLevel(index, LEVELS[index % LEVELS.length], seedRng.int(1, 1000000));
    state.found = new Set();
    state.secondsLeft = state.level.seconds;
    state.combo = 0;
    state.lastFindAt = -99;
    state.hintId = null;
    state.misses = [];
    state.pulses = [];
    state.banner = '';
    state.phase = 'playing';
    for (let v = 0; v < 2; v++) {
      const c = plates[v].getContext('2d');
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, BOARD, BOARD);
      paintScene(c, state.level, v);
    }
  }

  // Stage space -> board space. The plates sit under the HUD, side by side.
  function locate(x, y) {
    const top = HUD_H + CAPTION_H;
    const bot = top + BOARD;
    if (y < top || y > bot) return null;
    if (x >= 0 && x <= BOARD) return { side: 0, wx: x, wy: y - top };
    if (x >= BOARD + PANEL_GAP && x <= BOARD * 2 + PANEL_GAP) {
      return { side: 1, wx: x - BOARD - PANEL_GAP, wy: y - top };
    }
    return null;
  }

  function flash(text, colour) {
    state.banner = text;
    state.bannerColour = colour;
    state.bannerAt = state.time;
  }

  function comboText(n) {
    if (n >= 4) return 'FOUR IN A ROW';
    if (n === 3) return 'TRIPLE FIND';
    if (n === 2) return 'DOUBLE FIND';
    return 'FOUND IT';
  }

  function advance() {
    const next = state.levelIndex + 1;
    if (next < LEVELS.length) startLevel(next);
    else state.phase = 'done';
  }

  function pick(p) {
    if (state.phase !== 'playing') {
      if (state.phase === 'intro') startLevel(0);
      else if (state.phase === 'cleared') advance();
      else if (state.phase === 'timeout') startLevel(state.levelIndex);
      else if (state.phase === 'done') {
        state.score = 0;
        state.levelScores = [];
        state.hints = HINTS;
        startLevel(0);
      }
      return;
    }
    const loc = locate(p.x, p.y);
    if (!loc) return;
    // Nearest centre wins: overlapping circles must never make a find unreachable.
    let hit = null;
    let bestD = Infinity;
    for (const d of state.level.diffs) {
      if (state.found.has(d.id)) continue;
      const dx = loc.wx - d.cx;
      const dy = loc.wy - d.cy;
      const dd = dx * dx + dy * dy;
      if (dd <= d.r * d.r && dd < bestD) { bestD = dd; hit = d; }
    }
    if (hit) {
      state.found.add(hit.id);
      state.combo = state.time - state.lastFindAt < 4.5 ? state.combo + 1 : 1;
      state.lastFindAt = state.time;
      state.score += SCORE.find + (state.combo > 1 ? SCORE.combo * (state.combo - 1) : 0);
      state.pulses.push({ id: hit.id, at: state.time });
      state.hintId = null;
      if (state.found.size === state.level.diffs.length) {
        state.score += SCORE.clear + Math.round(state.secondsLeft) * SCORE.time;
        state.levelScores.push({ name: state.level.name, score: state.score });
        state.phase = 'cleared';
      } else {
        flash(comboText(state.combo), '#7ee2a8');
      }
    } else {
      state.combo = 0;
      state.misses.push({ ...loc, at: state.time });
      flash('NOT THERE', '#ff9a8a');
    }
  }

  function useHint() {
    if (state.phase !== 'playing' || state.hints <= 0) return;
    const left = state.level.diffs.filter((d) => !state.found.has(d.id));
    if (!left.length) return;
    state.hints -= 1;
    const target = left[Math.floor(Math.random() * left.length)];
    state.hintId = target.id;
    state.hintUntil = state.time + 3.2;
    state.secondsLeft = Math.max(1, state.secondsLeft - 4);
    flash('HINT - 4s SPENT', '#ffd479');
  }

  function onKey(key) {
    if (key === 'h' || key === 'H') useHint();
    if (key === 'r' || key === 'R') {
      state.score = 0;
      state.levelScores = [];
      state.hints = HINTS;
      startLevel(0);
    }
    if (key === 'Enter' || key === ' ') {
      if (state.phase === 'intro') startLevel(0);
      else if (state.phase === 'cleared') advance();
      else if (state.phase === 'timeout') startLevel(state.levelIndex);
      else if (state.phase === 'done') {
        state.score = 0;
        state.levelScores = [];
        state.hints = HINTS;
        startLevel(0);
      }
    }
  }

  createInput(canvas, STAGE_W, STAGE_H, pick, onKey);

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    state.time += dt;
    if (state.phase === 'playing') {
      state.secondsLeft -= dt;
      if (state.secondsLeft <= 0) {
        state.secondsLeft = 0;
        state.phase = state.found.size === state.level.diffs.length ? 'cleared' : 'timeout';
      }
    }
    draw();
    requestAnimationFrame(frame);
  }

  function drawPlate(side, ox) {
    const oy = HUD_H + CAPTION_H;
    ctx.save();
    ctx.translate(ox, oy);
    ctx.drawImage(plates[side], 0, 0, BOARD, BOARD);
    for (const d of state.level.diffs) {
      const found = state.found.has(d.id);
      const pulse = state.pulses.find((p) => p.id === d.id);
      if (found) {
        paintMarker(ctx, d, pulse ? Math.max(0, 1 - (state.time - pulse.at) / 0.7) : 0);
      } else if (state.hintId === d.id && state.time < state.hintUntil) {
        paintHint(ctx, d, state.time);
      }
    }
    for (const m of state.misses) {
      if (m.side !== side) continue;
      const age = state.time - m.at;
      if (age < 0.5) paintMiss(ctx, m.wx, m.wy, age);
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(16,19,28,0.94)';
    ctx.fillRect(ox, oy + BOARD, BOARD, CAPTION_H);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fillRect(ox, oy + BOARD, BOARD, 1);
    label(ctx, side === 0 ? 'LEFT PICTURE' : 'RIGHT PICTURE', ox + 14, oy + BOARD + 24, 10,
      'rgba(255,255,255,0.40)', '700', 'left', FONT);
    label(ctx, state.level.name, ox + BOARD - 14, oy + BOARD + 24, 13,
      'rgba(255,255,255,0.74)', '600', 'right', FONT);
    ctx.restore();
  }

  function draw() {
    ctx.save();
    ctx.fillStyle = '#0b0d14';
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);

    if (state.level) {
      paintHud(ctx, STAGE_W, {
        level: state.level,
        found: state.found.size,
        total: state.level.diffs.length,
        secondsLeft: state.secondsLeft,
        score: state.score,
        hints: state.hints,
        combo: state.time - state.lastFindAt < 4.5 ? state.combo : 0,
      });
      drawPlate(0, 0);
      drawPlate(1, BOARD + PANEL_GAP);
      paintFooter(ctx, STAGE_W, STAGE_H, LEVELS.length, state.levelIndex + 1);
      if (state.banner && state.time - state.bannerAt < 1.3) {
        paintBanner(ctx, STAGE_W, state.banner, state.bannerColour, 1 - (state.time - state.bannerAt) / 1.3);
      }
    }

    if (state.phase === 'intro') {
      paintCenterCard(ctx, STAGE_W, STAGE_H, 'TWIN TIDES', [
        'Two pictures, one difference at a time.',
        `${LEVELS.length} scenes - ${LEVELS[0].diffs} to ${LEVELS[LEVELS.length - 1].diffs} differences`,
        'Click a find in either picture. H spends 4s on a hint.',
        'Press Enter to start',
      ], '#7ee2a8');
    } else if (state.phase === 'cleared') {
      const next = LEVELS[state.levelIndex + 1];
      paintCenterCard(ctx, STAGE_W, STAGE_H, 'ALL FOUND', [
        `${state.level.name} - ${state.level.diffs.length} differences`,
        next ? `Next: ${next.name} (${next.diffs} differences)` : 'That was the last scene.',
        'Press Enter to continue',
      ], '#7ee2a8');
    } else if (state.phase === 'timeout') {
      paintCenterCard(ctx, STAGE_W, STAGE_H, 'TIME UP', [
        `${state.found.size} of ${state.level.diffs.length} found this scene`,
        `Score ${state.score}`,
        'Press Enter to try this scene again',
      ], '#ff9a8a');
    } else if (state.phase === 'done') {
      paintCenterCard(ctx, STAGE_W, STAGE_H, 'ALL SCENES CLEARED', [
        `Final score ${state.score}`,
        `${LEVELS.length} scenes, ${LEVELS.reduce((a, l) => a + l.diffs, 0)} differences`,
        'Press Enter to play again',
      ], '#ffd479');
    }
    ctx.restore();
  }

  requestAnimationFrame(frame);

  return {
    state,
    startLevel,
    useHint,
    draw,
    // The screenshot hooks drive these directly.
    solveAll() {
      for (const d of state.level.diffs) state.found.add(d.id);
    },
  };
}
