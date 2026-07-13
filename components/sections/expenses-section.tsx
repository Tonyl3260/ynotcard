'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView, useMotionValue, useTransform } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import expensesData from '@/expenses.json'

// ── Theme ──────────────────────────────────────────────────────────────────────

const C = {
  grid:   'rgba(255,255,255,0.05)',
  axis:   '#475569',
  blue:   '#3B82F6',
  gold:   '#FBBF24',
  purple: '#A78BFA',
} as const

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

const AXIS_PROPS = {
  tick:     { fill: C.axis, fontSize: 11 },
  axisLine: false as const,
  tickLine: false as const,
}

// ── Data ───────────────────────────────────────────────────────────────────────

const s = expensesData.summary

const PERIOD_ORDER: Record<string, number> = {
  'Jan-Mar': 0, 'April': 1, 'May-Jun': 2, 'July': 3,
}

const PERIOD_DATA = s.by_period as Record<string, { cogs: number; misc: number; total: number }>

const BY_PERIOD = s.periods.map(period => ({
  period,
  cogs: PERIOD_DATA[period].cogs,
  misc: PERIOD_DATA[period].misc,
}))

const BY_CATEGORY = (Object.entries(s.cogs_by_type) as [string, number][])
  .map(([category, total]) => ({ category, total }))
  .sort((a, b) => b.total - a.total)

const ALL_ITEMS = [
  ...expensesData.cogs.map(i => ({ ...i, _source: 'COGS' as const })),
  ...expensesData.misc.map(i => ({ ...i, _source: 'Misc' as const })),
]

// ── Shared tooltip ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border border-white/[0.08] px-3 py-2.5 text-xs shadow-card"
      style={{ background: 'rgba(12,21,36,0.94)', backdropFilter: 'blur(12px)' }}
    >
      <p className="text-slate-400 mb-1.5 font-medium">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 font-semibold text-slate-100">
          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: p.color ?? p.fill }} />
          <span className="text-slate-400 font-normal">{p.name}:</span>
          {'$' + (p.value as number).toLocaleString('en-US')}
        </div>
      ))}
    </div>
  )
}

// ── Animated counter ───────────────────────────────────────────────────────────

function Counter({ to, inView }: { to: number; inView: boolean }) {
  const count   = useMotionValue(0)
  const display = useTransform(count, v => '$' + Math.round(v).toLocaleString('en-US'))

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(count, to, { duration: 1.5, ease: 'easeOut' })
    return ctrl.stop
  }, [inView, to, count])

  return <motion.span>{display}</motion.span>
}

// ── KPI card ───────────────────────────────────────────────────────────────────

type KPIAccent = 'blue' | 'gold' | 'green' | 'red' | 'purple'

function KPICard({ label, value, accent, index }: {
  label: string; value: number; accent: KPIAccent; index: number
}) {
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
      <Card accent={accent} hoverable className="p-5 h-full flex flex-col gap-0">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500 mb-3">
          {label}
        </p>
        <div className="text-[1.75rem] font-bold text-slate-100 tabular-nums leading-none">
          <Counter to={value} inView={inView} />
        </div>
      </Card>
    </motion.div>
  )
}

// ── KPI section ────────────────────────────────────────────────────────────────

const KPIS: { label: string; value: number; accent: KPIAccent }[] = [
  { label: 'Total COGS',     value: s.total_cogs,     accent: 'blue'   },
  { label: 'Total Misc',     value: s.total_misc,     accent: 'gold'   },
  { label: 'Total Expenses', value: s.total_expenses, accent: 'purple' },
]

export function ExpensesKPI() {
  return (
    <section className="px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-[1rem] font-semibold text-slate-100">Expenses Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {KPIS.map((kpi, i) => (
          <KPICard key={kpi.label} label={kpi.label} value={kpi.value} accent={kpi.accent} index={i} />
        ))}
      </div>
    </section>
  )
}

// ── Stacked bar: COGS vs Misc by period ───────────────────────────────────────

