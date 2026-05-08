import type { Metadata } from 'next'
import { Reports } from '@/components/sections/reports'

export const metadata: Metadata = { title: 'Reports' }

export default function ReportsPage() {
  return <Reports />
}
