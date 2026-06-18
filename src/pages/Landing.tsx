import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Marquee } from '@/components/Marquee'
import { Hero } from '@/sections/Hero'
import { StudioNeeds } from '@/sections/StudioNeeds'
import { Foundation } from '@/sections/Foundation'
import { WhatWeHandle } from '@/sections/WhatWeHandle'
import { Showcase } from '@/sections/Showcase'
import { BrandStyle } from '@/sections/BrandStyle'
import { HowItWorks } from '@/sections/HowItWorks'
import { Pricing } from '@/sections/Pricing'
import { FAQ } from '@/sections/FAQ'
import { CTA } from '@/sections/CTA'

export function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        {/* partner first (what your studio needs) → then the platform credibility */}
        <StudioNeeds />
        <Foundation />
        <WhatWeHandle />
        <Showcase />
        <BrandStyle />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
