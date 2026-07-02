import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, ShieldCheck, Cpu, FolderSearch, Workflow, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { NetworkViz } from '@/components/NetworkViz'

const STAGES = [
  { icon: FolderSearch, label: 'Detect', sub: 'A new shoot lands in your catalog' },
  { icon: ShieldCheck, label: 'Encrypt on device', sub: 'AES-256 — your keys never leave your machine' },
  { icon: Cpu, label: 'Route to GPUs', sub: 'Intelligently routed across the network' },
  { icon: Sparkles, label: 'Render the pipeline', sub: 'Cull · grade · retouch · upscale · deliver' },
  { icon: Workflow, label: 'Sync results', sub: 'Back into your workflow, on your deadline' },
]

function Pipeline() {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(reduced ? STAGES.length : 0)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setStep((s) => (s + 1) % (STAGES.length + 1)), 1400)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div className="rounded-2xl border bg-canvas-card overflow-hidden" style={{ borderColor: 'var(--border)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)' }}>
      <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
        <span className="mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">How a job runs</span>
        <span className="mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">Secure pipeline</span>
      </div>
      <div className="p-4 sm:p-5">
        {STAGES.map((s, i) => {
          const completed = i < step
          const active = i === step
          return (
            <div key={s.label} className="relative flex items-start gap-3 pb-5 last:pb-0">
              {i < STAGES.length - 1 && (
                <span className="absolute left-[15px] top-8 bottom-1 w-px" style={{ background: completed ? 'var(--accent)' : 'var(--border)' }} />
              )}
              <motion.span
                className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full shrink-0"
                animate={{
                  background: completed || active ? 'var(--accent)' : 'var(--sunk)',
                  scale: active ? 1.08 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {completed ? <Check size={15} color="var(--accent-contrast)" /> : <s.icon size={15} style={{ color: active ? 'var(--accent-contrast)' : 'var(--fg-faint)' }} />}
              </motion.span>
              <div className="pt-1">
                <div className={`text-[14px] font-semibold ${active || completed ? 'text-fg' : 'text-fg-subtle'}`}>{s.label}</div>
                <div className="text-[12.5px] leading-snug text-fg-faint">{s.sub}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * The network, honestly — how a job actually runs (real zero-trust pipeline from
 * detect → encrypt → route → render → sync). No invented live metrics.
 */
export function NetworkShowcase() {
  return (
    <section className="dark-moment relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-50"><NetworkViz /></div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px]" style={{ background: 'radial-gradient(50% 60% at 70% 0%, var(--glow), transparent 72%)' }} />
      <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <Reveal><div className="eyebrow mb-5">The Unified Compute Interface</div></Reveal>
          <Reveal delay={0.05}>
            <h2 className="display" style={{ fontSize: 'clamp(2.1rem, 5vw, 3.8rem)' }}>
              One interface. <span className="text-grad">Unlimited compute.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted max-w-md">
              Your work is encrypted on your device, routed across the Unified Compute Interface, and
              finished on your deadline — overnight to within the hour. Nothing leaves your machine
              in the clear.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 mono text-[11px] uppercase tracking-[0.12em] text-fg-faint">
              <span>On-device encryption</span><span aria-hidden>·</span>
              <span>Intelligent routing</span><span aria-hidden>·</span>
              <span>India-resident</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}><Pipeline /></Reveal>
      </div>
    </section>
  )
}
