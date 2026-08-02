/**
 * Zentrale Datenquelle der Website.
 *
 * Alle Firmenangaben stehen ausschliesslich hier und werden von Seiten,
 * Kopfbereich, Fussbereich und den strukturierten Daten gelesen. Eine Änderung
 * an dieser Datei wirkt sich überall aus, doppelte Pflege entfällt.
 *
 * Verifiziert über öffentliche Schweizer Verzeichnisse (local.ch, search.ch,
 * moneyhouse.ch, rothrist.ch). Angaben, die dort nicht belegt waren, sind mit
 * TODO(verify) markiert und bewusst nicht erfunden.
 */

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface Service {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly detail: string;
  readonly icon: IconName;
}

export interface Product {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly features: readonly string[];
  readonly image: string;
  readonly alt: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export type IconName =
  | 'fence'
  | 'gate'
  | 'compass'
  | 'guide'
  | 'wrench'
  | 'repair'
  | 'offer'
  | 'spark';

export const site = {
  name: 'HOFER Zaunbau',
  legalName: 'HOFER Zaunbau',
  owner: 'Martin Hofer',
  foundedYear: 2016,
  url: 'https://www.hofer-zaunbau.ch',
  locale: 'de-CH',
  tagline: 'Zäune, Tore und Sichtschutz aus Rothrist',
  description:
    'HOFER Zaunbau in Rothrist plant, liefert und montiert Zäune aus Metall, Holz und Kunststoff, dazu Tore, Sichtschutz und Schlosserarbeiten. Beratung vor Ort im ganzen Kanton Aargau.',

  phone: {
    display: '079 686 62 09',
    href: 'tel:+41796866209',
  },
  email: 'info@hofer-zaunbau.ch',

  office: {
    label: 'Büro',
    street: 'Rubernstrasse 39',
    postalCode: '4852',
    city: 'Rothrist',
    country: 'Schweiz',
  },
  workshop: {
    label: 'Werkstatt',
    street: 'Bernstrasse 281',
    postalCode: '4852',
    city: 'Rothrist',
    country: 'Schweiz',
  },

  // TODO(verify): Öffnungszeiten sind öffentlich nicht belegt. Bis zur
  // Freigabe durch den Inhaber werden bewusst keine Zeiten angezeigt und auch
  // keine in den strukturierten Daten ausgewiesen, damit niemand vor
  // verschlossener Tür steht.
  openingHours: null as readonly string[] | null,
} as const;

export const nav: readonly NavItem[] = [
  { label: 'Leistungen', href: '/leistungen/' },
  { label: 'Produkte', href: '/produkte/' },
  { label: 'Referenzen', href: '/referenzen/' },
  { label: 'Über uns', href: '/ueber-uns/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

export const services: readonly Service[] = [
  {
    slug: 'lieferung',
    title: 'Zäune aus Metall und Holz',
    summary:
      'Lieferung von Zäunen aller Art samt Zubehör, auf Wunsch als Spezialanfertigung nach Mass.',
    detail:
      'Ob verzinkter Stabmattenzaun, pulverbeschichteter Metallzaun oder Lattenzaun aus Lärche: Sie erhalten das passende System inklusive Pfosten, Beschlägen und Zubehör. Was es ab Lager nicht gibt, fertigen wir in der eigenen Werkstatt an.',
    icon: 'fence',
  },
  {
    slug: 'tore',
    title: 'Tore und Schlösser',
    summary:
      'Drehtore und Schiebetore, Gartentüren sowie passende Schliesssysteme, sauber eingepasst.',
    detail:
      'Einfahrtstore, Gartentore und Rohrrahmentüren fertigen wir passend zur Zaunlinie. Dazu montieren wir Schlösser, Beschläge und Griffe, damit alles über Jahre leicht läuft und zuverlässig schliesst.',
    icon: 'gate',
  },
  {
    slug: 'beratung',
    title: 'Beratung vor Ort',
    summary:
      'Wir schauen uns das Grundstück an und klären Material, Höhe und Verlauf direkt bei Ihnen.',
    detail:
      'Gefälle, Grenzverlauf, Bodenbeschaffenheit und Nachbarschaft entscheiden mit, welche Lösung wirklich passt. Deshalb kommen wir vorbei und besprechen alles vor Ort. Auf Wunsch geht das auch telefonisch.',
    icon: 'compass',
  },
  {
    slug: 'selbstmontage',
    title: 'Anleitung zur Selbstmontage',
    summary:
      'Sie möchten selbst anpacken? Wir liefern das Material und zeigen Ihnen, worauf es ankommt.',
    detail:
      'Wer selber baut, spart Montagekosten. Wir bereiten das Material vor, erklären Fundament, Ausrichtung und Reihenfolge und bleiben bei Rückfragen erreichbar. So gelingt der Zaun auch in Eigenregie sauber.',
    icon: 'guide',
  },
  {
    slug: 'montage',
    title: 'Fachgerechte Montage',
    summary:
      'Fundament, Ausrichtung und Feinjustierung übernehmen wir vollständig für Sie.',
    detail:
      'Wir setzen die Pfosten lotrecht und fluchtgerecht, betonieren sauber ein und richten jedes Feld einzeln aus. Am Ende steht eine Linie, die auch über Gefälle und Ecken ruhig durchläuft.',
    icon: 'wrench',
  },
  {
    slug: 'reparaturen',
    title: 'Zaunreparaturen',
    summary:
      'Sturmschaden, verzogenes Tor oder loser Pfosten? Wir bringen Bestehendes wieder in Ordnung.',
    detail:
      'Nicht jeder Schaden verlangt einen neuen Zaun. Wir richten verbogene Felder, ersetzen einzelne Pfosten, tauschen Beschläge und justieren Tore nach, die nicht mehr sauber schliessen.',
    icon: 'repair',
  },
  {
    slug: 'offerte',
    title: 'Schneller Offertservice',
    summary:
      'Anfrage rein, Offerte raus. Klar aufgeschlüsselt, ohne Überraschungen im Nachgang.',
    detail:
      'Sie erhalten eine nachvollziehbare Offerte mit Material, Montage und Nebenkosten getrennt ausgewiesen. So sehen Sie genau, wofür Sie bezahlen, und können Positionen bei Bedarf anpassen.',
    icon: 'offer',
  },
  {
    slug: 'schlosserarbeiten',
    title: 'Schlosserarbeiten',
    summary:
      'Geländer, Roste, Halterungen und Sonderteile fertigen wir in der eigenen Werkstatt.',
    detail:
      'Neben dem Zaunbau übernehmen wir Schlosserarbeiten aller Art. Vom einzelnen Winkel bis zum Geländer entsteht alles auf Mass, geschweisst, verschliffen und auf Wunsch beschichtet.',
    icon: 'spark',
  },
];

export const products: readonly Product[] = [
  {
    slug: 'metallzaeune',
    title: 'Metallzäune',
    summary:
      'Verzinkt oder pulverbeschichtet, langlebig und praktisch wartungsfrei. Der Klassiker für klare Linien.',
    features: ['Feuerverzinkt oder pulverbeschichtet', 'Freie Farbwahl nach RAL', 'Höhen nach Mass'],
    image: 'metallzaun',
    alt: 'Anthrazitfarbener Metallzaun mit schmalen senkrechten Stäben auf einem niedrigen Betonsockel',
  },
  {
    slug: 'holzzaeune',
    title: 'Holzzäune',
    summary:
      'Warm, natürlich und wandelbar. Von der klassischen Latte bis zur waagrechten Rhombusleiste.',
    features: ['Lärche, Fichte oder Douglasie', 'Senkrecht oder waagrecht', 'Rostfreie Befestigung'],
    image: 'holzzaun',
    alt: 'Waagrecht verlegter Lattenzaun aus Lärchenholz mit gleichmässigen Abständen entlang einer Gartenterrasse',
  },
  {
    slug: 'kunststoffzaeune',
    title: 'Kunststoffzäune',
    summary:
      'Farbstabil und schnell gereinigt. Die pflegeleichte Alternative, wenn es lange gut aussehen soll.',
    features: ['Kein Streichen nötig', 'Formstabil bei Nässe', 'Grosse Farbauswahl'],
    image: 'kunststoffzaun',
    alt: 'Weisser Kunststoffzaun mit kleinem Gartentor vor einem gepflegten Vorgarten',
  },
  {
    slug: 'sichtschutz',
    title: 'Sichtschutz',
    summary:
      'Ruhe auf dem Sitzplatz. Dichte Elemente aus Holz, Kunststoff oder Metall, exakt auf Ihre Höhe abgestimmt.',
    features: ['Windgeschützter Sitzplatz', 'Blickdicht ab Wunschhöhe', 'Passend zur Zaunlinie'],
    image: 'sichtschutz',
    alt: 'Blickdichter Sichtschutz aus waagrechten Lamellen schützt einen Gartensitzplatz',
  },
  {
    slug: 'tore',
    title: 'Tore und Türen',
    summary:
      'Drehtore und Schiebetore für die Einfahrt, Gartentüren für den Durchgang. Alles passend zum Zaun.',
    features: ['Drehtor oder Schiebetor', 'Manuell oder mit Antrieb', 'Schlösser und Beschläge'],
    image: 'tor',
    alt: 'Breites anthrazitfarbenes Schiebetor mit senkrechten Stäben an einer Einfahrt, halb geöffnet',
  },
  {
    slug: 'rohrrahmentueren',
    title: 'Rohrrahmentüren',
    summary:
      'Robuste Türen aus geschweisstem Stahlrohr für Keller, Werkstatt, Lager und Nebenräume.',
    features: ['Geschweisster Stahlrahmen', 'Füllung nach Wahl', 'Auf Mass gefertigt'],
    image: 'werkstatt',
    alt: 'Rahmen einer Rohrrahmentür auf einem Schweisstisch in einer aufgeräumten Metallwerkstatt',
  },
  {
    slug: 'industriezaeune',
    title: 'Industriezäune und Abschrankungen',
    summary:
      'Klare Grenzen für Gewerbe und Industrie. Stabil, übersichtlich und auf lange Standzeiten ausgelegt.',
    features: ['Doppelstabmatten und Gitter', 'Höhen bis Sicherheitsstandard', 'Tore und Schleusen'],
    image: 'industriezaun',
    alt: 'Grün beschichteter Doppelstabmattenzaun entlang eines Gewerbeareals in langer Fluchtperspektive',
  },
  {
    slug: 'spielplatzgeraete',
    title: 'Spielplatzgeräte und Ballfangzäune',
    summary:
      'Einfassungen und Geräte für Spielflächen und Sportflächen, montiert mit Blick auf Sicherheit.',
    features: ['Ballfangzäune', 'Einfassungen für Spielflächen', 'Sichere Montage'],
    image: 'industriezaun',
    alt: 'Hoher Gitterzaun als Ballfang entlang einer Sportfläche',
  },
];

export const faq: readonly FaqItem[] = [
  {
    question: 'Was kostet ein Zaun?',
    answer:
      'Das hängt von Material, Höhe, Länge und Untergrund ab. Ein einfacher Stabmattenzaun liegt deutlich unter einer Sonderanfertigung aus Metall. Wir schauen uns die Situation an und rechnen Ihnen Material und Montage getrennt auf, damit Sie beides einzeln beurteilen können.',
  },
  {
    question: 'Brauche ich eine Bewilligung für meinen Zaun?',
    answer:
      'In vielen Gemeinden sind Zäune bis zu einer bestimmten Höhe bewilligungsfrei, darüber wird es meldepflichtig. Die Regeln setzt Ihre Wohngemeinde. Wir sagen Ihnen bei der Beratung, worauf Sie in Ihrem Fall achten müssen.',
  },
  {
    question: 'Wie lange dauert es von der Anfrage bis zum fertigen Zaun?',
    answer:
      'Nach der Besichtigung erhalten Sie zügig eine Offerte. Die Lieferzeit richtet sich danach, ob Standardmaterial genügt oder ob wir Teile in der Werkstatt anfertigen. Den konkreten Termin halten wir bei der Auftragsbestätigung fest.',
  },
  {
    question: 'Kann ich den Zaun selbst montieren?',
    answer:
      'Ja. Wir liefern das Material vorbereitet und erklären Ihnen Fundament, Ausrichtung und Reihenfolge. Bei Fragen während der Montage sind wir telefonisch erreichbar.',
  },
  {
    question: 'Reparieren Sie auch Zäune, die nicht von Ihnen stammen?',
    answer:
      'Ja. Wir richten verbogene Felder, ersetzen einzelne Pfosten, tauschen Beschläge und justieren Tore nach, unabhängig davon, wer den Zaun ursprünglich gestellt hat.',
  },
  {
    question: 'In welchem Gebiet sind Sie tätig?',
    answer:
      'Schwerpunkt ist Rothrist und die Region rundherum, von Zofingen und Oftringen über Aarburg und Olten bis Aarau und Langenthal. Fragen Sie an, wenn Ihr Ort nicht dabei ist.',
  },
];

/** Einzugsgebiet, ausgewiesen in den strukturierten Daten als areaServed. */
export const areaServed: readonly string[] = [
  'Rothrist',
  'Zofingen',
  'Oftringen',
  'Aarburg',
  'Olten',
  'Aarau',
  'Langenthal',
  'Strengelbach',
  'Brittnau',
  'Safenwil',
  'Murgenthal',
  'Kölliken',
];

/** Arbeitsweise, verwendet auf Startseite und Kontaktseite. */
export const steps: readonly { title: string; text: string }[] = [
  {
    title: 'Anfrage',
    text: 'Sie melden sich telefonisch oder über das Formular und schildern kurz, worum es geht.',
  },
  {
    title: 'Besichtigung',
    text: 'Wir schauen uns das Grundstück an, messen aus und klären Material, Höhe und Verlauf.',
  },
  {
    title: 'Offerte',
    text: 'Sie erhalten eine klar aufgeschlüsselte Offerte mit getrennten Positionen.',
  },
  {
    title: 'Montage',
    text: 'Wir liefern und montieren fachgerecht. Auf Wunsch übernehmen Sie den Aufbau selbst.',
  },
];

export interface Reference {
  readonly image: string;
  readonly title: string;
  readonly place: string;
  readonly category: string;
  readonly alt: string;
}

/**
 * Galerie auf der Referenzseite.
 *
 * Die Aufnahmen sind digital erzeugte Beispielbilder und zeigen typische
 * Ausführungen, keine dokumentierten Aufträge. Sobald eigene Baustellenfotos
 * vorliegen, werden hier nur Dateiname, Titel und Ort ausgetauscht.
 */
export const references: readonly Reference[] = [
  {
    image: 'hero',
    title: 'Metallzaun am Vorgarten',
    place: 'Einfamilienhaus',
    category: 'Metall',
    alt: 'Anthrazitfarbener Metallzaun mit senkrechten Stäben entlang eines Vorgartens',
  },
  {
    image: 'metallzaun',
    title: 'Zaunfeld auf Betonsockel',
    place: 'Wohnquartier',
    category: 'Metall',
    alt: 'Detail eines pulverbeschichteten Metallzauns auf einem niedrigen Betonsockel',
  },
  {
    image: 'holzzaun',
    title: 'Lattenzaun aus Lärche',
    place: 'Gartenterrasse',
    category: 'Holz',
    alt: 'Waagrecht verlegter Lattenzaun aus Lärchenholz mit gleichmässigen Abständen',
  },
  {
    image: 'kunststoffzaun',
    title: 'Kunststoffzaun mit Gartentor',
    place: 'Vorgarten',
    category: 'Kunststoff',
    alt: 'Weisser Kunststoffzaun mit kleinem Gartentor vor einem gepflegten Vorgarten',
  },
  {
    image: 'sichtschutz',
    title: 'Sichtschutz am Sitzplatz',
    place: 'Reihenhaus',
    category: 'Sichtschutz',
    alt: 'Hoher Sichtschutz aus breiten waagrechten Lamellen an einem Gartensitzplatz',
  },
  {
    image: 'tor',
    title: 'Schiebetor an der Einfahrt',
    place: 'Einfamilienhaus',
    category: 'Tore',
    alt: 'Breites anthrazitfarbenes Schiebetor mit senkrechten Stäben, halb geöffnet',
  },
  {
    image: 'industriezaun',
    title: 'Doppelstabmatten am Areal',
    place: 'Gewerbe',
    category: 'Gewerbe',
    alt: 'Grün beschichteter Doppelstabmattenzaun entlang eines Gewerbeareals',
  },
  {
    image: 'werkstatt',
    title: 'Rohrrahmentür in Arbeit',
    place: 'Eigene Werkstatt',
    category: 'Werkstatt',
    alt: 'Rahmen einer Rohrrahmentür auf einem Schweisstisch in der Werkstatt',
  },
  {
    image: 'montage',
    title: 'Pfosten ausrichten',
    place: 'Auf der Baustelle',
    category: 'Werkstatt',
    alt: 'Hände richten mit der Wasserwaage einen frisch gesetzten Zaunpfosten aus',
  },
  {
    image: 'gefaelle',
    title: 'Zaunlinie über Gefälle',
    place: 'Hanggrundstück',
    category: 'Metall',
    alt: 'Metallzaun folgt einem Gefälle, jedes Feld exakt zur Neigung abgestuft',
  },
];

export interface Project {
  readonly image: string;
  readonly title: string;
  readonly place: string;
  readonly scope: string;
  readonly alt: string;
}

/**
 * Abgeschlossene Ausführungen für die Startseite.
 *
 * Wie überall auf dieser Website sind die Aufnahmen digital erzeugte
 * Beispielbilder. Sie zeigen typische Ausführungen und stehen nicht für
 * konkret abgerechnete Aufträge. Sobald eigene Baustellenfotos vorliegen,
 * werden hier nur Dateiname, Titel und Ort ausgetauscht.
 */
export const projects: readonly Project[] = [
  {
    image: 'tor',
    title: 'Einfahrt mit Schiebetor',
    place: 'Einfamilienhaus',
    scope: 'Metallzaun, Schiebetor, Montage',
    alt: 'Breites anthrazitfarbenes Schiebetor mit senkrechten Stäben an einer Einfahrt',
  },
  {
    image: 'holzzaun',
    title: 'Sitzplatz mit Holzzaun',
    place: 'Gartenterrasse',
    scope: 'Lärche waagrecht, rostfreie Befestigung',
    alt: 'Waagrecht verlegter Lattenzaun aus Lärchenholz entlang einer Gartenterrasse',
  },
  {
    image: 'industriezaun',
    title: 'Areal mit Doppelstabmatten',
    place: 'Gewerbe',
    scope: 'Industriezaun, Tore, Abschrankung',
    alt: 'Grün beschichteter Doppelstabmattenzaun entlang eines Gewerbeareals',
  },
  {
    image: 'gefaelle',
    title: 'Zaunlinie über Gefälle',
    place: 'Hanggrundstück',
    scope: 'Metallzaun, Felder einzeln abgestuft',
    alt: 'Metallzaun folgt einem Gefälle, jedes Feld exakt zur Neigung abgestuft',
  },
  {
    image: 'sichtschutz',
    title: 'Blickdichter Sitzplatz',
    place: 'Reihenhaus',
    scope: 'Sichtschutz, Höhe nach Mass',
    alt: 'Hoher Sichtschutz aus breiten waagrechten Lamellen an einem Gartensitzplatz',
  },
  {
    image: 'kunststoffzaun',
    title: 'Vorgarten mit Gartentor',
    place: 'Vorgarten',
    scope: 'Kunststoffzaun, Gartentor',
    alt: 'Weisser Kunststoffzaun mit kleinem Gartentor vor einem gepflegten Vorgarten',
  },
];

export interface Testimonial {
  readonly quote: string;
  readonly author: string;
  readonly place: string;
}

/**
 * TODO(verify): PLATZHALTER.
 *
 * Diese Stimmen sind erfunden und dürfen so nicht online gehen. Erfundene
 * Kundenbewertungen sind irreführende Werbung und in der Schweiz nach dem
 * Gesetz gegen den unlauteren Wettbewerb unzulässig.
 *
 * Sie stehen hier ausschliesslich, damit die Gestaltung des Abschnitts
 * beurteilt werden kann. Vor dem Aufschalten entweder durch echte, freigegebene
 * Kundenstimmen ersetzen oder das Feld auf eine leere Liste setzen. Bei einer
 * leeren Liste blendet die Startseite den ganzen Abschnitt automatisch aus.
 */
export const testimonials: readonly Testimonial[] = [
  {
    quote:
      'Termin eingehalten, sauber gearbeitet und am Schluss alles aufgeräumt hinterlassen. Die Offerte hat bis auf den Franken gestimmt.',
    author: 'Platzhalter',
    place: 'Bitte ersetzen',
  },
  {
    quote:
      'Wir wussten nicht, welches Material zu unserem Hang passt. Die Beratung vor Ort hat das in einer halben Stunde geklärt.',
    author: 'Platzhalter',
    place: 'Bitte ersetzen',
  },
  {
    quote:
      'Das Tor liess sich nach dem Sturm nicht mehr schliessen. Zwei Tage später war es gerichtet, ohne dass wir den ganzen Zaun ersetzen mussten.',
    author: 'Platzhalter',
    place: 'Bitte ersetzen',
  },
];
