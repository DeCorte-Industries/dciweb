import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://decorteindustries.com',
  integrations: [
    tailwind(),
    // /blog is noindexed until posts exist, so it stays out of the sitemap too.
    sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/blog') }),
  ],
  output: 'hybrid',
  adapter: cloudflare(),
});
