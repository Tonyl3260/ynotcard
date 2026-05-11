'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Footer } from '@/components/sections/footer'

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV = [
  { label: 'Overview',  href: '/'          },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Reports',   href: '/reports'   },
  { label: 'About',     href: '/about'     },
] as const

// ── Icon SVGs (lucide-react v1.14 lacks Github/Linkedin) ─────────────────────

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link
      href="/"
      aria-label="YNotCard home"
      className="shrink-0 flex items-center gap-2.5 [text-decoration:none]"
    >
      <Image
        src="/logo.webp"
        alt="YNotCard logo"
        width={30}
        height={30}
        className="rounded-md"
        style={{ mixBlendMode: 'lighten' }}
        priority
      />
      <span className="text-slate-100 font-bold text-[0.95rem] tracking-tight leading-none">
        ynotcard
      </span>
    </Link>
  )
}

// ── Nav links (desktop) ───────────────────────────────────────────────────────

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {NAV.map(({ label, href }) => {
        const active = href === '/' ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'relative px-3 py-1.5 rounded-md text-[0.88rem] font-medium',
              'transition-all duration-150 [text-decoration:none]',
              active
                ? 'text-primary-400 bg-primary-500/[0.1]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]',
            )}
          >
            {label}
            {active && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary-500" />
            )}
          </Link>
        )
      })}
    </>
  )
}

// ── KPI pill ──────────────────────────────────────────────────────────────────

function KPIPill() {
  return (
    <span className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/[0.07] border border-primary-500/[0.18] text-[0.72rem] whitespace-nowrap select-none">
      <span className="font-semibold text-slate-300">458 orders</span>
      <span className="text-slate-500" aria-hidden>·</span>
      <span className="font-semibold text-slate-300">$12.7k</span>
      <span className="text-slate-500" aria-hidden>·</span>
      <span className="font-semibold text-slate-300">50 states</span>
    </span>
  )
}

// ── External icon button ──────────────────────────────────────────────────────

function IconBtn({
  href,
  label,
  children,
  className,
}: {
  href: string
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center justify-center h-8 w-8 rounded-md',
        'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]',
        'transition-colors duration-150',
        className,
      )}
    >
      {children}
    </a>
  )
}

// ── Mobile overlay ────────────────────────────────────────────────────────────

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col md:hidden',
        'bg-canvas-950/95 backdrop-blur-[24px]',
        'transition-opacity duration-200',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      {/* Top row */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-white/[0.06]">
        <Logo />
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-md p-1.5 text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-1 px-4 pt-6">
        {NAV.map(({ label, href }) => {
          const active = href === '/' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center px-4 py-3 rounded-xl text-[1rem] font-medium',
                '[text-decoration:none] transition-all duration-150',
                active
                  ? 'bg-primary-500/[0.12] text-primary-400'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200',
              )}
            >
              {active && (
                <span className="mr-3 h-4 w-[3px] rounded-full bg-primary-500 shrink-0" />
              )}
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: social icons */}
      <div className="mt-auto px-5 pb-8 flex items-center gap-2 border-t border-white/[0.06] pt-5">
        <IconBtn href="https://github.com/Tonyl3260" label="GitHub">
          <GitHubIcon size={18} />
        </IconBtn>
        <IconBtn href="https://www.linkedin.com/in/tonylin3260/" label="LinkedIn">
          <LinkedInIcon size={18} />
        </IconBtn>
      </div>
    </div>
  )
}

// ── Top nav ───────────────────────────────────────────────────────────────────

function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b border-white/[0.06] bg-canvas-950/80 backdrop-blur-[20px] backdrop-saturate-150">
        <div className="relative flex h-full items-center max-w-[1600px] mx-auto px-5">

          {/* Left: logo */}
          <Logo />

          {/* Center: nav links, absolutely centered */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5">
            <NavLinks />
          </nav>

          {/* Right: KPI pill + icons + hamburger */}
          <div className="ml-auto flex items-center gap-1.5">
            <KPIPill />
            {/* Divider between KPI pill and social icons */}
            <span className="hidden lg:block w-px h-4 bg-white/[0.12] mx-1" aria-hidden />
            <div className="hidden md:flex items-center gap-0.5">
              <IconBtn href="https://github.com/Tonyl3260" label="GitHub">
                <GitHubIcon size={17} />
              </IconBtn>
              <IconBtn href="https://www.linkedin.com/in/tonylin3260/" label="LinkedIn">
                <LinkedInIcon size={17} />
              </IconBtn>
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="md:hidden rounded-md p-1.5 text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>

        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

// ── Shell (root layout wrapper) ───────────────────────────────────────────────

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
