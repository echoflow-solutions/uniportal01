import { cn } from '@/lib/utils'

export function InkRule({ className }: { className?: string }) {
  return <div aria-hidden className={cn('ink-rule w-full', className)} />
}
