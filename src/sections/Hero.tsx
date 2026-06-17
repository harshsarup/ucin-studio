import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BEFORE_AFTER } from '@/lib/samples'

export function Hero() {
  const sample = BEFORE_AFTER[0]
  return (
    <section id="top" className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-plum-glow" />
      <div className="absolute inset-0 bg-warm-glow" />
      <div className="absolute inset-0 grid-texture opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          {/* Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="eyebrow mb-5"
            >
              <Sparkles size={13} /> Your AI production partner
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display font-light text-fg leading-[1.04]"
              style={{ fontSize: 'clamp(2.5rem, 5.6vw, 4.3rem)' }}
            >
              Hand off the<br />
              post-production.<br />
              <span className="text-gradient font-normal">Keep creating.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.14 }}
              className="mt-6 text-lg text-fg-muted leading-relaxed max-w-xl"
            >
              We handle the AI, the technology and the heavy lifting — upscaling, cut-outs,
              generation, transcription, translation — across thousands of assets, in your
              signature style. You stay focused on the work only you can do.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a href="/app?signup=1" className="btn-primary px-6 py-3 text-[15px]">
                Start creating free <ArrowRight size={16} />
              </a>
              <a href="#handle" className="btn-ghost px-6 py-3 text-[15px]">See what we handle</a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-fg-subtle"
            >
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-400" /> Pay per result — cheaper than your tools</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-400" /> No setup, no software</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-400" /> Encrypted &amp; India-resident</span>
            </motion.div>
          </div>

          {/* Before/after visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-plum-glow blur-2xl opacity-60" />
            <div className="relative card p-2 shadow-glow-plum">
              <BeforeAfter before={sample.before} after={sample.after} />
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs text-fg-subtle">{sample.caption}</span>
                <span className="badge badge-emerald">−25% vs Cloudinary</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 card px-3.5 py-2.5 hidden sm:flex items-center gap-2 animate-float">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-fg-muted font-mono">5,000 photos · 2.1 min</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
