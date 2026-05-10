import { HeroSection } from '@/components/sections/hero'
import { ExecutiveSummary } from '@/components/sections/executive-summary'
import { StatsStrip } from '@/components/sections/stats-strip'
import { KeyInsights } from '@/components/sections/key-insights'

export default function Page() {
  return (
    <>
      <HeroSection />
      <ExecutiveSummary />
      <StatsStrip />
      <KeyInsights />
    </>
  )
}
