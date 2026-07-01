import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Hero } from '@/sections/Hero'
import { Manifesto } from '@/sections/Manifesto'
import { AudienceRotator } from '@/sections/AudienceRotator'
import { WorkShowcase } from '@/sections/WorkShowcase'
import { Services } from '@/sections/Services'
import { Process } from '@/sections/Process'
import { NetworkShowcase } from '@/sections/NetworkShowcase'
import { Security } from '@/sections/Security'
import { DesktopApp } from '@/sections/DesktopApp'
import { ForStudios } from '@/sections/ForStudios'
import { Pricing } from '@/sections/Pricing'
import { FinalCTA } from '@/sections/FinalCTA'
import { themeById } from '@/lib/themes'

/**
 * UCIN Studio Landing — Stripe-style with the locked Plum gradient. Vibrant
 * gradient bookends, a single dark network showcase, clean light body.
 */
const PLUM = themeById('plum')

export function Landing() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="space-y-0">
        <Hero palette={PLUM} />
        <Manifesto />
        <AudienceRotator />
        <WorkShowcase />
        <Services />
        <Process />
        <NetworkShowcase />
        <Security />
        <DesktopApp />
        <ForStudios />
        <Pricing />
        <FinalCTA palette={PLUM} />
      </main>
      <Footer />
    </div>
  )
}
