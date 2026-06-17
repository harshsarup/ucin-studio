/** @type {import('tailwindcss').Config}
 *
 *  UCIN Studio — "UCIN, lights off."
 *  The light ucin.in brand inverted, not a generic dark theme:
 *    • warm off-white text (the light site's warm paper, flipped onto dark)
 *    • plum primary (identical UCIN plum lineage)
 *    • coral + saffron warm accents (UCIN signature)
 *    • plum-tinted charcoal canvas (never pure black — keeps the brand warmth)
 *    • IBM Plex type (the UCIN typographic signature)
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── canvas: plum-tinted charcoal, warm not clinical ──
        canvas: {
          DEFAULT: '#0B0910', // page
          surface: '#131019', // raised
          card:    '#181320', // cards
          elevated:'#1F1828', // popovers / hovers
          border:  '#271F33',
          'border-light': '#352A44',
        },
        // ── text: the warm paper, inverted ──
        fg: {
          DEFAULT: '#F4F1EA', // headings / primary  (warm off-white)
          muted:   '#C3BBD0', // body
          subtle:  '#938AA6', // secondary
          faint:   '#675E78', // captions / lines
        },
        // ── plum: UCIN primary (brightened for dark legibility) ──
        plum: {
          50:  '#F2ECFA',
          100: '#E4D8F4',
          200: '#CBB3EA',
          300: '#B79AE6',
          400: '#9D7BE8', // accents on dark
          500: '#8B5CF6', // primary
          600: '#6A3CC4', // the canonical UCIN plum
          700: '#52309A',
        },
        // ── coral: warm highlight (UCIN signature) ──
        coral: {
          300: '#F4A79C',
          400: '#EC8576',
          500: '#E06A58',
        },
        // ── saffron: sparing UCIN thesis accent ──
        saffron: { DEFAULT: '#FF9933', soft: '#FFB870' },
        // ── category accents for outcome tiles ──
        cyan:    { 400: '#22D3EE', 500: '#06B6D4' },
        emerald: { 400: '#34D399', 500: '#10B981' },
        amber:   { 400: '#FBBF24', 500: '#F59E0B' },
      },
      fontFamily: {
        sans:    ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        display: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'plum-glow':  'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(139,92,246,0.18), transparent)',
        'warm-glow':  'radial-gradient(ellipse 50% 40% at 80% 0%, rgba(236,133,118,0.10), transparent)',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:  { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:{ '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'float':   'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      boxShadow: {
        'glow-plum':  '0 0 50px rgba(139,92,246,0.22)',
        'glow-coral': '0 0 40px rgba(236,133,118,0.18)',
        'card':       '0 1px 2px rgba(0,0,0,0.4), 0 12px 40px -24px rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
}
