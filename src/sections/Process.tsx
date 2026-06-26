import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Upload, Wand2, Zap, Truck } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const ease = [0.16, 1, 0.3, 1] as const

const steps = [
  { icon: Upload, title: 'Upload', desc: 'Drop your raw files via web or CLI. We support all major formats.' },
  { icon: Wand2, title: 'Learn', desc: 'Our Brand‑Style LoRA analyses your colour palette, mood, and composition.' },
  { icon: Zap, title: 'Process', desc: 'Bulk renders run on our GPU cluster with SLA‑backed turnaround.' },
  { icon: Truck, title: 'Deliver', desc: 'Receive production‑ready files directly in your workspace.' },
]

export function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="py-32 bg-stone-50 dark:bg-stone-950">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-4 tracking-widest uppercase">How it works</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-stone-900 dark:text-stone-100"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
            Four steps to finished.
          </h2>
          <p className="mt-6 text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto">
            UCIN Studio fits into your existing workflow so you can start within minutes.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
              className="relative text-center"
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5B3DAF]/10 text-[#5B3DAF]">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-medium text-stone-900 dark:text-stone-100 mb-2">{step.title}</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{step.desc}</p>
              {/* connecting line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-stone-200 dark:bg-stone-700" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
