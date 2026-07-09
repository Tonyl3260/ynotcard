'use client'

import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { Card } from '@/components/ui/card'
import inventoryData from '@/inventory.json'

// ── Derived values from inventory snapshot ────────────────────────────────────

const s = inventoryData.summary
const revenue   = s.grand_total_revenue                              // 6301.92
const net       = s.grand_total_net                                  // 5127.22
const active    = s.total_singles_listings + s.total_sealed_listings // 131
const avgPrice  = revenue / active                                   // 48.10

// ── Types ─────────────────────────────────────────────────────────────────────

type KPIData = {
  label: string
  value: number
  format: (v: number) => string
  accent?: 'blue' | 'gold' | 'green' | 'red' | 'purple'
}

// ── Data ──────────────────────────────────────────────────────────────────────

const KPIS: KPIData[] = [
  {
    label: 'Total Listed Value',
    value: revenue,
    format: (v) => '$' + Math.round(v).toLocaleString('en-US'),
    accent: 'blue',
  },
  {
    label: 'Net After Fees',
    value: net,
    format: (v) => '$' + Math.round(v).toLocaleString('en-US'),
    accent: 'green',
  },
  {
    label: 'Unique Items Listed',
    value: active,
    format: (v) => Math.round(v).toString(),
    accent: 'purple',
  },
  {
    label: 'Avg Listing Price',
    value: avgPrice,
    format: (v) => '$' + v.toFixed(2),
    accent: 'gold',
  },
]

// ── Animated counter ──────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

function Counter({
  to,
  format,
  inView,
}: {
  to: number
  format: (v: number) => string
  inView: boolean
}) {
  const count   = useMotionValue(0)
  const display = useTransform(count, format)

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, { duration: 1.5, ease: 'easeOut' })
    return controls.stop
  }, [inView, to, count])

  return <motion.span>{display}</motion.span>
}

// ── KPI card ──────────────────────────────────────────────────────────────────

function KPICard({ kpi, index }: { kpi: KPIData; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
      className="h-full"
    >
      <Card
        accent={kpi.accent}
        hoverable
        className="p-5 h-full flex flex-col gap-0"
      >
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500 mb-3">
          {kpi.label}
        </p>

        <div className="text-[1.75rem] font-bold text-slate-100 tabular-nums leading-none">
          <Counter to={kpi.value} format={kpi.format} inView={inView} />
        </div>
      </Card>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function KPIOverview() {
  return (
    <section className="px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-[1rem] font-semibold text-slate-100">Inventory Overview</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {KPIS.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>
    </section>
  )
}
