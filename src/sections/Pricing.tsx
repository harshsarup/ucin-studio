import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const ease = [0.16, 1, 0.3, 1] as const

const plans = [
  {
    name: 'Starter',
    price: '₹5,000',
    period: '/mo',
    desc: 'For individual creators exploring AI‑powered post‑production.',
    features: ['100 AI credits', 'Standard queue', 'Basic support', 'Web upload'],
    highlight: false,
  },
  {
    name: 'Studio',
    price: '₹15,000',
    period: '/mo',
    desc: 'For growing studios that need consistent output.',
    features: ['500 AI credits', 'Priority queue', 'SLA‑backed delivery', 'Style LoRA training', 'Team dashboard', 'Slack integration'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For agencies and high‑volume teams.',
    features: ['Unlimited AI credits', 'Dedicated GPU cluster', 'Custom SLA', 'Brand‑Style LoRA library', 'Dedicated CSM', 'API access'],
    highlight: false,
  },
]

export function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} id="pricing" className="py-32 bg-stone-50 dark:bg-stone-950">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-4 tracking-widest uppercase">Pricing</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-stone-900 dark:text-stone-100"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
            Simple, transparent pricing.
          </h2>
          <p className="mt-6 text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto">
            Start for free and scale as you grow. No hidden fees, no surprises.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
              className={`relative rounded-2xl p-8 border ${plan.highlight ? 'border-[#5B3DAF] bg-[#5B3DAF]/5 shadow-xl shadow-[#5B3DAF]/10' : 'border-stone-200/50 dark:border-stone-700/50 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm'}`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5B3DAF] text-white text-xs font-semibold px-4 py-1 rounded-full">Most popular</span>
              )}
              <h3 className="text-2xl font-medium text-stone-900 dark:text-stone-100 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-light text-stone-900 dark:text-stone-100">{plan.price}</span>
                <span className="text-stone-500">{plan.period}</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                    <Check size={18} className="text-[#5B3DAF]" />
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="/app?signup=1"
                className={`group inline-flex items-center justify-center w-full px-6 py-3 rounded-xl font-medium transition-all duration-500 ${plan.highlight ? 'bg-[#5B3DAF] text-white hover:bg-[#4A2F94] shadow-lg shadow-[#5B3DAF]/30' : 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 hover:bg-stone-300 dark:hover:bg-stone-600'}`}
              >
                Get started
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
