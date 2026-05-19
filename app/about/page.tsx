import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  Code2,
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="px-6 pt-12 pb-16 max-w-5xl mx-auto space-y-12">

      {/* ── 1. Project summary ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-canvas-900/50 p-7 sm:p-9 space-y-6">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary-400 mb-3">
            Portfolio Project · Data Analytics
          </p>
          <h1 className="text-[1.4rem] sm:text-2xl font-bold text-slate-100 leading-snug mb-4">
            Business intelligence dashboard
          </h1>
          <p className="text-[0.875rem] text-slate-400 leading-relaxed max-w-2xl">
            I needed a better way to track my TCG reselling business than a spreadsheet,
            so I built one. This turns raw TCGplayer exports into revenue trends, margin
            analysis, and repricing signals across 458 real orders. Python and Excel
            handle the data pipeline, Next.js and Recharts handle the frontend.
          </p>
        </div>

        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500 mb-3">
            Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Python',       note: 'ETL & data cleaning',   Icon: Code2           },
              { name: 'Excel',        note: 'source modeling',       Icon: FileSpreadsheet },
              { name: 'Tableau',      note: 'exploratory analysis',  Icon: BarChart3       },
              { name: 'Next.js',      note: 'production frontend',   Icon: Layers          },
              { name: 'Recharts',     note: 'data visualization',    Icon: TrendingUp      },
              { name: 'TypeScript',   note: 'type-safe development', Icon: Code2           },
              { name: 'Tailwind CSS', note: 'UI design',             Icon: Palette         },
            ].map(({ name, note, Icon }) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.78rem] font-medium text-slate-300 bg-canvas-800/80 border border-white/[0.08]"
              >
                <Icon size={12} strokeWidth={1.75} className="text-primary-400 shrink-0" />
                <span className="font-semibold">{name}</span>
                <span className="text-slate-600">·</span>
                <span className="text-[0.72rem] text-slate-500">{note}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="https://www.linkedin.com/in/tonylin3260/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'gap-1.5')}
          >
            <ExternalLink size={13} />
            LinkedIn
          </a>
          <a
            href="/tony-lin-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'gap-1.5')}
          >
            <FileSpreadsheet size={13} />
            Resume
          </a>
        </div>
      </div>

      {/* ── 2. Data sources ── */}
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
                  '458 orders, Jan 20 to May 10 2026',
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
                  '123 singles + 10 sealed listings, $5,920 listed value',
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
