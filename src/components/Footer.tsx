import { Logo } from './Logo'

export function Footer() {
  const year = 2026
  return (
    <footer className="border-t border-canvas-border" style={{ background: '#F1EDE6' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-fg-subtle max-w-xs leading-relaxed">
              Your AI production partner. Hand off the post-production, stay focused on the
              work only you can do.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold text-fg mb-3">Product</div>
            <ul className="space-y-2 text-sm text-fg-subtle">
              <li><a href="#handle" className="hover:text-fg transition-colors">What we handle</a></li>
              <li><a href="#brand-style" className="hover:text-fg transition-colors">Brand-Style</a></li>
              <li><a href="#pricing" className="hover:text-fg transition-colors">Pricing</a></li>
              <li><a href="/app" className="hover:text-fg transition-colors">Open Studio</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-fg mb-3">Company</div>
            <ul className="space-y-2 text-sm text-fg-subtle">
              <li><a href="#" className="hover:text-fg transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-fg transition-colors">Terms</a></li>
              <li><a href="mailto:hello@ucin.in" className="hover:text-fg transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-canvas-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-fg-faint">© {year} UCIN Studio. Your assets are encrypted and India-resident.</p>
          <p className="text-xs text-fg-faint font-mono">Made for creators.</p>
        </div>
      </div>
    </footer>
  )
}
