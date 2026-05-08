'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
  purple:'#8B5CF6',
} as const

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

const AXIS_PROPS = {
  tick: { fill: C.axis, fontSize: 11 },
  axisLine: false as const,
  tickLine: false as const,
}

// ── Mock data ─────────────────────────────────────────────────────────────────

// 5 tracked products - deterministic price series using sin curves
const TRACKED = [
  { key: 'luffy',  name: 'Luffy OP05-013 SR', color: C.blue   },
  { key: 'shanks', name: 'Shanks OP06-022 L',  color: C.red    },
  { key: 'nami',   name: 'Nami OP07-019 SEC',  color: C.cyan   },
  { key: 'zoro',   name: 'Zoro OP04-025 L',    color: C.green  },
  { key: 'yamato', name: 'Yamato OP05-111 SR', color: C.gold   },
]

const PRICE_TREND = Array.from({ length: 30 }, (_, i) => ({
  day:    i === 0 ? 'D1' : i % 5 === 0 ? `D${i + 1}` : '',
  luffy:  Math.round(120 + 0.6 * i + 8  * Math.sin(i * 0.40)),
  shanks: Math.round(85  - 0.3 * i + 6  * Math.sin(i * 0.52 + 1.0)),
  nami:   Math.round(175 + 1.3 * i + 10 * Math.sin(i * 0.30 + 2.0)),
  zoro:   Math.round(95  + 0.2 * i + 5  * Math.sin(i * 0.60)),
  yamato: Math.round(140 + 0.9 * i + 12 * Math.sin(i * 0.35 + 0.5)),
}))

// Market index over 90 days
const MARKET_INDEX = Array.from({ length: 90 }, (_, i) => ({
  day:   i % 15 === 0 ? `D${i + 1}` : '',
  index: Math.round(1000 + 2.8 * i + 40 * Math.sin(i * 0.14) + 22 * Math.sin(i * 0.31 + 1)),
}))

// Volatility groups
const VOLATILE: Record<'high' | 'medium' | 'low', {
  name: string; price: number; change: number; volatility: number; range: [number, number]
}[]> = {
  high: [
    { name: 'Nami OP07-019 SEC',   price: 213, change:  18.2, volatility: 84, range: [148, 224] },
    { name: 'Yamato OP05-111 SR',  price: 167, change: -11.4, volatility: 76, range: [142, 191] },
  ],
  medium: [
    { name: 'Luffy OP05-013 SR',   price: 138, change:   6.1, volatility: 48, range: [118, 152] },
    { name: 'Shanks OP06-022 L',   price:  77, change:  -4.8, volatility: 41, range: [70,  90]  },
    { name: 'Sabo OP05-060 SR',    price: 105, change:   2.9, volatility: 44, range: [94, 116]  },
  ],
  low: [
    { name: 'Zoro OP04-025 L',     price:  97, change:   1.4, volatility: 18, range: [91, 102]  },
    { name: 'OP-06 Display Box',   price: 145, change:  -0.8, volatility: 14, range: [138, 151] },
    { name: 'OP-07 Booster Pack',  price:  18, change:   0.2, volatility: 11, range: [17,  20]  },
  ],
}

// Hot movers - 7 day
const GAINERS = [
  { name: 'Nami OP07-019 SEC',   detail: 'OP07 · SEC', price: 213, change:  18.2, changeAbs: 32 },
  { name: 'Luffy OP08-001 SR',   detail: 'OP08 · SR',  price: 156, change:  14.7, changeAbs: 20 },
  { name: 'Sabo OP05-060 SR',    detail: 'OP05 · SR',  price: 105, change:   9.4, changeAbs: 9  },
  { name: 'OP-08 Booster Pack',  detail: 'Sealed',     price:  88, change:   6.8, changeAbs: 6  },
  { name: 'Yamato OP05-111 SR',  detail: 'OP05 · SR',  price: 167, change:   5.1, changeAbs: 8  },
]

