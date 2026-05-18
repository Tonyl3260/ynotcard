'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import inventoryData from '@/inventory.json'

// ── Types ──────────────────────────────────────────────────────────────────────

type SortKey = 'price' | 'total_listed_value' | 'name' | 'qty'
type SortDir = 'asc' | 'desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'price',              label: 'Price'       },
  { key: 'total_listed_value', label: 'Total Value' },
  { key: 'name',               label: 'Name'        },
  { key: 'qty',                label: 'Qty'         },
]

// ── Rarity styling ────────────────────────────────────────────────────────────

const RARITY_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  'L':     { label: 'L',   color: '#FBBF24', bg: 'rgba(251,191,36,0.12)'  },
  'SEC':   { label: 'SEC', color: '#22D3EE', bg: 'rgba(34,211,238,0.12)'  },
  'SR':    { label: 'SR',  color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  'PR':    { label: 'PR',  color: '#60A5FA', bg: 'rgba(96,165,250,0.12)'  },
  'R':     { label: 'R',   color: '#34D399', bg: 'rgba(52,211,153,0.12)'  },
  'UC':    { label: 'UC',  color: '#94A3B8', bg: 'rgba(148,163,184,0.10)' },
  'C':     { label: 'C',   color: '#64748B', bg: 'rgba(100,116,139,0.10)' },
  'DON!!': { label: 'DON', color: '#F87171', bg: 'rgba(248,113,113,0.12)' },
}

function RarityBadge({ rarity }: { rarity: string }) {
  const s = RARITY_STYLE[rarity] ?? { label: rarity, color: '#94A3B8', bg: 'rgba(148,163,184,0.10)' }
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded text-[0.58rem] font-bold leading-none"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SINGLES = inventoryData.singles.map((item, i) => ({ ...item, _id: i }))
const TOTAL_VALUE  = SINGLES.reduce((s, c) => s + c.total_listed_value, 0)
const TOTAL_COPIES = SINGLES.reduce((s, c) => s + c.qty, 0)

// ── Inventory Table ───────────────────────────────────────────────────────────

function InventoryTable() {
  const [sortKey, setSortKey] = useState<SortKey>('price')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [search, setSearch]   = useState('')

  function selectSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  const query    = search.trim().toLowerCase()
  const filtered = query
    ? SINGLES.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.set.toLowerCase().includes(query)  ||
        (i.number ?? '').toLowerCase().includes(query)
      )
    : SINGLES

  const sorted = [...filtered].sort((a, b) => {
    let diff = 0
    if      (sortKey === 'name')               diff = a.name.localeCompare(b.name)
    else if (sortKey === 'qty')                diff = a.qty - b.qty
    else if (sortKey === 'price')              diff = a.price - b.price
    else if (sortKey === 'total_listed_value') diff = a.total_listed_value - b.total_listed_value
    return sortDir === 'asc' ? diff : -diff
  })

  return (
    <Card accent="blue" className="p-5">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.09em] text-slate-500">
          All Singles · {filtered.length}{filtered.length !== SINGLES.length ? `/${SINGLES.length}` : ''} listings
        </p>
        <div className="flex items-center gap-3">
          <span className="text-[0.62rem] text-slate-500 tabular-nums">{TOTAL_COPIES} copies</span>
          <span className="text-[0.62rem] text-slate-500 tabular-nums">
            ${TOTAL_VALUE.toLocaleString('en-US', { minimumFractionDigits: 2 })} listed
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, set, or card number…"
          className="w-full pl-8 pr-3 py-2 rounded-lg bg-canvas-800/60 border border-white/[0.07] text-[0.78rem] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 focus:bg-canvas-800 transition-colors"
        />
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-[0.62rem] text-slate-600 uppercase tracking-widest font-bold mr-1">Sort</span>
        {SORT_OPTIONS.map(({ key, label }) => {
          const active = sortKey === key
          return (
            <button
              key={key}
              onClick={() => selectSort(key)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-md text-[0.7rem] font-medium transition-all',
                active
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-white/[0.04] text-slate-500 border border-white/[0.06] hover:text-slate-300 hover:bg-white/[0.07]',
              )}
            >
              {label}
              {active && (
                sortDir === 'asc'
                  ? <ArrowUp size={11} strokeWidth={2.5} />
                  : <ArrowDown size={11} strokeWidth={2.5} />
              )}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-y-auto max-h-[520px]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ background: '#0C1524' }} className="sticky top-0">
              <th className="py-2 pl-3 pr-2 w-8">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">#</span>
              </th>
              <th className="py-2 px-2">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">Name</span>
              </th>
              <th className="py-2 px-2 w-14 text-right">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">Rarity</span>
              </th>
              <th className="py-2 px-2 w-12 text-right">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">Qty</span>
              </th>
              <th className="py-2 px-2 w-24 text-right">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">Price</span>
              </th>
              <th className="py-2 pl-2 pr-3 w-24 text-right">
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-slate-600">Total</span>
              </th>
            </tr>
            <tr style={{ background: '#0C1524' }}>
              <td colSpan={6} className="h-px bg-white/[0.06] p-0" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => (
              <tr
                key={item._id}
                className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
              >
                <td className="py-2 pl-3 pr-2 text-[0.62rem] font-bold text-slate-600 tabular-nums align-middle">
                  {i + 1}
                </td>
                <td className="py-2 px-2 align-middle min-w-0 max-w-[1px]">
                  <p className="text-[0.78rem] font-medium text-slate-200 truncate leading-tight">{item.name}</p>
                  <p className="text-[0.6rem] text-slate-600 truncate leading-tight">
                    {item.number ? `${item.number} · ` : ''}{item.set}
                  </p>
                </td>
                <td className="py-2 px-2 text-right align-middle">
                  <RarityBadge rarity={item.rarity} />
                </td>
                <td className="py-2 px-2 text-right align-middle text-[0.7rem] text-slate-500 tabular-nums">
                  ×{item.qty}
                </td>
                <td className={cn(
                  'py-2 px-2 text-right align-middle text-[0.82rem] font-bold tabular-nums',
                  item.price >= 100 ? 'text-primary-400' : item.price >= 50 ? 'text-amber-400' : 'text-slate-200',
                )}>
                  ${item.price.toFixed(2)}
                </td>
                <td className="py-2 pl-2 pr-3 text-right align-middle text-[0.72rem] text-slate-400 tabular-nums">
                  ${item.total_listed_value.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

export function InventoryIntelligence() {
  return (
    <section className="px-6 pt-8 pb-16 max-w-6xl mx-auto">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="h-4 w-[3px] rounded-full bg-gradient-to-b from-primary-500 to-cyan-400 shrink-0" />
        <div>
          <h2 className="text-[1rem] font-semibold text-slate-100">Inventory</h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <InventoryTable />
      </motion.div>
    </section>
  )
}
