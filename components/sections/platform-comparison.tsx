'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ── Data ──────────────────────────────────────────────────────────────────────

const PLATFORMS = [
  {
    name: 'TCGPlayer',
    revenue: '$11,099',
    orders: '393',
    period: 'Jan – Apr 2026',
    live: true,
  },
  {
    name: 'eBay',
    revenue: null,
    orders: null,
    period: null,
    live: false,
  },
  {
    name: 'Whatnot',
    revenue: null,
    orders: null,
    period: null,
    live: false,
  },
]

// ── Card ──────────────────────────────────────────────────────────────────────

function PlatformCard({ platform }: { platform: typeof PLATFORMS[number] }) {
  const { name, revenue, orders, period, live } = platform

  return (
    <Card
      accent={live ? 'blue' : undefined}
      className={cn('p-5 flex flex-col gap-4', !live && 'opacity-50')}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[0.88rem] font-semibold text-slate-200">{name}</p>
        {live ? (
          <Badge variant="blue" size="sm">Live Data</Badge>
        ) : (
          <Badge size="sm">Coming Soon</Badge>
        )}
      </div>

      {/* Stats */}
      {live ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-canvas-800/60 px-3 py-2.5">
            <p className="text-[1.15rem] font-bold text-primary-400 tabular-nums leading-none">
              {revenue}
            </p>
            <p className="text-[0.6rem] text-slate-500 uppercase tracking-widest mt-1.5">
              Revenue
            </p>
          </div>
          <div className="rounded-lg bg-canvas-800/60 px-3 py-2.5">
            <p className="text-[1.15rem] font-bold text-emerald-400 tabular-nums leading-none">
              {orders}
            </p>
            <p className="text-[0.6rem] text-slate-500 uppercase tracking-widest mt-1.5">
              Orders
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center py-4">
          <p className="text-[0.75rem] text-slate-600">Data not yet connected</p>
        </div>
      )}

      {/* Period */}
      {period && (
        <p className="text-[0.62rem] text-slate-600 uppercase tracking-widest">{period}</p>
      )}
    </Card>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function PlatformComparison() {
  return (
    <section className="px-6 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
        <div>
          <h2 className="text-[1rem] font-semibold text-slate-100">Platform Breakdown</h2>
          <p className="text-[0.8rem] text-slate-500 mt-0.5">Revenue and orders across all selling platforms</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLATFORMS.map(p => (
          <PlatformCard key={p.name} platform={p} />
        ))}
      </div>
    </section>
  )
}
