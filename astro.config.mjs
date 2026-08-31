// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

// Update `site` to your final Netlify (or custom) domain.
export default defineConfig({
  site: 'https://barsi.xyz',
  trailingSlash: 'ignore',
  image: {
    // No native image processing needed for a text-first terminal site.
    service: passthroughImageService(),
  },
  build: {
    format: 'directory',
  },
});
