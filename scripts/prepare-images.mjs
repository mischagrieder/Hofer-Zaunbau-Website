/**
 * Holt die Bildmotive und legt sie unter src/assets/images ab.
 *
 * Aufruf: npm run images
 *
 * Ist eine Quelle nicht erreichbar (etwa weil das Auslieferungsnetz der
 * Bildquelle gesperrt ist), schreibt das Skript an ihrer Stelle einen
 * Platzhalter im richtigen Seitenverhältnis. Der Build läuft dadurch immer
 * durch und das Layout stimmt, auch bevor die echten Aufnahmen vorliegen.
 * Ein späterer erneuter Aufruf ersetzt die Platzhalter.
 */

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const outDir = join(root, 'src/assets/images');

const RATIOS = { '21:9': [2400, 1029], '16:9': [1920, 1080], '4:3': [1600, 1200] };

/** Ruhiger Verlauf in den Markenfarben, damit Platzhalter nicht billig wirken. */
const placeholder = (width, height, label) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#dfeaf7"/>
        <stop offset="55%" stop-color="#c2d8ef"/>
        <stop offset="100%" stop-color="#93bbe2"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
    <g stroke="#16406f" stroke-opacity="0.16" stroke-width="${Math.round(width / 240)}">
      ${Array.from({ length: 9 }, (_, i) => {
        const x = Math.round((width / 10) * (i + 1));
        return `<line x1="${x}" y1="${height * 0.34}" x2="${x}" y2="${height * 0.86}"/>`;
      }).join('')}
      <line x1="0" y1="${height * 0.52}" x2="${width}" y2="${height * 0.52}"/>
      <line x1="0" y1="${height * 0.72}" x2="${width}" y2="${height * 0.72}"/>
    </g>
    <text x="${width / 2}" y="${height * 0.94}" text-anchor="middle"
      font-family="system-ui, sans-serif" font-size="${Math.round(width / 44)}"
      fill="#16406f" letter-spacing="2">${label}</text>
  </svg>`;

  return sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
};

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const run = async () => {
  const manifest = JSON.parse(await readFile(join(here, 'images.manifest.json'), 'utf8'));
  await mkdir(outDir, { recursive: true });

  const force = process.argv.includes('--force');
  let fetched = 0;
  let placeheld = 0;
  let kept = 0;

  for (const image of manifest.images) {
    const target = join(outDir, `${image.name}.jpg`);
    const [width, height] = RATIOS[image.ratio] ?? RATIOS['4:3'];

    if (!force && (await exists(target))) {
      kept += 1;
      continue;
    }

    try {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const buffer = Buffer.from(await response.arrayBuffer());
      await sharp(buffer)
        .resize(width, height, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(target);

      console.log(`  geladen     ${image.name}.jpg`);
      fetched += 1;
    } catch (error) {
      await writeFile(target, await placeholder(width, height, image.name.toUpperCase()));
      console.log(`  Platzhalter ${image.name}.jpg  (${error.message})`);
      placeheld += 1;
    }
  }

  console.log(
    `\n${fetched} geladen, ${placeheld} als Platzhalter, ${kept} unverändert.` +
      (placeheld > 0
        ? '\nHinweis: Sobald die Bildquelle erreichbar ist, "npm run images -- --force" erneut ausführen.'
        : ''),
  );
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
