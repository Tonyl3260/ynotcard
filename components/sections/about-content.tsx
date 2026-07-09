'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  Code2,
  FileSpreadsheet,
  Globe,
  Layers,
  Package,
  Palette,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ── Animation ─────────────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

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

// ── Data ──────────────────────────────────────────────────────────────────────

const STORY = [
  {
    label: 'The problem',
    text: 'Managing TCG inventory in spreadsheets gets messy fast. Prices change, listings pile up, and profit is hard to see at a glance.',
    Icon: FileSpreadsheet,
    accent: 'red' as const,
  },
  {
    label: 'The build',
    text: 'This dashboard pulls from real TCGplayer exports and inventory data, processes it with Python, and surfaces what actually matters.',
    Icon: Code2,
    accent: 'blue' as const,
  },
  {
    label: 'The result',
    text: 'Live sales trends, inventory value, profit per card, and reprice signals — all in one place.',
    Icon: TrendingUp,
    accent: 'green' as const,
  },
]

const STACK = [
  { name: 'Python',     Icon: Code2           },
  { name: 'Excel',      Icon: FileSpreadsheet },
  { name: 'Tableau',    Icon: BarChart3       },
  { name: 'Next.js',    Icon: Layers          },
  { name: 'TypeScript', Icon: Code2           },
  { name: 'Tailwind',   Icon: Palette         },
  { name: 'Recharts',   Icon: TrendingUp      },
  { name: 'Vercel',     Icon: Globe           },
]

const BOTTOM = [
  {
    label:    'View source',
    sub:      'See how the data pipeline and dashboard are built',
    href:     'https://github.com/Tonyl3260/ynotcard',
    Icon:     Code2,
    accent:   'blue' as const,
    external: true,
  },
  {
    label:    'Tableau dashboard',
    sub:      'Deep dive into sales analytics',
    href:     '#',
    Icon:     BarChart3,
    accent:   'purple' as const,
    external: false,
  },
  {
    label:    "How it's updated",
    sub:      'New TCGplayer sales and inventory exports are pulled and reprocessed monthly.',
    href:     null,
    Icon:     RefreshCw,
    accent:   'green' as const,
    external: false,
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.09em] text-slate-500">
        {children}
      </p>
    </div>
  )
}

function PulseDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
    </span>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function AboutContent() {
  return (
    <div className="px-6 pt-14 pb-16 max-w-5xl mx-auto space-y-14">

      <div className="space-y-6">

        {/* ── 1. Hero ── */}
        <Fade>
          <h1 className="text-3xl sm:text-[2.5rem] font-bold text-slate-100 leading-[1.1] tracking-tight mb-3">
            A real business. A real dashboard.
          </h1>
          <p className="text-[0.95rem] text-slate-400 leading-relaxed">
            YnotCard is a live analytics tool built for a One Piece TCG reselling operation, tracking inventory, sales, and profit across TCGplayer.
          </p>
        </Fade>

        {/* ── 2. The story ── */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STORY.map(({ label, text, accent }, i) => (
              <Fade key={label} delay={i * 0.08}>
                <Card accent={accent} className="p-4 h-full">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.09em] text-slate-500 mb-2">
                    {label}
                  </p>
                  <p className="text-[0.82rem] text-slate-400 leading-relaxed">
                    {text}
                  </p>
                </Card>
              </Fade>
            ))}
          </div>
        </div>

      </div>

      {/* ── 3. Data sources ── */}
      <Fade>
        <SectionLabel>Data sources</SectionLabel>
        <Card className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="rounded-xl bg-canvas-900/60 border border-white/[0.06] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package size={14} className="text-primary-400 shrink-0" />
                <p className="text-[0.82rem] font-semibold text-slate-200">TCGplayer shipping export</p>
                <PulseDot />
              </div>
              <ul className="space-y-1.5">
                {[
                  '737 orders, Jan 20 – Jun 30 2026',
                  'Anonymized: addresses, names, and tracking numbers stripped before commit',
                  'Refreshed monthly when new exports are pulled',
                ].map(t => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-slate-600 shrink-0" />
                    <span className="text-[0.78rem] text-slate-500 leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-canvas-900/60 border border-white/[0.06] p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileSpreadsheet size={14} className="text-emerald-400 shrink-0" />
                <p className="text-[0.82rem] font-semibold text-slate-200">Inventory spreadsheet</p>
              </div>
              <ul className="space-y-1.5">
                {[
                  '151 singles + 2 sealed listings, $6,963 listed value',
                  'Updated continuously as listings change',
                  'Calculated fields: TCGplayer fee, net per sale, price vs market, reprice flag',
                ].map(t => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-slate-600 shrink-0" />
                    <span className="text-[0.78rem] text-slate-500 leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </Card>
      </Fade>

      {/* ── 4. Tech stack ── */}
      <Fade>
        <SectionLabel>Built with</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STACK.map(({ name, Icon }) => (
            <div
              key={name}
              className="rounded-xl bg-canvas-800/60 border border-white/[0.08] p-3.5 flex items-center gap-2.5 hover:border-white/[0.16] transition-colors duration-150"
            >
              <Icon size={16} strokeWidth={1.75} className="text-primary-400 shrink-0" />
              <p className="text-[0.82rem] font-semibold text-slate-200">{name}</p>
            </div>
          ))}
        </div>
      </Fade>

      {/* ── 5. Bottom cards ── */}
      <Fade>
        <SectionLabel>Explore further</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BOTTOM.map(({ label, sub, href, accent, external }) => {
            const content = (
              <Card accent={accent} hoverable={!!href} className="p-5 h-full">
                <p className={cn(
                  'text-[0.88rem] font-semibold text-slate-200 leading-tight mb-1 transition-colors',
                  href && 'group-hover:text-slate-50',
                )}>
                  {label}
                </p>
                <p className="text-[0.72rem] text-slate-600 leading-snug">{sub}</p>
              </Card>
            )

            if (!href) {
              return <div key={label}>{content}</div>
            }

            return (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group block [text-decoration:none]"
              >
                {content}
              </a>
            )
          })}
        </div>
      </Fade>

    </div>
  )
}
