import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Stripe-style animated mesh gradient. Renders moving colour blobs on a tiny
 * canvas that's CSS-scaled up — the browser's bilinear upscale gives the smooth,
 * flowing mesh for free (cheap, no blur filter). Respects reduced-motion.
 */
export function MeshGradient({
  base, colors, className, style,
}: { base: string; colors: string[]; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const g = cv.getContext('2d')
    if (!g) return
    const W = 200, H = 120
    cv.width = W; cv.height = H
    const blobs = colors.map((c) => ({
      c,
      ox: Math.random() * 6.28, oy: Math.random() * 6.28,
      sx: 0.5 + Math.random() * 0.6, sy: 0.5 + Math.random() * 0.6,
      ax: 0.3 + Math.random() * 0.16, ay: 0.3 + Math.random() * 0.16,
      bx: Math.random(), by: Math.random(),
    }))
    let raf = 0
    let running = false
    const draw = (t: number) => {
      g.fillStyle = base
      g.fillRect(0, 0, W, H)
      for (const b of blobs) {
        const cx = W * (b.bx * 0.18 + 0.41 + b.ax * Math.sin(t * 0.00018 * b.sx + b.ox))
        const cy = H * (b.by * 0.18 + 0.41 + b.ay * Math.cos(t * 0.00018 * b.sy + b.oy))
        const r = W * 0.55
        const grd = g.createRadialGradient(cx, cy, 0, cx, cy, r)
        grd.addColorStop(0, b.c)
        grd.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = grd
        g.fillRect(0, 0, W, H)
      }
    }
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop) }
    const start = () => { if (running || reduced) return; running = true; raf = requestAnimationFrame(loop) }
    const stop = () => { running = false; cancelAnimationFrame(raf); raf = 0 }

    draw(0) // paint an initial frame so it's never blank (and covers reduced-motion)
    // Only animate while on-screen — offscreen mesh instances cost nothing.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 })
    io.observe(cv)
    return () => { stop(); io.disconnect() }
  }, [base, colors, reduced])

  return <canvas ref={ref} aria-hidden className={className} style={{ width: '100%', height: '100%', display: 'block', ...style }} />
}
