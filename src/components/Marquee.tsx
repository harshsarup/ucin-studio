const ITEMS = [
  'Upscale to 4K', 'Remove backgrounds', 'Generate visuals', 'Transcribe audio',
  'Translate copy', 'Brand-Style', 'Auto-tag & sort', 'Summarize', 'Detect objects',
]

/** A slow, muted ticker of capabilities — quiet motion, edges faded. */
export function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="relative py-6 overflow-hidden border-y border-canvas-border" style={{ background: '#F1EDE6' }}>
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #F1EDE6 0%, transparent 12%, transparent 88%, #F1EDE6 100%)' }}
      />
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-6 text-[15px] font-medium text-fg-subtle">
            {t}
            <span className="text-plum-300">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
