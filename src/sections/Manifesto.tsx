import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const STATS = [
  { k: '5,000 assets', v: 'finished overnight' },
  { k: 'Weeks → minutes', v: 'on parallel compute' },
  { k: '20–40% under', v: 'the tools you stack today' },
]

export function Manifesto() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <section className="dark-moment relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-60" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 110%, rgba(124,77,239,0.25), transparent 70%)' }} />

      <div ref={ref} className="relative max-w-5xl mx-auto px-6 py-32 sm:py-44 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease }}
          className="eyebrow mb-8"
        >
          A partner, not a tool
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.08, ease }}
          className="display" style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5rem)' }}
        >
          The hours that vanish<br />into post —{' '}
          <span style={{ color: 'var(--accent)' }}>those are ours now.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.18, ease }}
          className="mt-8 text-xl text-fg-muted leading-relaxed max-w-2xl mx-auto"
        >
          Upscaling, cut-outs, captions, your signature grade. UCIN&apos;s compute network runs it
          all in parallel, so a week of editing finishes overnight. You keep making — we keep finishing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.9, delay: 0.3, ease }}
          className="mt-16 grid sm:grid-cols-3 gap-8 sm:gap-6 max-w-3xl mx-auto"
        >
          {STATS.map((s) => (
            <div key={s.k}>
              <div className="display text-fg" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>{s.k}</div>
              <div className="mt-1.5 mono text-[12px] text-fg-faint">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
