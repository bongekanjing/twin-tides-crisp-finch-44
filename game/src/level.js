// Level construction. One job: choose which props differ, and prove each chosen
// difference actually changes pixels inside its own hit circle before the level
// is handed to the player. A difference nobody can see is not a difference.

import { makeRng } from './random.js';
import { SCENES } from './scenes.js';
import { SCENES2 } from './scenes2.js';
import { PALETTES, BOARD } from './config.js';

const BUILDERS = [
  { key: 'harbour', make: SCENES.harbour, palette: PALETTES.harbour, floor: '#1b2036' },
  { key: 'shelf', make: SCENES.shelf, palette: PALETTES.shelf, floor: '#241a18' },
  { key: 'dome', make: SCENES2.observatory, palette: PALETTES.dome, floor: '#14121c' },
  { key: 'glass', make: SCENES2.glasshouse, palette: PALETTES.glass, floor: '#6d7a6a' },
];

// Scenery that reads as texture rather than as a thing you can point at makes a
// poor difference: keep it out so every find is a real object.
const WEAK = new Set(['clouds', 'gulls', 'rocks', 'sunbeam', 'crackedPane', 'meteor', 'stars']);

// A difference must move at least this many pixels inside its circle to count.
const MIN_CHANGED = 90;

function blank() {
  const c = document.createElement('canvas');
  c.width = BOARD;
  c.height = BOARD;
  return c;
}

// Paint one plate into a scratch canvas and read its pixels.
function renderPlate(level, variant, scale) {
  const c = blank();
  const ctx = c.getContext('2d');
  paintInto(ctx, level, variant, scale);
  return ctx.getImageData(0, 0, BOARD, BOARD).data;
}

function changedInside(a, b, cx, cy, r) {
  let n = 0;
  const r2 = r * r;
  const x0 = Math.max(0, Math.floor(cx - r));
  const x1 = Math.min(BOARD, Math.ceil(cx + r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const y1 = Math.min(BOARD, Math.ceil(cy + r));
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy > r2) continue;
      const i = (y * BOARD + x) * 4;
      if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 26) n++;
    }
  }
  return n;
}

export function paintInto(ctx, level, variant, scale = 1) {
  const { base, diffs, palette } = level;
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, BOARD, BOARD);
  ctx.fillStyle = level.floor;
  ctx.fillRect(0, 0, BOARD, BOARD);
  base.back(ctx);
  const alt = variant === 1 ? new Map(diffs.map((d) => [d.id, d.options])) : null;
  for (const p of base.props) {
    const opts = alt && alt.has(p.id) ? alt.get(p.id) : p.opts;
    p.paint(ctx, opts);
  }
  ctx.restore();
}

export function paintScene(ctx, level, variant, scale = 1) {
  paintInto(ctx, level, variant, scale);
}

export function buildLevel(index, levelSpec, seed) {
  const scene = BUILDERS[levelSpec.scene % BUILDERS.length];
  const rng = makeRng(seed ^ (index * 2654435761));
  const base = scene.make({ ...scene.palette, rng });

  const level = {
    index,
    seed,
    name: levelSpec.name,
    seconds: levelSpec.seconds,
    sceneKey: scene.key,
    palette: scene.palette,
    floor: scene.floor,
    base,
    diffs: [],
  };

  const candidates = rng.shuffle(base.props.filter((p) => p.alts && p.alts.length && !WEAK.has(p.id)));
  const left = renderPlate(level, 0, 1);

  for (const p of candidates) {
    if (level.diffs.length >= levelSpec.diffs) break;
    const r = Math.max(34, p.r);
    // A find whose circle runs off the plate cannot be clicked at its centre.
    if (p.cx - r < 0 || p.cx + r > BOARD || p.cy - r < 0 || p.cy + r > BOARD) continue;
    // Centres must stay apart so two finds never collapse into one target, but
    // the circles themselves may overlap: pick() resolves by nearest centre.
    const clashes = level.diffs.some((d) => {
      const dx = d.cx - p.cx;
      const dy = d.cy - p.cy;
      return Math.sqrt(dx * dx + dy * dy) < Math.min(d.r, r);
    });
    if (clashes) continue;
    // Try each alternative, keep the most visible one that stays inside the circle.
    let best = null;
    for (const alt of p.alts) {
      const trial = { id: p.id, cx: p.cx, cy: p.cy, r, options: { ...p.opts, ...alt } };
      level.diffs.push(trial);
      const right = renderPlate(level, 1, 1);
      const n = changedInside(left, right, trial.cx, trial.cy, trial.r);
      level.diffs.pop();
      if (!best || n > best.n) best = { alt, n };
    }
    if (best && best.n >= MIN_CHANGED) {
      level.diffs.push({
        id: p.id,
        cx: p.cx,
        cy: p.cy,
        r: Math.max(34, p.r),
        options: { ...p.opts, ...best.alt },
      });
    }
  }

  return level;
}

// The right-hand plate for a level, painted into an existing context.
export function paintRight(ctx, level, scale = 1) {
  paintInto(ctx, level, 1, scale);
}
