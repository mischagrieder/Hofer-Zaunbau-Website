/**
 * Strukturprüfung der gebauten Seiten im echten Browser.
 *
 * Aufruf: node scripts/inspect.mjs  (setzt einen laufenden npm run preview voraus)
 *
 * Ergänzt scripts/audit.mjs. Während dort axe-core und Lighthouse laufen,
 * prüft dieses Skript Dinge, die beide nicht abdecken: Überschriftenfolge,
 * doppelte Kennungen, waagrechten Überlauf über mehrere Breiten, Trefferflächen
 * auf dem Handy und ob jedes Bedienelement einen sichtbaren Fokus bekommt.
 */

import puppeteer from 'puppeteer-core';

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

const widths = [320, 390, 480, 768, 1024, 1440, 1920];

const findings = [];
const note = (route, text) => findings.push(`${route} ${text}`);

const structure = (page) =>
  page.evaluate(() => {
    const out = { headings: [], duplicateIds: [], noAlt: 0, smallTargets: [], issues: [] };

    const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
      level: Number(h.tagName[1]),
      text: (h.textContent ?? '').trim().slice(0, 45),
    }));
    out.headings = levels;

    const seen = new Set();
    for (const el of document.querySelectorAll('[id]')) {
      if (seen.has(el.id)) out.duplicateIds.push(el.id);
      seen.add(el.id);
    }

    for (const img of document.querySelectorAll('img')) {
      if (!img.hasAttribute('alt')) out.noAlt += 1;
      // Bilder ohne Quelle werden erst zur Laufzeit befüllt, etwa in der
      // Grossansicht. Für die haben feste Masse keinen Sinn.
      if (!img.getAttribute('src')) continue;
      if (!img.getAttribute('width') || !img.getAttribute('height')) {
        out.issues.push(`Bild ohne Masse: ${(img.currentSrc || img.src).slice(-40)}`);
      }
    }

    /* Trefferflächen unter 24 Pixel.
       Ausgenommen sind zwei Fälle, die die Richtlinie ausdrücklich zulässt:
       nur für Screenreader sichtbare Elemente und Verweise, die im Fliesstext
       eines Absatzes stehen. */
    for (const el of document.querySelectorAll(
      'a[href], button, summary, input, select, textarea',
    )) {
      if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
      if (el.tagName === 'A' && el.closest('p')) continue;

      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.height < 24 || r.width < 24) {
        out.smallTargets.push(
          `${el.tagName}<${(el.textContent ?? '').trim().slice(0, 22)}> ${Math.round(r.width)}x${Math.round(r.height)}`,
        );
      }
    }

    if (document.querySelectorAll('h1').length !== 1) {
      out.issues.push(`h1 kommt ${document.querySelectorAll('h1').length} mal vor`);
    }
    if (!document.querySelector('main')) out.issues.push('kein main');

    return out;
  });

const run = async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  for (const route of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 400));

    const s = await structure(page);

    let previous = 0;
    for (const h of s.headings) {
      if (previous && h.level > previous + 1) {
        note(route, `Überschrift springt von h${previous} auf h${h.level}: "${h.text}"`);
      }
      previous = h.level;
    }
    for (const id of s.duplicateIds) note(route, `doppelte Kennung: ${id}`);
    if (s.noAlt) note(route, `${s.noAlt} Bilder ohne alt`);
    for (const i of s.issues) note(route, i);

    // Waagrechter Überlauf über alle Breiten
    for (const width of widths) {
      await page.setViewport({ width, height: 900, isMobile: width <= 480 });
      await new Promise((r) => setTimeout(r, 220));
      const over = await page.evaluate(() => {
        const d = document.documentElement;
        return d.scrollWidth > d.clientWidth ? `${d.scrollWidth}>${d.clientWidth}` : null;
      });
      if (over) note(route, `Überlauf bei ${width}px: ${over}`);
    }

    // Trefferflächen auf dem Handy
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await new Promise((r) => setTimeout(r, 250));
    const mobile = await structure(page);
    for (const t of mobile.smallTargets.slice(0, 5)) note(route, `kleine Trefferfläche: ${t}`);

    await page.close();
  }

  /* Sichtbarer Fokus, über echte Tabulatorschritte geprüft.
     Ein focus() aus dem Skript heraus löst :focus-visible nicht aus, weil der
     Browser das nur bei Bedienung über die Tastatur annimmt. Eine Prüfung über
     focus() meldet deshalb reihenweise Fehler, die keine sind. */
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 400));

  for (let step = 0; step < 20; step += 1) {
    await page.keyboard.press('Tab');
    const current = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      const ring =
        (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) ||
        s.boxShadow !== 'none';
      return ring
        ? null
        : `${el.tagName}<${(el.textContent ?? '').trim().slice(0, 24)}>`;
    });
    if (current) note('/', `kein sichtbarer Fokus: ${current}`);
  }

  await page.close();
  await browser.close();

  if (findings.length === 0) {
    console.log('\nStrukturprüfung: keine Befunde.\n');
  } else {
    console.log(`\nStrukturprüfung: ${findings.length} Befunde\n`);
    findings.forEach((f) => console.log('  ' + f));
    console.log();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
