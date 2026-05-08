import type { Metadata } from 'next'
import { SalesAnalytics } from '@/components/sections/sales-analytics'

export const metadata: Metadata = { title: 'Analytics' }

export default function AnalyticsPage() {
  return <SalesAnalytics />
}
