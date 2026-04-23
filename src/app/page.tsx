import dynamic from 'next/dynamic'
import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import { ProblemStatement } from '@/components/sections/ProblemStatement'
import { VerifySection } from '@/components/sections/VerifySection'
import { SDOTFramework } from '@/components/sections/SDOTFramework'
import { FeatureSequence } from '@/components/sections/FeatureSequence'
import { PlatformCoverage } from '@/components/sections/PlatformCoverage'
import { StudentWorkspace } from '@/components/sections/StudentWorkspace'
import { ForWhom } from '@/components/sections/ForWhom'
import { TrustCompliance } from '@/components/sections/TrustCompliance'
import { AboutBuilder } from '@/components/sections/AboutBuilder'
import { Closing } from '@/components/sections/Closing'
import { Footer } from '@/components/sections/Footer'
import { LandingNoticeProvider } from '@/components/providers/LandingNoticeProvider'

const EvidenceInAction = dynamic(
  () => import('@/components/sections/EvidenceInAction').then((mod) => mod.EvidenceInAction),
  {
    ssr: true,
  }
)

export default function LandingPage() {
  return (
    <LandingNoticeProvider>
      <main id="main" className="overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
        <Nav />
        <Hero />
        <ProblemStatement />
        <VerifySection />
        <SDOTFramework />
        <FeatureSequence />
        <PlatformCoverage />
        <StudentWorkspace />
        <EvidenceInAction />
        <ForWhom />
        <TrustCompliance />
        <AboutBuilder />
        <Closing />
        <Footer />
      </main>
    </LandingNoticeProvider>
  )
}
