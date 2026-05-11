'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ── Theme ─────────────────────────────────────────────────────────────────────

const C = {
  grid:  'rgba(255,255,255,0.05)',
  axis:  '#475569',
  blue:  '#3B82F6',
  blue4: '#60A5FA',
  cyan:  '#06B6D4',
  gold:  '#FBBF24',
  green: '#10B981',
  red:   '#EF4444',
} as const

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

const AXIS_PROPS = {
  tick: { fill: C.axis, fontSize: 11 },
  axisLine: false as const,
  tickLine: false as const,
}

// ── Types ─────────────────────────────────────────────────────────────────────

type DateRange = '7D' | '30D' | '90D' | '1Y'
type SalesView = 'D' | 'W' | 'M'

// ── Real data (TCG Player · Jan 20 – May 10 2026) ─────────────────────────────

const DAILY = [
  { label: 'Mar 22', revenue: 180,  units: 3  },
  { label: 'Mar 23', revenue: 221,  units: 7  },
  { label: 'Mar 24', revenue: 171,  units: 8  },
  { label: 'Mar 25', revenue: 166,  units: 12 },
  { label: 'Mar 26', revenue: 78,   units: 4  },
  { label: 'Mar 27', revenue: 234,  units: 10 },
  { label: 'Mar 28', revenue: 40,   units: 1  },
  { label: 'Mar 29', revenue: 60,   units: 1  },
  { label: 'Mar 30', revenue: 277,  units: 6  },
  { label: 'Mar 31', revenue: 253,  units: 6  },
  { label: 'Apr 1',  revenue: 276,  units: 6  },
  { label: 'Apr 2',  revenue: 345,  units: 30 },
  { label: 'Apr 3',  revenue: 362,  units: 22 },
  { label: 'Apr 4',  revenue: 320,  units: 13 },
  { label: 'Apr 5',  revenue: 249,  units: 7  },
  { label: 'Apr 6',  revenue: 0,    units: 0  },
  { label: 'Apr 7',  revenue: 98,   units: 5  },
  { label: 'Apr 8',  revenue: 109,  units: 10 },
  { label: 'Apr 9',  revenue: 139,  units: 8  },
  { label: 'Apr 10', revenue: 169,  units: 11 },
  { label: 'Apr 11', revenue: 199,  units: 8  },
  { label: 'Apr 12', revenue: 304,  units: 16 },
  { label: 'Apr 13', revenue: 170,  units: 7  },
  { label: 'Apr 14', revenue: 0,    units: 0  },
  { label: 'Apr 15', revenue: 123,  units: 3  },
  { label: 'Apr 16', revenue: 145,  units: 5  },
  { label: 'Apr 17', revenue: 371,  units: 8  },
  { label: 'Apr 18', revenue: 61,   units: 8  },
  { label: 'Apr 19', revenue: 448,  units: 24 },
  { label: 'Apr 20', revenue: 59,   units: 4  },
  { label: 'Apr 26', revenue: 318,  units: 23 },
  { label: 'Apr 27', revenue: 38,   units: 2  },
  { label: 'Apr 28', revenue: 25,   units: 5  },
  { label: 'Apr 29', revenue: 86,   units: 9  },
  { label: 'Apr 30', revenue: 54,   units: 15 },
  { label: 'May 1',  revenue: 38,   units: 6  },
  { label: 'May 2',  revenue: 21,   units: 5  },
  { label: 'May 3',  revenue: 86,   units: 5  },
  { label: 'May 4',  revenue: 116,  units: 7  },
  { label: 'May 5',  revenue: 222,  units: 14 },
  { label: 'May 6',  revenue: 149,  units: 10 },
  { label: 'May 7',  revenue: 105,  units: 12 },
  { label: 'May 8',  revenue: 236,  units: 15 },
  { label: 'May 9',  revenue: 47,   units: 17 },
  { label: 'May 10', revenue: 17,   units: 1  },
]

const WEEKLY = [
  { label: 'W1',  revenue: 844,  units: 80  },
  { label: 'W2',  revenue: 99,   units: 29  },
  { label: 'W3',  revenue: 0,    units: 0   },
  { label: 'W4',  revenue: 241,  units: 29  },
  { label: 'W5',  revenue: 204,  units: 30  },
  { label: 'W6',  revenue: 787,  units: 105 },
  { label: 'W7',  revenue: 843,  units: 53  },
  { label: 'W8',  revenue: 1268, units: 104 },
  { label: 'W9',  revenue: 1588, units: 76  },
  { label: 'W10', revenue: 1025, units: 42  },
  { label: 'W11', revenue: 1805, units: 84  },
  { label: 'W12', revenue: 1188, units: 65  },
  { label: 'W13', revenue: 1207, units: 52  },
  { label: 'W14', revenue: 356,  units: 25  },
  { label: 'W15', revenue: 426,  units: 52  },
  { label: 'W16', revenue: 776,  units: 69  },
]

