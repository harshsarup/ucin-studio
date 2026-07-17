import { Filter, Palette, Maximize2, Scissors, Sparkles, Wand2 } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { VolumeGrid } from '@/components/VolumeGrid'

const CAPS = [
  { icon: Filter, title: 'Cull', desc: 'Drop blinks, blur and duplicates — keep only the frames worth editing.' },
  { icon: Palette, title: 'Grade in your style', desc: 'Your signature look on every frame. Not a generic LUT — yours.' },
  { icon: Maximize2, title: 'Upscale & restore', desc: '4× sharper with faces restored. Print- and billboard-ready.' },
  { icon: Scissors, title: 'Cut out', desc: 'Hair-level cut-outs across an entire catalog.' },
  { icon: Sparkles, title: 'Retouch', desc: 'Natural skin that keeps its texture — at volume.' },
  { icon: Wand2, title: 'Generate & fill', desc: 'On-brand visuals, object removal and extensions from a prompt.' },
]

export function Services() {
  return (
    <section id="platform" className="py-24 md:py-32 bg-canvas-sunk">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-12">
          <div className="eyebrow mb-5">What we handle</div>
          <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)' }}>Any task. Any look. Any <span className="text-grad">volume.</span></h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-subtle">
            The whole pipeline — weddings, catalogs, campaigns, content — on curated state-of-the-art
            models, or <span className="text-fg">bring your own from HuggingFace</span> (private and
            gated models included — your token stays in your device keychain and runs on an isolated
            node). From culling to final delivery, you keep the craft; we handle the volume.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
          {/* capabilities — two columns */}
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-7">
            {CAPS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <div className="flex gap-3.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0" style={{ background: 'var(--tint)' }}>
                    <c.icon size={19} className="text-accent" />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold text-fg">{c.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-fg-subtle">{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* dense volume grid */}
          <Reveal delay={0.1}><VolumeGrid /></Reveal>
        </div>
      </div>
    </section>
  )
}
