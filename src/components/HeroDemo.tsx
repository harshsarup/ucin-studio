import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check, Sparkles, Wand2, ChevronDown } from 'lucide-react'

/**
 * Hero centerpiece — the assistant in motion: the brief types itself in, the
 * steps plan out, and a fixed quote counts up and locks. Loops. Reduced-motion
 * settles to the finished state.
 */
const BRIEF = '1,800 wedding photos — cull, warm grade, retouch the heroes. Need it Friday.'
const STEPS = [
  { label: 'Cull the blinks & dupes', detail: '1,800 frames', amount: 1350 },
  { label: 'Grade in your style', detail: '1,200 keepers', amount: 12000 },
  { label: 'Retouch the heroes', detail: '40 photos', amount: 1200 },
]
const TOTAL = 14585
const ease = [0.16, 1, 0.3, 1] as const
const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

type Phase = 'type' | 'plan' | 'quote'

export function HeroDemo() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('type')
  const [typed, setTyped] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!reduced) return
    setTyped(BRIEF.length); setPhase('quote'); setCount(TOTAL)
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    if (phase === 'type') {
      if (typed < BRIEF.length) {
        const id = setTimeout(() => setTyped((n) => n + 1), 26)
        return () => clearTimeout(id)
      }
      const id = setTimeout(() => setPhase('plan'), 550)
      return () => clearTimeout(id)
    }
    if (phase === 'plan') {
      const id = setTimeout(() => setPhase('quote'), 1500)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => { setCount(0); setTyped(0); setPhase('type') }, 5200)
    return () => clearTimeout(id)
  }, [phase, typed, reduced])

  useEffect(() => {
    if (reduced || phase !== 'quote') return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100)
      setCount(Math.round(TOTAL * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase, reduced])

  const showPlan = phase === 'plan' || phase === 'quote'
  const showQuote = phase === 'quote'

  return (
    <div className="w-full" style={{ filter: 'drop-shadow(0 40px 70px rgba(10,16,32,0.30))' }}>
      <div className="rounded-2xl border overflow-hidden bg-white" style={{ borderColor: 'rgba(10,16,32,0.08)' }}>
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
          <span className="mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">New shoot · Photographer</span>
          <span className="flex items-center gap-1.5 mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} /> Assistant
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* assistant prompt (animated) */}
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5" style={{ background: 'var(--surface)' }}>
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-fg">
                <Wand2 size={14} className="text-accent" /> Describe it — the assistant plans it
              </span>
              <ChevronDown size={15} className="text-fg-faint" style={{ transform: 'rotate(180deg)' }} />
            </div>
            <div className="border-t px-3.5 py-3 text-[14px] leading-relaxed text-fg min-h-[58px]" style={{ borderColor: 'var(--border)' }}>
              {typed === 0 && phase === 'type' ? <span className="text-fg-faint">Describe the job…</span> : BRIEF.slice(0, typed)}
              {!reduced && phase === 'type' && <span className="inline-block w-[2px] h-[1.05em] align-[-0.15em] ml-0.5" style={{ background: 'var(--accent)' }} />}
            </div>
          </div>

          {/* plan */}
          <AnimatePresence>
            {showPlan && (
              <motion.div initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
                <div className="flex items-center gap-1.5 mono text-[10px] uppercase tracking-[0.16em] text-fg-faint mb-2.5">
                  <Sparkles size={12} /> Planned for you
                </div>
                <div className="rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                  {STEPS.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={reduced ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: reduced ? 0 : 0.12 * i, ease }}
                      className="flex items-center justify-between gap-3 px-3.5 py-2.5 border-b last:border-b-0"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="min-w-0">
                        <div className="text-[13.5px] text-fg">{s.label}</div>
                        <div className="mono text-[11px] text-fg-faint">{s.detail}</div>
                      </div>
                      <div className="mono text-[13px] text-fg-subtle shrink-0">{inr(s.amount)}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* quote */}
          <AnimatePresence>
            {showQuote && (
              <motion.div initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease }}
                className="rounded-lg border p-4" style={{ borderColor: 'var(--accent)', background: 'var(--tint)' }}>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">Your fixed quote</div>
                    <div className="display text-3xl sm:text-4xl text-fg mt-1">{inr(count)}</div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>
                    <Check size={12} /> Fixed — never billed above
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
