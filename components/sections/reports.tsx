'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'

// ── Tableau embed ─────────────────────────────────────────────────────────────

const TABLEAU_URL =
  'https://public.tableau.com/views/YnotCardTCGPlayerSalesAnalyticsJan-Apr2026/Dashboard'
const TABLEAU_SHARE_URL =
  'https://public.tableau.com/app/profile/tonylin3260/viz/YnotCardTCGPlayerSalesAnalyticsJan-Apr2026/Dashboard'

function TableauEmbed() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(720)

  useEffect(() => {
    function updateHeight() {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      setHeight(w < 640 ? 500 : w < 1024 ? 620 : 720)
    }
    updateHeight()
    const ro = new ResizeObserver(updateHeight)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const src = `${TABLEAU_URL}?:embed=yes&:display_count=yes&:toolbar=yes&:showVizHome=no&:animate_transition=yes`

  return (
    <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-white/[0.08]">
      <iframe
        src={src}
        title="YnotCard TCG Player Sales Analytics Jan-Apr 2026"
        width="100%"
        height={height}
        style={{ border: 'none', display: 'block', background: '#0f172a' }}
        allowFullScreen
      />
    </div>
  )
}

// ── Placeholder card for future reports ──────────────────────────────────────

const FUTURE_REPORTS = [
  { title: 'May-Aug 2026 Sales', description: 'TCG Player sales breakdown once the period closes.' },
  { title: 'Profit & Loss Summary', description: 'Full P&L including cost of goods, fees, and net profit.' },
  { title: 'Market Trend Analysis', description: 'Price trend charts for high-value singles over time.' },
]

function FuturePlaceholder() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {FUTURE_REPORTS.map(({ title, description }) => (
        <Card key={title} className="p-5 border-dashed opacity-60">
          <div className="flex items-center gap-2.5 mb-2">
            <FileText size={14} strokeWidth={1.8} className="text-slate-500 shrink-0" />
            <p className="text-[0.82rem] font-semibold text-slate-400">{title}</p>
          </div>
          <p className="text-[0.72rem] text-slate-600 leading-relaxed">{description}</p>
          <span className="inline-block mt-3 text-[0.62rem] font-bold uppercase tracking-widest text-slate-600">
            Coming soon
          </span>
        </Card>
      ))}
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function Reports() {
  return (
    <div className="px-6 py-10 max-w-6xl mx-auto space-y-10">

      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
          <div>
            <h1 className="text-[1rem] font-semibold text-slate-100">Reports</h1>
            <p className="text-[0.8rem] text-slate-500 mt-0.5">Sales analytics · Tableau dashboards · deep-dive analysis</p>
          </div>
        </div>
      </div>

      {/* Primary report */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[0.88rem] font-semibold text-slate-200">
              TCG Player Sales Analytics
            </p>
            <p className="text-[0.72rem] text-slate-500 mt-0.5">January - April 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.06em] border"
              style={{ color: '#60A5FA', background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.25)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Tableau Public
            </span>
            <a
              href={TABLEAU_SHARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.78rem] text-slate-400 border border-white/[0.08] hover:text-slate-100 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-150 no-underline"
            >
              Open in Tableau
              <ExternalLink size={12} strokeWidth={2} />
            </a>
          </div>
        </div>
        <TableauEmbed />
      </div>

      {/* Future reports */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-slate-600 to-slate-700 shrink-0" />
          <p className="text-[0.82rem] font-semibold text-slate-500">Upcoming Reports</p>
        </div>
        <FuturePlaceholder />
      </div>

    </div>
  )
}
