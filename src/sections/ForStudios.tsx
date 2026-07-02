import { Infinity as InfinityIcon, Zap, Award, BadgeCheck, Wallet, ShieldCheck, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const OUTCOMES = [
  { icon: InfinityIcon, title: 'Say yes to more', desc: 'Unlimited production capacity — take on the events, clients and seasons you used to turn away.' },
  { icon: Zap, title: 'Win on speed', desc: 'Same-day sneak peeks and finals on time — the reputation that drives referrals and repeat bookings.' },
  { icon: Award, title: 'Pitch bigger', desc: 'Confidentiality, white-label delivery and consistent quality — land premium clients you couldn’t service before.' },
  { icon: BadgeCheck, title: 'Reliability you can promise', desc: 'SLA-backed turnaround and uptime — a commitment you can put in a client contract, not a best-effort tool.' },
  { icon: Wallet, title: 'Protect your margins', desc: 'Fixed price per event, known costs — price your work with confidence and keep what you earn.' },
  { icon: ShieldCheck, title: 'Grow without risk', desc: 'Pay per event, no capex — your cost scales with your revenue, never ahead of it.' },
]

export function ForStudios() {
  return (
    <section id="studios" className="py-24 md:py-32 bg-canvas-sunk">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-12">
          <div className="eyebrow mb-5">The business case</div>
          <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)' }}>
            <span className="text-grad">Supercharge</span> your business.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">
            A faster workflow is table stakes. We grow what your business can do — every feature a
            lever on your output, your reputation and your margins.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9">
          {OUTCOMES.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.05}>
              <div className="flex gap-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0" style={{ background: 'var(--tint)' }}>
                  <o.icon size={18} className="text-accent" />
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold text-fg">{o.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-fg-subtle">{o.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* two doors */}
        <div className="grid md:grid-cols-2 gap-5 mt-14">
          <div className="card p-8 transition-transform duration-200 hover:-translate-y-0.5">
            <div className="eyebrow mb-4">For studios &amp; agencies</div>
            <h3 className="display text-2xl text-fg">Scale your studio, not your stress.</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-fg-subtle">
              A partnership, not a login — a shared team workspace with house-style controls,
              SLA-backed delivery, confidentiality and white-label, plus dedicated onboarding and a
              named point of contact.
            </p>
            <a href="/contact?topic=studio" className="link-arrow mt-5">Talk to our studio team <ArrowRight size={15} /></a>
          </div>
          <div className="card p-8 transition-transform duration-200 hover:-translate-y-0.5">
            <div className="eyebrow mb-4">For creators &amp; influencers</div>
            <h3 className="display text-2xl text-fg">Studio results, solo.</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-fg-subtle">
              Access, speed and pay-per-use — finish like a studio without the capex or the hardware.
              Grade, generate and caption for every channel, the moment the content drops.
            </p>
            <a href="/app?signup=1" className="link-arrow mt-5">Start free <ArrowRight size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
