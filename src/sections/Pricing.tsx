import { Check, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const PAYG = [
  'Every result priced per item',
  '20–40% under Cloudinary, Remove.bg, AWS & DALL·E',
  'No monthly fee — pay only for what we deliver',
  'Every task unlocked',
]

const POWER = [
  'Everything in pay-as-you-go',
  'Brand-Style — your signature look, trained',
  'Included results every month',
  'Member pricing on every job',
  'Priority production',
]

export function Pricing() {
  return (
    <section id="pricing" className="py-32 sm:py-40">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="eyebrow mb-5 justify-center flex">Pricing</div>
          <h2 className="h-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
            You pay for finished work.<br /><span className="text-accent">Nothing else.</span>
          </h2>
          <p className="mt-6 text-lg text-fg-muted leading-relaxed">
            Start free and pay per result. Add a Power Pass when you want your own style and
            member pricing. No contracts.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          {/* PAYG */}
          <Reveal>
            <div className="card p-8 h-full flex flex-col">
              <div className="text-sm font-medium text-fg-subtle">Pay as you go</div>
              <div className="mt-3 mb-1">
                <span className="text-5xl font-semibold text-fg tracking-tight">₹0</span>
                <span className="text-fg-subtle"> to start</span>
              </div>
              <p className="text-sm text-fg-subtle mb-8">Then from ₹0.10 per result.</p>
              <ul className="space-y-3.5 mb-8 flex-1">
                {PAYG.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-fg-muted">
                    <Check size={16} className="text-fg-subtle mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="/app?signup=1" className="btn-ghost w-full">Start free</a>
            </div>
          </Reveal>

          {/* Power Pass */}
          <Reveal delay={0.1}>
            <div className="card p-8 h-full flex flex-col" style={{ borderColor: 'var(--tint-border)', background: 'var(--tint)', boxShadow: '0 24px 56px -34px rgba(106,60,196,0.35)' }}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-accent">Power Pass</div>
                <span className="text-xs text-accent font-mono">Most popular</span>
              </div>
              <div className="mt-3 mb-1">
                <span className="text-5xl font-semibold text-fg tracking-tight">₹999</span>
                <span className="text-fg-subtle">/mo</span>
              </div>
              <p className="text-sm text-fg-subtle mb-8">For studios shipping on-brand work at volume.</p>
              <ul className="space-y-3.5 mb-8 flex-1">
                {POWER.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-fg-muted">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="/app?signup=1&plan=power" className="btn-primary w-full">Get Power Pass <ArrowRight size={15} /></a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="text-center mt-8">
          <p className="text-sm text-fg-faint">
            Bigger studio? <a href="mailto:hello@ucin.in" className="link-arrow">Talk to us ›</a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
