// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.hofer-zaunbau.ch',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  // Bewusst ohne globales image.layout: die eingebauten Layoutstile setzen
  // eigene Grössenregeln auf dem img und überschreiben damit die Positionierung
  // der randabfallenden Bildspalten. Breiten und sizes werden ohnehin pro Bild
  // gesetzt, die Darstellung steuern die Klassen.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
