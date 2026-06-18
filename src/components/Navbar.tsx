import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { label: 'Platform', href: '#foundation' },
  { label: 'What we handle', href: '#handle' },
  { label: 'Brand-Style', href: '#brand-style' },
  { label: 'How it works', href: '#how' },
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

  const go = (href: string) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={scrolled
        ? { background: 'var(--nav-bg)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }
        : { borderBottom: '1px solid transparent' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#top"><Logo /></a>

          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.href)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-fg-subtle hover:text-fg hover:bg-canvas-tint transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <a href="/app" className="px-4 py-2 rounded-xl text-sm font-semibold text-fg hover:bg-canvas-tint transition-colors">
              Sign in
            </a>
            <a href="/app?signup=1" className="btn-primary">
              Start creating <ArrowRight size={14} />
            </a>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-fg hover:bg-canvas-tint" aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 py-4 space-y-1" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
          {LINKS.map((l) => (
            <button key={l.label} onClick={() => go(l.href)} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-fg-subtle hover:text-fg hover:bg-canvas-tint">
              {l.label}
            </button>
          ))}
          <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
            <a href="/app" className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-fg bg-canvas-tint">Sign in</a>
            <a href="/app?signup=1" className="btn-primary w-full">Start creating</a>
          </div>
        </div>
      )}
    </header>
  )
}
