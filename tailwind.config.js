/** @type {import('tailwindcss').Config}
 *
 *  UCIN Studio — tokens point at CSS variables (src/index.css). Light editorial
 *  base; `.dark-moment` flips the variables for full-bleed dark sections. Plum
 *  scale stays fixed for buttons/brand moments.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'var(--bg)',
          surface: 'var(--surface)',
          card:    'var(--card)',
          sunk:    'var(--sunk)',
          border:  'var(--border)',
          'border-light': 'var(--border-light)',
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
          400: '#9466DB', 500: '#7C4DEF', 600: '#6A3CC4', 700: '#52309A',
        },
      },
      fontFamily: {
        sans:    ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 40s linear infinite' },
    },
  },
  plugins: [],
}
