'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StudentSidebar } from '@/components/layout/StudentSidebar'
import { useAppStore } from '@/lib/store/appStore'
import { cn } from '@/lib/utils'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { currentUser, initializeStore, isInitialized, sidebarCollapsed } = useAppStore()
  const [isHydrated, setIsHydrated] = useState(false)

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  // Only check auth after hydration is complete
  useEffect(() => {
    if (isHydrated && isInitialized) {
      if (!currentUser) {
        router.push('/')
      } else if (currentUser.role !== 'student') {
        router.push('/instructor/dashboard')
      }
    }
  }, [currentUser, router, isHydrated, isInitialized])

  // Show loading while hydrating
  if (!isHydrated || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Show loading while checking auth
  if (!currentUser || currentUser.role !== 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <StudentSidebar />
      <main className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "pl-20" : "pl-72"
      )}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
