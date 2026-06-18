import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

/** Lenis smooth scrolling — the premium weighted feel. Anchor clicks still work
 *  (Lenis listens to native scroll). Respects reduced-motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    // smooth in-page anchor jumps
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')!
      if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: -80 }) }
    }
    document.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(raf); document.removeEventListener('click', onClick); lenis.destroy() }
  }, [])

  return <>{children}</>
}
