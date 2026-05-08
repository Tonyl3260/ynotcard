import type { Metadata } from 'next'
import { MarketInsights } from '@/components/sections/market-insights'

export const metadata: Metadata = { title: 'Market' }

export default function MarketPage() {
  return <MarketInsights />
}
