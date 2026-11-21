// Hands the entry in: copies game/ and screenshots/ to the output directory and
// writes dossier.json with the kit's vendored library. Node 22, standard library
// only. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });

const gameSrc = join(here, 'game');
const shotsSrc = join(here, 'screenshots');
if (!existsSync(gameSrc)) throw new Error('game/ is missing beside main.ts');
if (!existsSync(join(gameSrc, 'index.html'))) throw new Error('game/index.html is missing');
if (!existsSync(shotsSrc)) throw new Error('screenshots/ is missing beside main.ts');

cpSync(gameSrc, join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsSrc, join(out, 'screenshots'), { recursive: true });

// Refuse locally what the sealed gate would refuse, so a bad entry never ships.
const shotDir = join(out, 'screenshots');
const shotNames = [];
for (const name of (await import('node:fs')).readdirSync(shotDir)) {
  if (name.startsWith('.')) continue;
  const st = statSync(join(shotDir, name));
  if (!st.isFile()) continue;
  if (st.size > 262144) throw new Error(`${name} is over 256 KiB`);
  shotNames.push(name);
}
if (shotNames.length < 3 || shotNames.length > 4) {
  throw new Error(`screenshots/ must hold 3 or 4 images, found ${shotNames.length}`);
}

const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(out, 'dossier.json'), dossier);

const bytes = Buffer.byteLength(dossier);
if (bytes > 1572864) throw new Error(`dossier.json is ${bytes} bytes, over 1.5 MiB`);
console.log(`wrote ${join(out, 'dossier.json')} (${bytes} bytes)`);