const LOSERS = [
  { name: 'Shanks OP06-022 L',   detail: 'OP06 · L',   price:  77, change: -11.4, changeAbs: -10 },
  { name: 'OP-06 Display Box',   detail: 'Sealed',      price: 145, change:  -7.2, changeAbs: -11 },
  { name: 'Zoro OP04-025 L',     detail: 'OP04 · L',   price:  97, change:  -4.8, changeAbs: -5  },
  { name: 'OP-07 Booster Box',   detail: 'Sealed',      price: 312, change:  -3.9, changeAbs: -13 },
  { name: 'Robin OP03-040 SR',   detail: 'OP03 · SR',  price:  42, change:  -2.6, changeAbs: -1  },
]

// ── Shared primitives ─────────────────────────────────────────────────────────

function Fade({ children, delay = 0, className }: {
  children: React.ReactNode; delay?: number; className?: string
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
  children: React.ReactNode; aside?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500">{children}</p>
      {aside}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label, fmtValue }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border border-white/[0.08] px-3 py-2.5 text-xs shadow-card"
      style={{ background: 'rgba(12,21,36,0.94)', backdropFilter: 'blur(12px)' }}
    >
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 font-semibold text-slate-100 leading-snug">
          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: p.color ?? p.stroke }} />
          <span className="text-slate-400 font-normal truncate max-w-[120px]">{p.name}:</span>
          {fmtValue ? fmtValue(p.value) : p.value}
        </div>
      ))}
    </div>
  )
}

// Custom Legend renderer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartLegend({ payload }: any) {
  if (!payload?.length) return null
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-end pt-1">
      {payload.map((p: any) => (
        <span key={p.value} className="flex items-center gap-1.5 text-[0.62rem] text-slate-500">
          <span className="h-[2px] w-3 rounded-full inline-block" style={{ background: p.color }} />
          {p.value}
        </span>
      ))}
    </div>
  )
}

// ── 1. Price Trend ────────────────────────────────────────────────────────────

