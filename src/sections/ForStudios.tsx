import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Users, BarChart3, Paintbrush } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const ease = [0.16, 1, 0.3, 1] as const

const features = [
  { icon: Shield, title: 'SLA‑backed delivery', desc: 'Guaranteed turnaround times so you can promise your clients with confidence.' },
  { icon: Users, title: 'Team dashboard', desc: 'Manage projects, assign tasks, and track progress across your entire studio.' },
  { icon: BarChart3, title: 'Usage analytics', desc: 'Monitor processing volume, cost per asset, and team productivity.' },
  { icon: Paintbrush, title: 'Brand‑Style LoRA', desc: 'Your look, learned and applied consistently across every deliverable.' },
]

export function ForStudios() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="py-32 bg-stone-100 dark:bg-stone-800">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-4 tracking-widest uppercase">For studios</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-stone-900 dark:text-stone-100"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
            Scale without scaling headcount.
          </h2>
          <p className="mt-6 text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto">
            UCIN Studio becomes your dedicated post‑production partner, freeing your team to focus on creativity and client relationships.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
              className="flex gap-6 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 dark:border-stone-700/50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#5B3DAF]/10 flex items-center justify-center shrink-0">
                <f.icon size={24} className="text-[#5B3DAF]" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-stone-900 dark:text-stone-100 mb-2">{f.title}</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
