import { Reveal } from '@/components/Reveal'
import { GALLERY } from '@/lib/samples'

export function BrandStyle() {
  return (
    <section id="brand-style" className="px-6 py-12">
      <div className="max-w-6xl mx-auto rounded-[2rem] border px-8 sm:px-14 py-16 sm:py-20"
        style={{ background: 'linear-gradient(160deg, #F6F1FC 0%, #F7F5F1 60%)', borderColor: '#E7DBF6' }}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <Reveal>
            <div className="eyebrow mb-5">Brand-Style</div>
            <h2 className="h-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
              It always<br /><span className="text-plum">looks like you.</span>
            </h2>
            <p className="mt-6 text-lg text-fg-muted leading-relaxed">
              Send us your best work and we learn your aesthetic — your colour, your grade, your
              composition. From then on, every visual we generate and every batch we finish comes
              back unmistakably yours. The consistency a brand needs, at the scale a studio runs.
            </p>
            <a href="/app?signup=1" className="link-arrow mt-7">Train your style ›</a>
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
              <span className="text-fg-faint">4,812 frames styled</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