function PriceTrend() {
  return (
    <Card accent="blue" className="p-5 h-full">
      <WidgetTitle aside={
        <span className="text-[0.62rem] text-slate-600 hidden sm:block">Last 30 days · USD</span>
      }>
        Price Trends - Top 5 Tracked
      </WidgetTitle>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={PRICE_TREND} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="day" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={v => '$' + v} />
            <Tooltip content={<ChartTooltip fmtValue={(v: number) => '$' + v} />} />
            <Legend content={<ChartLegend />} />
            {TRACKED.map(({ key, name, color }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={name}
                stroke={color}
                strokeWidth={1.75}
                dot={false}
                activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── 2. Volatility Indicators ──────────────────────────────────────────────────

const VOL_META = {
  high:   { label: 'High',   variant: 'red'   as const, bar: C.red   },
  medium: { label: 'Medium', variant: 'gold'  as const, bar: C.gold  },
  low:    { label: 'Low',    variant: 'green' as const, bar: C.green },
}

function VolatilityPanel() {
  return (
    <Card className="p-5 h-full">
      <WidgetTitle>Volatility Indicators</WidgetTitle>
      <div className="space-y-4">
        {(['high', 'medium', 'low'] as const).map(level => {
          const { label, variant, bar } = VOL_META[level]
          return (
            <div key={level}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={variant} size="sm">{label}</Badge>
              </div>
              <div className="space-y-1.5">
                {VOLATILE[level].map(p => (
                  <div
                    key={p.name}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.75rem] font-medium text-slate-200 truncate leading-tight">{p.name}</p>
                      <p className="text-[0.62rem] text-slate-500">
                        ${p.range[0]}–${p.range[1]}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[0.78rem] font-bold tabular-nums text-slate-100">${p.price}</p>
                      <p className={cn(
                        'text-[0.62rem] font-semibold',
                        p.change >= 0 ? 'text-emerald-400' : 'text-red-400',
                      )}>
                        {p.change >= 0 ? '+' : ''}{p.change}%
                      </p>
                    </div>
                    {/* Volatility bar */}
                    <div className="shrink-0 w-10">
                      <div className="h-[3px] rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${p.volatility}%`, background: bar, opacity: 0.7 }}
                        />
                      </div>
                      <p className="text-[0.58rem] text-slate-600 text-right mt-0.5">{p.volatility}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── 3. Market Movement ────────────────────────────────────────────────────────

const firstIdx = MARKET_INDEX[0].index
const lastIdx  = MARKET_INDEX[MARKET_INDEX.length - 1].index
const idxChange = +(((lastIdx - firstIdx) / firstIdx) * 100).toFixed(1)

function MarketMovement() {
  return (
    <Card accent="purple" className="p-5 h-full">
      <WidgetTitle aside={
        <span className={cn('text-[0.72rem] font-semibold flex items-center gap-1', idxChange >= 0 ? 'text-emerald-400' : 'text-red-400')}>
          {idxChange >= 0 ? <TrendingUp size={11} strokeWidth={2.5} /> : <TrendingDown size={11} strokeWidth={2.5} />}
          {idxChange >= 0 ? '+' : ''}{idxChange}% (90d)
        </span>
      }>
        OP-TCG Market Index
      </WidgetTitle>
      {/* Big number */}
      <p className="text-[1.9rem] font-bold tabular-nums text-slate-100 leading-none mb-4">
        {lastIdx.toLocaleString()}
        <span className="text-[0.75rem] font-normal text-slate-500 ml-2">pts</span>
      </p>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={MARKET_INDEX} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="idxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={C.purple} stopOpacity={0.25} />
                <stop offset="100%" stopColor={C.purple} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="day" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} domain={['auto', 'auto']} tickFormatter={v => v.toLocaleString()} />
            <Tooltip content={<ChartTooltip fmtValue={(v: number) => v.toLocaleString() + ' pts'} />} />
            <Area
              type="monotone"
              dataKey="index"
              name="Index"
              stroke={C.purple}
              strokeWidth={2}
              fill="url(#idxGrad)"
              dot={false}
              activeDot={{ r: 4, fill: C.purple, stroke: 'rgba(139,92,246,0.3)', strokeWidth: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── 4. Hot Movers ─────────────────────────────────────────────────────────────

type Mover = typeof GAINERS[number]

function MoverRow({ m, isGainer }: { m: Mover; isGainer: boolean }) {
  const color = isGainer ? C.green : C.red
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-white/[0.04] last:border-0">
      <div
        className="h-7 w-7 shrink-0 rounded-md flex items-center justify-center"
        style={{ background: color + '18', border: `1px solid ${color}28` }}
      >
        {isGainer
          ? <TrendingUp size={13} strokeWidth={2.5} style={{ color }} />
          : <TrendingDown size={13} strokeWidth={2.5} style={{ color }} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.78rem] font-medium text-slate-200 truncate leading-tight">{m.name}</p>
        <p className="text-[0.62rem] text-slate-500">{m.detail}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[0.8rem] font-bold tabular-nums text-slate-100">${m.price}</p>
        <p className="text-[0.65rem] font-semibold tabular-nums" style={{ color }}>
          {isGainer ? '+' : ''}{m.change}%
        </p>
      </div>
    </div>
  )
}

function HotMovers() {
  return (
    <Card className="p-5 h-full">
      <WidgetTitle aside={
        <span className="text-[0.62rem] text-slate-600">Last 7 days</span>
      }>
        Hot Movers
      </WidgetTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gainers */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.green }} />
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-emerald-500">Gainers</p>
          </div>
          {GAINERS.map(m => <MoverRow key={m.name} m={m} isGainer />)}
        </div>
        {/* Losers */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.red }} />
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-red-500">Losers</p>
          </div>
          {LOSERS.map(m => <MoverRow key={m.name} m={m} isGainer={false} />)}
        </div>
      </div>
    </Card>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function MarketInsights() {
  return (
    <section className="px-6 pt-8 pb-16 max-w-6xl mx-auto">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
        <div>
          <h2 className="text-[1rem] font-semibold text-slate-100">Market Insights</h2>
          <p className="text-[0.8rem] text-slate-500 mt-0.5">Price trends · volatility · market index · mock data</p>
        </div>
      </div>

      {/* Row 1: Price trend (wide) + Volatility */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <Fade delay={0} className="lg:col-span-3">
          <PriceTrend />
        </Fade>
        <Fade delay={0.08} className="lg:col-span-2">
          <VolatilityPanel />
        </Fade>
      </div>

      {/* Row 2: Market movement + Hot movers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Fade delay={0.06} className="lg:col-span-3">
          <MarketMovement />
        </Fade>
        <Fade delay={0.14} className="lg:col-span-2">
          <HotMovers />
        </Fade>
      </div>
    </section>
  )
}
