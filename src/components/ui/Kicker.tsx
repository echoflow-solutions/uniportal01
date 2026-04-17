import { cn } from '@/lib/utils'

export function Kicker({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <p className={cn('editorial-kicker', className)}>{children}</p>
}
