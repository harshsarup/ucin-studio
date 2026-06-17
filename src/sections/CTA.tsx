import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

export function CTA() {
  return (
    <section className="px-6 pb-28 pt-10">
      <Reveal className="max-w-6xl mx-auto">
        <div
          className="relative overflow-hidden rounded-[2rem] px-6 py-24 sm:py-28 text-center"
          style={{ background: 'linear-gradient(135deg, #6A3CC4 0%, #52309A 55%, #46267C 100%)' }}
        >
          {/* drifting light mesh for life */}
          <div className="absolute inset-0 pointer-events-none opacity-70">
            <div className="absolute -top-1/3 left-1/4 w-[40rem] h-[40rem] rounded-full animate-mesh"
              style={{ background: 'radial-gradient(circle, rgba(244,167,156,0.28), transparent 60%)' }} />
            <div className="absolute -bottom-1/3 right-1/4 w-[36rem] h-[36rem] rounded-full animate-mesh"
              style={{ background: 'radial-gradient(circle, rgba(180,154,230,0.35), transparent 60%)', animationDelay: '-8s' }} />
          </div>

          <div className="relative">
            <h2 className="font-semibold text-white" style={{ fontSize: 'clamp(2.6rem, 6.5vw, 4.8rem)', letterSpacing: '-0.035em', lineHeight: 1.02 }}>
              Get your time back.
            </h2>
            <p className="mt-6 text-xl max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)' }}>
              Hand your backlog to your production partner. First results in under two minutes.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <a
                href="/app?signup=1"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium text-[15px] bg-white text-plum-700 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                style={{ boxShadow: '0 14px 36px -14px rgba(0,0,0,0.5)' }}
              >
                Start creating free <ArrowRight size={16} />
              </a>
              <a href="#pricing" className="inline-flex items-center gap-1 text-[15px] font-medium text-white/85 hover:text-white transition-colors">
                See pricing ›
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
