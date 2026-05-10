'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  TrendingUp,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Footer } from '@/components/sections/footer'

const NAV = [
  { label: 'Dashboard', href: '/',          Icon: LayoutDashboard },
  { label: 'Analytics', href: '/analytics', Icon: BarChart3 },
  { label: 'Inventory', href: '/inventory', Icon: Package },
  { label: 'Market',    href: '/market',    Icon: TrendingUp },
  { label: 'Reports',   href: '/reports',   Icon: FileText },
] as const

// ── Wordmark ─────────────────────────────────────────────────────────────────

function Logo({ size = 40, showName = false }: { size?: number; showName?: boolean }) {
  return (
    <Link href="/" aria-label="YNotCard home" className="shrink-0 [text-decoration:none] flex items-center gap-2.5">
      {/* mix-blend-mode:lighten drops the logo's black background on dark surfaces */}
      <Image
        src="/logo.webp"
        alt="YNotCard logo"
        width={size}
        height={size}
        className="rounded-md"
        style={{ mixBlendMode: 'lighten' }}
        priority
      />
      {showName && (
        <span className="text-slate-100 font-bold text-[1rem] tracking-tight leading-none">
          ynotcard
        </span>
      )}
    </Link>
  )
}

// ── Nav items (shared) ────────────────────────────────────────────────────────

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV.map(({ label, href, Icon }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'group relative flex items-center gap-3 rounded-[8px] px-3 py-2.5',
              'text-[0.88rem] font-medium transition-all duration-150',
              '[text-decoration:none]',
              active
                ? 'bg-primary-500/[0.12] text-primary-400'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200',
            )}
          >
            {/* Active left bar */}
            {active && (
              <span className="absolute left-0 inset-y-2 w-[3px] rounded-full bg-primary-500" />
            )}
            <Icon
              size={16}
              strokeWidth={active ? 2.2 : 1.8}
              className="shrink-0"
            />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden
        className={cn(
          'fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden',
          'transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={cn(
          'flex flex-col w-[220px] shrink-0',
          'bg-canvas-900 border-r border-white/[0.06]',
          // Mobile: fixed overlay, slide in/out
          'fixed inset-y-0 left-0 z-40',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
          // Desktop: static flex child, always visible
          'lg:static lg:inset-auto lg:z-auto lg:translate-x-0',
        )}
      >
        {/* Logo row */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-white/[0.06]">
          <Logo size={44} showName />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden rounded-md p-1 text-slate-500 hover:text-slate-200 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3">
          <NavItems onNavigate={onClose} />
        </div>

      </aside>
    </>
  )
}

// ── Top bar ───────────────────────────────────────────────────────────────────

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 px-5 border-b border-white/[0.06] bg-canvas-950/80 backdrop-blur-[20px] backdrop-saturate-150">
      {/* Hamburger - mobile only */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden rounded-md p-1.5 text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition-colors"
      >
        <Menu size={19} />
      </button>

      {/* Mobile logo */}
      <div className="lg:hidden">
        <Logo size={32} />
      </div>

      <div className="flex-1" />

      {/* Right: One Piece TCG stats */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="rounded-lg bg-primary-500/[0.07] border border-primary-500/[0.18] px-3 pt-2 pb-2">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[0.8rem] font-bold text-slate-200 leading-none">393</p>
              <p className="text-[0.55rem] text-slate-500 uppercase tracking-wide mt-0.5">orders</p>
            </div>
            <div>
              <p className="text-[0.8rem] font-bold text-slate-200 leading-none">$11.1k</p>
              <p className="text-[0.55rem] text-slate-500 uppercase tracking-wide mt-0.5">revenue</p>
            </div>
            <div>
              <p className="text-[0.8rem] font-bold text-slate-200 leading-none">50</p>
              <p className="text-[0.55rem] text-slate-500 uppercase tracking-wide mt-0.5">states</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// ── Shell (exported) ──────────────────────────────────────────────────────────

export function Shell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content column */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  )
}
