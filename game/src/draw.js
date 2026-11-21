// Drawing primitives. One job: the small set of shape helpers every scene is
// built from, so a scene file reads as scenery rather than as canvas calls.

export function roundRect(d, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  d.beginPath();
  d.moveTo(x + rr, y);
  d.lineTo(x + w - rr, y);
  d.quadraticCurveTo(x + w, y, x + w, y + rr);
  d.lineTo(x + w, y + h - rr);
  d.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  d.lineTo(x + rr, y + h);
  d.quadraticCurveTo(x, y + h, x, y + h - rr);
  d.lineTo(x, y + rr);
  d.quadraticCurveTo(x, y, x + rr, y);
  d.closePath();
  d.fill();
}

export function box(d, x, y, w, h, fill) {
  d.fillStyle = fill;
  d.fillRect(x, y, w, h);
}

export function tile(d, x, y, w, h, r, fill) {
  d.fillStyle = fill;
  roundRect(d, x, y, w, h, r);
}

export function ring(d, cx, cy, r, width, stroke) {
  d.strokeStyle = stroke;
  d.lineWidth = width;
  d.beginPath();
  d.arc(cx, cy, r, 0, Math.PI * 2);
  d.stroke();
}

export function disc(d, cx, cy, r, fill) {
  d.fillStyle = fill;
  d.beginPath();
  d.arc(cx, cy, r, 0, Math.PI * 2);
  d.fill();
}

export function poly(d, pts, fill) {
  d.fillStyle = fill;
  d.beginPath();
  d.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) d.lineTo(pts[i][0], pts[i][1]);
  d.closePath();
  d.fill();
}

export function strokePoly(d, pts, width, colour, close = true) {
  d.strokeStyle = colour;
  d.lineWidth = width;
  d.lineJoin = 'round';
  d.beginPath();
  d.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) d.lineTo(pts[i][0], pts[i][1]);
  if (close) d.closePath();
  d.stroke();
}

export function line(d, x1, y1, x2, y2, width, colour) {
  d.strokeStyle = colour;
  d.lineWidth = width;
  d.beginPath();
  d.moveTo(x1, y1);
  d.lineTo(x2, y2);
  d.stroke();
}

// A vertical gradient band, the cheapest way to give a scene depth.
export function band(d, x, y, w, h, top, bottom) {
  const g = d.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  d.fillStyle = g;
  d.fillRect(x, y, w, h);
}

export function label(d, text, x, y, size, colour, weight = '600', align = 'center', family = 'ui-sans-serif, system-ui, sans-serif') {
  d.fillStyle = colour;
  d.font = `${weight} ${size}px ${family}`;
  d.textAlign = align;
  d.textBaseline = 'middle';
  d.fillText(text, x, y);
}

// Radial glow, used for lamps, windows and the sun.
export function glow(d, cx, cy, r, colour, inner = 1) {
  const g = d.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, colour);
  g.addColorStop(inner, colour);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  d.fillStyle = g;
  d.beginPath();
  d.arc(cx, cy, r, 0, Math.PI * 2);
  d.fill();
}

// Thin parallel lines, for water, planking and hatching.
export function stripes(d, x, y, w, h, step, colour, width = 1, angle = 0) {
  d.save();
  d.beginPath();
  d.rect(x, y, w, h);
  d.clip();
  d.strokeStyle = colour;
  d.lineWidth = width;
  d.beginPath();
  if (angle === 0) {
    for (let yy = y; yy <= y + h; yy += step) {
      d.moveTo(x, yy);
      d.lineTo(x + w, yy);
    }
  } else {
    for (let xx = x; xx <= x + w; xx += step) {
      d.moveTo(xx, y);
      d.lineTo(xx, y + h);
    }
  }
  d.stroke();
  d.restore();
}

export function stars(d, rng, count, x, y, w, h, colour) {
  d.fillStyle = colour;
  for (let i = 0; i < count; i++) {
    const sx = x + rng.next() * w;
    const sy = y + rng.next() * h;
    const r = rng.next() < 0.15 ? 1.8 : 1;
    d.beginPath();
    d.arc(sx, sy, r, 0, Math.PI * 2);
    d.fill();
  }
}

export function leafShape(d, cx, cy, len, wide, angle, fill) {
  d.save();
  d.translate(cx, cy);
  d.rotate(angle);
  d.fillStyle = fill;
  d.beginPath();
  d.moveTo(0, 0);
  d.quadraticCurveTo(len * 0.45, -wide, len, 0);
  d.quadraticCurveTo(len * 0.45, wide, 0, 0);
  d.fill();
  d.restore();
}

export function star(d, cx, cy, outer, inner, points, fill) {
  d.fillStyle = fill;
  d.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) d.moveTo(px, py);
    else d.lineTo(px, py);
  }
  d.closePath();
  d.fill();
}

export function arrow(d, x1, y1, x2, y2, width, colour) {
  line(d, x1, y1, x2, y2, width, colour);
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = width * 3.2;
  d.strokeStyle = colour;
  d.lineWidth = width;
  d.beginPath();
  d.moveTo(x2 - Math.cos(a - 0.5) * head, y2 - Math.sin(a - 0.5) * head);
  d.lineTo(x2, y2);
  d.lineTo(x2 - Math.cos(a + 0.5) * head, y2 - Math.sin(a + 0.5) * head);
  d.stroke();
}
