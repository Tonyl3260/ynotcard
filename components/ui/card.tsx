import { cn } from '@/lib/utils'

const accentBar = {
  blue:   'before:bg-gradient-to-r before:from-primary-500 before:to-cyan-400',
  gold:   'before:bg-gradient-to-r before:from-amber-400 before:to-orange-500',
  green:  'before:bg-gradient-to-r before:from-emerald-500 before:to-emerald-400',
  red:    'before:bg-gradient-to-r before:from-red-500 before:to-rose-400',
  purple: 'before:bg-gradient-to-r before:from-violet-500 before:to-purple-400',
} as const

const accentGlow = {
  blue:   'hover:shadow-glow-blue',
  gold:   'hover:shadow-glow-gold',
  green:  'hover:shadow-glow-green',
  red:    '',
  purple: '',
} as const

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Colored 2px top bar + matching hover glow */
  accent?: keyof typeof accentBar
  /** Lift on hover */
  hoverable?: boolean
}

export function Card({ className, accent, hoverable = !!accent, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        // Base surface
        'relative overflow-hidden rounded-card',
        'bg-canvas-800/70 border border-white/[0.06]',
        'backdrop-blur-glass',
        'transition-all duration-200',
        // Accent top bar
        accent && [
          'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[2px]',
          accentBar[accent],
        ],
        // Hover state
        hoverable && [
          'hover:border-white/[0.12] hover:-translate-y-0.5',
          accent && accentGlow[accent],
        ],
        className,
      )}
      {...props}
    >
      {/* Subtle inner highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card bg-gradient-to-br from-white/[0.025] to-transparent"
      />
      <div className="relative">{children}</div>
    </div>
  )
}
