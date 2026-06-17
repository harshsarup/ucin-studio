import { Reveal } from '@/components/Reveal'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BEFORE_AFTER } from '@/lib/samples'

export function Showcase() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 grid-texture opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-12">
          <div className="eyebrow mb-4">Drag to compare</div>
          <h2 className="font-display font-light text-fg leading-[1.06]" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)' }}>
            The output speaks<br /><span className="text-gradient">for itself.</span>
          </h2>
          <p className="mt-4 text-fg-muted leading-relaxed">
            Real results, at batch scale. Drag the handle on any of these to see the difference.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {BEFORE_AFTER.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1}>
              <div className="card p-2">
                <BeforeAfter before={s.before} after={s.after} />
                <div className="px-3 py-2.5">
                  <div className="text-sm font-semibold text-fg">{s.label}</div>
                  <div className="text-xs text-fg-subtle mt-0.5">{s.caption}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
