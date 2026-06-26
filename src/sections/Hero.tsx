import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Pause } from 'lucide-react'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BEFORE_AFTER } from '@/lib/samples'

const ease = [0.22, 1, 0.36, 1] as const

const HERO_MESSAGES = [
  "Because art should never be held back",
  "Because we understand timelines",
  "You focus on the art—leave the grunt work to us",
  "The platform evolves with you"
]

const PROMISE_POINTS = [
  { label: "Every project delivered", detail: "on time" },
  { label: "Unleash your full potential", detail: "with UCIN" },
  { label: "Learns from your edits", detail: "gets better with use" }
]

export function Hero() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const sample = BEFORE_AFTER[0]
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % HERO_MESSAGES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <section id="top" ref={ref} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Dynamic background with floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-400/8 to-purple-400/8 blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col justify-center pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left side - Messaging */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, ease }}
              className="space-y-6"
            >
              {/* Rotating hero messages */}
              <div className="h-20 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentMessage}
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 90 }}
                    transition={{ duration: 0.6, ease }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                    style={{ 
                      background: 'linear-gradient(135deg, var(--fg), var(--accent))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {HERO_MESSAGES[currentMessage]}
                  </motion.h1>
                </AnimatePresence>
              </div>

              {/* Message controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 hover:bg-purple-500/20 transition-colors text-sm font-medium"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <div className="flex gap-2">
                  {HERO_MESSAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentMessage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentMessage ? 'bg-purple-500 w-6' : 'bg-gray-400/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Promise points */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="space-y-4"
            >
              {PROMISE_POINTS.map((point, i) => (
                <motion.div
                  key={point.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:scale-150 transition-transform" />
                  <span className="text-lg text-fg-muted">
                    {point.label}{' '}
                    <span className="font-semibold text-fg">{point.detail}</span>
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.4, ease }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <a 
                href="/app?signup=1" 
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start creating free 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
              </a>
              <a 
                href="#work" 
                className="px-6 py-4 text-fg-muted hover:text-fg font-medium transition-colors border border-gray-300/20 hover:border-purple-500/30 rounded-2xl hover:bg-purple-500/5"
              >
                See the work ↓
              </a>
            </motion.div>
          </div>

          {/* Right side - Interactive showcase */}
          <motion.div 
            style={{ y, scale, opacity }} 
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }} 
              animate={{ opacity: 1, scale: 1, rotateY: 0 }} 
              transition={{ duration: 1, delay: 0.3, ease }}
              className="relative"
            >
              {/* Floating elements around the showcase */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -left-8 px-4 py-2 bg-green-500/90 text-white text-sm font-medium rounded-full shadow-lg backdrop-blur-sm"
              >
                ✓ On-time delivery
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-12 px-4 py-2 bg-blue-500/90 text-white text-sm font-medium rounded-full shadow-lg backdrop-blur-sm"
              >
                AI-powered
              </motion.div>

              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 px-4 py-2 bg-purple-500/90 text-white text-sm font-medium rounded-full shadow-lg backdrop-blur-sm"
              >
                Brand-Style LoRA
              </motion.div>

              <BeforeAfter before={sample.before} after={sample.after} />
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/5 dark:bg-white/5 rounded-full text-sm text-fg-subtle backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {sample.caption}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom section with specs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.6, ease }}
        className="relative border-t border-gray-200/20 bg-gray-50/30 dark:bg-gray-900/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-fg-subtle">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              SLA-backed compute
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              India-resident team
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              Batch-native processing
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full" />
              Brand-Style training
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
