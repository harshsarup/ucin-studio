import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { SPEED_TIERS } from '@/lib/catalog'

const ease = [0.16, 1, 0.3, 1] as const

const KICKER: Record<string, string> = { flex: 'Standard', core: 'Faster', priority: 'Fastest' }
const INCLUDES: Record<string, string> = {
  flex: 'Best for full events and large catalogs.',
  core: 'Sneak peeks and same-day client turnarounds.',
  priority: 'Urgent hero shots and last-minute deliveries.',
}

/**
 * Pricing — value-first. Per-event, build-your-own-SLA, fixed quote. The exact
 * price is built in the app (we don't broadcast per-item rates on the site).
 */
export function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="pricing" ref={ref} className="py-24 md:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-14">
          <div className="eyebrow mb-5">Pricing</div>
          <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)' }}>
            Pay <span className="text-grad">per event.</span> Never per month.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">
            No subscriptions, no credits to burn. Choose how fast you need it, see one fixed all-in
            price before anything starts — and you&apos;re never billed above it.
          </p>
        </Reveal>

        {/* Build-your-own-SLA: speed tiers (no rates) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SPEED_TIERS.map((s, i) => {
            const featured = s.id === 'core'
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07, ease }}
                className="card p-7"
                style={featured ? { borderColor: 'var(--accent)', background: 'var(--tint)' } : undefined}
              >
                <div className="mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
                  {KICKER[s.id]}{featured && <span style={{ color: 'var(--accent-ink)' }}> · most chosen</span>}
                </div>
                <h3 className="display mt-3 text-2xl text-fg">{s.label}</h3>
                <p className="mt-1.5 text-[15px] text-fg-subtle">{s.promise}</p>
                <p className="mt-5 text-[14px] leading-relaxed text-fg-muted">{INCLUDES[s.id]}</p>
              </motion.div>
            )
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-2 text-[14px] text-fg-subtle">
            <span className="flex items-center gap-1.5"><Check size={16} style={{ color: 'var(--accent-ink)' }} /> Fixed price — never billed above the quote</span>
            <span className="flex items-center gap-1.5"><Check size={16} style={{ color: 'var(--accent-ink)' }} /> Pay only for the work in each event</span>
            <span className="flex items-center gap-1.5"><Check size={16} style={{ color: 'var(--accent-ink)' }} /> Add-ons: private &amp; dedicated, guaranteed deadline, white-label</span>
          </div>
        </Reveal>

        {/* Enterprise — Custom */}
        <Reveal delay={0.15}>
          <div className="card mt-10 flex flex-col md:flex-row md:items-center justify-between gap-6 p-8">
            <div className="max-w-xl">
              <h3 className="display text-2xl text-fg">Enterprise — Custom</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-fg-subtle">
                For agencies and high-volume studios: dedicated capacity, custom SLAs, a Brand-Style
                library across teams, and secure, confidential processing with India data-residency.
              </p>
            </div>
            <a href="/contact?topic=enterprise" className="btn-line shrink-0">Talk to us <ArrowRight size={16} /></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
