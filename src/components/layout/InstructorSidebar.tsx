'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store/appStore'
import {
  Home,
  BookOpen,
  FileText,
  AlertTriangle,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Shield,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const mainNavItems = [
  { href: '/instructor/dashboard', label: 'Dashboard', icon: Home },
  { href: '/instructor/courses', label: 'My Courses', icon: BookOpen },
  { href: '/instructor/students', label: 'Students', icon: Users },
  { href: '/instructor/submissions', label: 'Submissions', icon: FileText },
  { href: '/instructor/grading', label: 'Grading', icon: ClipboardCheck },
]

const managementNavItems = [
  { href: '/instructor/flagged', label: 'Flagged Work', icon: AlertTriangle, hasBadge: true },
  { href: '/instructor/integrity', label: 'Integrity Reports', icon: Shield },
  { href: '/instructor/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/instructor/schedule', label: 'Schedule', icon: Calendar },
]

const supportNavItems = [
  { href: '/instructor/ai-assistant', label: 'AI Assistant', icon: MessageSquare },
  { href: '/instructor/notifications', label: 'Notifications', icon: Bell, badge: 5 },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function InstructorSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, integrityReports, logout, sidebarCollapsed, toggleSidebar } = useAppStore()
  const isCollapsed = sidebarCollapsed

  if (!currentUser) return null

  // Count flagged submissions
  const flaggedCount = integrityReports.filter(
    (report) => report.riskLevel === 'high' || report.flags.length > 0
  ).length

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const NavLink = ({ item }: { item: { href: string; label: string; icon: React.ElementType; badge?: number; hasBadge?: boolean } }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    const showBadge = item.hasBadge && flaggedCount > 0

    return (
      <Link key={item.href} href={item.href}>
        <div
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            isActive
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-white')} />
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  'px-2 py-0.5 text-xs rounded-full',
                  isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'
                )}>
                  {item.badge}
                </span>
              )}
              {showBadge && (
                <span className={cn(
                  'px-2 py-0.5 text-xs rounded-full',
                  isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                )}>
                  {flaggedCount}
                </span>
              )}
            </>
          )}
        </div>
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-50 flex flex-col',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Header with Logo */}
      <div className={cn('p-4 border-b border-slate-100', isCollapsed && 'px-2')}>
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          {!isCollapsed ? (
            <>
              <div className="bg-white rounded-lg p-1.5 shadow-sm border border-slate-200">
                <Image
                  src="/apic-logo.png"
                  alt="APIC"
                  width={100}
                  height={30}
                  className="h-7 w-auto"
                />
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-slate-900">UniPortal</span>
              </div>
            </>
          ) : (
            <div className="p-2 bg-emerald-600 rounded-xl">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 z-10"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* User Profile Card */}
      <div className={cn('p-4', isCollapsed && 'px-2')}>
        <div className={cn(
          'flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl',
          isCollapsed && 'justify-center p-2'
        )}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-semibold text-sm flex-shrink-0 shadow-lg shadow-emerald-500/25">
            {getInitials(currentUser.name)}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">Lecturer</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Menu</p>
          )}
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        {/* Management */}
        <div className="mt-6 space-y-1">
          {!isCollapsed && (
            <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Management</p>
          )}
          {managementNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        {/* Support */}
        <div className="mt-6 space-y-1">
          {!isCollapsed && (
            <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Support</p>
          )}
          {supportNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className={cn('p-4 border-t border-slate-100 space-y-2', isCollapsed && 'px-2')}>
        {!isCollapsed && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-900">Quick Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <p className="text-slate-500">Pending</p>
                <p className="font-bold text-lg text-slate-900">12</p>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <p className="text-slate-500">Flagged</p>
                <p className="font-bold text-lg text-red-600">{flaggedCount}</p>
              </div>
            </div>
          </div>
        )}

        <Link href="/instructor/settings">
          <div className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors',
            isCollapsed && 'justify-center px-2'
          )}>
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span>Settings</span>}
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
