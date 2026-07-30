/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Core surfaces/text.
        ink: '#1B2430', // headings, dark surfaces, primary text
        paper: '#F5F6F3', // page background — cool off-white, not cream
        smoke: '#5B6472', // secondary/body text
        // Interactive accent — the blue from the original logo mark, kept
        // for continuity as the one color that always means "click here".
        signal: {
          light: '#EDF1FA',
          DEFAULT: '#3457A0',
          dark: '#1F3567',
        },
        // Medallion-architecture tiers (bronze/silver/gold): a real data
        // engineering concept — raw, cleaned, and business-ready data —
        // used both literally (hero diagram) and as the four service
        // accent colors, never as arbitrary decoration.
        bronze: '#A9713F',
        silver: '#8C96A6',
        gold: '#B8901F',
      },
      fontFamily: {
        // Headlines only, used with restraint.
        display: ['"Space Grotesk"', 'sans-serif'],
        // Body copy, nav, UI text.
        body: ['"IBM Plex Sans"', 'sans-serif'],
        // Eyebrows, table headers, tier tags, captions.
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
