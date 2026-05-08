import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-bold uppercase tracking-[0.05em] whitespace-nowrap border',
  {
    variants: {
      variant: {
        blue:   'bg-primary-500/15 text-primary-400 border-primary-500/30',
        gold:   'bg-amber-400/15   text-amber-400   border-amber-400/30',
        green:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        red:    'bg-red-500/15     text-red-400     border-red-500/30',
        purple: 'bg-violet-500/15  text-violet-400  border-violet-500/30',
        muted:  'bg-slate-500/10   text-slate-500   border-slate-500/20',
      },
      size: {
        sm: 'text-[0.65rem] px-2 py-0.5',
        md: 'text-[0.68rem] px-2.5 py-1',
      },
    },
    defaultVariants: {
      variant: 'muted',
      size: 'sm',
    },
  },
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { badgeVariants }
