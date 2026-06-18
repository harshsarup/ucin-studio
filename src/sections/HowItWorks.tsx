import { Reveal } from '@/components/Reveal'

const STEPS = [
  { n: '1', title: 'Bring your work', body: 'Drop in a folder — shoot, footage, catalog. Assets are encrypted client-side before a single byte uploads to India-resident storage.' },
  { n: '2', title: 'We run the production', body: 'Your batch is dispatched across our SLA-backed GPU pool and processed in parallel, in your style. Guaranteed completion, not best-effort.' },
  { n: '3', title: 'Get it back finished', body: 'Review the batch, compare before and after, download. You pay per delivered result — derived from real compute, not a per-call API fee.' },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="max-w-3xl mb-16">
          <div className="eyebrow mb-5">How it works</div>
          <h2 className="h-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
            You send the work.<br /><span className="text-accent">We send it back finished.</span>
          </h2>
          <p className="mt-6 text-lg text-fg-muted leading-relaxed max-w-xl">
            No pipelines to build, no models to wrangle, no compute to babysit. You never
            manage the technology — that's the entire point of a production partner.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="md:border-l border-canvas-border md:pl-7">
                <div className="text-accent font-mono text-sm mb-4">0{s.n}</div>
                <div className="text-xl font-semibold text-fg mb-2.5">{s.title}</div>
                <p className="text-[15px] text-fg-subtle leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
