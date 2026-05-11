'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { StrawHatHero } from '@/components/StrawHatHero'

function scrollToSummary() {
  const target = document.getElementById('summary')
  if (!target) return
  const y = target.getBoundingClientRect().top + window.scrollY - 64
  window.scrollTo({ top: y, behavior: 'smooth' })
}

// ── Animation ─────────────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

// ── Dashboard preview data ────────────────────────────────────────────────────

// Top 10 sets by revenue (inventory.json set_breakdown)
const SET_DATA = [
  { abbr: 'Promo',      rev: 597.49 },
  { abbr: 'PRB Best',   rev: 523.13 },
  { abbr: 'PRB v2',     rev: 430.34 },
  { abbr: 'Fist',       rev: 405.19 },
  { abbr: "Kami's",     rev: 393.06 },
  { abbr: 'His Will',   rev: 326.35 },
  { abbr: 'Azure Sea',  rev: 272.00 },
  { abbr: 'Anime 25',   rev: 234.83 },
  { abbr: 'Paramount',  rev: 229.95 },
  { abbr: 'Emperors',   rev: 216.86 },
]
const MAX_SET_REV = SET_DATA[0].rev

// Monthly revenue Jan–May 2026 (shipping.json)
const MONTHLY_REV = [943.36, 1015.73, 5192.96, 4467.08, 1037.47]

function buildLinePath(data: number[], w: number, h: number, pad: number) {
  const min   = Math.min(...data)
  const max   = Math.max(...data)
  const range = max - min || 1
  const xs    = data.map((_, i) => (i / (data.length - 1)) * w)
  const ys    = data.map(v => h - pad - ((v - min) / range) * (h - pad * 2))
  let d = `M ${xs[0]},${ys[0]}`
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpx},${ys[i - 1]} ${cpx},${ys[i]} ${xs[i]},${ys[i]}`
  }
  return { path: d, lastX: xs[xs.length - 1], lastY: ys[ys.length - 1] }
}

// ── Dashboard preview card ────────────────────────────────────────────────────

function DashboardPreview() {
  const n       = SET_DATA.length
  const barSlot = 280 / n          // 28px per slot
  const barW    = Math.round(barSlot * 0.78) // ~22px bar width

  const { path: linePath, lastX, lastY } = buildLinePath(MONTHLY_REV, 280, 46, 3)
  const areaPath = `${linePath} L 280,46 L 0,46 Z`

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute -inset-6 rounded-3xl bg-primary-500/[0.08] blur-3xl pointer-events-none" />

      <Card accent="blue" className="relative border-white/[0.1] shadow-card overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center justify-between px-4 py-3 bg-canvas-900/60 border-b border-white/[0.06]">
          <span className="text-[0.6rem] font-semibold text-slate-500">Inventory Snapshot</span>
          <span className="text-[0.6rem] text-slate-600">Apr 20, 2026</span>
        </div>

        {/* Metric strip */}
        <div className="grid grid-cols-2 divide-x divide-white/[0.05] border-b border-white/[0.06]">
          {[
            { label: 'Listed Value',    value: '$6,302', color: 'text-primary-400' },
            { label: 'Unique Listings', value: '131',    color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-4 py-3 bg-canvas-800/40">
              <div className={cn('text-[1.05rem] font-bold tabular-nums', color)}>{value}</div>
              <div className="text-[0.58rem] text-slate-500 uppercase tracking-widest mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {/* Bar chart – Value by Set */}
          <div>
            <p className="text-[0.58rem] text-slate-600 uppercase tracking-widest mb-1.5">
              Value by Set
            </p>
            {/* viewBox 280×80: 54px bars + 26px label area */}
            <svg viewBox="0 0 280 80" className="w-full">
              {SET_DATA.map((s, i) => {
                const pct  = s.rev / MAX_SET_REV
                const bH   = pct * 50
                const x    = i * barSlot + (barSlot - barW) / 2
                const cx   = x + barW / 2
                return (
                  <g key={s.abbr}>
                    <rect
                      x={x} y={54 - bH} width={barW} height={bH}
                      rx="2"
                      fill={`rgba(59,130,246,${(0.15 + pct * 0.65).toFixed(2)})`}
                    />
                    <text
                      x={cx} y={58}
                      fontSize="6.5"
                      fill="rgba(100,116,139,0.85)"
                      textAnchor="end"
                      transform={`rotate(-40,${cx},58)`}
                    >
                      {s.abbr}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Line chart – Sales Trend (Jan–Apr 2026) */}
          <div>
            <p className="text-[0.58rem] text-slate-600 uppercase tracking-widest mb-2">
              Sales Trend
            </p>
            <svg viewBox="0 0 280 46" className="w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.28)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#heroAreaGrad)" />
              <path
                d={linePath}
                fill="none"
                stroke="rgba(96,165,250,0.85)"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              {/* Glowing endpoint */}
              <circle cx={lastX} cy={lastY} r="5.5" fill="rgba(96,165,250,0.18)" />
              <circle cx={lastX} cy={lastY} r="2.8" fill="rgba(96,165,250,0.9)" />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ── Hero section ──────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden flex items-center"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 70% 55% at 62% -8%, rgba(59,130,246,0.13) 0%, transparent 65%),
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, 48px 48px, 48px 48px',
      }}
    >
      {/* Bottom fade - merges into page content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas-950 to-transparent" />

      <div className="relative w-full max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left - copy */}
          <motion.div
            className="flex flex-col gap-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              variants={item}
              className="text-4xl lg:text-5xl xl:text-[3.25rem] font-bold leading-[1.1] tracking-tight"
            >
              TCG Operations Dashboard
            </motion.h1>

            <motion.p
              variants={item}
              className="text-[1rem] text-slate-400 leading-relaxed max-w-[460px]"
            >
              Operational analytics for a multi-channel TCG reselling business. 458 orders, 50 states, $12,657 revenue from Jan to May 2026. Real data, refreshed monthly.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-3">
              <button
                onClick={scrollToSummary}
                className={cn(buttonVariants({ size: 'lg' }))}
              >
                View Summary
              </button>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              variants={item}
              className="flex gap-7 pt-4 border-t border-white/[0.06]"
            >
              {[
                { value: '458',     label: 'Orders'         },
                { value: '$12,657', label: 'Revenue'        },
                { value: '50',      label: 'States reached' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-lg font-bold text-slate-100 tabular-nums">{value}</div>
                  <div className="text-[0.68rem] text-slate-500 uppercase tracking-wide mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - straw hat */}
          <motion.div
            className="w-full max-w-[380px] mx-auto lg:max-w-none flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
          >
            <StrawHatHero />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