const MONTHLY = [
  { label: 'Jan', revenue: 943,  units: 109 },
  { label: 'Feb', revenue: 1016, units: 135 },
  { label: 'Mar', revenue: 5193, units: 310 },
  { label: 'Apr', revenue: 4467, units: 249 },
  { label: 'May', revenue: 1037, units: 92  },
]

// Which views are selectable per range, and the default
const RANGE_VIEWS: Record<DateRange, SalesView[]> = {
  '7D':  ['D'],
  '30D': ['D', 'W'],
  '90D': ['W', 'M'],
  '1Y':  ['W', 'M'],
}
const RANGE_VIEW_DEFAULT: Record<DateRange, SalesView> = {
  '7D': 'D', '30D': 'D', '90D': 'W', '1Y': 'M',
}

function getSalesData(range: DateRange, view: SalesView) {
  if (view === 'D') return range === '7D' ? DAILY.slice(-7) : DAILY
  if (view === 'W') return range === '30D' ? WEEKLY.slice(-4) : WEEKLY
  return range === '90D' ? MONTHLY : MONTHLY
}

// Avg order value trend per range
const AOV_DATA: Record<DateRange, { label: string; aov: number }[]> = {
  '7D': [
    { label: 'May 4',  aov: 16.5 },
    { label: 'May 5',  aov: 24.7 },
    { label: 'May 6',  aov: 24.8 },
    { label: 'May 7',  aov: 26.2 },
    { label: 'May 8',  aov: 39.4 },
    { label: 'May 9',  aov: 11.8 },
    { label: 'May 10', aov: 17.0 },
  ],
  '30D': [
    { label: 'W13', aov: 40.2 },
    { label: 'W14', aov: 35.6 },
    { label: 'W15', aov: 17.0 },
    { label: 'W16', aov: 25.9 },
  ],
  '90D': [
    { label: 'W1',  aov: 19.2 },
    { label: 'W2',  aov: 9.0  },
    { label: 'W4',  aov: 16.1 },
    { label: 'W5',  aov: 13.6 },
    { label: 'W6',  aov: 17.9 },
    { label: 'W7',  aov: 29.1 },
    { label: 'W8',  aov: 27.5 },
    { label: 'W9',  aov: 37.8 },
    { label: 'W10', aov: 46.6 },
    { label: 'W11', aov: 38.4 },
    { label: 'W12', aov: 24.7 },
    { label: 'W13', aov: 40.2 },
    { label: 'W14', aov: 35.6 },
    { label: 'W15', aov: 17.0 },
    { label: 'W16', aov: 25.9 },
  ],
  '1Y': [
    { label: 'Jan', aov: 17.2 },
    { label: 'Feb', aov: 15.9 },
    { label: 'Mar', aov: 33.5 },
    { label: 'Apr', aov: 32.4 },
    { label: 'May', aov: 22.6 },
  ],
}

// Top states by revenue (full period Jan 20 – May 10)
const TOP_STATES = [
  { state: 'CA', orders: 84, revenue: 2121 },
  { state: 'TX', orders: 37, revenue: 1198 },
  { state: 'NY', orders: 26, revenue: 926  },
  { state: 'FL', orders: 31, revenue: 773  },
  { state: 'PA', orders: 18, revenue: 709  },
  { state: 'CT', orders: 5,  revenue: 609  },
  { state: 'SC', orders: 11, revenue: 550  },
  { state: 'IN', orders: 8,  revenue: 416  },
  { state: 'MA', orders: 11, revenue: 387  },
  { state: 'IL', orders: 16, revenue: 386  },
]

const STATS: Record<DateRange, { revenue: string; units: number; orders: number; aov: string }> = {
  '7D':  { revenue: '$892',    units: 76,  orders: 37,  aov: '$24.10' },
  '30D': { revenue: '$2,765',  units: 198, orders: 95,  aov: '$29.10' },
  '90D': { revenue: '$12,657', units: 895, orders: 458, aov: '$27.63' },
  '1Y':  { revenue: '$12,657', units: 895, orders: 458, aov: '$27.63' },
}

const TOP_SETS = [
  { name: 'One Piece Promotion Cards',       units: 26, revenue: 597, margin: 81.5 },
  { name: 'Premium Booster The Best',        units: 28, revenue: 523, margin: 79.9 },
  { name: 'Premium Booster The Best Vol. 2', units: 33, revenue: 430, margin: 76.2 },
  { name: 'A Fist of Divine Speed',          units: 10, revenue: 405, margin: 84.6 },
  { name: "Adventure on Kami's Island",      units: 11, revenue: 393, margin: 84.1 },
]

