import type { Metadata } from 'next'
import { ExpensesKPI, ExpensesDetail } from '@/components/sections/expenses-section'

export const metadata: Metadata = { title: 'Expenses' }

export default function ExpensesPage() {
  return (
    <>
      <ExpensesKPI />
      <ExpensesDetail />
    </>
  )
}
