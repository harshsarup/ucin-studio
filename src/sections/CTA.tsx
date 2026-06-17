import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

export function CTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-plum-glow" />
      <div className="absolute inset-0 bg-warm-glow" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <h2 className="font-display font-light text-fg leading-[1.05]" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
            Stop grinding the post.<br />
            <span className="text-gradient">Start shipping the work.</span>
          </h2>
          <p className="mt-5 text-lg text-fg-muted max-w-xl mx-auto leading-relaxed">
            Hand your backlog to your AI production partner and get your time back.
            First results in under two minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="/app?signup=1" className="btn-primary px-7 py-3.5 text-[15px]">
              Start creating free <ArrowRight size={16} />
            </a>
            <a href="#pricing" className="btn-ghost px-7 py-3.5 text-[15px]">See pricing</a>
          </div>
          <p className="mt-6 text-xs text-fg-faint">No card required · Pay only for results · Cancel anytime</p>
        </Reveal>
      </div>
    </section>
  )
}