// ── Shared primitives ─────────────────────────────────────────────────────────

function Fade({ children, delay = 0, className }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function WidgetTitle({ children, aside }: {
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500">
        {children}
      </p>
      {aside}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border border-white/[0.08] px-3 py-2.5 text-xs shadow-card"
      style={{ background: 'rgba(12,21,36,0.94)', backdropFilter: 'blur(12px)' }}
    >
      <p className="text-slate-400 mb-1.5 font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 font-semibold text-slate-100">
          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: p.color ?? p.fill }} />
          <span className="text-slate-400 font-normal">{p.name}:</span>
          {formatter ? formatter(p.value, p.name) : p.value}
        </div>
      ))}
    </div>
  )
}

// ── Date range filter ─────────────────────────────────────────────────────────

const RANGES: DateRange[] = ['7D', '30D', '90D', '1Y']

function DateFilter({ value, onChange }: { value: DateRange; onChange: (r: DateRange) => void }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-canvas-800/60 border border-white/[0.06]">
      {RANGES.map(r => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={cn(
            'px-3 py-1 rounded-md text-[0.78rem] font-semibold transition-all duration-150',
            value === r
              ? 'bg-primary-500/20 text-primary-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-300',
          )}
        >
          {r}
        </button>
      ))}
    </div>
  )
}

// ── Stats strip ───────────────────────────────────────────────────────────────

function StatsStrip({ range }: { range: DateRange }) {
  const s = STATS[range]
  const items = [
    { label: 'Revenue',    value: s.revenue               },
    { label: 'Items Sold', value: s.units.toLocaleString() },
    { label: 'Orders',     value: s.orders.toLocaleString() },
    { label: 'Avg Order',  value: s.aov                   },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {items.map(({ label, value }) => (
        <Card key={label} className="px-4 py-3">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500 mb-1">{label}</p>
          <p className="text-[1.2rem] font-bold tabular-nums text-slate-100 leading-none">{value}</p>
        </Card>
      ))}
    </div>
  )
}

// ── 1. Sales over time ────────────────────────────────────────────────────────

const VIEW_LABELS: Record<SalesView, string> = { D: 'Daily', W: 'Weekly', M: 'Monthly' }

