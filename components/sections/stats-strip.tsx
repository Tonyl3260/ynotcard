'use client'

import { Card } from '@/components/ui/card'

const STATS = [
  { label: 'Orders',          value: '394',     sub: null,        color: 'text-slate-100'   },
  { label: 'Revenue',         value: '$11,099', sub: null,        color: 'text-primary-400' },
  { label: 'States Reached',  value: '35+',     sub: null,        color: 'text-emerald-400' },
  { label: 'Avg Order Value', value: '$29.20',  sub: null,        color: 'text-cyan-400'    },
  { label: 'Packages Lost',   value: '7',       sub: '$108 loss', color: 'text-amber-400'   },
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
        {STATS.map(({ label, value, sub, color }) => (
          <Card key={label} className="px-4 py-4 flex flex-col gap-1">
            <p className={`text-[1.6rem] font-bold tabular-nums leading-none ${color}`}>
              {value}
            </p>
            {sub && (
              <p className="text-[0.62rem] text-amber-500/80 font-medium leading-none">{sub}</p>
            )}
            <p className="text-[0.62rem] text-slate-500 uppercase tracking-widest mt-1 leading-tight">
              {label}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}
