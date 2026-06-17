import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BEFORE_AFTER } from '@/lib/samples'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const sample = BEFORE_AFTER[0]
  return (
    <section id="top" className="relative pt-40 pb-24 overflow-hidden">
      {/* one faint identity glow, nothing more */}
      <div
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(139,92,246,0.14), transparent 70%)' }}
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
          className="eyebrow mb-6"
        >
          Your AI production partner
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05, ease }}
          className="h-display"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
        >
          The studio behind<br /><span className="text-plum">your studio.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease }}
          className="mt-7 text-xl text-fg-muted leading-relaxed max-w-2xl mx-auto"
        >
          Hand us the upscaling, the cut-outs, the captions, the grade — every tedious hour
          of post. We finish thousands of assets in your signature style, overnight. You stay
          on the work that's yours alone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease }}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          <a href="/app?signup=1" className="btn-primary">Start creating free <ArrowRight size={16} /></a>
          <a href="#handle" className="link-arrow">See what we handle ›</a>
        </motion.div>
      </div>

      {/* the hero object: a single, large before/after */}
      <motion.div
        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease }}
        className="relative max-w-4xl mx-auto px-6 mt-20"
      >
        <BeforeAfter before={sample.before} after={sample.after} />
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-fg-subtle">
          <span>{sample.caption}</span>
          <span className="text-fg-faint">·</span>
          <span>25% under Cloudinary</span>
        </div>
      </motion.div>
    </section>
  )
}
