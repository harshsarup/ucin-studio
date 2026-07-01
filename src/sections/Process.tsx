import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Reveal } from '@/components/Reveal'

const ease = [0.16, 1, 0.3, 1] as const

const steps = [
  { n: '01', title: 'Build it, or just describe it', desc: 'Pick a preset, or type the job in a sentence — the assistant plans the steps and prices it instantly.' },
  { n: '02', title: 'We learn your look', desc: 'Brand-Style reads your palette, mood and composition from your own edits — and sharpens every shoot.' },
  { n: '03', title: 'We do the grunt work', desc: 'Bulk renders run on SLA-backed compute at the deadline you set — overnight to within the hour.' },
  { n: '04', title: 'Delivered, priced up front', desc: 'Production-ready files land back in your workspace at the fixed price you agreed. Never billed over.' },
]

export function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="how" ref={ref} className="py-24 md:py-32 bg-canvas-sunk">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-14">
          <div className="eyebrow mb-5">How it works</div>
          <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)' }}>
            Four steps to finished.
          </h2>
        </Reveal>

        <div className="border-t" style={{ borderColor: 'var(--fg)' }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
              className="group grid grid-cols-1 md:grid-cols-[auto_1fr_2fr] items-baseline gap-3 md:gap-10 border-b py-8"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="display flex items-center gap-3 text-3xl md:text-4xl text-fg">
                <span className="inline-block h-2.5 w-2.5" style={{ background: 'var(--accent)' }} />
                {step.n}
              </div>
              <h3 className="display text-xl md:text-2xl text-fg">{step.title}</h3>
              <p className="text-[15px] md:text-lg leading-relaxed text-fg-subtle">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
