'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
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
import { AlertTriangle, DollarSign, MapPin, Package, TrendingDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ── Theme ─────────────────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

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

const AXIS = {
  tick: { fill: C.axis, fontSize: 11 },
  axisLine: false as const,
  tickLine: false as const,
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const REVENUE_DATA = [
  { month: 'Jun', revenue: 4200  },
  { month: 'Jul', revenue: 5100  },
  { month: 'Aug', revenue: 4800  },
  { month: 'Sep', revenue: 6200  },
  { month: 'Oct', revenue: 7100  },
  { month: 'Nov', revenue: 8400  },
  { month: 'Dec', revenue: 9200  },
  { month: 'Jan', revenue: 8100  },
  { month: 'Feb', revenue: 9800  },
  { month: 'Mar', revenue: 11200 },
  { month: 'Apr', revenue: 10800 },
  { month: 'May', revenue: 12840 },
]

const CATEGORY_DATA = [
  { name: 'SR',    value: 1874 },
  { name: 'L',     value: 1020 },
  { name: 'R',     value: 821  },
  { name: 'SEC',   value: 490  },
  { name: 'Other', value: 694  },
]

const INVENTORY_DATA = [
  { month: 'Jun', singles: 180, sealed: 24 },
  { month: 'Jul', singles: 165, sealed: 20 },
  { month: 'Aug', singles: 190, sealed: 18 },
  { month: 'Sep', singles: 210, sealed: 22 },
  { month: 'Oct', singles: 195, sealed: 28 },
  { month: 'Nov', singles: 220, sealed: 25 },
  { month: 'Dec', singles: 185, sealed: 30 },
  { month: 'Jan', singles: 160, sealed: 20 },
  { month: 'Feb', singles: 175, sealed: 18 },
  { month: 'Mar', singles: 155, sealed: 15 },
  { month: 'Apr', singles: 148, sealed: 12 },
  { month: 'May', singles: 145, sealed: 10 },
]

const INSIGHTS = [
  {
    Icon: MapPin,
    iconBg: 'bg-primary-500/15',
    iconColor: 'text-primary-400',
    border: 'border-l-primary-500',
    text: 'California leads buyer demand with 69 orders — 17.5% of total sales',
  },
  {
    Icon: TrendingDown,
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    border: 'border-l-amber-500',
    text: 'February order volume dropped 68% — lowest period Jan–Apr 2026',
  },
  {
    Icon: Package,
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    border: 'border-l-orange-500',
    text: 'Tracked shipping costs peaked week of March 29 at $131 — 3× weekly average',
  },
  {
    Icon: DollarSign,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    border: 'border-l-emerald-500',
    text: 'Average order value held steady at $28.24 across all 393 orders',
  },
]

const REORDER_ALERTS = [
  { name: 'Monkey.D.Luffy AA (OP11-040)',  stock: 2, min: 5, urgent: true  },
  { name: 'Sanji AA (OP02-026)',           stock: 1, min: 3, urgent: true  },
  { name: 'Nefeltari Vivi AA',             stock: 3, min: 5, urgent: true  },
  { name: 'Ace & Sabo & Luffy AA',         stock: 6, min: 8, urgent: false },
  { name: 'Boa Hancock AA (OP14-112)',      stock: 1, min: 3, urgent: false },
]

// ── Shared primitives ─────────────────────────────────────────────────────────

// Frosted tooltip - wrap in a factory so we can inject a valueFormatter per chart
// Recharts tooltip types are awkward with readonly arrays - use any here intentionally
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeTooltip(valueFormatter: (v: number) => string): (props: any) => React.ReactElement | null {
  return function T({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
      <div
        className="rounded-lg border border-white/[0.08] px-3 py-2.5 text-xs shadow-card"
        style={{ background: 'rgba(12,21,36,0.94)', backdropFilter: 'blur(12px)' }}
      >
        {label && <p className="text-slate-400 mb-1.5 font-medium">{label}</p>}
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 font-semibold text-slate-100">
            <span
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ background: p.color ?? p.stroke }}
            />
            <span className="text-slate-400 font-normal">{p.name}:</span>
            {valueFormatter(p.value)}
          </div>
        ))}
      </div>
    )
  }
}

function WidgetTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500">
        {children}
      </p>
      {aside}
    </div>
  )
}