function PeriodChart() {
  const fmt = (v: number) => '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)
  return (
    <Card accent="blue" className="p-5">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500 mb-3">
        COGS vs Misc by Period
      </p>
      <div className="flex items-center gap-4 mb-4">
        <span className="flex items-center gap-1.5 text-[0.7rem] text-slate-400">
          <span className="h-2 w-2 rounded-sm inline-block" style={{ background: C.blue }} /> COGS
        </span>
        <span className="flex items-center gap-1.5 text-[0.7rem] text-slate-400">
          <span className="h-2 w-2 rounded-sm inline-block" style={{ background: C.gold }} /> Misc
        </span>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={BY_PERIOD} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barSize={40}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="period" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={fmt} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="cogs" name="COGS" stackId="s" fill={C.blue} fillOpacity={0.85} radius={[0, 0, 0, 0]} />
            <Bar dataKey="misc" name="Misc" stackId="s" fill={C.gold} fillOpacity={0.85} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── Horizontal bar: COGS by category ──────────────────────────────────────────

function CategoryChart() {
  return (
    <Card accent="purple" className="p-5 h-full">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500 mb-4">
        COGS by Category
      </p>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={BY_CATEGORY}
            layout="vertical"
            margin={{ top: 4, right: 48, left: 0, bottom: 0 }}
            barSize={18}
          >
            <CartesianGrid stroke={C.grid} horizontal={false} />
            <XAxis
              type="number"
              {...AXIS_PROPS}
              tickFormatter={v => '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)}
            />
            <YAxis type="category" dataKey="category" width={88} {...AXIS_PROPS} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="total" name="COGS" fill={C.purple} fillOpacity={0.85} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── Line-item table ────────────────────────────────────────────────────────────

type SortKey = 'period' | '_source' | 'type' | 'item' | 'amount'
type SortDir = 'asc' | 'desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'period',   label: 'Period'  },
  { key: 'amount',   label: 'Amount'  },
  { key: '_source',  label: 'Source'  },
  { key: 'type',     label: 'Type'    },
  { key: 'item',     label: 'Item'    },
]

function LineItemTable() {
  const [sortKey, setSortKey] = useState<SortKey>('period')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function selectSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'amount' ? 'desc' : 'asc')
    }
  }

  const sorted = [...ALL_ITEMS].sort((a, b) => {
    let diff = 0
    if      (sortKey === 'amount')   diff = a.amount - b.amount
    else if (sortKey === 'period')   diff = (PERIOD_ORDER[a.period] ?? 0) - (PERIOD_ORDER[b.period] ?? 0)
    else if (sortKey === '_source')  diff = a._source.localeCompare(b._source)
    else if (sortKey === 'type')     diff = a.type.localeCompare(b.type)
    else if (sortKey === 'item')     diff = a.item.localeCompare(b.item)
    return sortDir === 'asc' ? diff : -diff
  })

  return (
    <Card accent="blue" className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500">
          All Expenses · {ALL_ITEMS.length} line items
        </p>
        <span className="text-[0.62rem] text-slate-500 tabular-nums">
          Total: ${s.total_expenses.toLocaleString('en-US')}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-[0.62rem] text-slate-600 uppercase tracking-widest font-bold mr-1">Sort</span>
        {SORT_OPTIONS.map(({ key, label }) => {
          const active = sortKey === key
          return (
            <button
              key={key}
              onClick={() => selectSort(key)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-md text-[0.7rem] font-medium transition-all',
                active
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:text-slate-300 hover:bg-white/[0.07]',
              )}
            >
              {label}
              {active && (
                sortDir === 'asc'
                  ? <ArrowUp size={11} strokeWidth={2.5} />
                  : <ArrowDown size={11} strokeWidth={2.5} />
              )}
            </button>
          )
        })}
      </div>

      <div className="overflow-y-auto max-h-[480px]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ background: '#0C1524' }} className="sticky top-0">
              <th className="py-2 pl-3 pr-2 w-8">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">#</span>
              </th>
              <th className="py-2 px-2 w-24">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">Period</span>
              </th>
              <th className="py-2 px-2 w-16">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">Source</span>
              </th>
              <th className="py-2 px-2 w-28">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">Type</span>
              </th>
              <th className="py-2 px-2">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">Item</span>
              </th>
              <th className="py-2 pl-2 pr-3 w-24 text-right">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">Amount</span>
              </th>
            </tr>
            <tr style={{ background: '#0C1524' }}>
              <td colSpan={6} className="h-px bg-white/[0.06] p-0" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => (
              <tr
                key={i}
                className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
              >
                <td className="py-2 pl-3 pr-2 text-[0.62rem] font-bold text-slate-600 tabular-nums align-middle">
                  {i + 1}
                </td>
                <td className="py-2 px-2 align-middle">
                  <span className="text-[0.72rem] font-medium text-slate-400">{item.period}</span>
                </td>
                <td className="py-2 px-2 align-middle">
                  <span
                    className={cn(
                      'inline-block px-1.5 py-0.5 rounded text-[0.62rem] font-bold leading-none',
                      item._source === 'COGS'
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-amber-400 bg-amber-400/10',
                    )}
                  >
                    {item._source}
                  </span>
                </td>
                <td className="py-2 px-2 align-middle text-[0.72rem] text-slate-500">
                  {item.type}
                </td>
                <td className="py-2 px-2 align-middle min-w-0 max-w-[1px]">
                  <p className="text-[0.78rem] text-slate-200 truncate">{item.item}</p>
                </td>
                <td className="py-2 pl-2 pr-3 text-right align-middle text-[0.82rem] font-bold tabular-nums text-slate-200">
                  ${item.amount.toLocaleString('en-US')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ── Fade wrapper ───────────────────────────────────────────────────────────────

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

// ── Detail section ─────────────────────────────────────────────────────────────

export function ExpensesDetail() {
  return (
    <section className="px-6 pt-8 pb-16 max-w-6xl mx-auto">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
        <h2 className="text-[1rem] font-semibold text-slate-100">Breakdown</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 mb-4">
        <Fade delay={0}>
          <PeriodChart />
        </Fade>
        <Fade delay={0.06}>
          <CategoryChart />
        </Fade>
      </div>

      <Fade delay={0.1}>
        <LineItemTable />
      </Fade>
    </section>
  )
}
