import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        "cGray": "#1A1A1A",
        "cLightGray": "#202020",
        "cRed": "#E50914"
      }
    }
  },

  plugins: []
} satisfies Config;
