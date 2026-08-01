# HOFER Zaunbau, Website

Website der HOFER Zaunbau in Rothrist. Statisch gebaut mit Astro und Tailwind,
ausgelegt auf schnelle Ladezeiten, gute Auffindbarkeit in der lokalen Suche und
Bedienbarkeit ohne Maus.

## Schnellstart

```bash
npm install
npm run images     # Bildmotive holen, siehe unten
npm run dev        # Entwicklungsserver auf http://localhost:4321
```

| Befehl | Wirkung |
| --- | --- |
| `npm run dev` | Entwicklungsserver mit Hot Reload |
| `npm run build` | Erzeugt die fertige Website nach `dist/` |
| `npm run preview` | Liefert `dist/` lokal aus |
| `npm run check` | Typprüfung über alle Astro-Dateien |
| `npm run images` | Holt die Bildmotive nach `src/assets/images` |
| `npm run audit` | Prüft alle Seiten mit axe-core und misst mit Lighthouse |

### Prüflauf

`npm run audit` setzt einen laufenden `npm run preview` voraus und nutzt das im
System vorhandene Chromium, es wird nichts nachgeladen. Der Lauf prüft jede
Seite gegen WCAG 2.1 A und AA und misst die Startseite mit Lighthouse.

Letzter Stand: **keine Verstösse** auf allen neun Seiten, Lighthouse
**100 / 100 / 100 / 100** bei 0 ms Blockierzeit und 0 Layoutverschiebung.

## Inhalte pflegen

Sämtliche Firmenangaben, Leistungen, Produkte, Fragen und Referenzen stehen in
**einer** Datei:

```
src/data/site.ts
```

Adresse, Telefonnummer oder eine Produktbeschreibung wird dort geändert und
wirkt sofort auf allen Seiten, im Fussbereich und in den strukturierten Daten
für Suchmaschinen. Es gibt keine zweite Stelle, an der dieselbe Angabe gepflegt
werden müsste.

### Noch zu prüfen

In `src/data/site.ts` und auf den Rechtsseiten sind Angaben markiert, die sich
nicht aus öffentlichen Quellen belegen liessen und deshalb bewusst nicht
erfunden wurden:

- **Öffnungszeiten**: aktuell keine ausgewiesen, weder sichtbar noch in den
  strukturierten Daten. Siehe `openingHours` in `src/data/site.ts`.
- **Impressum**: Rechtsform, Unternehmensidentifikationsnummer und
  Mehrwertsteuernummer sind in eckigen Klammern hinterlegt. Auf der Seite steht
  ein Hinweiskasten, der nach dem Ergänzen entfernt werden kann.
- **Datenschutz**: Der Text beschreibt den heutigen Stand ohne Analysedienste.
  Kommt später ein Werkzeug dazu, muss der Abschnitt angepasst werden.

## Bildmaterial

Die Motive sind digital erzeugte Beispielbilder, keine dokumentierten Aufträge.
Darauf wird im Fussbereich und auf der Referenzseite ausdrücklich hingewiesen.
Herkunft und Quelladresse jedes Motivs stehen in `scripts/images.manifest.json`.

`npm run images` lädt die Motive nach `src/assets/images`. Ist eine Quelle nicht
erreichbar, legt das Skript stattdessen einen Platzhalter im richtigen
Seitenverhältnis an, damit Build und Layout trotzdem stimmen. Sobald die Quelle
erreichbar ist:

```bash
npm run images -- --force
npm run build
```

Sollen später echte Baustellenfotos verwendet werden, genügt es, die Dateien
unter demselben Namen in `src/assets/images` abzulegen. Astro erzeugt daraus
automatisch AVIF und WebP in mehreren Breiten.

## Aufbau

```
src/
  data/site.ts          Alle Inhalte und Firmenangaben
  lib/images.ts         Bildzuordnung über Namen
  styles/global.css     Design Tokens, Basisstile, Bewegung
  layouts/BaseLayout    Kopfbereich, SEO, strukturierte Daten, Fussbereich
  components/           Wiederverwendbare Bausteine
  pages/                Eine Datei pro Seite
scripts/                Bildpipeline
```

### Gestaltung

Die Farben, Schriftgrössen, Abstände und Rundungen sind als Tokens im Block
`@theme` in `src/styles/global.css` definiert. Wer die Marke anpassen will,
ändert dort die Werte, nicht die einzelnen Komponenten.

- **Farben**: Blau und Weiss. `brand-800` trägt Flächen und Schrift auf Weiss
  (Kontrast 9.7:1), `brand-600` ist der hellere Akzent für Linien und Icons,
  `brand-900` die Grundfläche der dunklen Abschnitte.
- **Schrift**: Archivo für Überschriften, Inter für Fliesstext. Beide werden
  als Variable Font vom eigenen Server ausgeliefert, nur Latin, zusammen 83 KB.
  Kein Abruf bei Dritten.
- **Aufmacher**: Randloses Bild mit Text darüber. Zwei fest gesetzte Verläufe
  sichern den Kontrast, damit Weiss auch bei einem späteren Motivwechsel lesbar
  bleibt. Der Kopfbereich liegt transparent darüber und wird beim Scrollen fest.
- **Silbentrennung**: global abgeschaltet (hyphens: none). Wörter brechen nur an
  Wortgrenzen, nie mitten im Wort.
- **Bewegung**: Einblendungen beim Scrollen und Übergänge zwischen Seiten. Alles
  ist an `prefers-reduced-motion` gebunden und entfällt vollständig, wenn
  reduzierte Bewegung eingestellt ist.

### Barrierefreiheit

Sprungmarke zum Inhalt, durchgehende Landmarken, sichtbare Fokusringe, das
mobile Menü mit Fokusfang und Escape, die Grossansicht der Galerie über das
native `dialog`-Element, Fragen und Antworten über `details` und `summary` ohne
JavaScript. Das Formular meldet Fehler über `aria-invalid`, verknüpfte
Fehlertexte und eine Live-Region.

## Formular

Das Offertformular ist auf Netlify Forms ausgelegt: `data-netlify` und das
versteckte Feld `form-name` genügen, damit Einsendungen ohne eigenen Server
ankommen. Ein Honigtopffeld hält automatisierte Einsendungen zurück. Ohne
JavaScript wird das Formular ganz normal abgeschickt.

Bei einem anderen Anbieter wird lediglich das `action`-Attribut in
`src/components/ContactForm.astro` gesetzt.

## Veröffentlichen

`netlify.toml` ist vorbereitet: Build `npm run build`, Verzeichnis `dist`, dazu
langlebige Zwischenspeicherung für Schriften und erzeugte Bilder sowie einige
Sicherheitskopfzeilen. Die Ausgabe ist rein statisch und läuft ebenso auf
Vercel, GitHub Pages oder klassischem Webhosting.

Vor dem Aufschalten ist in `astro.config.mjs` und `public/robots.txt` die
endgültige Adresse zu prüfen.
