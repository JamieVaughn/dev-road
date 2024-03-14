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
  output: "server", // "server" | "hybrid" | "static" (static is default if omitted, but fails build)
  vite: {
    build: {
      minify: true, // false for debugging with wrangler
    },
  },
  adapter: cloudflare({
    mode: "directory", // directory | advanced
    functionPerRoute: true,
  }),
  routes: {
    strategy: 'include',
    include: ['/articles/*'], // handled by custom function
    exclude: [], // handled by static page
  },
});