import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from "@astrojs/cloudflare";
import icon from "astro-icon";
import solid from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    mdx(), 
    sitemap(), 
    icon(), 
    solid(), 
  ],
  output: "hybrid",
  vite: {
    build: {
      minify: true, // false for debugging with wrangler
    },
  },
  adapter: cloudflare({
    mode: "advanced", // directory | advanced
  }),
  routes: {
    strategy: 'include',
    include: ['/articles/*'], // handled by custom function
    exclude: [], // handled by static page
  },
});