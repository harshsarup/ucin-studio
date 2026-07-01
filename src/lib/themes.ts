/** Selectable gradient themes (swatches) for the Stripe-style mesh hero. */
export interface Theme {
  id: string
  name: string
  accent: string
  accentInk: string
  base: string
  colors: string[]
  swatch: string
}

export const THEMES: Theme[] = [
  {
    id: 'plum', name: 'Plum', accent: '#5B3DAF', accentInk: '#4A2F94', base: '#F6F3FF',
    colors: ['rgba(124,79,255,0.55)', 'rgba(139,92,246,0.5)', 'rgba(167,139,255,0.55)', 'rgba(108,63,239,0.42)', 'rgba(150,120,255,0.5)', 'rgba(120,140,240,0.3)'],
    swatch: 'linear-gradient(135deg,#7C4FFF,#8B5CF6,#A78BFF,#6C3FEF)',
  },
  {
    id: 'aurora', name: 'Aurora', accent: '#4D5BFF', accentInk: '#3A45D6', base: '#EEF2FF',
    colors: ['rgba(77,91,255,0.82)', 'rgba(56,189,248,0.6)', 'rgba(99,102,241,0.7)', 'rgba(45,212,191,0.5)', 'rgba(129,140,248,0.62)'],
    swatch: 'linear-gradient(135deg,#4D5BFF,#38BDF8,#6366F1,#2DD4BF)',
  },
  {
    id: 'sunset', name: 'Sunset', accent: '#E0533D', accentInk: '#C43F2C', base: '#FFF3EE',
    colors: ['rgba(255,122,90,0.74)', 'rgba(255,90,140,0.64)', 'rgba(168,85,247,0.55)', 'rgba(255,179,92,0.6)', 'rgba(244,114,182,0.55)'],
    swatch: 'linear-gradient(135deg,#FF7A5A,#FF5A8C,#A855F7,#FFB35C)',
  },
  {
    id: 'mint', name: 'Mint', accent: '#0FA37F', accentInk: '#0B7E62', base: '#ECFBF6',
    colors: ['rgba(16,185,129,0.74)', 'rgba(45,212,191,0.62)', 'rgba(59,130,246,0.52)', 'rgba(94,234,212,0.58)', 'rgba(132,204,160,0.55)'],
    swatch: 'linear-gradient(135deg,#10B981,#2DD4BF,#3B82F6,#5EEAD4)',
  },
]

export const themeById = (id: string): Theme => THEMES.find((t) => t.id === id) ?? THEMES[0]
