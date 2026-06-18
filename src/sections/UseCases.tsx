import { Reveal } from '@/components/Reveal'

const CASES: { who: string; line: string }[] = [
  { who: 'Photographers', line: 'Deliver the whole shoot — upscaled, graded, on-brand — overnight, instead of grinding edits for days.' },
  { who: 'E-commerce brands', line: 'Cut out and standardise an entire catalog, then generate fresh on-brand visuals at scale.' },
  { who: 'Agencies', line: 'Localise and repurpose a campaign across every market and channel in a single afternoon.' },
  { who: 'Video & podcast creators', line: 'Subtitles, transcripts and translations for your entire back catalog — done while you sleep.' },
]

export function UseCases() {
  return (
    <section className="py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="max-w-3xl mb-16">
          <div className="eyebrow mb-5">Who it's for</div>
          <h2 className="h-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
            For people who make<br /><span className="text-accent">at volume.</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-12">
          {CASES.map((c, i) => (
            <Reveal key={c.who} delay={i * 0.08}>
              <div className="border-t border-canvas-border pt-6">
                <div className="text-xl font-semibold text-fg mb-2.5">{c.who}</div>
                <p className="text-[15px] text-fg-subtle leading-relaxed max-w-md">{c.line}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
