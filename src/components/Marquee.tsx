const ITEMS = [
  'Upscale', 'Cut out', 'Grade', 'Retouch', 'Generate', 'Restore', 'Transcribe', 'Brand-Style',
]

/** Big kinetic type strip — capabilities running edge to edge, plum marks. */
export function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="relative overflow-hidden border-y" style={{ borderColor: 'var(--border)' }}>
      <div className="flex w-max animate-marquee whitespace-nowrap py-4">
        {row.map((t, i) => (
          <span key={i} className="display mx-7 inline-flex items-center gap-7 text-[clamp(1.6rem,3.2vw,2.6rem)] uppercase text-fg">
            {t}
            <span className="inline-block h-2.5 w-2.5" style={{ background: 'var(--accent)' }} />
          </span>
        ))}
      </div>
    </div>
  )
}
