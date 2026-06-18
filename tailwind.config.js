/** @type {import('tailwindcss').Config}
 *
 *  UCIN Studio — dual theme via CSS variables (see src/index.css :root / .dark).
 *  Tokens point at the variables so every surface + text colour switches with a
 *  single `.dark` class on <html>. Plum scale stays fixed (buttons/brand moments).
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'var(--bg)',
          sunk:    'var(--sunk)',
          surface: 'var(--surface)',
          card:    'var(--card)',
          border:  'var(--border)',
          'border-light': 'var(--border-strong)',
          tint:    'var(--tint)',
        },
        fg: {
          DEFAULT: 'var(--fg)',
          muted:   'var(--fg-muted)',
          subtle:  'var(--fg-subtle)',
          faint:   'var(--fg-faint)',
        },
        accent: 'var(--accent)',
        plum: {
          50:  '#F4EFFB', 100: '#E7DBF6', 200: '#D2BCEC', 300: '#B79AE6',
          400: '#9466DB', 500: '#7C4DEF', 600: '#6A3CC4', 700: '#52309A', 900: '#1A1226',
        },
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
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
        mesh:    'meshDrift 22s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
      },
    },
  },
  plugins: [],
}
