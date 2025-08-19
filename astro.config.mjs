import { defineConfig } from "astro/config";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

export default defineConfig({
  site: SITE.website,
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