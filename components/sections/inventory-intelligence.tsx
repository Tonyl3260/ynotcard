'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertTriangle, Package, TrendingDown, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ── Theme ─────────────────────────────────────────────────────────────────────

const C = {
  grid:  'rgba(255,255,255,0.05)',
  axis:  '#475569',
  blue:  '#3B82F6',
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

// ── Mock data ─────────────────────────────────────────────────────────────────

const LOW_STOCK = [
  { name: 'Sanji AA',                 sku: 'OP02-026', stock: 1, threshold: 3, urgent: true  },
  { name: 'Boa Hancock AA',           sku: 'OP14-112', stock: 1, threshold: 3, urgent: true  },
  { name: 'Monkey.D.Luffy SEC AA',    sku: 'OP15-119', stock: 1, threshold: 3, urgent: true  },
  { name: 'Nico Robin Parallel',      sku: 'OP09-062', stock: 1, threshold: 3, urgent: false },
  { name: 'Roronoa Zoro AA',          sku: 'EB04-007', stock: 1, threshold: 3, urgent: false },
  { name: 'Monkey.D.Luffy AA',        sku: 'OP11-040', stock: 2, threshold: 4, urgent: false },
]

const FORECAST_DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i === 0 ? 'Now' : i % 5 === 0 ? `D${i}` : '',
  label: `Day ${i}`,
  stock: Math.max(0, Math.round(18 - 0.45 * i + Math.sin(i * 0.4) * 1.2)),
}))

const AGING_DATA = [
  { bucket: '0–30 days',  pct: 42, color: C.green },
  { bucket: '31–60 days', pct: 28, color: C.blue  },
  { bucket: '61–90 days', pct: 18, color: C.gold  },
  { bucket: '90+ days',   pct: 12, color: C.red   },
]

const HEATMAP_PRODUCTS = [
  { name: 'Ace&Sabo&Luffy AA', weeks: [8, 9, 7,  6] },
  { name: 'Rob Lucci Promo',   weeks: [5, 6, 7,  8] },
  { name: 'DON!! Nami PB2',    weeks: [4, 5, 5,  6] },
  { name: 'Helmeppo AA',       weeks: [3, 4, 3,  4] },
  { name: 'Kuzan Parallel',    weeks: [6, 5, 7,  6] },
  { name: 'Franky Parallel',   weeks: [2, 3, 2,  4] },
  { name: 'Benn.Beckman SR',   weeks: [3, 2, 4,  3] },
  { name: 'Sanji OP10-005',    weeks: [4, 4, 5,  4] },
]

