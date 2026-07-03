import { ArrowRight } from 'lucide-react'
import { Logo } from './Logo'
import type { Vertical } from '@/lib/catalog'
import { VERTICALS, VERTICAL_ORDER } from '@/lib/catalog'

/** First-run persona picker. Sets the workspace that tailors labels, presets and
 *  (soon) the recommended models. Shown until a workspace is chosen; re-openable
 *  from the app bar's "change". */
const TAGLINE: Record<Vertical, string> = {
  photo:      'Weddings, portraits & events — culled, graded & finished in your style.',
  agency:     'On-brand campaign visuals, generated & retouched at volume.',
  ecom:       'Catalogs cut out & standardised, plus lifestyle scenes & social — at volume.',
  creator:    'Grade, generate & subtitle for every channel.',
}

export function Onboarding({ onPick }: { onPick: (v: Vertical) => void }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-canvas-border">
        <div className="max-w-5xl mx-auto flex h-16 items-center px-6">
          <Logo />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="eyebrow mb-3">Welcome</div>
        <h1 className="display mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Select Your Workspace:
        </h1>
        <p className="text-lg text-fg-muted mb-10 max-w-xl">
          We&apos;ll tailor your presets, models and workspace to how you work — you can change it anytime.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {VERTICAL_ORDER.map((v) => (
            <button
              key={v}
              onClick={() => onPick(v)}
              className="card p-6 text-left transition-transform hover:-translate-y-0.5"
            >
              <div className="text-xl font-semibold text-fg">{VERTICALS[v].label}</div>
              <p className="mt-1.5 text-[15px] text-fg-subtle leading-relaxed">{TAGLINE[v]}</p>
              <span className="link-arrow mt-4">Continue <ArrowRight size={15} /></span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
