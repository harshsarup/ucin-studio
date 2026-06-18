import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'For studios', href: '#studios' },
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#pricing' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={scrolled
        ? { background: 'var(--nav-bg)', backdropFilter: 'blur(18px)', borderBottom: '1px solid var(--border)' }
        : { borderBottom: '1px solid transparent' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#top" aria-label="UCIN Studio"><Logo /></a>

          <nav className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-[14px] font-medium text-fg-subtle hover:text-fg transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="/app" className="text-[14px] font-medium text-fg-subtle hover:text-fg transition-colors">Sign in</a>
            <a href="/app?signup=1" className="btn-primary !px-5 !py-2.5">Start creating</a>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 -mr-2 text-fg" aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-5 py-5 space-y-1" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block px-2 py-2.5 text-[15px] font-medium text-fg-subtle hover:text-fg">
              {l.label}
            </a>
          ))}
          <div className="pt-3 space-y-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <a href="/app" className="block px-2 py-2.5 text-[15px] font-medium text-fg">Sign in</a>
            <a href="/app?signup=1" className="btn-primary w-full">Start creating</a>
          </div>
        </div>
      )}
    </header>
  )
}
