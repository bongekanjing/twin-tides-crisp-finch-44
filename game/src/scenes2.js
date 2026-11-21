// The observatory and the glasshouse. One job: two more pictures whose props
// differ in ways a player can reason about — a dome slit, a telescope angle, a
// pot that moved, a pane that cracked.

import {
  band, box, tile, ring, disc, poly, strokePoly, line, label, glow, stripes,
  stars, leafShape, star, arrow, roundRect,
} from './draw.js';
import { BOARD } from './config.js';
import { prop } from './scenes.js';

function observatory(p) {
  const back = (d) => {
    band(d, 0, 0, BOARD, 300, '#0b0d18', '#1b2038');
    stars(d, { next: mulberry(21) }, 150, 0, 0, BOARD, 290, '#e6ecfa');
    // milky band
    d.save();
    d.globalAlpha = 0.14;
    d.fillStyle = '#cfd8f0';
    d.beginPath();
    d.ellipse(240, 140, 300, 46, -0.38, 0, Math.PI * 2);
    d.fill();
    d.restore();
    // horizon ridge
    poly(d, [[0, 300], [70, 272], [150, 292], [230, 258], [330, 286], [430, 262], [520, 288], [576, 274], [576, 300]], '#0a0c14');
    // dome shell
    d.fillStyle = p.wall;
    d.beginPath();
    d.arc(288, 300, 190, Math.PI, 0);
    d.fill();
    d.fillStyle = '#10131f';
    d.beginPath();
    d.arc(288, 300, 168, Math.PI, 0);
    d.fill();
    // rib arcs
    d.strokeStyle = 'rgba(150,170,210,0.18)';
    d.lineWidth = 3;
    for (const r of [60, 110, 150]) {
      d.beginPath();
      d.arc(288, 300, r, Math.PI, 0);
      d.stroke();
    }
    // floor
    d.fillStyle = p.floor;
    d.fillRect(0, 300, BOARD, BOARD - 300);
    stripes(d, 0, 300, BOARD, 276, 34, 'rgba(0,0,0,0.14)', 3);
    // desk slab
    d.fillStyle = p.desk;
    d.fillRect(0, 470, BOARD, 26);
    d.fillStyle = 'rgba(0,0,0,0.35)';
    d.fillRect(0, 496, BOARD, 10);
  };

  const props = [
    prop('scopeBody', 300, 372, 60, { angle: 0, present: 1 }, [
      { angle: 1 },
      { angle: 2 },
    ], (d, o) => {
      const angles = [-0.86, -0.6, -1.1];
      const a = angles[o.angle];
      const len = 150;
      d.save();
      d.translate(300, 380);
      d.rotate(a);
      d.fillStyle = '#8d95a6';
      d.fillRect(-46, -13, 132, 26);
      d.fillStyle = '#5e667a';
      d.fillRect(70, -17, 26, 34);
      d.fillStyle = '#c9d1e0';
      d.fillRect(-52, -9, 10, 18);
      d.fillStyle = '#3c4256';
      d.fillRect(-20, -20, 44, 40);
      d.restore();
      // mount
      strokePoly(d, [[300, 380], [272, 470], [328, 470]], 8, '#5e667a', false);
      disc(d, 300, 380, 12, '#3c4256');
      // counterweight
      line(d, 300, 380, 268, 424, 7, '#5e667a');
      disc(d, 268, 424, 12, '#8d95a6');
    }),

    prop('domeSlit', 288, 150, 44, { open: 1 }, [
      { open: 0 }, { open: 2 },
    ], (d, o) => {
      d.save();
      d.beginPath();
      d.arc(288, 300, 180, Math.PI, 0);
      d.clip();
      if (o.open === 1) {
        d.fillStyle = '#05070f';
        d.fillRect(272, 112, 32, 190);
        d.fillStyle = '#131a2e';
        d.fillRect(272, 112, 6, 190);
        d.fillRect(298, 112, 6, 190);
      } else if (o.open === 2) {
        d.fillStyle = '#05070f';
        d.fillRect(258, 112, 64, 190);
      }
      d.restore();
    }),

    prop('moon', 96, 96, 40, { phase: 0 }, [
      { phase: 1 }, { phase: 2 },
    ], (d, o) => {
      glow(d, 96, 96, 96, 'rgba(214,226,255,0.13)');
      disc(d, 96, 96, 28, p.star);
      // maria
      d.fillStyle = 'rgba(190,200,225,0.30)';
      disc(d, 88, 90, 8, 'rgba(190,200,225,0.30)');
      disc(d, 104, 104, 6, 'rgba(190,200,225,0.24)');
      if (o.phase === 1) {
        disc(d, 84, 92, 26, '#0b0d18');
      } else if (o.phase === 2) {
        disc(d, 110, 96, 20, '#0b0d18');
      }
    }),

    prop('starBright', 470, 72, 20, { present: 1, spikes: 4 }, [
      { present: 0 }, { spikes: 6 },
    ], (d, o) => {
      if (!o.present) return;
      star(d, 470, 72, 16, 5, o.spikes, '#f7f2d8');
      glow(d, 470, 72, 34, 'rgba(247,242,216,0.35)');
    }),

    prop('deskLamp', 466, 428, 40, { lit: 1, shade: 0 }, [
      { lit: 0 }, { shade: 1 },
    ], (d, o) => {
      d.fillStyle = '#3a3f52';
      d.fillRect(452, 462, 40, 10);
      line(d, 470, 462, 470, 412, 4, '#3a3f52');
      if (o.lit) glow(d, 470, 420, 84, 'rgba(255,214,138,0.30)');
      d.fillStyle = o.shade ? '#2f6b52' : '#c9a86a';
      poly(d, [[444, 412], [496, 412], [486, 386], [454, 386]], o.shade ? '#2f6b52' : '#c9a86a');
      disc(d, 470, 424, 7, o.lit ? '#ffe6b0' : '#5a5340');
    }),

    prop('chair', 392, 452, 40, { present: 1, tilt: 0 }, [
      { present: 0 }, { tilt: 1 },
    ], (d, o) => {
      if (!o.present) return;
      const lean = o.tilt ? -14 : 0;
      d.fillStyle = '#2f3648';
      d.fillRect(360 + lean, 424, 52, 12);
      d.fillRect(354 + lean, 392, 12, 40);
      line(d, 366 + lean, 436, 366, 470, 4, '#2f3648');
      line(d, 404 + lean, 436, 404, 470, 4, '#2f3648');
      d.fillStyle = '#242a3a';
      d.fillRect(358 + lean, 386, 60, 10);
    }),

    prop('charts', 130, 430, 44, { n: 1, roll: 0 }, [
      { roll: 1 }, { n: 0 },
    ], (d, o) => {
      for (let i = 0; i < (o.n || 0); i++) {
        d.fillStyle = p.paper;
        d.fillRect(96, 424 - i * 4, 74, 46);
        d.strokeStyle = 'rgba(60,50,30,0.4)';
        d.lineWidth = 1;
        for (let k = 0; k < 4; k++) line(d, 102, 432 + k * 8, 164, 432 + k * 8, 1, 'rgba(60,50,30,0.25)');
      }
      if (o.roll) {
        d.fillStyle = p.paper;
        d.beginPath();
        d.ellipse(206, 444, 10, 30, 0, 0, Math.PI * 2);
        d.fill();
        d.strokeStyle = 'rgba(60,50,30,0.4)';
        d.stroke();
      }
    }),

    prop('globe', 220, 448, 34, { present: 1 }, [
      { present: 0 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = '#3a3f52';
      d.fillRect(210, 462, 20, 8);
      disc(d, 220, 442, 20, '#3f6b8c');
      d.strokeStyle = 'rgba(230,240,255,0.5)';
      d.lineWidth = 1.5;
      d.beginPath();
      d.arc(220, 442, 20, 0, Math.PI * 2);
      d.stroke();
      d.beginPath();
      d.ellipse(220, 442, 9, 20, 0, 0, Math.PI * 2);
      d.stroke();
      d.fillStyle = 'rgba(120,170,120,0.75)';
      d.beginPath();
      d.ellipse(214, 434, 7, 5, 0.3, 0, Math.PI * 2);
      d.fill();
      d.beginPath();
      d.ellipse(228, 450, 6, 8, -0.2, 0, Math.PI * 2);
      d.fill();
    }),

    prop('meteor', 330, 208, 30, { present: 1 }, [
      { present: 0 },
    ], (d, o) => {
      if (!o.present) return;
      d.save();
      d.globalAlpha = 0.75;
      line(d, 330, 208, 396, 168, 3, '#f7f2d8');
      d.globalAlpha = 0.35;
      line(d, 330, 208, 412, 158, 1.6, '#f7f2d8');
      d.restore();
      disc(d, 330, 208, 3, '#fffdf2');
    }),

    prop('crate', 500, 470, 34, { n: 1, open: 0 }, [
      { n: 2 }, { open: 1 },
    ], (d, o) => {
      for (let i = 0; i < (o.n || 0); i++) {
        const x = 478 + i * 40;
        d.fillStyle = '#6b5238';
        d.fillRect(x, 446, 38, 30);
        d.strokeStyle = '#453320';
        d.lineWidth = 2;
        d.strokeRect(x + 1, 447, 36, 28);
      }
      if (o.open) {
        d.fillStyle = '#7d6444';
        poly(d, [[478, 446], [516, 446], [506, 428], [488, 428]], '#7d6444');
      }
    }),

    prop('books', 60, 452, 30, { n: 3 }, [
      { n: 2 }, { n: 4 },
    ], (d, o) => {
      const cols = ['#7d3b3b', '#3b5c7d', '#6b6b3b', '#4a3b6b'];
      for (let i = 0; i < o.n; i++) {
        d.fillStyle = cols[i];
        d.fillRect(34, 470 - i * 12, 44, 11);
        d.fillStyle = 'rgba(255,255,255,0.25)';
        d.fillRect(38, 472 - i * 12, 34, 1.5);
      }
    }),

    prop('thermos', 150, 372, 24, { present: 1, cup: 1 }, [
      { present: 0 }, { cup: 0 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = '#4a6b6b';
      roundRect(d, 138, 340, 24, 44, 5);
      d.fillStyle = '#2f4a4a';
      d.fillRect(138, 344, 24, 6);
      if (o.cup) {
        d.fillStyle = '#d8d2c0';
        roundRect(d, 164, 352, 16, 16, 3);
      }
    }),

    prop('notebook', 250, 486, 26, { present: 1 }, [
      { present: 0 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = '#c9c0a4';
      d.fillRect(226, 482, 52, 26);
      d.fillStyle = '#8a5a3b';
      d.fillRect(226, 482, 52, 4);
      d.strokeStyle = 'rgba(70,60,40,0.45)';
      d.lineWidth = 1;
      for (let i = 0; i < 3; i++) line(d, 232, 492 + i * 5, 270, 492 + i * 5, 1, 'rgba(70,60,40,0.3)');
    }),
  ];

  return { back, props };
}

function glasshouse(p) {
  const back = (d) => {
    band(d, 0, 0, BOARD, BOARD, '#b9cec4', '#8fae9f');
    // glass panes with a light sky behind
    d.fillStyle = '#d6e6dc';
    d.fillRect(28, 40, 520, 300);
    d.fillStyle = 'rgba(255,255,255,0.28)';
    poly(d, [[28, 340], [180, 40], [250, 40], [98, 340]], 'rgba(255,255,255,0.16)');
    // frame grid
    d.strokeStyle = p.frame;
    d.lineWidth = 8;
    d.strokeRect(28, 40, 520, 300);
    for (const x of [148, 288, 428]) line(d, x, 40, x, 340, 8, p.frame);
    for (const y of [140, 240]) line(d, 28, y, 548, y, 8, p.frame);
    // glazing bars, thin
    d.strokeStyle = 'rgba(93,111,91,0.55)';
    d.lineWidth = 3;
    for (const x of [88, 218, 358, 498]) line(d, x, 40, x, 340, 3, 'rgba(93,111,91,0.55)');
    // floor: gravel + bench
    d.fillStyle = '#7d7a68';
    d.fillRect(0, 340, BOARD, BOARD - 340);
    stripes(d, 0, 340, BOARD, 236, 16, 'rgba(0,0,0,0.10)', 2);
    d.fillStyle = p.bench;
    d.fillRect(0, 470, BOARD, 22);
    d.fillStyle = 'rgba(0,0,0,0.28)';
    d.fillRect(0, 492, BOARD, 9);
    for (const x of [60, 300, 520]) {
      d.fillStyle = p.bench;
      d.fillRect(x, 492, 16, 84);
    }
  };

  const props = [
    prop('potTall', 96, 424, 40, { leaves: 5, pot: 0 }, [
      { leaves: 7 }, { pot: 1 },
    ], (d, o) => {
      const pots = ['#b0663f', '#8a8f6b'];
      d.fillStyle = pots[o.pot];
      poly(d, [[66, 420], [126, 420], [118, 470], [74, 470]], pots[o.pot]);
      d.fillRect(62, 410, 68, 12);
      for (let i = 0; i < o.leaves; i++) {
        const a = -Math.PI / 2 + (i - (o.leaves - 1) / 2) * 0.30;
        leafShape(d, 96, 412, 70 + (i % 3) * 16, 17, a, i % 2 ? p.leafDark : p.leaf);
      }
    }),

    prop('potWide', 226, 436, 34, { present: 1, blooms: 3 }, [
      { present: 0 }, { blooms: 5 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = '#a85e3a';
      poly(d, [[198, 430], [254, 430], [248, 468], [204, 468]], '#a85e3a');
      d.fillRect(194, 422, 64, 10);
      for (let i = 0; i < o.blooms; i++) {
        const x = 210 + i * 16;
        line(d, x, 424, x + (i - 1) * 3, 396, 2, p.leafDark);
        disc(d, x + (i - 1) * 3, 392, 7, p.accent);
        disc(d, x + (i - 1) * 3, 392, 3, '#8a6a1a');
      }
    }),

    prop('hanging', 340, 160, 40, { present: 1, n: 2 }, [
      { present: 0 }, { n: 3 },
    ], (d, o) => {
      if (!o.present) return;
      for (let i = 0; i < o.n; i++) {
        const x = 316 + i * 26;
        line(d, x, 40, x, 96, 2, '#5a5a4a');
        d.fillStyle = '#b0663f';
        poly(d, [[x - 12, 96], [x + 12, 96], [x + 9, 118], [x - 9, 118]], '#b0663f');
        for (let k = 0; k < 3; k++) {
          leafShape(d, x, 100, 26, 8, Math.PI / 2 + (k - 1) * 0.7, p.leaf);
        }
      }
    }),

    prop('wateringCan', 400, 448, 34, { spout: 1 }, [
      { spout: 0 },
    ], (d, o) => {
      d.fillStyle = '#6b8f92';
      roundRect(d, 380, 424, 44, 40, 6);
      if (o.spout) poly(d, [[380, 438], [352, 414], [356, 406], [382, 428]], '#6b8f92');
      d.strokeStyle = '#6b8f92';
      d.lineWidth = 5;
      d.beginPath();
      d.arc(404, 420, 14, -2.6, -0.4);
      d.stroke();
      d.fillStyle = 'rgba(255,255,255,0.28)';
      d.fillRect(386, 432, 6, 26);
    }),

    prop('stool', 474, 462, 32, { present: 1, legs: 3 }, [
      { present: 0 }, { legs: 4 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = p.wood ?? '#8a6a44';
      d.beginPath();
      d.ellipse(474, 448, 38, 12, 0, 0, Math.PI * 2);
      d.fill();
      for (let i = 0; i < o.legs; i++) {
        const x = 446 + i * 20;
        line(d, x, 452, x - 2, 494, 4, '#7d5a3c');
      }
    }),

    prop('butterfly', 300, 250, 26, { present: 1, spread: 1 }, [
      { present: 0 }, { spread: 0 },
    ], (d, o) => {
      if (!o.present) return;
      const s = o.spread ? 1 : 0.45;
      d.fillStyle = '#d4743a';
      d.beginPath();
      d.ellipse(292, 248, 12 * s, 9, -0.4, 0, Math.PI * 2);
      d.fill();
      d.beginPath();
      d.ellipse(308, 248, 12 * s, 9, 0.4, 0, Math.PI * 2);
      d.fill();
      d.fillStyle = '#3a2c22';
      d.fillRect(299, 242, 3, 14);
    }),

    prop('trowel', 150, 486, 26, { present: 1 }, [
      { present: 0 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = '#b9b2a0';
      poly(d, [[134, 486], [164, 482], [170, 496], [140, 500]], '#b9b2a0');
      line(d, 166, 486, 186, 476, 5, '#6b4a33');
    }),

    prop('seedTray', 62, 486, 34, { cells: 4, green: 1 }, [
      { cells: 6 }, { green: 0 },
    ], (d, o) => {
      d.fillStyle = '#3f4a3a';
      d.fillRect(34, 470, 64, 26);
      const per = o.cells / 2;
      for (let i = 0; i < o.cells; i++) {
        const x = 38 + (i % per) * 29;
        const y = 474 + Math.floor(i / per) * 12;
        d.fillStyle = '#2a332a';
        d.fillRect(x, y, 24, 9);
        if (o.green) {
          d.fillStyle = '#6b9a5a';
          disc(d, x + 12, y + 3, 2.5, '#6b9a5a');
        }
      }
    }),

    prop('crackedPane', 428, 190, 40, { crack: 0 }, [
      { crack: 1 },
    ], (d, o) => {
      if (!o.crack) return;
      d.strokeStyle = 'rgba(40,50,45,0.55)';
      d.lineWidth = 1.6;
      d.beginPath();
      d.moveTo(436, 152);
      d.lineTo(448, 186);
      d.lineTo(434, 212);
      d.lineTo(452, 236);
      d.stroke();
      d.beginPath();
      d.moveTo(448, 186);
      d.lineTo(470, 178);
      d.stroke();
      d.beginPath();
      d.moveTo(434, 212);
      d.lineTo(414, 226);
      d.stroke();
    }),

    prop('tag', 226, 402, 20, { present: 1, word: 0 }, [
      { present: 0 }, { word: 1 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = '#efe6cd';
      d.fillRect(206, 396, 40, 16);
      d.strokeStyle = '#8a7a5a';
      d.lineWidth = 1.5;
      d.strokeRect(206, 396, 40, 16);
      label(d, o.word ? 'II' : 'I', 226, 404, 11, '#4a4030');
    }),

    prop('canStack', 540, 476, 30, { n: 2 }, [
      { n: 1 }, { n: 3 },
    ], (d, o) => {
      for (let i = 0; i < o.n; i++) {
        d.fillStyle = '#9aa39a';
        roundRect(d, 516, 494 - i * 16, 44, 14, 3);
        d.fillStyle = '#7a837a';
        d.fillRect(516, 500 - i * 16, 44, 2);
      }
    }),

    prop('bucket', 340, 496, 26, { present: 1, colour: 0 }, [
      { present: 0 }, { colour: 1 },
    ], (d, o) => {
      if (!o.present) return;
      const c = o.colour ? '#3f5c7a' : '#7a8a6a';
      d.fillStyle = c;
      poly(d, [[316, 470], [364, 470], [356, 500], [324, 500]], c);
      d.strokeStyle = '#4a4a4a';
      d.lineWidth = 3;
      d.beginPath();
      d.arc(340, 470, 24, Math.PI, 0);
      d.stroke();
    }),

    prop('spider', 480, 330, 18, { present: 0, web: 1 }, [
      { present: 1 }, { web: 0 },
    ], (d, o) => {
      if (o.web) {
        d.strokeStyle = 'rgba(255,255,255,0.45)';
        d.lineWidth = 1.2;
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          line(d, 480, 300, 480 + Math.cos(a) * 34, 300 + Math.sin(a) * 34, 1.2, 'rgba(255,255,255,0.40)');
        }
        for (let r = 10; r < 34; r += 8) {
          d.beginPath();
          d.arc(480, 300, r, 0, Math.PI / 2);
          d.stroke();
        }
      }
      if (o.present) {
        disc(d, 480, 316, 4, '#2a2a2a');
        for (let i = 0; i < 4; i++) {
          line(d, 480, 316, 472 + i * 5, 324, 1.2, '#2a2a2a');
        }
      }
    }),

    prop('sunbeam', 340, 120, 30, { on: 1 }, [
      { on: 0 },
    ], (d, o) => {
      if (!o.on) return;
      d.save();
      d.globalAlpha = 0.16;
      poly(d, [[250, 40], [330, 40], [470, 340], [390, 340]], '#fff6d8');
      d.restore();
    }),

    prop('lantern', 300, 392, 30, { lit: 1, glass: 0 }, [
      { lit: 0 }, { glass: 1 },
    ], (d, o) => {
      line(d, 300, 380, 300, 356, 3, '#3f4a3a');
      d.fillStyle = '#3f4a3a';
      d.fillRect(286, 340, 28, 6);
      if (o.lit) glow(d, 300, 364, 46, 'rgba(255,214,138,0.45)');
      d.fillStyle = o.glass ? '#d8c46a' : '#efe6c2';
      d.fillRect(290, 346, 20, 30);
      d.strokeStyle = '#3f4a3a';
      d.lineWidth = 2;
      d.strokeRect(290, 346, 20, 30);
      line(d, 300, 346, 300, 376, 1.6, '#3f4a3a');
      disc(d, 300, 368, 4, o.lit ? '#ffe6b0' : '#6b6a55');
    }),

    prop('plaque', 150, 352, 30, { present: 1, word: 0 }, [
      { present: 0 }, { word: 1 },
    ], (d, o) => {
      if (!o.present) return;
      d.fillStyle = '#5d4a2f';
      d.fillRect(118, 340, 64, 22);
      d.strokeStyle = '#d8c9a0';
      d.lineWidth = 1.6;
      d.strokeRect(121, 343, 58, 16);
      label(d, o.word ? 'BED 7' : 'BED 4', 150, 351, 10, '#e8dcbc');
    }),

    prop('keys', 250, 490, 26, { n: 2 }, [
      { n: 1 }, { n: 3 },
    ], (d, o) => {
      for (let i = 0; i < o.n; i++) {
        const x = 236 + i * 18;
        d.fillStyle = '#c9bfa4';
        d.fillRect(x, 482, 5, 14);
        ring(d, x + 2, 480, 5, 2, '#c9bfa4');
        d.fillRect(x + 5, 486, 7, 3);
      }
    }),
  ];

  return { back, props };
}

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

export const SCENES2 = { observatory, glasshouse };
