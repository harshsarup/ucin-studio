import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { WORK } from '@/lib/samples'
import { cn } from '@/lib/cn'

const ease = [0.22, 1, 0.36, 1] as const

function Rise({ children, i = 0, className }: { children: ReactNode; i?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const SPAN: Record<string, string> = {
  tall: 'row-span-2',
  wide: 'col-span-2',
  sq:   '',
}

export function Work() {
  return (
    <section id="work" className="py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <Rise>
            <div className="eyebrow mb-4">The work</div>
            <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)' }}>
              This is what<br />we hand back.
            </h2>
          </Rise>
          <Rise i={1}>
            <p className="text-lg text-fg-muted leading-relaxed max-w-sm">
              Thousands of finished assets — upscaled, cut out, generated, restored, graded to your
              style. Every frame, production-ready.
            </p>
          </Rise>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[230px]">
          {WORK.map((w, i) => (
            <Rise key={i} i={i} className={cn('group relative overflow-hidden rounded-2xl', SPAN[w.span])}>
              <img src={w.src} alt={w.tag} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium text-white mono opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'rgba(106,60,196,0.85)', backdropFilter: 'blur(4px)' }}>
                {w.tag}
              </span>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}
