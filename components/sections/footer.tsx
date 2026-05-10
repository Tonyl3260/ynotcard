import { Code2 } from 'lucide-react'

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

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
            <p className="text-[0.78rem] font-semibold text-slate-400">ynotcard TCG Portfolio</p>
          </div>
        </div>

        {/* Right - links */}
        <nav aria-label="Footer links" className="flex items-center gap-1">
          <a
            href="https://github.com/Tonyl3260"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.78rem] text-slate-500 border border-transparent hover:text-slate-200 hover:border-white/[0.08] hover:bg-white/[0.04] transition-all duration-150"
          >
            <Code2 size={14} strokeWidth={1.75} aria-hidden />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/tonylin3260/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.78rem] text-slate-500 border border-transparent hover:text-slate-200 hover:border-white/[0.08] hover:bg-white/[0.04] transition-all duration-150"
          >
            <LinkedInIcon size={14} />
            LinkedIn
          </a>
          <span className="ml-2 text-[0.62rem] text-slate-700 select-none">
            © {new Date().getFullYear()}
          </span>
        </nav>
      </div>
    </footer>
  )
}
