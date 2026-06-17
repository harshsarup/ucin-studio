import { Palette, Check, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { GALLERY } from '@/lib/samples'

const POINTS = [
  'Encrypted on your device before a single byte leaves',
  'One style, reused across thousands of jobs',
  'No prompt-wrangling — your look is baked in',
]

export function BrandStyle() {
  return (
    <section id="brand-style" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Copy */}
            <Reveal className="p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-plum"><Palette size={11} /> Brand-Style</span>
                <span className="text-[11px] text-fg-subtle">Your signature look, on every asset</span>
              </div>
              <h2 className="font-display text-fg leading-tight mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>
                Train your style once.<br />
                <span className="text-gradient">We apply it to everything.</span>
              </h2>
              <p className="text-fg-muted leading-relaxed mb-7">
                Send us a set of your best work and we learn your aesthetic — your colour, your
                grade, your composition. Then every visual we generate and every batch we finish
                comes back unmistakably <span className="text-fg font-medium">yours</span>. The
                consistency a brand needs, at the scale a studio runs.
              </p>
              <div className="space-y-3">
                {POINTS.map((p, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-fg-muted">
                    <Check size={15} className="text-emerald-400 mt-0.5 shrink-0" /> {p}
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Visual: generated gallery + style chip */}
            <div className="relative bg-canvas-surface/60 border-t lg:border-t-0 lg:border-l border-canvas-border p-8 sm:p-12">
              <div className="absolute inset-0 grid-texture opacity-40" />
              <Reveal delay={0.15} className="relative">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {GALLERY.map((src, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-canvas-border">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="card p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={13} className="text-plum-300" />
                    <span className="text-xs text-fg-muted">Style: <span className="text-fg font-medium">Aurora Weddings</span></span>
                  </div>
                  <span className="badge badge-emerald text-[10px]">4,812 styled</span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
