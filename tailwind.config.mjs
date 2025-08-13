// tailwind.config.mjs
import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
});
