import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  Check,
  Code2,
  Database,
  ExternalLink,
  FileSpreadsheet,
  Globe,
  Layers,
  Package,
  Palette,
  TrendingUp,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'About' }

// ── Tech stack ────────────────────────────────────────────────────────────────

const STACK = [
  { name: 'Python',      Icon: Code2            },
  { name: 'Excel',       Icon: FileSpreadsheet  },
  { name: 'Tableau',     Icon: BarChart3        },
  { name: 'Next.js',     Icon: Layers           },
  { name: 'TypeScript',  Icon: Code2            },
  { name: 'Tailwind',    Icon: Palette          },
  { name: 'Recharts',    Icon: TrendingUp       },
  { name: 'Vercel',      Icon: Globe            },
]

// ── Skills ────────────────────────────────────────────────────────────────────

const DATA_SKILLS = [
  'Cleaning and reshaping raw operational exports (TCGplayer CSV, custom Excel inventory)',
  'Building KPI frameworks for a multi-channel retail business',
  'Identifying pricing inefficiencies (67 of 121 singles flagged for reprice review)',
  'Geographic and temporal sales pattern analysis',
  'Calculating margin retention after platform fees and shipping',
  'Designing executive-summary narratives from raw numbers',
]

const TECH_SKILLS = [
  'Python data pipeline (CSV → JSON transformation, PII stripping)',
  'Excel modeling with calculated fields for fees, margin, and reprice flags',
  'Tableau Public for cross-platform dashboard delivery',
  'Next.js 15 with App Router, TypeScript, Tailwind CSS',
  'Recharts for interactive visualizations',
  'Vercel deployment with continuous integration',
]

// ── CTA links ─────────────────────────────────────────────────────────────────

const LINKS = [
  {
    label:   'View source on GitHub',
    sub:     'github.com/Tonyl3260/ynotcard',
    href:    'https://github.com/Tonyl3260/ynotcard',
    Icon:    Code2,
    accent:  'blue' as const,
    external: true,
  },
  {
    label:   'Tableau Dashboard',
    sub:     'Interactive deep-dive — link coming soon',
    href:    '#',
    Icon:    BarChart3,
    accent:  'purple' as const,
    external: false,
  },
  {
    label:   'LinkedIn / Contact',
    sub:     'linkedin.com/in/tonylin3260',
    href:    'https://www.linkedin.com/in/tonylin3260/',
    Icon:    ExternalLink,
    accent:  'green' as const,
    external: true,
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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-[3px] shrink-0 h-4 w-4 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
            <Check size={9} strokeWidth={3} className="text-primary-400" />
          </span>
          <span className="text-[0.84rem] text-slate-400 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="px-6 pt-12 pb-16 max-w-5xl mx-auto space-y-12">

      {/* ── 1. Page header ── */}
      <div>
        <h1 className="text-[2rem] font-bold text-slate-100 leading-tight tracking-tight mb-2">
          About this project
        </h1>
        <p className="text-slate-400 text-[1rem]">
          Operational analytics for a real TCG reselling business
        </p>
      </div>

      {/* ── 2. Project overview ── */}
      <div>
        <SectionLabel>Overview</SectionLabel>
        <Card accent="blue" className="p-6">
          <p className="text-[0.92rem] text-slate-300 leading-[1.75]">
            <span className="font-semibold text-slate-100">ynotcard</span> is a portfolio analytics
            dashboard built with real data from my trading card reselling business operating across
            TCGplayer, eBay, and Whatnot. The dashboard tracks inventory, sales performance, shipping
            operations, and pricing efficiency across{' '}
            <span className="text-primary-400 font-semibold">393 orders</span> shipped to{' '}
            <span className="text-primary-400 font-semibold">all 50 US states</span> between
            January and April 2026.
          </p>
        </Card>
      </div>

      {/* ── 3. What this demonstrates ── */}
      <div>
        <SectionLabel>What this demonstrates</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-7 w-7 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                <Database size={14} className="text-primary-400" />
              </span>
              <h3 className="text-[0.88rem] font-semibold text-slate-200">Data analyst skills</h3>
            </div>
            <BulletList items={DATA_SKILLS} />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Code2 size={14} className="text-cyan-400" />
              </span>
              <h3 className="text-[0.88rem] font-semibold text-slate-200">Technical skills</h3>
            </div>
            <BulletList items={TECH_SKILLS} />
          </Card>
        </div>
      </div>

      {/* ── 4. Data sources ── */}
      <div>
        <SectionLabel>Data sources</SectionLabel>
        <Card className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="rounded-xl bg-canvas-900/60 border border-white/[0.06] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package size={14} className="text-primary-400 shrink-0" />
                <p className="text-[0.82rem] font-semibold text-slate-200">TCGplayer shipping export</p>
              </div>
              <ul className="space-y-1.5">
                {[
                  '393 orders, Jan 20 to Apr 20 2026',
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
                  '121 singles + 10 sealed listings, $6,302 listed value',
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
      </div>

      {/* ── 5. Tech stack ── */}
      <div>
        <SectionLabel>Built with</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {STACK.map(({ name, Icon }) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.78rem] font-medium text-slate-300 bg-canvas-800/80 border border-white/[0.08] hover:border-white/[0.16] hover:text-slate-100 transition-colors duration-150"
            >
              <Icon size={13} strokeWidth={1.75} className="text-primary-400 shrink-0" />
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── 6. Links ── */}
      <div>
        <SectionLabel>Explore further</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LINKS.map(({ label, sub, href, Icon, accent, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group block [text-decoration:none]"
            >
              <Card accent={accent} hoverable className="p-5 h-full">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="h-8 w-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-primary-400" />
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-slate-600 group-hover:text-slate-400 transition-colors mt-0.5"
                  />
                </div>
                <p className="text-[0.88rem] font-semibold text-slate-200 leading-tight mb-1">
                  {label}
                </p>
                <p className="text-[0.72rem] text-slate-600 leading-snug">{sub}</p>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* ── 7. Disclosure ── */}
      <p className="text-[0.72rem] text-slate-700 leading-relaxed border-t border-white/[0.04] pt-6">
        This is a personal portfolio project. All operational data is real, sourced from a side
        business I operate. Customer information has been removed before publication.
      </p>

    </div>
  )
}
