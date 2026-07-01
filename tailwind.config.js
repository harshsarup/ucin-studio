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
        'accent-ink': 'var(--accent-ink)',
        signal: {
          DEFAULT: '#FF3D2E', ink: '#D11C0E', bright: '#FF5247',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 38s linear infinite' },
    },
  },
  plugins: [],
}
