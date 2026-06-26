import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const ease = [0.16, 1, 0.3, 1] as const

export function FinalCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="py-32 bg-stone-100 dark:bg-stone-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-stone-900 dark:text-stone-100 mb-8"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
            Ready to create without limits?
          </h2>
          <p className="text-xl text-stone-600 dark:text-stone-400 leading-relaxed mb-12 max-w-2xl mx-auto">
            Join thousands of creatives who trust UCIN Studio to handle the heavy lifting so they can focus on the art.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            <a
              href="/app?signup=1"
              className="group inline-flex items-center gap-4 px-10 py-5 bg-[#5B3DAF] hover:bg-[#4A2F94] text-white font-medium rounded-3xl transition-all duration-700 shadow-xl shadow-[#5B3DAF]/25 hover:shadow-2xl hover:shadow-[#5B3DAF]/40 hover:-translate-y-1 hover:scale-105"
            >
              <span className="text-lg">Start creating free</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
            </a>
          </motion.div>
          <p className="mt-8 text-sm text-stone-500 dark:text-stone-500">
            No credit card required. 50 free credits on signup.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
