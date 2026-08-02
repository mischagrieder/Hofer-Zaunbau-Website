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
| `npm run inspect` | Prüft Überschriftenfolge, Überlauf, Trefferflächen, Fokus |

### Prüflauf

`npm run audit` setzt einen laufenden `npm run preview` voraus und nutzt das im
System vorhandene Chromium, es wird nichts nachgeladen. Der Lauf prüft jede
Seite gegen WCAG 2.1 A und AA und misst die Startseite mit Lighthouse.

`npm run inspect` ergänzt das um Prüfungen, die beide Werkzeuge nicht abdecken:
Überschriftenfolge, doppelte Kennungen, waagrechter Überlauf über sieben Breiten
von 320 bis 1920 Pixel, Trefferflächen auf dem Handy und ob jedes Bedienelement
beim Durchtabben einen sichtbaren Fokus bekommt.

Zwei Prüfungen sind bewusst so gebaut, dass sie keine Fehlalarme erzeugen: der
Fokus wird über echte Tabulatorschritte geprüft, weil ein `focus()` aus dem
Skript `:focus-visible` nicht auslöst. Und bei den Trefferflächen sind die
beiden Fälle ausgenommen, die die Richtlinie zulässt, nämlich Verweise im
Fliesstext und nur für Screenreader sichtbare Elemente.

Letzter Stand: **keine Verstösse** bei axe-core auf allen neun Seiten,
**keine Befunde** bei der Strukturprüfung, Lighthouse **100 / 100 / 100** für
Leistung, Barrierefreiheit und SEO bei 0 ms Blockierzeit und 0
Layoutverschiebung.

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
- **Bewertung im Aufmacher**: `heroReview` in `src/data/site.ts` ist erfunden.
  Durch eine echte, freigegebene Rückmeldung ersetzen oder auf `null` setzen,
  dann zeigt der Aufmacher wieder den Sachhinweis zur Beratung vor Ort.
- **Kundenstimmen**: Der Abschnitt auf der Startseite enthält drei
  **erfundene** Platzhalter. Erfundene Bewertungen sind unzulässige Werbung und
  dürfen so nicht online gehen. Entweder durch echte, freigegebene Stimmen
  ersetzen oder `testimonials` in `src/data/site.ts` auf eine leere Liste
  setzen, dann entfällt der Abschnitt automatisch. Auf der Seite steht dazu ein
  sichtbarer Hinweiskasten.

## Bildmaterial

Die Motive sind digital erzeugte Beispielbilder, keine dokumentierten Aufträge.
Darauf wird im Fussbereich und auf der Referenzseite ausdrücklich hingewiesen.
Herkunft und Quelladresse jedes Motivs stehen in `scripts/images.manifest.json`.

`npm run images` lädt die Motive nach `src/assets/images`.

Ist eine Quelle beim Bauen nicht erreichbar, greifen zwei Vorkehrungen
ineinander, damit die Website trotzdem vollständig aussieht:

1. Das Skript legt einen Platzhalter im richtigen Seitenverhältnis an, damit
   der Build durchläuft und die Proportionen stimmen.
2. Es vermerkt das Motiv in `src/data/remote-images.json`. Für genau diese
   Motive bindet `src/components/Picture.astro` die Quelladresse direkt ein.
   Besucher sehen dadurch das echte Bild, obwohl die Datei lokal fehlt.

Sobald die Quelle erreichbar ist:

```bash
npm run images -- --force
npm run build
```

Das Skript schreibt `remote-images.json` bei jedem Lauf neu. Sind alle Motive
lokal vorhanden, ist die Datei leer und jedes Bild läuft wieder über die
Aufbereitung von Astro mit AVIF, WebP und mehreren Breiten. Der Umstieg
passiert von selbst, am Code ist nichts zu ändern.

Solange Motive über die Quelladresse laufen, gilt: keine Bildoptimierung durch
Astro und eine Abhängigkeit von einem fremden Server. Das ist als Übergang
gedacht, nicht als Dauerzustand.

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
- **Flächen**: Die Abschnitte wechseln bewusst zwischen Weiss, hellem Blau und
  zwei dunklen Blautönen ab, damit die Seite nicht als eine durchgehende weisse
  Fläche wirkt. Die Tonwerte liefert `tone` in `components/Section.astro`.
- **Formen**: Raster, senkrechte Striche und ein weicher Lichtschein ziehen eine
  ruhige Bauzeichnungsanmutung durch die Seite. Alle als Verlauf umgesetzt, also
  ohne zusätzliche Datei und ohne Abruf. Siehe `.pattern-*` und `.glow-*`.
- **Eingangssequenz**: Die Startseite beginnt mit einem Blick durch ein Loch im
  Maschendrahtzaun. Beim Scrollen wächst der Zaun vom Lochmittelpunkt aus über
  den Bildschirm hinaus. Der Zaun ist ein erzeugtes SVG, bewegt werden nur
  `transform` und `opacity`. Sie läuft nur mit JavaScript und nur ohne
  reduzierte Bewegung. Fehlt eines von beidem, beginnt die Seite direkt mit dem
  Aufmacher. Siehe `components/IntroFence.astro`.
- **Handy**: Unter 768 Pixel fallen Muster, eingefärbte Abschnitte und
  Kartenflächen weg. Der Inhalt steht direkt auf Weiss und wird nur durch feine
  Linien getrennt. Auf dem schmalen Bildschirm wirkt sonst jede Fläche wie ein
  Rahmen um den Text. Die Regeln stehen gebündelt in der Media Query in
  `global.css`.
- **Bewegung**: Einblendungen beim Scrollen und Übergänge zwischen Seiten. Alles
  ist an `prefers-reduced-motion` gebunden und entfällt vollständig, wenn
  reduzierte Bewegung eingestellt ist.

### Barrierefreiheit

Sprungmarke zum Inhalt, durchgehende Landmarken, sichtbare Fokusringe, das
mobile Menü mit Fokusfang und Escape, die Grossansicht der Galerie über das
native `dialog`-Element, Fragen und Antworten über `details` und `summary` ohne
JavaScript. Das Formular meldet Fehler über `aria-invalid`, verknüpfte
Fehlertexte und eine Live-Region.

## Aufbau der Startseite

1. Aufmacher
2. Leistungen
3. Ergebnisse, abgeschlossene Ausführungen
4. Kundenstimmen, blendet sich bei leerer Liste selbst aus
5. Über uns
6. Kontakt, Formular und häufige Fragen
7. Fussbereich

Die häufigen Fragen stehen bewusst im Abschnitt Kontakt. Sie räumen die letzten
Einwände genau dort aus, wo über eine Anfrage entschieden wird.

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
