import type { Metadata } from 'next'
import { KPIOverview } from '@/components/sections/kpi-overview'
import { InventoryIntelligence } from '@/components/sections/inventory-intelligence'

export const metadata: Metadata = { title: 'Inventory' }

export default function InventoryPage() {
  return (
    <>
      <KPIOverview />
      <InventoryIntelligence />
    </>
  )
}
