// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

// `site` must be the canonical URL the site is actually served from —
// it drives <link rel="canonical">, OG tags and any sitemap.
export default defineConfig({
  site: 'https://patrikbarsi.xyz',
  trailingSlash: 'ignore',
  image: {
    // No native image processing needed for a text-first terminal site.
    service: passthroughImageService(),
  },
  build: {
    format: 'directory',
  },
});
