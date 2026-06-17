/** @type {import('tailwindcss').Config}
 *
 *  UCIN Studio — light, warm, high-contrast. The UCIN "Warm Paper & Plum"
 *  identity, premium-grade: warm-paper canvas, near-black ink for contrast,
 *  rich plum primary + plum/coral moments so it never washes out.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── canvas: warm paper, white cards ──
        canvas: {
          DEFAULT: '#F7F5F1', // page
          surface: '#FFFFFF', // raised
          card:    '#FFFFFF',
          elevated:'#FFFFFF',
          border:  '#E8E2D6',
          'border-light': '#DBD3C6',
          tint:    '#F2ECFA', // plum wash panel
        },
        // ── text: near-black ink for contrast, warm grays below ──
        fg: {
          DEFAULT: '#16131C', // headings
          muted:   '#46414E', // body
          subtle:  '#6B6675', // secondary
          faint:   '#A39BAC', // captions
          invert:  '#F7F5F1', // text on dark/plum bands
        },
        // ── plum: UCIN primary ──
        plum: {
          50:  '#F4EFFB',
          100: '#E7DBF6',
          200: '#D2BCEC',
          300: '#B79AE6',
          400: '#9466DB',
          500: '#7C4DEF',
          600: '#6A3CC4', // canonical UCIN plum — primary
          700: '#52309A',
          900: '#1A1226', // plum-black for contrast bands
        },
        coral: { 300: '#F4A79C', 400: '#EC8576', 500: '#E06A58' },
        saffron: { DEFAULT: '#FF9933' },
      },
      fontFamily: {
        sans:    ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        display: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        shimmer:   { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        meshDrift: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(4%,-3%) scale(1.1)' }, '66%': { transform: 'translate(-4%,3%) scale(0.95)' } },
        marquee:   { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        floaty:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-7px)' } },
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
        mesh:    'meshDrift 22s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        floaty:  'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
