// HUD and overlays. One job: everything painted on top of the two pictures —
// the found markers, the counter, the clock, the hint ring and the round cards.
// Every helper here takes explicit stage width and height, so the frame is drawn
// once for a wide stage rather than assuming a square board.

import { disc, ring, label, roundRect } from './draw.js';

export const FONT = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

const BAR = 52;
const FOOT = 34;

// A found difference: a green ring with a tick through it, plus a ripple that
// fades out over the first third of a second after the find.
export function paintMarker(ctx, diff, pulse) {
  const { cx, cy, r } = diff;
  ctx.save();
  if (pulse > 0) {
    ring(ctx, cx, cy, r + 8 + (1 - pulse) * 18, 3, `rgba(126,226,168,${0.5 * pulse})`);
  }
  ring(ctx, cx, cy, r, 4, 'rgba(10,14,22,0.55)');
  ring(ctx, cx, cy, r, 2, '#7ee2a8');
  ctx.strokeStyle = '#7ee2a8';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.38, cy + r * 0.06);
  ctx.lineTo(cx - r * 0.08, cy + r * 0.36);
  ctx.lineTo(cx + r * 0.42, cy - r * 0.30);
  ctx.stroke();
  ctx.restore();
}

// The hint: a golden pulse around one still-unfound difference, breathing.
export function paintHint(ctx, diff, t) {
  const { cx, cy, r } = diff;
  ctx.save();
  ctx.globalAlpha = 0.30 + Math.sin(t * 6) * 0.26;
  ring(ctx, cx, cy, r + 22, 2.5, '#ffd479');
  ctx.globalAlpha = 0.14;
  disc(ctx, cx, cy, r + 10, '#ffd479');
  ctx.restore();
}

// A miss fades from a red ring at the click point outward.
export function paintMiss(ctx, x, y, age) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, 1 - age * 2.4);
  ctx.strokeStyle = '#ff8f84';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, 10 + age * 40, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// The top bar. Reads left to right: how many found, the clock, the score.
export function paintHud(ctx, w, view) {
  const { level, found, total, secondsLeft, score, hints, combo } = view;

  ctx.save();
  ctx.fillStyle = 'rgba(11,13,19,0.94)';
  ctx.fillRect(0, 0, w, BAR);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(0, BAR - 1, w, 1);

  // found counter, with the level's name under it
  label(ctx, `${found}`, 20, 18, 25, '#7ee2a8', '800', 'left', FONT);
  label(ctx, `of ${total} found`, 20 + (found > 9 ? 24 : 16) + 6, 20, 13, 'rgba(255,255,255,0.62)', '600', 'left', FONT);
  label(ctx, level.name, 20, 39, 11, 'rgba(255,255,255,0.40)', '600', 'left', FONT);

  // clock
  const mm = Math.floor(Math.max(0, secondsLeft) / 60);
  const ss = Math.floor(Math.max(0, secondsLeft) % 60);
  const urgent = secondsLeft <= 15;
  label(ctx, `${mm}:${String(ss).padStart(2, '0')}`, w / 2, 19, 25, urgent ? '#ff8a7a' : '#f2f3f7', '800', 'center', FONT);
  label(ctx, 'TIME LEFT', w / 2, 39, 10, 'rgba(255,255,255,0.40)', '700', 'center', FONT);
  const frac = Math.max(0, Math.min(1, secondsLeft / Math.max(1, level.seconds)));
  ctx.fillStyle = 'rgba(255,255,255,0.09)';
  ctx.fillRect(0, BAR - 4, w, 4);
  ctx.fillStyle = urgent ? '#ff8a7a' : '#6fb3ff';
  ctx.fillRect(0, BAR - 4, w * frac, 4);

  // score and hints, right
  label(ctx, `${score}`, w - 128, 18, 21, '#ffd479', '800', 'right', FONT);
  label(ctx, 'SCORE', w - 128, 38, 10, 'rgba(255,255,255,0.40)', '700', 'right', FONT);
  label(ctx, `HINT ${hints}`, w - 16, 19, 12, hints > 0 ? '#cfd6e6' : 'rgba(255,255,255,0.28)', '700', 'right', FONT);
  label(ctx, 'press H', w - 16, 38, 10, 'rgba(255,255,255,0.34)', '600', 'right', FONT);

  if (combo > 1) label(ctx, `x${combo} COMBO`, 20 + 190, 26, 12, '#ffd479', '700', 'left', FONT);
  ctx.restore();
}

// The bottom strip: one pip per difference, filled as they are found.
export function paintFooter(ctx, w, h, total, found) {
  ctx.save();
  ctx.fillStyle = 'rgba(11,13,19,0.94)';
  ctx.fillRect(0, h - FOOT, w, FOOT);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(0, h - FOOT, w, 1);
  const gap = Math.min(20, (w - 260) / Math.max(1, total));
  const startX = w / 2 - (gap * (total - 1)) / 2;
  for (let i = 0; i < total; i++) {
    disc(ctx, startX + i * gap, h - FOOT / 2, 4, i < found ? '#7ee2a8' : 'rgba(255,255,255,0.20)');
  }
  label(ctx, 'click a difference in either picture', 18, h - FOOT / 2, 11, 'rgba(255,255,255,0.45)', '500', 'left', FONT);
  label(ctx, 'H hint   R restart   Enter continue', w - 18, h - FOOT / 2, 11, 'rgba(255,255,255,0.45)', '500', 'right', FONT);
  ctx.restore();
}

// A centre card: used for the title, a cleared round and the end of the run.
export function paintCenterCard(ctx, w, h, title, lines, accent) {
  ctx.save();
  ctx.fillStyle = 'rgba(7,9,14,0.78)';
  ctx.fillRect(0, 0, w, h);
  const cw = Math.min(560, w - 80);
  const ch = 92 + lines.length * 30;
  const x = (w - cw) / 2;
  const y = (h - ch) / 2;
  ctx.fillStyle = 'rgba(20,24,36,0.98)';
  roundRect(ctx, x, y, cw, ch, 16);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, cw, ch, 16);
  ctx.stroke();
  label(ctx, title, w / 2, y + 44, 28, accent, '800', 'center', FONT);
  lines.forEach((ln, i) => {
    label(ctx, ln, w / 2, y + 84 + i * 30, 15, 'rgba(255,255,255,0.82)', '500', 'center', FONT);
  });
  ctx.restore();
}

// The short banner that flashes on a find or a hint.
export function paintBanner(ctx, w, text, colour, alpha) {
  if (!text || alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.fillStyle = 'rgba(8,10,16,0.66)';
  roundRect(ctx, w / 2 - 104, 74, 208, 34, 17);
  label(ctx, text, w / 2, 91, 14, colour, '700', 'center', FONT);
  ctx.restore();
}
