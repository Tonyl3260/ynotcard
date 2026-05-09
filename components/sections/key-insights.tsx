'use client'

import { DollarSign, MapPin, Package, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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
    text: 'Average order value held steady at $29.20 across all 394 transactions',
  },
]

export function KeyInsights() {
  return (
    <section className="px-6 pb-16 max-w-6xl mx-auto">
      <Card className="p-5">
        {/* Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
            <p className="text-[0.88rem] font-semibold text-slate-100">Data Insights</p>
          </div>
          <p className="text-[0.65rem] text-slate-600 uppercase tracking-widest">
            Derived from Jan–Apr 2026 TCGPlayer sales analysis
          </p>
        </div>

        {/* Insight rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INSIGHTS.map(({ Icon, iconBg, iconColor, border, text }) => (
            <div
              key={text}
              className={cn(
                'flex items-start gap-3 px-3 py-3 rounded-lg',
                'bg-white/[0.02] border border-white/[0.05] border-l-2',
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
    </section>
  )
}
