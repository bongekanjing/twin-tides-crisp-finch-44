// The four pictures, each built from identifiable props. One job: define what a
// scene looks like and which props can differ, so the level designer only picks
// props and never touches drawing code.

import {
  band, box, tile, ring, disc, poly, strokePoly, line, label, glow, stripes,
  stars, leafShape, star, arrow, roundRect,
} from './draw.js';
import { BOARD } from './config.js';

// A prop is one recognisable object: where it sits, how it may change, how it paints.
export function prop(id, cx, cy, r, opts, alts, paint) {
  return { id, cx, cy, r, opts, alts, paint };
}

// ------------------------------------------------------------------ harbour --
function harbour(p) {
  const rng = p.rng;
  const horizon = 300;

  const back = (d) => {
    band(d, 0, 0, BOARD, horizon, p.skyTop, p.skyLow);
    band(d, 0, horizon - 60, BOARD, 60, 'rgba(255,255,255,0)', 'rgba(255,255,255,0.10)');
    // far hills, two ridges
    poly(d, [[0, horizon], [90, 232], [190, 262], [300, 214], [410, 254], [510, 226], [576, 246], [576, horizon]],
      p.hillFar);
    poly(d, [[0, horizon], [70, 262], [150, 286], [260, 252], [350, 282], [470, 258], [576, 276], [576, horizon]],
      p.hill);
    // sea
    d.fillStyle = p.sea;
    d.fillRect(0, horizon, BOARD, BOARD - horizon);
    stripes(d, 0, horizon + 4, BOARD, BOARD - horizon - 4, 9, 'rgba(255,255,255,0.055)', 2);
    // sun path on the water
    for (let i = 0; i < 14; i++) {
      const w = 90 - i * 4;
      d.fillStyle = `rgba(255,214,150,${0.16 - i * 0.008})`;
      d.fillRect(238 - w / 2 + i * 2, horizon + 8 + i * 15, w, 5);
    }
    // pier in the foreground
    d.fillStyle = p.woodDark;
    d.fillRect(0, 470, BOARD, 106);
    d.fillStyle = p.wood;
    d.fillRect(0, 458, BOARD, 22);
    stripes(d, 0, 458, BOARD, 22, 26, p.woodDark, 2, 1);
    for (let x = 8; x < BOARD; x += 96) {
      d.fillStyle = p.woodDark;
      d.fillRect(x, 480, 12, 96);
    }
  };

  const props = [
    prop('sun', 300, 214, 40, { r: 34 }, [
      { r: 46 }, { r: 26 },
    ], (d, o) => {
      glow(d, 300, 214, o.r * 3.4, 'rgba(255,196,120,0.30)');
      disc(d, 300, 214, o.r, p.sun);
    }),

    prop('clouds', 120, 96, 60, { n: 3 }, [
      { n: 2 }, { n: 4 },
    ], (d, o) => {
      const spots = [[86, 92, 46], [168, 78, 34], [250, 108, 30], [40, 120, 26], [330, 74, 28]];
      for (let i = 0; i < o.n; i++) {
        const [x, y, w] = spots[i];
        d.fillStyle = 'rgba(255,237,214,0.30)';
        d.beginPath();
        d.ellipse(x, y, w, w * 0.42, 0, 0, Math.PI * 2);
        d.fill();
      }
    }),

    prop('lighthouse', 470, 214, 52, { stripe: 0, beam: 1 }, [
      { stripe: 1 }, { beam: 0 },
    ], (d, o) => {
      const bx = 470;
      const top = 150;
      const bot = 300;
      // tower
      poly(d, [[bx - 20, bot], [bx - 13, top], [bx + 13, top], [bx + 20, bot]], o.stripe ? '#e8e2d4' : '#efe9dc');
      // bands
      d.fillStyle = o.stripe ? '#b9433d' : '#c8554a';
      d.fillRect(bx - 17, 200, 34, 15);
      d.fillRect(bx - 15, 252, 30, 13);
      // gallery + lantern
      d.fillStyle = p.ink;
      d.fillRect(bx - 18, top - 6, 36, 7);
      d.fillStyle = '#2b3148';
      d.fillRect(bx - 12, top - 26, 24, 21);
      disc(d, bx, top - 18, 5, o.beam ? '#ffe9a8' : '#4a5168');
      poly(d, [[bx - 14, top - 26], [bx, top - 40], [bx + 14, top - 26]], '#b9433d');
      if (o.beam) {
        d.save();
        d.globalAlpha = 0.22;
        poly(d, [[bx, top - 18], [bx + 190, top - 62], [bx + 190, top + 26]], '#ffe9a8');
        d.restore();
      }
    }),

    prop('boatSloop', 150, 356, 44, { hull: 0, sail: 1 }, [
      { hull: 1 }, { sail: 0 },
    ], (d, o) => {
      const hullColour = o.hull ? '#8c4a3a' : '#3e4e78';
      // hull
      poly(d, [[108, 350], [196, 350], [182, 376], [122, 376]], hullColour);
      d.fillStyle = 'rgba(0,0,0,0.16)';
      d.fillRect(108, 350, 88, 5);
      // mast + sail
      line(d, 152, 350, 152, 296, 3, '#2c2a2c');
      if (o.sail) poly(d, [[154, 300], [154, 344], [196, 344]], '#f2e6cf');
      // reflection
      d.fillStyle = 'rgba(0,0,0,0.16)';
      d.fillRect(116, 382, 72, 4);
      d.fillRect(126, 392, 52, 3);
    }),

    prop('boatDinghy', 372, 398, 34, { oars: 1 }, [
      { oars: 0 }, { oars: 2 },
    ], (d, o) => {
      poly(d, [[342, 392], [404, 392], [394, 412], [352, 412]], '#c9b48a');
      d.strokeStyle = '#7d6642';
      d.lineWidth = 2;
      d.strokeRect(344, 393, 58, 18);
      for (let i = 0; i < o.oars; i++) {
        line(d, 350 + i * 40, 386, 336 + i * 52, 372, 3, '#8a7350');
      }
    }),

    prop('gulls', 214, 138, 40, { n: 3 }, [
      { n: 2 }, { n: 4 },
    ], (d, o) => {
      const spots = [[186, 130, 1], [232, 152, 0.8], [206, 110, 0.7], [258, 122, 0.9], [172, 158, 0.75]];
      for (let i = 0; i < o.n; i++) {
        const [x, y, s] = spots[i];
        d.strokeStyle = '#22242e';
        d.lineWidth = 2;
        d.beginPath();
        d.moveTo(x - 9 * s, y);
        d.quadraticCurveTo(x - 4 * s, y - 6 * s, x, y - 1 * s);
        d.quadraticCurveTo(x + 4 * s, y - 6 * s, x + 9 * s, y);
        d.stroke();
      }
    }),

    prop('lamp', 62, 424, 34, { lit: 1 }, [
      { lit: 0 }, { lit: 1, tall: 1 },
    ], (d, o) => {
      const h = o.tall ? 96 : 78;
      line(d, 62, 470, 62, 470 - h, 5, '#2f3340');
      d.fillStyle = '#2f3340';
      d.fillRect(46, 470 - h, 34, 8);
      if (o.lit) glow(d, 64, 470 - h + 18, 34, 'rgba(255,214,138,0.55)');
      disc(d, 64, 470 - h + 18, 9, o.lit ? '#ffe0a4' : '#5a6070');
      d.strokeStyle = '#2f3340';
      d.lineWidth = 2;
      d.strokeRect(52, 470 - h + 4, 24, 28);
    }),

    prop('crates', 232, 448, 40, { n: 3 }, [
      { n: 2 }, { n: 4 },
    ], (d, o) => {
      const spots = [[196, 436], [246, 436], [221, 400], [268, 408]];
      for (let i = 0; i < o.n; i++) {
        const [x, y] = spots[i];
        d.fillStyle = '#a8763f';
        d.fillRect(x, y, 40, 34);
        d.strokeStyle = '#6d4a24';
        d.lineWidth = 2;
        d.strokeRect(x + 1, y + 1, 38, 32);
        line(d, x + 4, y + 6, x + 36, y + 28, 2, '#6d4a24');
        line(d, x + 36, y + 6, x + 4, y + 28, 2, '#6d4a24');
      }
    }),

    prop('barrels', 470, 442, 34, { n: 2 }, [
      { n: 1 }, { n: 3 },
    ], (d, o) => {
      for (let i = 0; i < o.n; i++) {
        const x = 434 + i * 52;
        d.fillStyle = p.wood;
        roundRect(d, x, 414, 40, 52, 9);
        d.fillStyle = p.woodDark;
        d.fillRect(x, 426, 40, 4);
        d.fillRect(x, 448, 40, 4);
      }
    }),

    prop('cat', 340, 452, 26, { present: 1 }, [
      { present: 0 }, { present: 1, tail: 1 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = '#2b2b33';
      d.beginPath();
      d.ellipse(340, 456, 20, 12, 0, 0, Math.PI * 2);
      d.fill();
      disc(d, 356, 446, 8, '#2b2b33');
      poly(d, [[350, 440], [352, 432], [357, 438]], '#2b2b33');
      poly(d, [[360, 438], [364, 432], [364, 441]], '#2b2b33');
      if (o.tail) {
        d.strokeStyle = '#2b2b33';
        d.lineWidth = 4;
        d.beginPath();
        d.moveTo(320, 456);
        d.quadraticCurveTo(306, 448, 312, 434);
        d.stroke();
      }
    }),

    prop('buoy', 96, 392, 22, { present: 1 }, [
      { present: 0 }, { present: 1, top: 1 },
    ], (d, o) => {
      if (!o.present) return;
      poly(d, [[86, 386], [106, 386], [102, 404], [90, 404]], '#c14a3f');
      d.fillStyle = '#e7e2d5';
      d.fillRect(86, 392, 20, 4);
      line(d, 96, 386, 96, o.top ? 372 : 378, 3, '#2c2a2c');
      d.fillStyle = '#e7e2d5';
      d.beginPath();
      d.arc(96, 404, 5, 0, Math.PI);
      d.fill();
    }),

    prop('cottage', 78, 268, 30, { lit: 2 }, [
      { lit: 1 }, { lit: 3 },
    ], (d, o) => {
      d.fillStyle = '#3a3f5c';
      d.fillRect(44, 250, 56, 42);
      poly(d, [[40, 251], [72, 232], [104, 251]], '#2c3049');
      for (let i = 0; i < 3; i++) {
        const on = i < o.lit;
        d.fillStyle = on ? '#ffd88c' : '#242a42';
        d.fillRect(50 + i * 17, 260, 11, 12);
      }
    }),

    prop('flag', 408, 168, 26, { dir: 1 }, [
      { dir: -1 },
    ], (d, o) => {
      line(d, 408, 208, 408, 158, 3, '#2c2a2c');
      poly(d, [[409, 160], [409 + 26 * o.dir, 166], [409, 176]], p.accent);
    }),

    prop('rocks', 528, 404, 30, { n: 2 }, [
      { n: 1 }, { n: 3 },
    ], (d, o) => {
      const spots = [[516, 402, 22], [548, 414, 15], [500, 418, 13]];
      for (let i = 0; i < o.n; i++) {
        const [x, y, r] = spots[i];
        disc(d, x, y, r, '#4c5163');
        disc(d, x - r * 0.25, y - r * 0.3, r * 0.6, '#5c6274');
      }
    }),

    prop('net', 152, 462, 30, { colour: 0 }, [
      { colour: 1 },
    ], (d, o) => {
      const c = o.colour ? '#c07a3a' : '#3f7d84';
      d.strokeStyle = c;
      d.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        d.beginPath();
        d.arc(152, 448, 8 + i * 4, 0.2, Math.PI - 0.2);
        d.stroke();
      }
      d.fillStyle = c;
      d.fillRect(120, 460, 64, 5);
    }),

    prop('cratesSmall', 300, 476, 30, { n: 1 }, [
      { n: 0 }, { n: 2 },
    ], (d, o) => {
      for (let i = 0; i < o.n; i++) {
        d.fillStyle = '#96693a';
        d.fillRect(272 + i * 36, 458, 32, 28);
        d.strokeStyle = '#5f4020';
        d.lineWidth = 2;
        d.strokeRect(273 + i * 36, 459, 30, 26);
        line(d, 276 + i * 36, 464, 300 + i * 36, 480, 2, '#5f4020');
      }
    }),
  ];

  return { back, props };
}

