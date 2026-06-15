import type {Config} from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F4ED',
        cream: '#FFFFFF',
        champagne: '#EFE7D6',
        gold: '#C4A052',
        'gold-deep': '#A07E32',
        charcoal: '#1F1B16',
        muted: '#6E665A',
        line: '#E3DAC9',
        dark: '#15120E'
      },
      fontFamily: {
        heading: ['var(--font-eb-garamond)', 'Georgia', 'serif'],
        body: ['var(--font-montserrat)', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
