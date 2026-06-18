import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

function Rise({ children, i = 0 }: { children: ReactNode; i?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.05, ease }}>
      {children}
    </motion.div>
  )
}

const STEPS = [
  {
    n: '01',
    title: 'Connect your work',
    body: 'Drag in a folder, or connect your storage — Amazon S3, Google Drive, or your local machine through the desktop app (run it with a single npx command, no install wizard). Every asset is encrypted on your device before it uploads. Nothing ever leaves in the clear.',
  },
  {
    n: '02',
    title: 'Choose the job — and your style',
    body: 'Pick what you need: upscale, remove backgrounds, generate, transcribe, translate. Then optionally apply a Brand-Style model — a LoRA fine-tune trained once on your past work that captures your colour, grade and composition. From then on your look is applied automatically, with zero prompt-wrangling.',
  },
  {
    n: '03',
    title: 'We run it on the compute network',
    body: 'Your batch is split and dispatched in parallel across UCIN’s SLA-backed compute network. The Preemption Shield checkpoints progress and auto-resumes on any interruption, so even a 10,000-file job lands on a committed deadline — guaranteed completion, not best-effort. A week of manual editing finishes overnight.',
  },
  {
    n: '04',
    title: 'Review and deliver',
    body: 'Finished assets arrive in a gallery. Compare before and after, approve, and download — or push results straight back to your storage. You pay per delivered result, priced from real compute cost, never a per-call API markup.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-28 sm:py-36">
      <div className="max-w-5xl mx-auto px-6">
        <Rise>
          <div className="eyebrow mb-5">How it works</div>
          <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)' }}>
            From folder to finished.
          </h2>
          <p className="mt-6 text-xl text-fg-muted leading-relaxed max-w-2xl">
            You work at the top of the stack. Underneath, every job moves through the same
            pipeline — encrypted, dispatched across the compute network, and delivered. Here is what
            actually happens.
          </p>
        </Rise>

        <div className="mt-16 space-y-px">
          {STEPS.map((s, i) => (
            <Rise key={s.n} i={i}>
              <div className="grid sm:grid-cols-[6rem_1fr] gap-3 sm:gap-8 py-9 border-t border-canvas-border">
                <div className="mono text-sm text-accent pt-1">{s.n}</div>
                <div>
                  <h3 className="display text-fg" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)', fontWeight: 600 }}>{s.title}</h3>
                  <p className="mt-3 text-[17px] text-fg-muted leading-relaxed max-w-2xl">{s.body}</p>
                </div>
              </div>
            </Rise>
          ))}
        </div>

        <Rise i={4}>
          <p className="mt-10 mono text-[12px] text-fg-faint leading-relaxed border-t border-canvas-border pt-6">
            Best-in-class open models — Real-ESRGAN · Whisper v3 · FLUX · NLLB-200 — run on
            India-resident compute. Your files and your trained styles stay yours, and never train a
            public model.
          </p>
        </Rise>
      </div>
    </section>
  )
}