function SalesChart({ range }: { range: DateRange }) {
  const available = RANGE_VIEWS[range]
  const [preferred, setPreferred] = useState<SalesView>('D')
  const view = available.includes(preferred) ? preferred : RANGE_VIEW_DEFAULT[range]

  const data = getSalesData(range, view)
  const fmt = (v: number) => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)

  return (
    <Card accent="blue" className="p-5">
      <WidgetTitle aside={
        <div className="flex items-center gap-1 p-0.5 rounded-md bg-canvas-900/80 border border-white/[0.06]">
          {(['D', 'W', 'M'] as SalesView[]).map(v => (
            <button
              key={v}
              onClick={() => setPreferred(v)}
              disabled={!available.includes(v)}
              className={cn(
                'px-2.5 py-0.5 rounded text-[0.7rem] font-semibold transition-all duration-150',
                view === v ? 'bg-primary-500/20 text-primary-400' : 'text-slate-500 hover:text-slate-300',
                !available.includes(v) && 'opacity-30 cursor-not-allowed',
              )}
            >
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>
      }>
        Sales Over Time
      </WidgetTitle>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barSize={view === 'D' ? 8 : 24}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="label" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={fmt} />
            <Tooltip
              content={<ChartTooltip formatter={(v: number) => '$' + v.toLocaleString('en-US')} />}
            />
            <Bar dataKey="revenue" name="Revenue" fill={C.blue} fillOpacity={0.8} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── 2. Top-Performing Sets ────────────────────────────────────────────────────

function TopSetsTable() {
  return (
    <Card className="p-5 h-full">
      <WidgetTitle>Top Sets by Listed Value</WidgetTitle>
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="grid gap-3 pb-2 border-b border-white/[0.05] mb-1 min-w-[280px]"
          style={{ gridTemplateColumns: '1fr 60px 80px' }}>
          {['Set', 'Copies', 'Value'].map(h => (
            <p key={h} className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-slate-600">{h}</p>
          ))}
        </div>
        <div className="space-y-0">
          {TOP_SETS.map((s, i) => (
            <div
              key={s.name}
              className="grid items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0 min-w-[280px]"
              style={{ gridTemplateColumns: '1fr 60px 80px' }}
            >
              <div className="min-w-0 flex items-center gap-2">
                <span className="h-5 w-5 rounded shrink-0 flex items-center justify-center text-[0.6rem] font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20">
                  {i + 1}
                </span>
                <p className="text-[0.8rem] font-medium text-slate-200 truncate">{s.name}</p>
              </div>
              <p className="text-[0.8rem] tabular-nums text-slate-300">{s.units}</p>
              <p className="text-[0.8rem] tabular-nums font-semibold text-slate-100">${s.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ── 3. Avg Order Value Tracker ────────────────────────────────────────────────

function AvgOrderValueChart({ range }: { range: DateRange }) {
  const data = AOV_DATA[range]
  const nonZero = data.filter(d => d.aov > 0)
  const latest = nonZero.length ? nonZero[nonZero.length - 1].aov : 0
  const first  = nonZero.length ? nonZero[0].aov : 0
  const pct = first > 0 ? +((latest - first) / first * 100).toFixed(1) : 0

  return (
    <Card accent="green" className="p-5 h-full">
      <WidgetTitle aside={
        <span className={cn('text-[0.72rem] font-semibold flex items-center gap-1', pct >= 0 ? 'text-emerald-400' : 'text-red-400')}>
          {pct >= 0 ? <TrendingUp size={11} strokeWidth={2.5} /> : <TrendingDown size={11} strokeWidth={2.5} />}
          {pct >= 0 ? '+' : ''}{pct}%
        </span>
      }>
        Avg Order Value
      </WidgetTitle>
      <p className="text-[2rem] font-bold tabular-nums text-emerald-400 leading-none mb-4">
        ${latest.toFixed(2)}
      </p>
      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="label" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} domain={[0, 'auto']} tickFormatter={v => '$' + v} />
            <Tooltip content={<ChartTooltip formatter={(v: number) => '$' + v.toFixed(2)} />} />
            <Line
              type="monotone"
              dataKey="aov"
              name="AOV"
              stroke={C.green}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: C.green, stroke: 'rgba(16,185,129,0.3)', strokeWidth: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── 4. Top States by Revenue ──────────────────────────────────────────────────

function TopStatesChart() {
  const fmt = (v: number) => '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)
  return (
    <Card className="p-5">
      <WidgetTitle aside={
        <span className="text-[0.62rem] text-slate-600 hidden sm:block">Jan 20 – May 10 · 50 states reached</span>
      }>
        Revenue by State
      </WidgetTitle>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={TOP_STATES} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barSize={18}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="state" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={fmt} />
            <Tooltip content={<ChartTooltip formatter={(v: number, name: string) =>
              name === 'revenue' ? '$' + v.toLocaleString('en-US') : v.toString()
            } />} />
            <Bar dataKey="revenue" name="revenue" fill={C.blue} fillOpacity={0.82} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── Tableau deep-dive banner ──────────────────────────────────────────────────

function TableauBanner() {
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 rounded-xl border mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(139,92,246,0.05) 100%)',
        borderColor: 'rgba(59,130,246,0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center mt-0.5"
          style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
        >
          <ArrowUpRight size={16} strokeWidth={2.2} style={{ color: '#3B82F6' }} />
        </div>
        <div>
          <p className="text-[0.88rem] font-semibold text-slate-100 leading-tight">
            Real Sales Data Available
          </p>
          <p className="text-[0.75rem] text-slate-400 mt-0.5 leading-relaxed">
            Actual Jan-May 2026 TCG Player sales analytics are on the Reports page.
            Charts below are inventory snapshot estimates only.
          </p>
        </div>
      </div>
      <Link
        href="/reports"
        className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-[0.8rem] font-semibold text-primary-400 border border-primary-500/30 bg-primary-500/10 hover:bg-primary-500/20 transition-colors no-underline whitespace-nowrap"
      >
        View Reports
        <ArrowUpRight size={13} strokeWidth={2.5} />
      </Link>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function SalesAnalytics() {
  const [range, setRange] = useState<DateRange>('30D')

  return (
    <section className="px-6 pt-8 pb-16 max-w-6xl mx-auto">
      {/* Header + filter */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
          <div>
            <h2 className="text-[1rem] font-semibold text-slate-100">Sales Analytics</h2>
            <p className="text-[0.8rem] text-slate-500 mt-0.5">Jan 20 – May 10 2026 · real TCG Player data</p>
          </div>
        </div>
        <DateFilter value={range} onChange={setRange} />
      </div>

      {/* Stats strip */}
      <StatsStrip range={range} />

      {/* Sales chart - full width */}
      <Fade delay={0} className="mb-4">
        <SalesChart range={range} />
      </Fade>

      {/* Row 2: Top sets + AOV */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <Fade delay={0.06} className="lg:col-span-3">
          <TopSetsTable />
        </Fade>
        <Fade delay={0.12} className="lg:col-span-2">
          <AvgOrderValueChart range={range} />
        </Fade>
      </div>

      {/* Top states - full width */}
      <Fade delay={0.08}>
        <TopStatesChart />
      </Fade>
    </section>
  )
}
