import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import rehypeMermaid from "rehype-mermaid";

export default defineConfig({
  site: "https://upmaru.com",
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [react()],
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid", "math"],
    },
    rehypePlugins: [[rehypeMermaid, { strategy: "pre-mermaid" }]],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
