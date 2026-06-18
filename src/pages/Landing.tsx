import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Hero } from '@/sections/Hero'
import { Work } from '@/sections/Work'
import { Manifesto } from '@/sections/Manifesto'
import { HowItWorks } from '@/sections/HowItWorks'

/**
 * Rebuild — Phase 1 (top third): the new art direction. The remaining sections
 * (What we handle · Brand-Style · For studios · Platform/specs · Process ·
 * Pricing · CTA) follow once the direction is approved.
 */
export function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Work />
        <Manifesto />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
