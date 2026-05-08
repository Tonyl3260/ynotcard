import type { Metadata } from 'next'
import { InventoryIntelligence } from '@/components/sections/inventory-intelligence'

export const metadata: Metadata = { title: 'Inventory' }

export default function InventoryPage() {
  return <InventoryIntelligence />
}
