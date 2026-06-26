import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BEFORE_AFTER } from '@/lib/samples'

const ease = [0.16, 1, 0.3, 1] as const

const HERO_MESSAGES = [
  "Because art should never be held back",
  "Because we understand timelines", 
  "You focus on the art—we handle the rest",
  "The platform that evolves with you"
]

export function Hero() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const sample = BEFORE_AFTER[0]
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % HERO_MESSAGES.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="top" ref={ref} className="relative min-h-screen overflow-hidden">
      
      {/* Full-bleed background with subtle texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800" />
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(91,61,175,0.4) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Content */}
      <div className="relative">
        
        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
          
          {/* Brand mark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm border border-stone-200/50 dark:border-stone-700/50 shadow-lg shadow-stone-900/5 mb-12">
              <div className="w-3 h-3 rounded-full bg-[#5B3DAF] animate-pulse" />
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300 tracking-wide">
                POST-PRODUCTION STUDIO
              </span>
            </div>
            
            {/* Main headline - editorial serif */}
            <div className="space-y-8 mb-16">
              <div className="h-32 md:h-40 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentMessage}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 1.05 }}
                    transition={{ duration: 1, ease }}
                    className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.85] tracking-tight text-stone-900 dark:text-stone-100 text-center max-w-6xl"
                    style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                  >
                    {HERO_MESSAGES[currentMessage]}
                  </motion.h1>
                </AnimatePresence>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease }}
                className="space-y-6"
              >
                <p className="text-xl md:text-2xl lg:text-3xl font-light text-stone-600 dark:text-stone-400 max-w-4xl mx-auto leading-relaxed text-center">
                  Every project delivered, on time.<br />
                  <span className="text-[#5B3DAF] font-normal" style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                    Unleash your full potential, with UCIN.
                  </span>
                </p>
                
                {/* Subtle promise indicators */}
                <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-stone-500 dark:text-stone-500 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>SLA-backed delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5B3DAF]" />
                    <span>Brand-Style learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>India-resident team</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <a 
                href="/app?signup=1"
                className="group relative px-10 py-5 bg-[#5B3DAF] hover:bg-[#4A2F94] text-white font-medium rounded-3xl transition-all duration-700 shadow-xl shadow-[#5B3DAF]/25 hover:shadow-2xl hover:shadow-[#5B3DAF]/40 hover:-translate-y-1 hover:scale-105"
              >
                <span className="flex items-center gap-3 text-lg">
                  Start creating free
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                </span>
              </a>
              
              <button className="group flex items-center gap-3 px-8 py-5 text-stone-700 dark:text-stone-300 hover:text-[#5B3DAF] dark:hover:text-[#5B3DAF] font-medium transition-all duration-500 border border-stone-300/30 dark:border-stone-600/30 hover:border-[#5B3DAF]/40 rounded-3xl hover:bg-[#5B3DAF]/5">
                <Play size={18} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg">Watch demo</span>
              </button>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease }}
              className="text-sm text-stone-500 dark:text-stone-500 font-light mt-8"
            >
              Available in browser or desktop — 
              <code className="px-3 py-1 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg text-xs font-mono ml-2">npx ucin-studio</code>
            </motion.p>
          </motion.div>
        </div>

        {/* Hero showcase - cinematic presentation */}
        <motion.div 
          style={{ y, opacity }}
          className="relative px-6 pb-20"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.8, ease }}
              className="relative"
            >
              {/* Showcase frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/20 dark:shadow-black/40 bg-white dark:bg-stone-900 p-2">
                <BeforeAfter before={sample.before} after={sample.after} />
              </div>
              
              {/* Floating caption */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease }}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-2xl px-8 py-4 border border-stone-200/50 dark:border-stone-700/50 shadow-xl shadow-stone-900/10">
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-300 text-center whitespace-nowrap">
                    {sample.caption}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Elegant bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-stone-50 dark:from-stone-950 to-transparent pointer-events-none" />
      
    </section>
  )
}
