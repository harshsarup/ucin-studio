import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

function hexToRgb(hex: string) {
  const h = hex.replace('#', '').trim()
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const i = parseInt(n || 'A88FF0', 16)
  return { r: (i >> 16) & 255, g: (i >> 8) & 255, b: i & 255 }
}

/**
 * Contained compute-network visualization — drifting GPU nodes, proximity links,
 * and routing pulses. Calm and bounded (a panel visual, not a full backdrop).
 */
export function NetworkViz({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const g = cv.getContext('2d')
    if (!g) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, raf = 0
    const col = getComputedStyle(cv).getPropertyValue('--accent') || '#A88FF0'
    const c = hexToRgb(col)
    type N = { x: number; y: number; vx: number; vy: number; r: number; ph: number }
    type P = { a: number; b: number; t: number; s: number }
    let nodes: N[] = []
    let pulses: P[] = []
    const LINK = 92

    function resize() {
      const r = cv!.getBoundingClientRect()
      w = r.width; h = r.height
      cv!.width = Math.max(1, w * dpr); cv!.height = Math.max(1, h * dpr)
      g!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.max(14, Math.min(32, Math.round((w * h) / 5200)))
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.3 + 0.7, ph: Math.random() * 6.28,
      }))
    }
    function frame(t: number) {
      g!.clearRect(0, 0, w, h)
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
      }
      const edges: [number, number][] = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d = Math.hypot(dx, dy)
          if (d < LINK) {
            edges.push([i, j])
            g!.strokeStyle = `rgba(${c.r},${c.g},${c.b},${(1 - d / LINK) * 0.22})`
            g!.lineWidth = 0.6
            g!.beginPath(); g!.moveTo(nodes[i].x, nodes[i].y); g!.lineTo(nodes[j].x, nodes[j].y); g!.stroke()
          }
        }
      }
      for (const n of nodes) {
        const tw = 0.5 + 0.5 * Math.sin(t * 0.001 + n.ph)
        g!.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.4 + 0.5 * tw})`
        g!.beginPath(); g!.arc(n.x, n.y, n.r, 0, 6.28); g!.fill()
      }
      if (!reduced && edges.length && pulses.length < 8 && Math.random() < 0.2) {
        const [a, b] = edges[Math.floor(Math.random() * edges.length)]
        pulses.push({ a, b, t: 0, s: 0.015 + Math.random() * 0.02 })
      }
      pulses = pulses.filter((p) => {
        p.t += p.s
        const A = nodes[p.a], B = nodes[p.b]
        if (p.t >= 1 || !A || !B) return false
        const x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t
        g!.fillStyle = `rgba(${c.r},${c.g},${c.b},0.95)`
        g!.beginPath(); g!.arc(x, y, 1.7, 0, 6.28); g!.fill()
        return true
      })
      if (!reduced && running) raf = requestAnimationFrame(frame)
    }
    let running = false
    const start = () => { if (running || reduced) return; running = true; raf = requestAnimationFrame(frame) }
    const stop = () => { running = false; cancelAnimationFrame(raf); raf = 0 }
    resize()
    frame(0) // initial paint (also the static frame for reduced-motion)
    // Only run the loop while the panel is on-screen.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 })
    io.observe(cv)
    window.addEventListener('resize', resize)
    return () => { stop(); io.disconnect(); window.removeEventListener('resize', resize) }
  }, [reduced])

  return <canvas ref={ref} aria-hidden className={className} style={{ width: '100%', height: '100%', display: 'block', ...style }} />
}
