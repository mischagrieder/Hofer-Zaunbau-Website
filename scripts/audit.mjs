/**
 * Prüfläufe gegen die gebaute Website.
 *
 * Aufruf: npm run build && npm run preview & && node scripts/audit.mjs
 *
 * Führt für jede Seite eine Prüfung mit axe-core durch und misst die
 * Startseite zusätzlich mit Lighthouse. Verwendet das im System vorhandene
 * Chromium, es wird nichts nachgeladen.
 */

import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core');
const CHROMIUM = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium';
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';

const routes = [
  '/',
  '/leistungen/',
  '/produkte/',
  '/referenzen/',
  '/ueber-uns/',
  '/kontakt/',
  '/impressum/',
  '/datenschutz/',
  '/404.html',
];

const runAxe = async () => {
  const axeSource = await readFile(axePath, 'utf8');
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  let total = 0;
  console.log('\nBarrierefreiheit (axe-core, WCAG 2.1 A und AA)\n');

  for (const route of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0' });
    await page.evaluate(axeSource);

    const { violations } = await page.evaluate(async () =>
      // @ts-expect-error axe wird zur Laufzeit in die Seite injiziert
      window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      }),
    );

    total += violations.length;
    const mark = violations.length === 0 ? 'ok  ' : 'FEHL';
    console.log(`  ${mark} ${route.padEnd(16)} ${violations.length} Verstösse`);

    for (const violation of violations) {
      console.log(`        ${violation.id} (${violation.impact}): ${violation.help}`);
      for (const node of violation.nodes.slice(0, 3)) {
        console.log(`          ${node.target.join(' ')}`);
      }
    }

    await page.close();
  }

  await browser.close();
  return total;
};

const runLighthouse = async () => {
  const { default: lighthouse } = await import('lighthouse');
  const chromeLauncher = await import('chrome-launcher');

  const chrome = await chromeLauncher.launch({
    chromePath: CHROMIUM,
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  const result = await lighthouse(
    `${BASE}/`,
    { port: chrome.port, output: 'json', logLevel: 'error' },
    undefined,
  );

  await chrome.kill();

  const categories = result.lhr.categories;
  console.log('\nLighthouse, Startseite\n');
  for (const key of ['performance', 'accessibility', 'best-practices', 'seo']) {
    const category = categories[key];
    if (category) {
      console.log(
        `  ${category.title.padEnd(18)} ${Math.round((category.score ?? 0) * 100)}`,
      );
    }
  }

  const audits = result.lhr.audits;
  console.log('\n  Kennzahlen');
  for (const key of [
    'first-contentful-paint',
    'largest-contentful-paint',
    'total-blocking-time',
    'cumulative-layout-shift',
  ]) {
    if (audits[key]) console.log(`    ${key.padEnd(26)} ${audits[key].displayValue}`);
  }

  return categories;
};

const main = async () => {
  const violations = await runAxe();
  await runLighthouse();

  console.log(
    violations === 0
      ? '\nErgebnis: keine Verstösse gegen die geprüften Regeln.\n'
      : `\nErgebnis: ${violations} Verstösse, bitte beheben.\n`,
  );

  process.exit(violations === 0 ? 0 : 1);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
