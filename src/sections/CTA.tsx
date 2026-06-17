import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

export function CTA() {
  return (
    <section className="py-40 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 70% at 50% 100%, rgba(139,92,246,0.14), transparent 70%)' }}
      />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <h2 className="h-display" style={{ fontSize: 'clamp(2.6rem, 6.5vw, 4.8rem)' }}>
            Get your<br /><span className="text-plum">time back.</span>
          </h2>
          <p className="mt-7 text-xl text-fg-muted max-w-lg mx-auto leading-relaxed">
            Hand your backlog to your production partner. First results in under two minutes.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a href="/app?signup=1" className="btn-primary">Start creating free <ArrowRight size={16} /></a>
            <a href="#pricing" className="link-arrow">See pricing ›</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
