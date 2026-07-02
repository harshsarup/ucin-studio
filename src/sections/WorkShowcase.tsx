import { Reveal } from '@/components/Reveal'
import { pxSrc } from '@/lib/samples'

/**
 * "Proof, not promises." — a small, curated stock gallery (not a bloated wall),
 * with a hover reveal (zoom + gradient + caption). Swap for real UCIN output later.
 */
const TILES = [
  { id: '10442714', tag: 'Graded',   caption: 'Warm filmic grade, your look' },
  { id: '3067766',  tag: 'Enhanced', caption: 'True colour, clean skies' },
  { id: '15222306', tag: 'Upscaled', caption: 'Low-res → print-ready 4K' },
  { id: '36103492', tag: 'Restored', caption: 'Faded → restored & sharp' },
]

export function WorkShowcase() {
  return (
    <section id="work" className="py-24 md:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">The work</div>
            <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)' }}>
              <span className="text-grad">Proof,</span> not promises.
            </h2>
          </div>
          <p className="md:text-right md:max-w-xs text-[15px] leading-relaxed text-fg-subtle">
            Thousands of finished assets — culled, graded, upscaled, cut out, generated and restored.
            Every frame, in your style.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TILES.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <div className="group relative overflow-hidden rounded-xl aspect-[4/3]">
                <img src={pxSrc(t.id)} alt={t.tag} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(to top, rgba(10,16,32,0.80), rgba(10,16,32,0.05) 55%)' }} />
                <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white" style={{ background: 'rgba(10,16,32,0.55)', backdropFilter: 'blur(4px)' }}>
                  {t.tag}
                </span>
                <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-white text-[13px] font-medium leading-snug">
                  {t.caption}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
