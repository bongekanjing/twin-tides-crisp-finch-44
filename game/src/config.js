// Layout, palettes and tuning for "Twin Tides" — a spot the difference game.
// One job: every number the rest of the game shares lives here.

export const BOARD = 576;            // the world is a square BOARD x BOARD box
export const PANEL_GAP = 18;         // css gap between the two pictures

export const LEVELS = [
  { scene: 0, diffs: 6,  seconds: 100, name: 'Harbour, last light' },
  { scene: 1, diffs: 8,  seconds: 105, name: 'The night shelf' },
  { scene: 2, diffs: 9,  seconds: 110, name: 'Observatory, 2 a.m.' },
  { scene: 3, diffs: 10, seconds: 115, name: 'The glasshouse' },
  { scene: 0, diffs: 12, seconds: 105, name: 'Harbour, again' },
  { scene: 1, diffs: 11, seconds: 110, name: 'The night shelf, again' },
  { scene: 2, diffs: 11, seconds: 115, name: 'Observatory, again' },
  { scene: 3, diffs: 12, seconds: 120, name: 'The glasshouse, again' },
];

// Each scene owns a palette so the four pictures never read as one picture.
export const PALETTES = {
  harbour: {
    skyTop: '#2b3a6b', skyMid: '#8e5a7a', skyLow: '#e8895f', sun: '#ffd9a0',
    sea: '#3b4a72', seaLight: '#6d7ba6', hill: '#232b48', hillFar: '#39406b',
    wood: '#8a5a3b', woodDark: '#5d3a26', stone: '#6b6f7a', ink: '#181c2c',
    accent: '#f2b544', leaf: '#3f6b52', metal: '#b9c2cf', cream: '#f4e9d4',
  },
  shelf: {
    wall: '#3a2c2a', tile: '#57423c', shelf: '#6b4a33', shelfDark: '#432c1e',
    ink: '#1b1412', cream: '#efe0c6', accent: '#d9714a', leaf: '#4a6b45',
    metal: '#a8a29b', jam: '#8c2f39', bread: '#c98b4b', icing: '#f3ddc0',
  },
  dome: {
    wall: '#171a2b', floor: '#241f33', desk: '#4a3a2f', ink: '#0e1018',
    cream: '#e8dfc8', accent: '#8fb0d8', star: '#f6f1dc', glow: '#c9a86a',
    metal: '#9aa3b2', paper: '#d8cfb6',
  },
  glass: {
    wall: '#2a3b33', frame: '#5d6f5b', leaf: '#4c7a4a', leafDark: '#33562f',
    soil: '#4a352a', pot: '#b0663f', bench: '#7d5a3c', ink: '#141a16',
    cream: '#f0e8d2', accent: '#e0b23c', sky: '#cfe0d8',
  },
};

export const SCORE = { find: 100, combo: 25, clear: 250, time: 5 };

export const HINTS = 3;
