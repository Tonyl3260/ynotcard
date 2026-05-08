import { Code2, ExternalLink } from 'lucide-react'

const LINKS = [
  {
    href: 'https://github.com',
    label: 'GitHub',
    Icon: Code2,
    external: true,
  },
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    Icon: ExternalLink,
    external: true,
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] mt-4">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left - brand */}
        <div className="flex items-center gap-3">
          <span
            className="h-6 w-6 rounded-md flex items-center justify-center text-[0.65rem] font-black text-primary-400 border border-primary-500/30"
            style={{ background: 'rgba(59,130,246,0.1)' }}
            aria-hidden
          >
            Y
          </span>
          <div>
            <p className="text-[0.78rem] font-semibold text-slate-400">YNotCard</p>
            <p className="text-[0.62rem] text-slate-600">
              TCG Portfolio Analytics · Built with Next.js & Recharts
            </p>
          </div>
        </div>

        {/* Right - links */}
        <nav aria-label="Footer links" className="flex items-center gap-1">
          {LINKS.map(({ href, label, Icon, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.78rem] text-slate-500 border border-transparent hover:text-slate-200 hover:border-white/[0.08] hover:bg-white/[0.04] transition-all duration-150"
            >
              <Icon size={14} strokeWidth={1.75} aria-hidden />
              {label}
            </a>
          ))}
          <span className="ml-2 text-[0.62rem] text-slate-700 select-none">
            © {new Date().getFullYear()}
          </span>
        </nav>
      </div>
    </footer>
  )
}
