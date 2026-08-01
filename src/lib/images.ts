import type { ImageMetadata } from 'astro';

/**
 * Nachschlagewerk für die Bildmotive.
 *
 * Die Inhaltsdaten in data/site.ts verweisen nur über einen Namen auf ein Bild.
 * Hier wird daraus das von Astro verarbeitete Bildobjekt, das Breite, Höhe und
 * die erzeugten Formate mitbringt. Ein unbekannter Name fällt beim Build auf,
 * nicht erst im Browser.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.jpg', {
  eager: true,
});

const byName = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, module]) => [
    path.split('/').pop()!.replace('.jpg', ''),
    module.default,
  ]),
);

export const image = (name: string): ImageMetadata => {
  const found = byName.get(name);
  if (!found) {
    throw new Error(
      `Bild "${name}" fehlt in src/assets/images. Vorhanden: ${[...byName.keys()].join(', ')}`,
    );
  }
  return found;
};
