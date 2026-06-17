import { Check, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const PAYG = [
  'Every result priced per item',
  '20–40% under Cloudinary, Remove.bg, AWS & DALL·E',
  'No monthly fee — pay only for what we deliver',
  'All tasks unlocked',
]

const POWER = [
  'Everything in Pay-as-you-go',
  'Brand-Style training — your signature look',
  'Included results every month',
  'Member pricing on every job',
  'Priority production queue',
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow mb-4 justify-center flex">Pricing</div>
          <h2 className="font-display font-light text-fg leading-[1.06]" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)' }}>
            Pay for results.<br /><span className="text-gradient">Never for setup.</span>
          </h2>
          <p className="mt-4 text-fg-muted leading-relaxed">
            Start free and pay per outcome. Add a Power Pass when you want your own style and
            member pricing. No contracts, cancel anytime.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* PAYG */}
          <Reveal>
            <div className="card p-7 h-full flex flex-col">
              <div className="text-sm font-semibold text-fg-subtle">Pay as you go</div>
              <div className="mt-2 mb-1">
                <span className="text-4xl font-bold text-fg">₹0</span>
                <span className="text-fg-subtle text-sm"> to start</span>
              </div>
              <p className="text-xs text-fg-subtle mb-6">Then just pay per result — from ₹0.10 each.</p>
              <ul className="space-y-3 mb-7 flex-1">
                {PAYG.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-fg-muted">
                    <Check size={15} className="text-emerald-400 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="/app?signup=1" className="btn-ghost w-full py-3">Start free <ArrowRight size={15} /></a>
            </div>
          </Reveal>

          {/* Power Pass */}
          <Reveal delay={0.1}>
            <div className="card p-7 h-full flex flex-col relative shadow-glow-plum" style={{ borderColor: 'rgba(139,92,246,0.4)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge badge-plum">Most popular</span>
              </div>
              <div className="text-sm font-semibold text-plum-300">Power Pass</div>
              <div className="mt-2 mb-1">
                <span className="text-4xl font-bold text-fg">₹999</span>
                <span className="text-fg-subtle text-sm">/month</span>
              </div>
              <p className="text-xs text-fg-subtle mb-6">For studios shipping on-brand work at volume.</p>
              <ul className="space-y-3 mb-7 flex-1">
                {POWER.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-fg-muted">
                    <Check size={15} className="text-plum-300 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="/app?signup=1&plan=power" className="btn-primary w-full py-3">Get Power Pass <ArrowRight size={15} /></a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="text-center mt-8">
          <p className="text-xs text-fg-faint">
            Bigger studio? <a href="mailto:hello@ucin.in" className="text-plum-300 hover:text-plum-200">Talk to us</a> about volume plans.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
