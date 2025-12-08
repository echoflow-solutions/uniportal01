'use client'

import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("w-64 border-r bg-slate-50 p-4", className)}>
      <nav className="space-y-2">
        {/* Navigation items will be added based on user role */}
      </nav>
    </aside>
  )
}
