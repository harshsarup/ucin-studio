import { useRef, useState, useCallback, useEffect } from 'react'
import { useInView } from 'framer-motion'

/** Drag-to-reveal before/after slider. Auto-sweeps once on first view to invite
 *  interaction — the signature creative-AI gesture, professionally restrained. */
export function BeforeAfter({
  before, after, beforeLabel = 'Before', afterLabel = 'After', beforeFilter, noSweep = false,
}: { before: string; after: string; beforeLabel?: string; afterLabel?: string; beforeFilter?: string; noSweep?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)
  const touched = useRef(false)
  const inView = useInView(ref, { once: true, margin: '-90px' })

  const update = useCallback((clientX: number) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }, [])

  // one-time invitation sweep (cancels the moment the user touches it)
  useEffect(() => {
    if (!inView || noSweep) return
    const keys = [50, 80, 20, 50]
    const dur = 1700, seg = dur / (keys.length - 1)
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      if (touched.current) return
      const t = now - start
      if (t >= dur) { setPos(50); return }
      const i = Math.min(keys.length - 2, Math.floor(t / seg))
      const lt = (t - i * seg) / seg
      const e = lt < 0.5 ? 2 * lt * lt : 1 - Math.pow(-2 * lt + 2, 2) / 2
      setPos(keys[i] + (keys[i + 1] - keys[i]) * e)
      raf = requestAnimationFrame(tick)
    }
    const id = setTimeout(() => { raf = requestAnimationFrame(tick) }, 350)
    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [inView])

  const onDown = (x: number) => { touched.current = true; dragging.current = true; update(x) }

  return (
    <div
      ref={ref}
      style={{ borderColor: 'var(--border)' }}
      className="group relative w-full aspect-[4/3] overflow-hidden rounded-2xl select-none cursor-ew-resize border"
      onMouseDown={(e) => onDown(e.clientX)}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => { dragging.current = false }}
      onMouseLeave={() => { dragging.current = false }}
      onTouchStart={(e) => onDown(e.touches[0].clientX)}
      onTouchMove={(e) => update(e.touches[0].clientX)}
    >
      <img src={after} alt={afterLabel} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <span className="absolute top-3 right-3 mono text-[10px] font-medium uppercase tracking-[0.12em] px-2.5 py-1 text-white"
        style={{ background: '#0A0A0A' }}>{afterLabel}</span>

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt={beforeLabel} loading="lazy" decoding="async" className="absolute inset-0 h-full object-cover max-w-none"
          style={{ width: ref.current?.clientWidth ?? '100%', filter: beforeFilter }} draggable={false} />
        <span className="absolute top-3 left-3 mono text-[10px] font-medium uppercase tracking-[0.12em] px-2.5 py-1"
          style={{ background: '#FFFFFF', color: '#0A0A0A' }}>{beforeLabel}</span>
      </div>

      <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{ left: `${pos}%`, boxShadow: '0 0 12px rgba(0,0,0,0.35)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-none bg-white shadow-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  )
}
