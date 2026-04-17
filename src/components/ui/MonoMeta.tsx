import { cn } from '@/lib/utils'

export function MonoMeta({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'font-mono-ui text-[13px] leading-5 tracking-[0.08em] text-[var(--slate)]',
        className
      )}
    >
      {children}
    </p>
  )
}
