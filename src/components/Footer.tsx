import { Logo } from './Logo'

export function Footer() {
  const year = 2026
  return (
    <footer className="border-t border-canvas-border bg-canvas-sunk">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-[15px] text-fg-subtle max-w-sm leading-relaxed">
              The post-production studio inside your studio — the creative layer on UCIN&apos;s
              SLA-backed compute network. Hand off the post; we finish it for you.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold text-fg mb-3 mono tracking-wide">PRODUCT</div>
            <ul className="space-y-2.5 text-[15px] text-fg-subtle">
              <li><a href="#work" className="hover:text-fg transition-colors">Work</a></li>
              <li><a href="#studios" className="hover:text-fg transition-colors">For studios</a></li>
              <li><a href="#platform" className="hover:text-fg transition-colors">Platform</a></li>
              <li><a href="/app" className="hover:text-fg transition-colors">Open Studio</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-fg mb-3 mono tracking-wide">COMPANY</div>
            <ul className="space-y-2.5 text-[15px] text-fg-subtle">
              <li><a href="#" className="hover:text-fg transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-fg transition-colors">Terms</a></li>
              <li><a href="mailto:hello@ucin.in" className="hover:text-fg transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-canvas-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-fg-faint">© {year} UCIN Studio · encrypted &amp; India-resident</p>
          <p className="text-[13px] text-fg-faint mono">Made for studios.</p>
        </div>
      </div>
    </footer>
  )
}
