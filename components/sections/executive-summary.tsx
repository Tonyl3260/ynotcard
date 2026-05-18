'use client'

import { motion } from 'framer-motion'
import { BarChart2, Package, TrendingUp } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Insight = {
  Icon: typeof TrendingUp
  iconBg: string
  iconColor: string
  tag: string
  tagColor: string
  headline: string
  narrative: React.ReactNode
  metric: string
  metricColor: string
}

// ── Highlight helper ──────────────────────────────────────────────────────────

function Hi({ children, color = 'text-primary-400' }: { children: React.ReactNode; color?: string }) {
  return <span className={`${color} font-semibold`}>{children}</span>
}

// ── Insights ──────────────────────────────────────────────────────────────────

const INSIGHTS: Insight[] = [
  {
    Icon:        TrendingUp,
    iconBg:      'rgba(59,130,246,0.12)',
    iconColor:   '#3B82F6',
    tag:         'Portfolio',
    tagColor:    'text-primary-400 bg-primary-500/10 border-primary-500/25',
    headline:    '$6,302 listed value with 81% net margin after fees',
    narrative: (
      <>
        Current inventory spans <Hi>131 active listings</Hi> (121 singles + 10 sealed)
        with <Hi>$6,302</Hi> in total listed value. After TCG Player fees, the portfolio
        nets <Hi>$5,127</Hi>, an 81.4% retention rate. SR and Legendary cards are the
        primary value drivers at <Hi>$2,894</Hi> combined.
      </>
    ),
    metric:      '$6,302',
    metricColor: 'text-primary-400',
  },
  {
    Icon:        Package,
    iconBg:      'rgba(16,185,129,0.12)',
    iconColor:   '#10B981',
    tag:         'Breakdown',
    tagColor:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    headline:    'SR cards lead with 47 listings and $1,874 in value',
    narrative: (
      <>
        Super Rare cards dominate inventory with <Hi color="text-emerald-400">$1,874</Hi> across
        47 listings, followed by Legendary at <Hi color="text-emerald-400">$1,020</Hi> (13 listings).
        Top sets by value: Promo Cards <Hi color="text-emerald-400">$597</Hi>, Premium Booster Best{' '}
        <Hi color="text-emerald-400">$523</Hi>, and Fist of Divine Speed <Hi color="text-emerald-400">$405</Hi>.
      </>
    ),
    metric:      '47 SRs',
    metricColor: 'text-emerald-400',
  },
]

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

// ── Component ─────────────────────────────────────────────────────────────────

export function ExecutiveSummary() {
  return (
    <section id="summary" className="px-6 py-10 max-w-6xl mx-auto">
      {/* Gradient border wrapper */}
      <div
        className="p-px rounded-[16px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(59,130,246,0.45) 0%, rgba(6,182,212,0.15) 45%, rgba(139,92,246,0.4) 100%)',
        }}
      >
        <div className="rounded-[15px] bg-canvas-800/95 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]"
            style={{
              background:
                'linear-gradient(90deg, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.04) 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              {/* Glow orb */}
              <div className="relative h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                <BarChart2 size={15} strokeWidth={2} style={{ color: '#60A5FA' }} />
              </div>
              <div>
                <h2 className="text-[0.95rem] font-semibold text-slate-100 leading-none">
                  Executive Summary
                </h2>
                <p className="text-[0.68rem] text-slate-500 mt-0.5">Month-to-date · One Piece TCG portfolio</p>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.06em] border"
              style={{ color: '#60A5FA', background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.2)' }}
            >
              Jan – Apr 2026
            </span>
          </div>

          {/* Insight cards */}
          <div className="divide-y divide-white/[0.04]">
            {INSIGHTS.map((ins, i) => (
              <motion.div
                key={ins.headline}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
                className="flex items-start gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 hover:bg-white/[0.015] transition-colors duration-150"
              >
                {/* Icon */}
                <div
                  className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center mt-0.5"
                  style={{ background: ins.iconBg, border: `1px solid ${ins.iconColor}30` }}
                >
                  <ins.Icon size={16} strokeWidth={2.2} style={{ color: ins.iconColor }} />
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.07em] border ${ins.tagColor}`}
                    >
                      {ins.tag}
                    </span>
                    <p className="text-[0.88rem] font-semibold text-slate-100">{ins.headline}</p>
                  </div>
                  <p className="text-[0.78rem] text-slate-400 leading-relaxed">{ins.narrative}</p>
                </div>

                {/* Metric */}
                <div className="shrink-0 text-right hidden sm:block">
                  <p className={`text-[1.4rem] font-bold tabular-nums leading-none ${ins.metricColor}`}>
                    {ins.metric}
                  </p>
                  <p className="text-[0.6rem] text-slate-600 mt-1 uppercase tracking-wide">current</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/[0.04] flex items-center justify-between"
            style={{ background: 'rgba(0,0,0,0.15)' }}>
            <p className="text-[0.62rem] text-slate-600">
              Based on Jan – Apr 2026 TCGPlayer sales data
            </p>
            <p className="text-[0.62rem] text-slate-600">
              Inventory snapshot
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
