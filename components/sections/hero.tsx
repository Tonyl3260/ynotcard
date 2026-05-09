'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function scrollToSummary() {
  const target = document.getElementById('summary')
  const scrollEl = document.querySelector('main')
  if (!target || !scrollEl) return
  const start = scrollEl.scrollTop
  const end = target.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top + start
  const duration = 1200
  const startTime = performance.now()
  function step(now: number) {
    const progress = Math.min((now - startTime) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 4)
    scrollEl.scrollTop = start + (end - start) * ease
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
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

// ── Mock dashboard preview ────────────────────────────────────────────────────

const BAR_HEIGHTS = [34, 57, 43, 71, 49, 84, 63, 77, 51, 67, 90, 59]

function DashboardPreview() {
  return (
    <div className="relative">
      {/* Ambient glow behind card */}
      <div className="absolute -inset-6 rounded-3xl bg-primary-500/[0.08] blur-3xl pointer-events-none" />

      <Card accent="blue" className="relative border-white/[0.1] shadow-card overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-canvas-900/60 border-b border-white/[0.06]">
          <span className="h-[9px] w-[9px] rounded-full bg-red-400/60" />
          <span className="h-[9px] w-[9px] rounded-full bg-amber-400/60" />
          <span className="h-[9px] w-[9px] rounded-full bg-emerald-400/60" />
          <div className="flex-1" />
          <span className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-primary-400">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
            Live
          </span>
        </div>

        {/* Metric strip */}
        <div className="grid grid-cols-3 divide-x divide-white/[0.05] border-b border-white/[0.06]">
          {[
            { label: 'Listed Value', value: '$6,302', color: 'text-primary-400'  },
            { label: 'Listings',     value: '131',    color: 'text-emerald-400'  },
            { label: 'Priced OK',    value: '45%',    color: 'text-amber-400'    },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-4 py-3 bg-canvas-800/40">
              <div className={cn('text-[1.05rem] font-bold tabular-nums', color)}>{value}</div>
              <div className="text-[0.58rem] text-slate-500 uppercase tracking-widest mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {/* Bar chart */}
          <div>
            <p className="text-[0.58rem] text-slate-600 uppercase tracking-widest mb-2.5">
              Value by Set
            </p>
            <div className="flex items-end gap-[3px] h-[60px]">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: `rgba(59,130,246,${0.15 + (h / 100) * 0.65})`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Area / line chart */}
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
              <path
                d="M0,37 C18,34 36,27 56,23 C76,19 94,31 114,21 C134,11 154,15 174,9 C194,3 214,13 234,7 C254,1 270,5 280,3 L280,46 L0,46 Z"
                fill="url(#heroAreaGrad)"
              />
              <path
                d="M0,37 C18,34 36,27 56,23 C76,19 94,31 114,21 C134,11 154,15 174,9 C194,3 214,13 234,7 C254,1 270,5 280,3"
                fill="none"
                stroke="rgba(96,165,250,0.85)"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <circle cx="280" cy="3" r="3" fill="rgba(96,165,250,0.9)" />
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
            <motion.div variants={item}>
              <Badge variant="blue" size="md">Analytics Dashboard</Badge>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl lg:text-5xl xl:text-[3.25rem] font-bold leading-[1.1] tracking-tight"
            >
              My{' '}
              <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                ynotcard
              </span>
              {' '}Hub
            </motion.h1>

            <motion.p
              variants={item}
              className="text-[1rem] text-slate-400 leading-relaxed max-w-[460px]"
            >
              Personal inventory tracker for my One Piece TCG collection. Monitor what I have, analyze what's selling, and stay on top of the market to spot the next thing worth picking up.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-3">
              <button
                onClick={scrollToSummary}
                className={cn(buttonVariants({ size: 'lg' }))}
              >
                View Dashboard
              </button>
              <Link
                href="/analytics"
                className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'no-underline')}
              >
                Explore Analytics
              </Link>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              variants={item}
              className="flex gap-7 pt-4 border-t border-white/[0.06]"
            >
              {[
                { value: '131',   label: 'Active listings' },
                { value: '$6.3k', label: 'Listed value'   },
                { value: '45%',   label: 'Priced OK'       },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-lg font-bold text-slate-100 tabular-nums">{value}</div>
                  <div className="text-[0.68rem] text-slate-500 uppercase tracking-wide mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - mock preview */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
          >
            <DashboardPreview />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
