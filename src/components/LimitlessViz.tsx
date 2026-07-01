import { motion, useReducedMotion } from 'framer-motion'
import { User, Cpu } from 'lucide-react'

/**
 * Reframe value: editing stops being the ceiling on your business. One event
 * takes ~a week to edit; finished overnight on UCIN — so you grow at the pace
 * you shoot, not the pace you can edit.
 */
export function LimitlessViz() {
  const reduced = useReducedMotion()
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(closest-side, rgba(124,79,255,0.13), transparent 72%)' }} />

      <div className="relative z-10 rounded-2xl border bg-canvas-card p-5 sm:p-6" style={{ borderColor: 'var(--border)', boxShadow: '0 30px 70px -30px var(--shadow)' }}>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-fg">One wedding · 1,800 photos</span>
          <span className="mono text-[10px] uppercase tracking-[0.12em] text-fg-faint">to edit</span>
        </div>

        {/* editing it yourself */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[12px] text-fg-subtle"><User size={13} /> You, editing</span>
            <span className="mono text-[11px] text-fg-faint">~ a week</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--sunk)' }}>
            <motion.div className="h-full rounded-full" style={{ background: 'var(--fg-faint)' }}
              initial={{ width: '0%' }} whileInView={{ width: '14%' }} viewport={{ once: true, amount: 0.6 }}
              transition={reduced ? { duration: 0 } : { duration: 1.1, ease: 'easeOut' }} />
          </div>
        </div>

        {/* UCIN */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-fg"><Cpu size={13} className="text-accent" /> On UCIN</span>
            <span className="mono text-[11px] font-semibold" style={{ color: 'var(--accent-ink)' }}>overnight</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--sunk)' }}>
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #7C4FFF, #A855F7)' }}
              initial={{ width: '0%' }} whileInView={{ width: '100%' }} viewport={{ once: true, amount: 0.6 }}
              transition={reduced ? { duration: 0 } : { duration: 1.3, ease: 'easeOut', delay: 0.15 }} />
          </div>
          <div className="mt-3 flex items-center gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }}
                animate={reduced ? {} : { opacity: [0.3, 1, 0.3] }} transition={reduced ? {} : { duration: 1.4, repeat: Infinity, delay: i * 0.07 }} />
            ))}
            <span className="mono text-[9px] uppercase tracking-[0.1em] text-fg-faint ml-2">the whole network, in parallel</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 text-center">
        <div className="mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Finish editing an event — overnight</div>
        <div className="mono text-[10px] uppercase tracking-[0.12em] text-fg-faint mt-1.5">Grow as fast as you can shoot — not as fast as you can edit</div>
      </div>
    </div>
  )
}
