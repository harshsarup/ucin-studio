import { Camera, ShoppingBag, Megaphone, Mic2, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const CASES: { Icon: LucideIcon; who: string; line: string; tasks: string }[] = [
  { Icon: Camera,     who: 'Photographers & studios', line: 'Deliver the whole shoot, upscaled and on-brand, overnight — instead of grinding edits for days.', tasks: 'Upscale · Brand-Style · Remove-bg' },
  { Icon: ShoppingBag,who: 'E-commerce & brands',     line: 'Cut out and standardise an entire catalog, then generate fresh on-brand visuals at scale.', tasks: 'Remove-bg · Generate · Upscale' },
  { Icon: Megaphone,  who: 'Agencies & marketers',    line: 'Localise and repurpose a campaign across every market and channel in an afternoon.', tasks: 'Translate · Generate · Summarize' },
  { Icon: Mic2,       who: 'Video & podcast creators',line: 'Subtitles, transcripts and translations for your back catalog — done while you sleep.', tasks: 'Transcribe · Translate · Summarize' },
]

export function UseCases() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-12">
          <div className="eyebrow mb-4">Who it's for</div>
          <h2 className="font-display font-light text-fg leading-[1.06]" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)' }}>
            Built for people who<br /><span className="text-gradient-plum">make things at scale.</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-4">
          {CASES.map((c, i) => (
            <Reveal key={c.who} delay={i * 0.08}>
              <div className="card-hover p-6 h-full flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-plum-500/12 border border-plum-500/25 flex items-center justify-center shrink-0">
                  <c.Icon size={19} className="text-plum-300" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-base font-semibold text-fg mb-1.5">{c.who}</div>
                  <p className="text-sm text-fg-subtle leading-relaxed mb-3">{c.line}</p>
                  <div className="text-[11px] font-mono text-plum-300/80">{c.tasks}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
