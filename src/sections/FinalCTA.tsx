import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { MeshGradient } from '@/components/MeshGradient'
import type { Theme } from '@/lib/themes'

const SLATE = '#0A1020'
const SUB = '#3D4358'

/** Closing CTA on a full-bleed mesh gradient (Stripe-style bookend). */
export function FinalCTA({ palette }: { palette: Theme }) {
  return (
    <section className="relative overflow-hidden" style={{ color: SLATE }}>
      <div className="absolute inset-0"><MeshGradient base={palette.base} colors={palette.colors} /></div>
      <div className="relative max-w-3xl mx-auto px-6 py-32 md:py-40 text-center">
        <Reveal>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif", fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.0, fontSize: 'clamp(2.6rem, 7vw, 5.6rem)', color: SLATE }}>
            Unleash your full potential, with UCIN.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: SUB }}>
            Keep the craft — we handle the rest. Build your first event in minutes and see the price
            before you commit.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="/app?signup=1" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white" style={{ background: palette.accent, boxShadow: `0 14px 30px -10px ${palette.accent}` }}>
              Start creating <ArrowRight size={17} />
            </a>
            <a href="/app" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(6px)', color: SLATE }}>
              Build a quote first
            </a>
          </div>
          <p className="mt-6 mono text-[12px] uppercase tracking-[0.12em]" style={{ color: SUB }}>No card to build a quote · encrypted &amp; India-resident</p>
        </Reveal>
      </div>
    </section>
  )
}