const RESTOCK_ACTIONS = [
  {
    Icon: Zap,
    color: C.red,
    bg: 'rgba(239,68,68,0.08)',
    title: 'Reprice: 67 singles above market (55%)',
    body: 'Monkey.D.Luffy AA (OP11-040) is 125% above market at $99.95 vs $44.47. Aligning to market could significantly improve conversion.',
  },
  {
    Icon: TrendingDown,
    color: C.gold,
    bg: 'rgba(251,191,36,0.07)',
    title: 'Single-copy risk: Sanji AA ($229.95)',
    body: 'Your most valuable item has only 1 copy. Monitor closely and consider sourcing more or dropping toward the $166 market price.',
  },
  {
    Icon: Package,
    color: C.blue,
    bg: 'rgba(59,130,246,0.07)',
    title: 'Sealed opportunity: Awakening Booster Boxes',
    body: '2 OP-05 booster boxes listed at $250 each. Strong margin at $215.57 net per box. Consider sourcing more while the set appreciates.',
  },
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

// ── 1. Low Stock Warnings ─────────────────────────────────────────────────────

function LowStockPanel() {
  const sorted = [...LOW_STOCK].sort((a, b) => Number(b.urgent) - Number(a.urgent))
  return (
    <Card accent="red" className="p-5 h-full">
      <WidgetTitle aside={<Badge variant="red" size="sm">{LOW_STOCK.length} items</Badge>}>
        Low Quantity Singles
      </WidgetTitle>
      <div className="space-y-1.5">
        {sorted.map(item => (
          <div
            key={item.sku}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg border',
              item.urgent
                ? 'bg-red-500/[0.06] border-red-500/20'
                : 'bg-white/[0.02] border-white/[0.05]',
            )}
          >
            <AlertTriangle
              size={13}
              strokeWidth={2.5}
              className={cn('shrink-0', item.urgent ? 'text-red-400' : 'text-amber-400')}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[0.8rem] font-medium text-slate-200 truncate leading-tight">
                {item.name}
              </p>
              <p className="text-[0.62rem] text-slate-500">{item.sku}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className={cn(
                'text-[0.78rem] font-bold tabular-nums',
                item.urgent ? 'text-red-400' : 'text-amber-400',
              )}>
                {item.stock}/{item.threshold}
              </p>
              <div className="h-[3px] w-14 rounded-full bg-white/[0.06] mt-1">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(item.stock / item.threshold) * 100}%`,
                    background: item.urgent ? C.red : C.gold,
                    opacity: 0.75,
                  }}
                />
              </div>
            </div>
            <Badge variant={item.urgent ? 'red' : 'gold'} size="sm" className="shrink-0">
              {item.urgent ? 'Critical' : 'Low'}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── 2. Stock Forecast ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ForecastTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div
      className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs shadow-card"
      style={{ background: 'rgba(12,21,36,0.94)', backdropFilter: 'blur(12px)' }}
    >
      <p className="text-slate-400 mb-1">{d.label}</p>
      <p className="font-semibold text-slate-100">{payload[0].value} units remaining</p>
    </div>
  )
}

function StockForecast() {
  return (
    <Card accent="blue" className="p-5 h-full">
      <WidgetTitle aside={
        <span className="text-[0.62rem] text-slate-600 hidden sm:block">Ace & Sabo & Luffy AA</span>
      }>
        Stock Forecast · 30 days
      </WidgetTitle>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={FORECAST_DATA} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="day" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} />
            <Tooltip content={<ForecastTooltip />} />
            <ReferenceLine
              y={5}
              stroke={C.red}
              strokeDasharray="4 3"
              strokeOpacity={0.5}
              label={{ value: 'Reorder', fill: C.red, fontSize: 10, position: 'insideTopRight' }}
            />
            <Line
              type="monotone"
              dataKey="stock"
              name="Stock"
              stroke={C.blue}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: C.blue, stroke: 'rgba(59,130,246,0.3)', strokeWidth: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── 3. Inventory Aging ────────────────────────────────────────────────────────

function InventoryAging() {
  return (
    <Card className="p-5 h-full">
      <WidgetTitle>Inventory Aging</WidgetTitle>
      <div className="space-y-3">
        {AGING_DATA.map(({ bucket, pct, color }) => (
          <div key={bucket}>
            <div className="flex justify-between mb-1.5">
              <span className="text-[0.75rem] text-slate-400">{bucket}</span>
              <span className="text-[0.75rem] font-semibold tabular-nums" style={{ color }}>
                {pct}%
              </span>
            </div>
            <div className="h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: color, opacity: 0.75 }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
              />
            </div>
          </div>
        ))}
        <div className="pt-3 border-t border-white/[0.05] space-y-1.5">
          <div className="flex justify-between text-[0.72rem]">
            <span className="text-slate-500">Healthy stock (≤60 days)</span>
            <span className="text-emerald-400 font-semibold">70%</span>
          </div>
          <div className="flex justify-between text-[0.72rem]">
            <span className="text-slate-500">At-risk stock (60+ days)</span>
            <span className="text-red-400 font-semibold">30%</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ── 4. Product Movement Heatmap ───────────────────────────────────────────────

function heatColor(v: number): string {
  const t = v / 10
  if (t > 0.75) return `rgba(16,185,129,${0.25 + t * 0.5})`
  if (t > 0.45) return `rgba(59,130,246,${0.18 + t * 0.4})`
  if (t > 0.2)  return `rgba(251,191,36,${0.12 + t * 0.35})`
  return             `rgba(239,68,68,${0.08 + t * 0.3})`
}

function MovementHeatmap() {
  const WEEKS = ['W–3', 'W–2', 'W–1', 'W0']
  return (
    <Card className="p-5 h-full">
      <WidgetTitle aside={
        <div className="flex gap-3 text-[0.6rem] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: 'rgba(239,68,68,0.35)', display: 'inline-block' }} />
            Slow
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: 'rgba(16,185,129,0.6)', display: 'inline-block' }} />
            Fast
          </span>
        </div>
      }>
        Product Movement
      </WidgetTitle>
      <div className="overflow-x-auto -mx-1 px-1">
      <div className="grid gap-1 min-w-[260px]" style={{ gridTemplateColumns: '1fr repeat(4, 34px)' }}>
        <div />
        {WEEKS.map(w => (
          <div key={w} className="text-center text-[0.6rem] text-slate-600 pb-1">{w}</div>
        ))}
        {HEATMAP_PRODUCTS.map(({ name, weeks }) => (
          <React.Fragment key={name}>
            <div className="text-[0.68rem] text-slate-400 flex items-center truncate pr-2 h-7">
              {name}
            </div>
            {weeks.map((v, i) => (
              <div
                key={i}
                className="h-7 rounded-md flex items-center justify-center text-[0.62rem] font-bold border border-white/[0.04]"
                style={{
                  background: heatColor(v),
                  color: v >= 7 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
                }}
              >
                {v}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      </div>{/* /overflow-x-auto */}
    </Card>
  )
}

// ── 5. Restock Recommendations ────────────────────────────────────────────────

function RestockRecommendations() {
  return (
    <Card accent="purple" className="p-5 h-full">
      <WidgetTitle aside={
        <span className="flex items-center gap-1.5 text-[0.62rem] text-violet-400 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          AI Insights
        </span>
      }>
        Restock Recommendations
      </WidgetTitle>
      <div className="space-y-3">
        {RESTOCK_ACTIONS.map(({ Icon, color, bg, title, body }) => (
          <div
            key={title}
            className="flex gap-3 p-3 rounded-lg border border-white/[0.05]"
            style={{ background: bg }}
          >
            <div
              className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center mt-0.5"
              style={{ background: color + '22', border: `1px solid ${color}33` }}
            >
              <Icon size={14} strokeWidth={2.2} style={{ color }} />
            </div>
            <div>
              <p className="text-[0.8rem] font-semibold text-slate-100 leading-tight mb-0.5">
                {title}
              </p>
              <p className="text-[0.72rem] text-slate-400 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function InventoryIntelligence() {
  return (
    <section className="px-6 pt-8 pb-16 max-w-6xl mx-auto">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
        <div>
          <h2 className="text-[1rem] font-semibold text-slate-100">Inventory Intelligence</h2>
          <p className="text-[0.8rem] text-slate-500 mt-0.5">Low qty · aging · movement · live snapshot</p>
        </div>
      </div>

      {/* Row 1: Low Stock (wide) + Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <Fade delay={0} className="lg:col-span-3">
          <LowStockPanel />
        </Fade>
        <Fade delay={0.08} className="lg:col-span-2">
          <StockForecast />
        </Fade>
      </div>

      {/* Row 2: Aging + Heatmap + Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Fade delay={0.06}>
          <InventoryAging />
        </Fade>
        <Fade delay={0.12}>
          <MovementHeatmap />
        </Fade>
        <Fade delay={0.18}>
          <RestockRecommendations />
        </Fade>
      </div>
    </section>
  )
}