function Fade({
  children,
  delay = 0,
  className,
}: {
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

// ── 1. Revenue Growth - LineChart ─────────────────────────────────────────────

const revTooltip = makeTooltip(v => '$' + v.toLocaleString('en-US'))

function RevenueChart() {
  return (
    <Card accent="blue" className="p-5 h-full">
      <WidgetTitle>Revenue Growth - Last 12 Months</WidgetTitle>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={REVENUE_DATA} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.blue} stopOpacity={0.18} />
                <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="month" {...AXIS} />
            <YAxis {...AXIS} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'} />
            <Tooltip content={revTooltip} />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={C.blue}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: C.blue4, stroke: 'rgba(96,165,250,0.3)', strokeWidth: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── 2. Sales by Rarity - BarChart ─────────────────────────────────────────────

const catTooltip = makeTooltip(v => '$' + v.toLocaleString('en-US'))

function CategoryChart() {
  return (
    <Card className="p-5 h-full">
      <WidgetTitle>Sales by Rarity</WidgetTitle>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={CATEGORY_DATA} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="name" {...AXIS} />
            <YAxis {...AXIS} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'} />
            <Tooltip content={catTooltip} />
            <Bar
              dataKey="value"
              name="Revenue"
              fill={C.blue}
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── 3. Inventory Trends - AreaChart ──────────────────────────────────────────

const invTooltip = makeTooltip(v => v.toString())

const InvLegend = (
  <div className="flex gap-4 text-[0.62rem] text-slate-500">
    <span className="flex items-center gap-1.5">
      <span className="h-[2px] w-4 rounded-full inline-block" style={{ background: C.blue }} />
      Singles
    </span>
    <span className="flex items-center gap-1.5">
      <span className="h-[2px] w-4 rounded-full inline-block" style={{ background: C.cyan }} />
      Sealed
    </span>
  </div>
)

function InventoryChart() {
  return (
    <Card accent="green" className="p-5 h-full">
      <WidgetTitle aside={InvLegend}>Inventory Trends</WidgetTitle>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={INVENTORY_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="singlesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.blue} stopOpacity={0.22} />
                <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sealedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.cyan} stopOpacity={0.18} />
                <stop offset="95%" stopColor={C.cyan} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="month" {...AXIS} />
            <YAxis {...AXIS} />
            <Tooltip content={invTooltip} />
            <Area
              type="monotone"
              dataKey="singles"
              name="Singles"
              stroke={C.blue}
              strokeWidth={2}
              fill="url(#singlesGrad)"
              dot={false}
              activeDot={{ r: 3, fill: C.blue, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="sealed"
              name="Sealed"
              stroke={C.cyan}
              strokeWidth={2}
              fill="url(#sealedGrad)"
              dot={false}
              activeDot={{ r: 3, fill: C.cyan, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── 4. Data Insights ─────────────────────────────────────────────────────────

function DataInsights() {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <WidgetTitle>Data Insights</WidgetTitle>
        <span className="text-[0.62rem] text-slate-600 leading-none mt-0.5 hidden sm:block">
          Derived from Jan–Apr 2026 TCGPlayer sales analysis
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INSIGHTS.map(({ Icon, iconBg, iconColor, border, text }) => (
          <div
            key={text}
            className={cn(
              'flex items-start gap-3 px-3 py-3 rounded-lg bg-white/[0.02] border border-white/[0.05] border-l-2',
              border,
            )}
          >
            <div className={cn('h-7 w-7 shrink-0 rounded-md flex items-center justify-center mt-0.5', iconBg)}>
              <Icon size={13} strokeWidth={2.2} className={iconColor} />
            </div>
            <p className="text-[0.78rem] text-slate-300 leading-snug">{text}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── 5. Reorder Alerts ─────────────────────────────────────────────────────────

function ReorderAlerts() {
  return (
    <Card accent="red" className="p-5 h-full">
      <WidgetTitle
        aside={
          <Badge variant="red" size="sm">{REORDER_ALERTS.length} items</Badge>
        }
      >
        Reorder Alerts
      </WidgetTitle>
      <div className="space-y-2">
        {REORDER_ALERTS.map(item => (
          <div
            key={item.name}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]"
          >
            {/* Icon */}
            <div
              className={cn(
                'h-7 w-7 shrink-0 rounded-md flex items-center justify-center',
                item.urgent ? 'bg-red-500/15' : 'bg-amber-400/10',
              )}
            >
              <AlertTriangle
                size={12}
                strokeWidth={2.5}
                className={item.urgent ? 'text-red-400' : 'text-amber-400'}
              />
            </div>
            {/* Name + stock */}
            <div className="flex-1 min-w-0">
              <p className="text-[0.8rem] font-medium text-slate-200 truncate leading-tight">
                {item.name}
              </p>
              <p className="text-[0.62rem] text-slate-500 leading-tight">
                {item.stock} in stock · min {item.min}
              </p>
            </div>
            {/* Badge */}
            <Badge variant={item.urgent ? 'red' : 'gold'} size="sm">Reorder</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function AnalyticsPreview() {
  return (
    <section className="px-6 pt-8 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
        <div>
          <h2 className="text-[1rem] font-semibold text-slate-100">Analytics Preview</h2>
          <p className="text-[0.8rem] text-slate-500 mt-0.5">Live inventory snapshot · trend charts estimated</p>
        </div>
      </div>

      {/* Row 1: Revenue (2-col) + Category (1-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Fade delay={0} className="lg:col-span-2">
          <RevenueChart />
        </Fade>
        <Fade delay={0.08}>
          <CategoryChart />
        </Fade>
      </div>

      {/* Row 2: Inventory (2-col) + Alerts (1-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Fade delay={0.06} className="lg:col-span-2">
          <InventoryChart />
        </Fade>
        <Fade delay={0.14}>
          <ReorderAlerts />
        </Fade>
      </div>

      {/* Row 3: Data Insights (full width) */}
      <Fade delay={0.04}>
        <DataInsights />
      </Fade>
    </section>
  )
}
