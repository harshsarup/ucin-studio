import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BEFORE_AFTER } from '@/lib/samples'

const ease = [0.16, 1, 0.3, 1] as const

const HERO_MESSAGES = [
  "Because art should never be held back",
  "Because we understand timelines", 
  "You focus on the art—leave the grunt work to us",
  "The platform evolves with you"
]

export function Hero() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const sample = BEFORE_AFTER[0]
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 60])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % HERO_MESSAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="top" ref={ref} className="relative min-h-screen bg-gradient-to-b from-stone-50 to-white dark:from-stone-950 dark:to-stone-900">
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
      
      <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        {/* Editorial header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800/50 text-sm font-medium text-stone-600 dark:text-stone-400 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#5B3DAF]" />
            Post-production studio
          </div>
          
          {/* Main headline with editorial serif feel */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentMessage}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease }}
                className="text-5xl md:text-6xl lg:text-7xl font-light leading-[0.9] tracking-tight text-stone-900 dark:text-stone-100"
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
              >
                {HERO_MESSAGES[currentMessage]}
              </motion.h1>
            </AnimatePresence>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="text-xl md:text-2xl font-light text-stone-600 dark:text-stone-400 max-w-4xl mx-auto leading-relaxed"
            >
              Every project delivered, on time. Unleash your full potential, with UCIN.
            </motion.p>
          </div>
        </motion.div>

        {/* Hero showcase - full bleed imagery */}
        <motion.div 
          style={{ y, opacity }}
          className="relative mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease }}
            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10 dark:shadow-black/30"
          >
            <BeforeAfter before={sample.before} after={sample.after} />
            
            {/* Elegant caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease }}
              className="absolute bottom-6 left-6 right-6"
            >
              <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-2xl px-6 py-4 border border-stone-200/50 dark:border-stone-700/50">
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300 leading-relaxed">
                  {sample.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Value propositions - editorial layout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            { title: "Every project delivered", subtitle: "on time", desc: "SLA-backed compute ensures your deadlines are never missed." },
            { title: "Unleash your full potential", subtitle: "with UCIN", desc: "Focus on the creative work while we handle the technical execution." },
            { title: "Learns from your edits", subtitle: "gets better with use", desc: "Brand-Style LoRA adapts to your signature aesthetic over time." }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 + i * 0.1, ease }}
              className="text-center space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100">
                  {item.title}
                </h3>
                <p className="text-lg font-light text-[#5B3DAF]" 
                  style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                  {item.subtitle}
                </p>
              </div>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA - refined and calm */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease }}
          className="text-center space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/app?signup=1"
              className="group relative px-8 py-4 bg-[#5B3DAF] hover:bg-[#4A2F94] text-white font-medium rounded-2xl transition-all duration-500 shadow-lg shadow-[#5B3DAF]/20 hover:shadow-xl hover:shadow-[#5B3DAF]/30 hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                Start creating free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </a>
            
            <a 
              href="#work"
              className="px-8 py-4 text-stone-700 dark:text-stone-300 hover:text-[#5B3DAF] dark:hover:text-[#5B3DAF] font-medium transition-colors duration-300 border border-stone-200 dark:border-stone-700 hover:border-[#5B3DAF]/30 rounded-2xl"
            >
              View our work
            </a>
          </div>
          
          <p className="text-sm text-stone-500 dark:text-stone-500 font-light">
            Available in browser or as desktop app — 
            <code className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded text-xs font-mono">npx ucin-studio</code>
          </p>
        </motion.div>

      </div>

      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-stone-900 to-transparent pointer-events-none" />
      
    </section>
  )
}
