import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Marquee } from '@/components/Marquee'
import { Hero } from '@/sections/Hero'
import { WhatWeHandle } from '@/sections/WhatWeHandle'
import { Showcase } from '@/sections/Showcase'
import { BrandStyle } from '@/sections/BrandStyle'
import { HowItWorks } from '@/sections/HowItWorks'
import { Pricing } from '@/sections/Pricing'
import { UseCases } from '@/sections/UseCases'
import { FAQ } from '@/sections/FAQ'
import { CTA } from '@/sections/CTA'

export function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <WhatWeHandle />
        <Showcase />
        <BrandStyle />
        <HowItWorks />
        <UseCases />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
