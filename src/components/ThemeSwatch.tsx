import { THEMES } from '@/lib/themes'

/** Floating swatch switcher — try the gradient themes live. */
export function ThemeSwatch({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  return (
    <div
      className="fixed bottom-5 right-5 z-[120] flex items-center gap-2 rounded-full px-3 py-2"
      style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(10,16,32,0.10)', boxShadow: '0 12px 34px rgba(10,16,32,0.18)' }}
    >
      <span className="mono text-[9px] uppercase tracking-[0.16em]" style={{ color: '#8A90A0' }}>Theme</span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => onPick(t.id)}
          title={t.name}
          aria-label={t.name}
          className="h-6 w-6 rounded-full transition-transform hover:scale-110"
          style={{ background: t.swatch, outline: active === t.id ? '2px solid #0A1020' : '1px solid rgba(10,16,32,0.15)', outlineOffset: 2 }}
        />
      ))}
    </div>
  )
}
