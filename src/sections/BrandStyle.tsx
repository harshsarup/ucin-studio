import { Reveal } from '@/components/Reveal'
import { GALLERY } from '@/lib/samples'

const STATS = [
  { k: 'Weeks → minutes', v: 'manual grading, automated' },
  { k: '1 model, every job', v: 'trained once, reused forever' },
  { k: 'Zero prompt-wrangling', v: 'your look is built in' },
]

export function BrandStyle() {
  return (
    <section id="brand-style" className="px-6 py-12">
      <div className="max-w-6xl mx-auto rounded-[2rem] border px-8 sm:px-14 py-16 sm:py-20"
        style={{ background: 'linear-gradient(160deg, var(--tint) 0%, var(--bg) 65%)', borderColor: 'var(--tint-border)' }}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <Reveal>
            <div className="eyebrow mb-5">Brand-Style · the efficiency unlock</div>
            <h2 className="h-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
              Train your look once.<br /><span className="text-accent">Supercharge every job.</span>
            </h2>
            <p className="mt-6 text-lg text-fg-muted leading-relaxed">
              Send a sample of your best work and we train a private <span className="text-fg font-medium">Brand-Style
              model</span> on it — a LoRA fine-tune that captures your colour, grade and composition.
              From then on, your signature is applied automatically to every batch. What takes your
              editors weeks of frame-by-frame grading happens in minutes, consistently, across thousands
              of assets. That is the unlock: your style at zero marginal effort.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {STATS.map((s) => (
                <div key={s.k} className="border-l-2 pl-3" style={{ borderColor: 'var(--accent)' }}>
                  <div className="text-sm font-semibold text-fg">{s.k}</div>
                  <div className="text-[12px] text-fg-subtle mt-0.5">{s.v}</div>
                </div>
              ))}
            </div>
            <a href="/app?signup=1" className="link-arrow mt-8">Train your style ›</a>
          </Reveal>

          {/* Visual */}
          <Reveal delay={0.15}>
            <div className="grid grid-cols-3 gap-2.5">
              {GALLERY.map((src, i) => (
                <div key={i}
                  className="aspect-square rounded-2xl overflow-hidden border border-canvas-border transition-transform duration-300 hover:scale-[1.04] hover:z-10"
                  style={{ boxShadow: '0 14px 30px -22px rgba(22,19,28,0.4)' }}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-fg-subtle px-1">
              <span>Style: <span className="text-fg font-medium">Aurora Weddings</span></span>
              <span className="mono text-[12px] text-fg-faint">4,812 frames · 2.1 min</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
