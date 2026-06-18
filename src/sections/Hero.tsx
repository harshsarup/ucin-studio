import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BEFORE_AFTER } from '@/lib/samples'

const ease = [0.22, 1, 0.36, 1] as const
const SPECS = ['SLA-backed compute', 'India-resident', 'Batch-native', 'Brand-Style LoRA']

export function Hero() {
  const sample = BEFORE_AFTER[0]
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 80])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04])

  return (
    <section id="top" ref={ref} className="relative pt-36 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,black,transparent)]" />
      <div className="absolute inset-x-0 top-0 h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 0%, rgba(106,60,196,0.06), transparent 72%)' }} />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
          className="eyebrow mb-7"
        >
          <span className="dot" /> Post-production partner · powered by UCIN compute
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.05, ease }}
          className="display"
          style={{ fontSize: 'clamp(3.2rem, 8.5vw, 6.6rem)' }}
        >
          Make the work.<br />
          <span style={{ color: 'var(--accent)' }}>We&apos;ll finish it.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.16, ease }}
          className="mt-8 text-xl text-fg-muted leading-relaxed max-w-2xl mx-auto"
        >
          UCIN Studio is the post-production team inside your studio. We upscale, cut out, generate
          and transcribe — and apply your signature style, trained once as a{' '}
          <span className="text-fg font-medium">Brand-Style</span> model — across thousands of assets,
          finished overnight on UCIN&apos;s SLA-backed compute network.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.26, ease }}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
        >
          <a href="/app?signup=1" className="btn-primary">Start creating free <ArrowRight size={16} /></a>
          <a href="#work" className="link-arrow">See the work ›</a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.34, ease }}
          className="mt-5 text-[13px] text-fg-faint"
        >
          In your browser — or a desktop app (<span className="mono">npx ucin-studio</span>) for large local libraries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.42, ease }}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mono text-[12px] text-fg-subtle"
        >
          {SPECS.map((s, i) => (
            <span key={s} className="flex items-center gap-3">
              {i > 0 && <span className="text-fg-faint">/</span>}{s}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div style={{ y, scale }} className="relative max-w-4xl mx-auto px-6 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease }}
        >
          <BeforeAfter before={sample.before} after={sample.after} />
          <div className="mt-4 text-center mono text-[13px] text-fg-subtle">{sample.caption}</div>
        </motion.div>
      </motion.div>
    </section>
  )
}
