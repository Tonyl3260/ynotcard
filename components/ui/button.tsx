import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-semibold',
    'rounded-[9px] border cursor-pointer select-none',
    'transition-all duration-200',
    'disabled:opacity-50 disabled:pointer-events-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-br from-primary-500 to-primary-700',
          'text-white border-transparent',
          'shadow-[0_2px_12px_rgba(59,130,246,0.30)]',
          'hover:shadow-[0_4px_20px_rgba(59,130,246,0.45)] hover:-translate-y-px',
        ],
        secondary: [
          'bg-canvas-700 text-slate-200 border-white/[0.10]',
          'hover:border-white/[0.20] hover:bg-canvas-600',
        ],
        ghost: [
          'bg-transparent text-slate-400 border-white/[0.08]',
          'hover:border-primary-500/40 hover:text-primary-400 hover:bg-primary-500/10',
        ],
      },
      size: {
        sm:   'text-sm px-3 py-1.5',
        md:   'text-[0.9rem] px-[18px] py-[7px]',
        lg:   'text-base px-6 py-2.5',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}

export { buttonVariants }
