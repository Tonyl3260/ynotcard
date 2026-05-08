import { HeroSection } from '@/components/sections/hero'
import { ExecutiveSummary } from '@/components/sections/executive-summary'
import { KPIOverview } from '@/components/sections/kpi-overview'
import { AnalyticsPreview } from '@/components/sections/analytics-preview'
import { Footer } from '@/components/sections/footer'

export default function Page() {
  return (
    <>
      <HeroSection />
      <ExecutiveSummary />
      <KPIOverview />
      <AnalyticsPreview />
      <Footer />
    </>
  )
}
