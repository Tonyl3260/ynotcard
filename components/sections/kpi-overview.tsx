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
  sparkline: number[]
  accent?: 'blue' | 'gold' | 'green' | 'red' | 'purple'
}

// ── Data ──────────────────────────────────────────────────────────────────────

const KPIS: KPIData[] = [
  {
    label: 'Total Listed Value',
    value: revenue,
    format: (v) => '$' + Math.round(v).toLocaleString('en-US'),
    sparkline: [3000, 3500, 4000, 3800, 4500, 5000, 5500, 5200, 5800, revenue],
    accent: 'blue',
  },
  {
    label: 'Net After Fees',
    value: net,
    format: (v) => '$' + Math.round(v).toLocaleString('en-US'),
    sparkline: [2400, 2800, 3200, 3100, 3600, 4000, 4400, 4200, 4700, net],
    accent: 'green',
  },
  {
    label: 'Unique Items Listed',
    value: active,
    format: (v) => Math.round(v).toString(),
    sparkline: [100, 105, 110, 115, 118, 122, 126, 128, 130, active],
  },
  {
    label: 'Avg Listing Price',
    value: avgPrice,
    format: (v) => '$' + v.toFixed(2),
    sparkline: [35, 38, 40, 42, 44, 45, 46, 47, 47.5, avgPrice],
    accent: 'gold',
  },
]

// ── Sparkline ─────────────────────────────────────────────────────────────────

function buildPath(data: number[], w: number, h: number): string {
  const min   = Math.min(...data)
  const max   = Math.max(...data)
  const range = max - min || 1
  const pad   = 2

  const xs = data.map((_, i) => (i / (data.length - 1)) * w)
  const ys = data.map(v => h - pad - ((v - min) / range) * (h - pad * 2))

  let d = `M ${xs[0]},${ys[0]}`
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpx},${ys[i - 1]} ${cpx},${ys[i]} ${xs[i]},${ys[i]}`
  }
  return d
}

function Sparkline({ data, accent }: { data: number[]; accent?: string }) {
  const W      = 200
  const H      = 32
  const isRed  = accent === 'red'
  const stroke = isRed ? 'rgba(239,68,68,0.65)'  : 'rgba(59,130,246,0.75)'
  const fill   = isRed ? 'rgba(239,68,68,0.08)'  : 'rgba(59,130,246,0.12)'
  const path   = buildPath(data, W, H)
  const areaPath = `${path} L ${W},${H} L 0,${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <path d={areaPath} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
      <circle
        cx={W}
        cy={buildPath(data, W, H).match(/[\d.]+$/)?.[0] ?? H / 2}
        r="2.5"
        fill={stroke}
      />
    </svg>
  )
}

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

        <div className="text-[1.75rem] font-bold text-slate-100 tabular-nums leading-none mb-2.5">
          <Counter to={kpi.value} format={kpi.format} inView={inView} />
        </div>

        <p className="text-[0.62rem] text-slate-600 mb-3">Current snapshot</p>

        <div className="mt-auto -mx-1 -mb-1">
          <Sparkline data={kpi.sparkline} accent={kpi.accent} />
        </div>
      </Card>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function KPIOverview() {
  return (
    <section className="px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-[1rem] font-semibold text-slate-100">Performance Overview</h2>
          <p className="text-[0.8rem] text-slate-500 mt-0.5">Current inventory snapshot</p>
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
