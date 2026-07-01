import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'

const COLS = 8
const CELLS = 32

/**
 * The moat — NOT the style model (that's table stakes / Imagen's pitch). The
 * defensible edge is orchestrated compute: idle GPUs across the network, tapped
 * into one interface. Animation shows idle capacity lighting up as it's used.
 */
export function WorkGallery() {
  const reduced = useReducedMotion()
  return (
    <section id="moat" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal>
          <div className="eyebrow mb-5">The moat</div>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4.6vw, 3.6rem)' }}>
            The moat isn&apos;t the model. <span className="text-grad">It&apos;s the compute.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted max-w-md">
            Style models are table stakes — bring any, or open-source, no lock-in. The edge you
            can&apos;t buy is the compute beneath them.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-fg-subtle max-w-md">
            Idle GPUs across the network, orchestrated into one interface — studio-grade speed and
            scale at a fraction of owning it. The more it runs, the sharper the routing, and the
            further ahead it pulls.
          </p>
        </Reveal>

        {/* orchestration panel — idle capacity lighting up as it's tapped */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border bg-canvas-card p-5 sm:p-6" style={{ borderColor: 'var(--border)', boxShadow: '0 30px 70px -30px var(--shadow)' }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Idle GPUs · orchestrated</span>
              <span className="flex items-center gap-1.5 mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} /> Live
              </span>
            </div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
              {Array.from({ length: CELLS }).map((_, i) => {
                const r = Math.floor(i / COLS), c = i % COLS
                return (
                  <motion.div
                    key={i}
                    className="aspect-square rounded-[3px]"
                    style={{ background: 'rgba(124,79,255,0.12)' }}
                    animate={reduced ? { backgroundColor: 'rgba(124,79,255,0.55)' } : { backgroundColor: ['rgba(124,79,255,0.10)', 'rgba(124,79,255,0.95)', 'rgba(124,79,255,0.10)'] }}
                    transition={reduced ? {} : { duration: 2.6, repeat: Infinity, delay: (r + c) * 0.12, ease: 'easeInOut' }}
                  />
                )
              })}
            </div>
            <div className="mt-4 mono text-[10px] uppercase tracking-[0.12em] text-fg-faint">
              Tapping idle capacity across providers → your job, in minutes
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
