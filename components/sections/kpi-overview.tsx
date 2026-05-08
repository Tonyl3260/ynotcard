'use client'

import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type KPIData = {
  label: string
  value: number
  format: (v: number) => string
  trend: number        // % change vs prior period
  positiveIsGood: boolean
  sparkline: number[]
  accent?: 'blue' | 'gold' | 'green' | 'red' | 'purple'
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const KPIS: KPIData[] = [
  {
    label: 'Total Listed Value',
    value: 6302,
    format: (v) => '$' + Math.round(v).toLocaleString('en-US'),
    trend: 8.3,
    positiveIsGood: true,
    sparkline: [3000, 3500, 4000, 3800, 4500, 5000, 5500, 5200, 5800, 6302],
    accent: 'blue',
  },
  {
    label: 'Net After Fees',
    value: 5127,
    format: (v) => '$' + Math.round(v).toLocaleString('en-US'),
    trend: 7.1,
    positiveIsGood: true,
    sparkline: [2400, 2800, 3200, 3100, 3600, 4000, 4400, 4200, 4700, 5127],
    accent: 'green',
  },
  {
    label: 'Net Margin',
    value: 81.4,
    format: (v) => v.toFixed(1) + '%',
    trend: 1.2,
    positiveIsGood: true,
    sparkline: [78, 79, 80, 79.5, 80.5, 81, 80.8, 81.2, 81, 81.4],
  },
  {
    label: 'Singles Listed',
    value: 121,
    format: (v) => Math.round(v).toString(),
    trend: -2.5,
    positiveIsGood: true,
    sparkline: [90, 95, 100, 105, 108, 112, 115, 118, 120, 121],
  },
  {
    label: 'Active Listings',
    value: 131,
    format: (v) => Math.round(v).toString(),
    trend: 3.2,
    positiveIsGood: true,
    sparkline: [100, 105, 110, 115, 118, 122, 126, 128, 130, 131],
  },
  {
    label: 'Avg Listing Price',
    value: 48.10,
    format: (v) => '$' + v.toFixed(2),
    trend: 5.2,
    positiveIsGood: true,
    sparkline: [35, 38, 40, 42, 44, 45, 46, 47, 47.5, 48.10],
    accent: 'gold',
  },
  {
    label: 'Reprice Alerts',
    value: 67,
    format: (v) => Math.round(v).toString(),
    trend: 33,
    positiveIsGood: false,
    sparkline: [30, 35, 40, 45, 50, 55, 60, 63, 65, 67],
    accent: 'red',
  },
]

// ── Sparkline ─────────────────────────────────────────────────────────────────

function buildPath(data: number[], w: number, h: number): string {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 2

  const xs = data.map((_, i) => (i / (data.length - 1)) * w)
  const ys = data.map(v => h - pad - ((v - min) / range) * (h - pad * 2))

  let d = `M ${xs[0]},${ys[0]}`
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpx},${ys[i - 1]} ${cpx},${ys[i]} ${xs[i]},${ys[i]}`
  }
  return d
}

function Sparkline({ data, good }: { data: number[]; good: boolean }) {
  const W = 200
  const H = 32
  const stroke = good ? 'rgba(59,130,246,0.75)' : 'rgba(239,68,68,0.65)'
  const fill   = good ? 'rgba(59,130,246,0.12)' : 'rgba(239,68,68,0.08)'
  const path   = buildPath(data, W, H)
  const areaPath = `${path} L ${W},${H} L 0,${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <path d={areaPath} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
      {/* Endpoint dot */}
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
  const count = useMotionValue(0)
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
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const isGood = kpi.positiveIsGood ? kpi.trend > 0 : kpi.trend < 0
  const TrendIcon = kpi.trend > 0 ? TrendingUp : TrendingDown

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
        {/* Label */}
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500 mb-3">
          {kpi.label}
        </p>

        {/* Value */}
        <div className="text-[1.75rem] font-bold text-slate-100 tabular-nums leading-none mb-2.5">
          <Counter to={kpi.value} format={kpi.format} inView={inView} />
        </div>

        {/* Trend */}
        <div className={cn(
          'flex items-center gap-1 text-[0.72rem] font-semibold mb-3',
          isGood ? 'text-emerald-400' : 'text-red-400',
        )}>
          <TrendIcon size={11} strokeWidth={2.5} className="shrink-0" />
          <span>{Math.abs(kpi.trend)}%</span>
          <span className="text-slate-600 font-normal">vs last month</span>
        </div>

        {/* Sparkline - pushed to bottom */}
        <div className="mt-auto -mx-1 -mb-1">
          <Sparkline data={kpi.sparkline} good={isGood} />
        </div>
      </Card>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function KPIOverview() {
  return (
    <section className="px-6 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-[1rem] font-semibold text-slate-100">Performance Overview</h2>
          <p className="text-[0.8rem] text-slate-500 mt-0.5">Month-to-date · vs prior 30 days</p>
        </div>
        <span className="text-[0.7rem] text-slate-600 hidden sm:block">Mock data</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {KPIS.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>
    </section>
  )
}
