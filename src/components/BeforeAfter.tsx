import { useRef, useState, useCallback } from 'react'

/** Drag-to-reveal before/after slider — the signature creative-AI interaction. */
export function BeforeAfter({
  before, after, beforeLabel = 'Before', afterLabel = 'After',
}: { before: string; after: string; beforeLabel?: string; afterLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const update = useCallback((clientX: number) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const p = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(0, Math.min(100, p)))
  }, [])

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border border-canvas-border select-none cursor-ew-resize"
      onMouseDown={(e) => { dragging.current = true; update(e.clientX) }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => { dragging.current = false }}
      onMouseLeave={() => { dragging.current = false }}
      onTouchStart={(e) => update(e.touches[0].clientX)}
      onTouchMove={(e) => update(e.touches[0].clientX)}
    >
      {/* After (full) */}
      <img src={after} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <span
        className="absolute top-3 right-3 text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(139,92,246,0.85)', color: '#fff', backdropFilter: 'blur(4px)' }}
      >
        {afterLabel}
      </span>

      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={before} alt={beforeLabel}
          className="absolute inset-0 h-full object-cover max-w-none"
          style={{ width: ref.current?.clientWidth ?? '100%' }}
          draggable={false}
        />
        <span
          className="absolute top-3 left-3 text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(8,7,12,0.7)', color: '#C3BBD0', backdropFilter: 'blur(4px)' }}
        >
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white/80" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6A3CC4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  )
}
