import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Hero } from '@/sections/Hero'
import { Manifesto } from '@/sections/Manifesto'
import { WorkGallery } from '@/sections/WorkGallery'
import { Services } from '@/sections/Services'
import { Process } from '@/sections/Process'
import { ForStudios } from '@/sections/ForStudios'
import { Pricing } from '@/sections/Pricing'
import { FinalCTA } from '@/sections/FinalCTA'
import { greeting } from '@/utils/greeting'

/**
 * UCIN Studio Landing Page
 * Built from scratch following the editorial‑premium, imagery‑led, calm brand direction.
 * References: Frame.io × Krea × Stories by Joseph Radhik.
 */
export function Landing() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <main className="space-y-0">
        <Hero />
        <Manifesto />
        <WorkGallery />
        <Services />
        <Process />
        <ForStudios />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
