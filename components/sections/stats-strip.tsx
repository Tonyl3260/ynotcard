'use client'

import { Card } from '@/components/ui/card'
import { TOTAL_ORDERS, UNIQUE_STATES, TOTAL_REVENUE, AVG_ORDER_VALUE } from '@/lib/data'

const STATS = [
  { label: 'Orders',               value: String(TOTAL_ORDERS),                                  color: 'text-slate-100'   },
  { label: 'Revenue',              value: '$' + Math.round(TOTAL_REVENUE).toLocaleString('en-US'), color: 'text-primary-400' },
  { label: 'States Reached',       value: String(UNIQUE_STATES),                                  color: 'text-emerald-400' },
  { label: 'Avg Order Value',      value: '$' + AVG_ORDER_VALUE.toFixed(2),                       color: 'text-cyan-400'    },
  { label: 'Packages Lost · $108', value: '7',                                                    color: 'text-amber-400'   },
]

export function StatsStrip() {
  return (
    <section className="px-6 py-8 max-w-6xl mx-auto">
      {/* Section label */}
      <div className="flex items-center gap-2.5 mb-5">
        <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.09em] text-slate-500">
          By The Numbers · Jan–Apr 2026
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STATS.map(({ label, value, color }) => (
          <Card key={label} className="px-4 py-4 flex flex-col gap-1">
            <p className={`text-[1.6rem] font-bold tabular-nums leading-none ${color}`}>
              {value}
            </p>
            <p className="text-[0.62rem] text-slate-500 uppercase tracking-widest mt-1 leading-tight">
              {label}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}
