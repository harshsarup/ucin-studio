import { Reveal } from '@/components/Reveal'
import { LimitlessViz } from '@/components/LimitlessViz'

/**
 * The reframe — a statement paired with a visual that conveys the promise:
 * one brief spawns an endless fan of finished frames (input → limitless output).
 */
export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-canvas">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
        <div>
          <Reveal><div className="eyebrow mb-8">The reframe</div></Reveal>
          <Reveal delay={0.05}>
            <h2 className="display" style={{ fontSize: 'clamp(2.1rem, 5vw, 4.2rem)' }}>
              You create. We make it <span className="text-grad">limitless.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-[15px] md:text-base leading-relaxed text-fg-muted">
              Your hours, your hardware and your headcount shouldn&apos;t decide how much you can take
              on — whether it&apos;s weddings, catalogs, campaigns or content. We take the production
              off your plate, so your output scales as far as your ambition does.
            </p>
          </Reveal>
        </div>

        {/* visual: one brief → limitless finished output */}
        <Reveal delay={0.1}>
          <LimitlessViz />
        </Reveal>
      </div>
    </section>
  )
}
