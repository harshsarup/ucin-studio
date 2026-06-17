import { Reveal } from '@/components/Reveal'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BEFORE_AFTER } from '@/lib/samples'

export function Showcase() {
  return (
    <section className="py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="max-w-3xl mb-16">
          <div className="eyebrow mb-5">The work</div>
          <h2 className="h-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
            Proof, not promises.
          </h2>
          <p className="mt-6 text-lg text-fg-muted leading-relaxed max-w-xl">
            Real output, at batch scale. Drag any handle to see the difference.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {BEFORE_AFTER.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1}>
              <BeforeAfter before={s.before} after={s.after} />
              <div className="mt-4">
                <div className="text-[15px] font-semibold text-fg">{s.label}</div>
                <div className="text-sm text-fg-subtle mt-0.5">{s.caption}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
