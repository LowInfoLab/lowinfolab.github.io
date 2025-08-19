import { defineConfig } from "astro/config";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://lowinfolab.com",
  base: "/",
  trailingSlash: "always",
  integrations: [
      sitemap({
        filter: page => SITE.showArchives || !page.endsWith("/archives"),
      }),
    ],
    markdown: {
      remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
      shikiConfig: {
        themes: { light: "min-light", dark: "night-owl" },
        wrap: true,
      },
    },
    vite: {
      plugins: [tailwindcss()],
      optimizeDeps: {
        exclude: ["@resvg/resvg-js"],
      },
    }
});