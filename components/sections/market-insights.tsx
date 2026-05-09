'use client'

import { Construction } from 'lucide-react'

export function MarketInsights() {
  return (
    <section className="px-6 pt-8 pb-16 max-w-6xl mx-auto">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
        <div>
          <h2 className="text-[1rem] font-semibold text-slate-100">Market Insights</h2>
          <p className="text-[0.8rem] text-slate-500 mt-0.5">Price trends · set performance · market signals</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-24 gap-5 rounded-xl border border-dashed border-white/[0.08] bg-canvas-900/40">
        <div className="h-14 w-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
          <Construction size={26} strokeWidth={1.6} className="text-primary-400" />
        </div>
        <div className="text-center">
          <p className="text-[1rem] font-semibold text-slate-200">Work in Progress</p>
          <p className="text-[0.82rem] text-slate-500 mt-1.5 max-w-xs leading-relaxed">
            Market data integration coming soon. Live price trends and set performance will appear here.
          </p>
        </div>
      </div>
    </section>
  )
}