// -------------------------------------------------------------------- shelf --
function shelf(p) {
  const back = (d) => {
    band(d, 0, 0, BOARD, BOARD, p.wall, '#281e1c');
    // tiled splashback
    d.fillStyle = p.tile;
    d.fillRect(0, 150, BOARD, 300);
    stripes(d, 0, 150, BOARD, 300, 48, 'rgba(0,0,0,0.22)', 2);
    stripes(d, 0, 150, BOARD, 300, 48, 'rgba(0,0,0,0.22)', 2, 1);
    // window, upper left
    d.fillStyle = '#101524';
    d.fillRect(36, 176, 150, 196);
    d.fillStyle = '#1b2440';
    d.fillRect(42, 182, 138, 184);
    stars(d, { next: mulberry(7) }, 26, 44, 184, 134, 180, '#dfe6f5');
    d.fillStyle = p.shelfDark;
    d.fillRect(110, 182, 6, 184);
    d.fillRect(42, 270, 138, 6);
    // shelves
    for (const y of [368, 500, 632]) {
      d.fillStyle = p.shelf;
      d.fillRect(0, y, BOARD, 20);
      d.fillStyle = p.shelfDark;
      d.fillRect(0, y + 20, BOARD, 8);
    }
    // brackets
    for (const x of [120, 300, 470]) {
      d.fillStyle = p.shelfDark;
      poly(d, [[x, 508], [x + 22, 508], [x, 546]], '#3a261a');
    }
  };

  const props = [
    prop('jarA', 96, 336, 32, { lid: 0, fill: 1 }, [
      { lid: 1 }, { fill: 0 }, { lid: 2 },
    ], (d, o) => {
      const lids = ['#c0533f', '#4a6d8c', '#c9a13b'];
      d.fillStyle = 'rgba(240,235,220,0.20)';
      roundRect(d, 66, 300, 60, 68, 8);
      if (o.fill) {
        d.fillStyle = p.jam;
        roundRect(d, 70, 320, 52, 44, 5);
      }
      d.strokeStyle = 'rgba(255,255,255,0.35)';
      d.lineWidth = 2;
      roundRect(d, 66, 300, 60, 68, 8);
      d.stroke();
      d.fillStyle = lids[o.lid];
      roundRect(d, 62, 288, 68, 16, 5);
    }),

    prop('jarB', 162, 340, 26, { lid: 0, present: 1 }, [
      { lid: 2 }, { present: 0 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = 'rgba(240,235,220,0.18)';
      roundRect(d, 140, 312, 46, 56, 7);
      d.fillStyle = '#6b8f4e';
      roundRect(d, 144, 330, 38, 34, 4);
      d.fillStyle = o.lid ? '#c9a13b' : '#8a8f7a';
      roundRect(d, 137, 303, 52, 12, 4);
    }),

    prop('jarC', 218, 344, 22, { lid: 0 }, [
      { lid: 1 },
    ], (d, o) => {
      d.fillStyle = 'rgba(240,235,220,0.16)';
      roundRect(d, 200, 320, 38, 48, 6);
      d.fillStyle = '#b8873f';
      roundRect(d, 204, 336, 30, 28, 3);
      d.fillStyle = o.lid ? '#3f6b52' : '#b9473c';
      roundRect(d, 197, 313, 44, 10, 4);
    }),

    prop('bread', 300, 344, 34, { present: 1, score: 3 }, [
      { present: 0 }, { score: 5 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = p.bread;
      d.beginPath();
      d.ellipse(300, 340, 44, 22, 0, 0, Math.PI * 2);
      d.fill();
      d.fillStyle = '#a86f38';
      for (let i = 0; i < o.score; i++) {
        line(d, 272 + i * 16, 330, 282 + i * 16, 350, 3, '#8a5827');
      }
      d.fillStyle = '#e0c79a';
      d.beginPath();
      d.ellipse(300, 352, 40, 8, 0, 0, Math.PI);
      d.fill();
    }),

    prop('mugs', 386, 340, 30, { n: 2, colour: 0 }, [
      { n: 1 }, { n: 3 }, { colour: 1 },
    ], (d, o) => {
      const cols = ['#e6ddc8', '#5b7f92', '#b8603f'];
      for (let i = 0; i < o.n; i++) {
        const x = 366 + i * 34;
        d.fillStyle = cols[o.colour];
        roundRect(d, x, 322, 28, 30, 4);
        d.strokeStyle = cols[o.colour];
        d.lineWidth = 4;
        d.beginPath();
        d.arc(x + 30, 334, 8, -1.1, 1.1);
        d.stroke();
        d.fillStyle = 'rgba(60,40,30,0.5)';
        d.beginPath();
        d.ellipse(x + 14, 323, 12, 3.5, 0, 0, Math.PI * 2);
        d.fill();
      }
    }),

    prop('plant', 486, 316, 42, { leaves: 5 }, [
      { leaves: 3 }, { leaves: 7 },
    ], (d, o) => {
      d.fillStyle = p.pot;
      poly(d, [[462, 330], [510, 330], [502, 368], [470, 368]], '#b0663f');
      d.fillStyle = '#c87a4d';
      d.fillRect(458, 322, 56, 10);
      for (let i = 0; i < o.leaves; i++) {
        const a = -Math.PI / 2 + (i - (o.leaves - 1) / 2) * 0.42;
        leafShape(d, 486, 320, 52 + (i % 2) * 12, 15, a, i % 2 ? p.leafDark ?? '#33562f' : p.leaf);
      }
    }),

    prop('tins', 128, 462, 40, { n: 3, stripe: 0 }, [
      { n: 2 }, { n: 4 }, { stripe: 1 },
    ], (d, o) => {
      const labels = ['#b03f3a', '#3f6b8c', '#8a8f4a', '#a8713f'];
      for (let i = 0; i < o.n; i++) {
        const x = 78 + i * 44;
        d.fillStyle = '#d8d4c6';
        roundRect(d, x, 412, 38, 62, 4);
        d.fillStyle = labels[i];
        d.fillRect(x, 428, 38, o.stripe ? 20 : 26);
        d.fillStyle = 'rgba(255,255,255,0.6)';
        d.fillRect(x + 6, 434, 26, 2);
        d.fillStyle = '#b6b2a4';
        d.fillRect(x, 412, 38, 5);
      }
    }),

    prop('kettle', 268, 452, 36, { spout: 1, present: 1 }, [
      { present: 0 }, { spout: 1, lid: 1 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = p.metal;
      d.beginPath();
      d.ellipse(268, 458, 34, 30, 0, 0, Math.PI * 2);
      d.fill();
      d.fillStyle = 'rgba(255,255,255,0.35)';
      d.beginPath();
      d.ellipse(256, 446, 12, 9, -0.5, 0, Math.PI * 2);
      d.fill();
      poly(d, [[292, 444], [318, 432], [320, 442], [296, 458]], p.metal);
      d.strokeStyle = p.metal;
      d.lineWidth = 6;
      d.beginPath();
      d.arc(240, 448, 22, 1.4, 3.6);
      d.stroke();
      disc(d, 268, 430, 9, o.lid ? '#8a5a3b' : p.metal);
    }),

    prop('plates', 372, 458, 34, { n: 2 }, [
      { n: 1 }, { n: 3 },
    ], (d, o) => {
      for (let i = 0; i < o.n; i++) {
        d.fillStyle = '#e8e2d2';
        d.beginPath();
        d.ellipse(372, 470 - i * 10, 44 - i * 2, 12, 0, 0, Math.PI * 2);
        d.fill();
        d.strokeStyle = '#b9b2a0';
        d.lineWidth = 2;
        d.stroke();
      }
    }),

    prop('bowl', 466, 462, 28, { colour: 0 }, [
      { colour: 1 }, { colour: 2 },
    ], (d, o) => {
      const cols = ['#5b7f92', '#b8603f', '#6b8f4e'];
      d.fillStyle = cols[o.colour];
      d.beginPath();
      d.ellipse(466, 452, 34, 22, 0, 0, Math.PI);
      d.fill();
      d.fillStyle = 'rgba(0,0,0,0.18)';
      d.beginPath();
      d.ellipse(466, 452, 34, 8, 0, 0, Math.PI * 2);
      d.fill();
      disc(d, 466, 452, 6, '#d8b64a');
    }),

    prop('bottles', 96, 560, 40, { n: 3 }, [
      { n: 2 }, { n: 4 },
    ], (d, o) => {
      for (let i = 0; i < o.n; i++) {
        const x = 62 + i * 40;
        d.fillStyle = i % 2 ? '#4a6b52' : '#6b3f2f';
        roundRect(d, x, 508, 28, 52, 6);
        d.fillRect(x + 10, 494, 8, 16);
        d.fillStyle = '#c9a13b';
        d.fillRect(x + 9, 490, 10, 6);
        d.fillStyle = 'rgba(255,255,255,0.20)';
        d.fillRect(x + 4, 516, 4, 38);
      }
    }),

    prop('clock', 250, 546, 34, { hand: 0 }, [
      { hand: 1 },
    ], (d, o) => {
      disc(d, 250, 568, 30, '#d8cfb6');
      ring(d, 250, 568, 30, 4, p.shelfDark);
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        line(d, 250 + Math.cos(a) * 23, 568 + Math.sin(a) * 23, 250 + Math.cos(a) * 27, 568 + Math.sin(a) * 27, 2, p.ink);
      }
      line(d, 250, 568, 250, 548, 3, p.ink);
      line(d, 250, 568, 250 + (o.hand ? 16 : 9), 568 + (o.hand ? 0 : 7), 2.5, p.ink);
      disc(d, 250, 568, 3, p.ink);
    }),

    prop('jug', 330, 552, 34, { present: 1, handle: 1 }, [
      { present: 0 }, { handle: 0 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = '#cfc3a6';
      roundRect(d, 308, 528, 44, 60, 8);
      if (o.handle) {
        d.strokeStyle = '#cfc3a6';
        d.lineWidth = 6;
        d.beginPath();
        d.arc(354, 552, 14, -1.4, 1.4);
        d.stroke();
      }
      d.fillStyle = '#8a6a4a';
      d.beginPath();
      d.ellipse(330, 530, 20, 5, 0, 0, Math.PI * 2);
      d.fill();
    }),

    prop('eggs', 412, 540, 34, { n: 3 }, [
      { n: 2 }, { n: 4 },
    ], (d, o) => {
      disc(d, 412, 584, 26, '#8a6a4a');
      for (let i = 0; i < o.n; i++) {
        const a = -Math.PI / 2 + (i - 1) * 0.7;
        d.fillStyle = '#efe4c8';
        d.beginPath();
        d.ellipse(412 + Math.cos(a) * 12, 578 + Math.sin(a) * 8, 6, 8, 0, 0, Math.PI * 2);
        d.fill();
      }
    }),

    prop('lemons', 490, 544, 34, { n: 2 }, [
      { n: 1 }, { n: 0 },
    ], (d, o) => {
      for (let i = 0; i < o.n; i++) {
        disc(d, 470 + i * 26, 586 - (i % 2) * 6, 13, '#d9c243');
        d.fillStyle = '#b9a133';
        d.beginPath();
        d.ellipse(482 + i * 26, 586 - (i % 2) * 6, 3, 2, 0.4, 0, Math.PI * 2);
        d.fill();
      }
    }),

    prop('herbs', 540, 268, 40, { n: 2 }, [
      { n: 1 }, { n: 3 },
    ], (d, o) => {
      for (let i = 0; i < o.n; i++) {
        const x = 512 + i * 28;
        line(d, x, 176, x, 210, 2, '#6b5a3a');
        for (let k = 0; k < 4; k++) {
          leafShape(d, x, 214 + k * 14, 22, 7, -Math.PI / 2 + (k % 2 ? 0.5 : -0.5), '#5f7a48');
        }
      }
    }),

    prop('towels', 500, 418, 32, { stripe: 0 }, [
      { stripe: 1 },
    ], (d, o) => {
      d.fillStyle = '#e2d9c2';
      d.fillRect(452, 400, 70, 54);
      d.fillStyle = o.stripe ? '#4a6d8c' : '#b0603f';
      d.fillRect(452, 412, 70, 8);
      d.fillRect(452, 432, 70, 8);
      d.strokeStyle = '#b9b0a0';
      d.lineWidth = 2;
      d.strokeRect(452, 400, 70, 54);
    }),
  ];

  return { back, props };
}

// Small deterministic stream so static scenery stars never drift.
function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SCENES = { harbour, shelf };
