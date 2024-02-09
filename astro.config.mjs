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
    solid(), 
    mdx(), 
    sitemap(), 
    icon(), 
  ],
  output: "server",
  vite: {
    build: {
      minify: false, // false for debugging with wrangler
    },
  },
  adapter: cloudflare({
    mode: "advanced", // directory | advanced
  })
});