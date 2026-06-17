import { FolderUp, Cpu, Download } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const STEPS = [
  { n: '01', Icon: FolderUp, title: 'Send us your folder', body: 'Drag in your shoot, your footage, your catalog — or point us at where it lives. No formats to worry about.' },
  { n: '02', Icon: Cpu,      title: 'We handle the production', body: 'Our AI does the upscaling, cutting, generating and styling — thousands of assets in parallel, in your look.' },
  { n: '03', Icon: Download, title: 'Get finished results', body: 'Review the batch, compare before/after, and download. Pay only for what we delivered.' },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-24 relative">
      <div className="absolute inset-0 bg-plum-glow opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-12">
          <div className="eyebrow mb-4">How it works</div>
          <h2 className="font-display font-light text-fg leading-[1.06]" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)' }}>
            Three steps. <span className="text-gradient-plum">Zero setup.</span>
          </h2>
          <p className="mt-4 text-fg-muted leading-relaxed">
            You never install software, manage infrastructure, or learn a tool. You hand off the
            work — we hand back the results.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="card p-6 h-full relative overflow-hidden">
                <span className="absolute -top-2 -right-1 font-display font-bold text-7xl text-white/[0.03] select-none">{s.n}</span>
                <div className="w-11 h-11 rounded-xl bg-plum-500/12 border border-plum-500/25 flex items-center justify-center mb-4">
                  <s.Icon size={19} className="text-plum-300" strokeWidth={1.75} />
                </div>
                <div className="text-base font-semibold text-fg mb-1.5">{s.title}</div>
                <p className="text-sm text-fg-subtle leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
