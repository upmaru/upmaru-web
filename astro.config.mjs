import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import rehypeMermaid from "rehype-mermaid";

export default defineConfig({
  integrations: [react()],
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid", "math"],
    },
    rehypePlugins: [[rehypeMermaid, { strategy: "inline-svg" }]],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
