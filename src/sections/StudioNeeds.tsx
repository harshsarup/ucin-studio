import { TrendingUp, Clock, Sparkles, Wallet, Lock, Hand, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

/** Researched against how creative studios actually work: their bottleneck is
 *  post-production volume, consistency, turnaround, margin, IP safety and keeping
 *  creative control. Each need → how we fulfil it as their production partner. */
const NEEDS: { Icon: LucideIcon; need: string; body: string }[] = [
  {
    Icon: TrendingUp,
    need: 'Take on more work — without hiring',
    body: 'We are the elastic post-production team you don’t have to staff. Scale to thousands of assets a day, then back down, with no editors to onboard or bench.',
  },
  {
    Icon: Clock,
    need: 'Hit every deadline',
    body: 'Overnight batches finish in minutes. Deliver while the brief is still warm and turn faster than studios still editing by hand.',
  },
  {
    Icon: Sparkles,
    need: 'Stay perfectly on-brand at scale',
    body: 'Your Brand-Style is applied automatically, so a 5,000-asset job is as consistent as a single hero frame. No drift, no manual matching.',
  },
  {
    Icon: Wallet,
    need: 'Protect your margins',
    body: 'Per-result pricing runs well under freelance editors and the stack of tools you pay for today. Post stops eating the project.',
  },
  {
    Icon: Lock,
    need: 'Honour every NDA',
    body: 'Assets are encrypted before they leave the machine and processed on India-resident compute. Client IP stays in-country and never trains a public model.',
  },
  {
    Icon: Hand,
    need: 'Keep creative control',
    body: 'We take the repetitive production work. The creative calls — the edit, the look, the final cut — stay entirely yours.',
  },
]

export function StudioNeeds() {
  return (
    <section id="studios" className="py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="max-w-3xl mb-16">
          <div className="eyebrow mb-5">Built for studios</div>
          <h2 className="h-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
            We fit how studios<br /><span className="text-accent">actually work.</span>
          </h2>
          <p className="mt-6 text-lg text-fg-muted leading-relaxed max-w-xl">
            Your bottleneck isn’t ideas — it’s the hours that disappear into post. We slot in as
            the part of your team that absorbs all of it, so the studio can keep creating.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {NEEDS.map((n, i) => (
            <Reveal key={n.need} delay={(i % 3) * 0.07}>
              <div className="h-9 w-9 rounded-lg border border-canvas-border bg-canvas-tint flex items-center justify-center mb-4">
                <n.Icon size={16} className="text-accent" strokeWidth={1.75} />
              </div>
              <div className="text-[15px] font-semibold text-fg mb-2">{n.need}</div>
              <p className="text-[15px] text-fg-muted leading-relaxed">{n.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
