import { useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const COLS = 12
const COUNT = 96

/**
 * A dense wall of frames that grade (grayscale → colour) in a diagonal wave when
 * scrolled in — expresses volume + the "grade the whole batch" function.
 */
export function VolumeGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const on = inView || reduced

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden border p-2.5" style={{ borderColor: 'var(--border)', background: 'var(--card)', boxShadow: '0 24px 60px -30px var(--shadow)' }}>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
        {Array.from({ length: COUNT }).map((_, i) => {
          const row = Math.floor(i / COLS)
          const col = i % COLS
          const delay = reduced ? 0 : (row + col) * 45
          return (
            <img
              key={i}
              src={`https://picsum.photos/seed/vol${i}/80/80`}
              alt=""
              loading="lazy"
              className="aspect-square w-full object-cover rounded-[3px]"
              style={{ filter: on ? 'grayscale(0)' : 'grayscale(1) brightness(0.82)', transition: 'filter .55s ease', transitionDelay: `${delay}ms` }}
            />
          )
        })}
      </div>
      <div className="flex items-center justify-between px-1 pt-2.5 mono text-[10px] uppercase tracking-[0.12em] text-fg-faint">
        <span>1,842 frames</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} /> Grading in your style…</span>
      </div>
    </div>
  )
}
