'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store/appStore'
import {
  Home,
  BookOpen,
  FileText,
  Send,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar,
  BarChart3,
  Shield,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  Bot,
  Library,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { UniversityFrontDeskChat } from '@/components/chat/UniversityFrontDeskChat'

const mainNavItems = [
  { href: '/student/dashboard', label: 'Dashboard', icon: Home },
  { href: '/student/courses', label: 'My Courses', icon: BookOpen },
  { href: '/student/assignments', label: 'Assignments', icon: FileText },
  { href: '/student/submissions', label: 'My Submissions', icon: Send },
  { href: '/student/grades', label: 'Grades', icon: BarChart3 },
  { href: '/student/library', label: 'Library', icon: Library },
]

const managementNavItems = [
  { href: '/student/fees', label: 'Fees & Payments', icon: CreditCard },
  { href: '/student/schedule', label: 'Schedule', icon: Calendar },
  { href: '/student/integrity', label: 'Academic Integrity', icon: Shield },
]

const supportNavItems = [
  { href: '/student/ai-assistant', label: 'AI Academic Assistant', icon: MessageSquare },
  { href: '/student/notifications', label: 'Notifications', icon: Bell, badge: 3 },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function StudentSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, logout, sidebarCollapsed, toggleSidebar } = useAppStore()
  const isCollapsed = sidebarCollapsed
  const [isChatOpen, setIsChatOpen] = useState(false)

  if (!currentUser) return null

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const NavLink = ({ item }: { item: { href: string; label: string; icon: React.ElementType; badge?: number } }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    return (
      <Link key={item.href} href={item.href}>
        <div
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            isActive
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive && 'text-white')} />
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  'px-1.5 py-0.5 text-xs rounded-full',
                  isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                )}>
                  {item.badge}
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
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header with Logo */}
      <div className={cn('p-3 border-b border-slate-100', isCollapsed && 'px-2')}>
        <div className={cn('flex items-center gap-2', isCollapsed && 'justify-center')}>
          {!isCollapsed ? (
            <>
              <div className="bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                <Image
                  src="/apic-logo.png"
                  alt="APIC"
                  width={80}
                  height={24}
                  className="h-6 w-auto"
                />
              </div>
              <div className="h-5 w-px bg-slate-200" />
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span className="font-bold text-slate-900 text-sm">UniPortal</span>
              </div>
            </>
          ) : (
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-16 h-6 w-6 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 z-10"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* User Profile - Compact */}
      <div className={cn('px-3 py-2', isCollapsed && 'px-2')}>
        <div className={cn(
          'flex items-center gap-2 p-2 bg-slate-50 rounded-lg',
          isCollapsed && 'justify-center p-1.5'
        )}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold text-xs flex-shrink-0">
            {getInitials(currentUser.name)}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-slate-900 truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-xs text-green-600">Online</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-1 space-y-4 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-0.5">
          {!isCollapsed && (
            <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Main</p>
          )}
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        {/* Management */}
        <div className="space-y-0.5">
          {!isCollapsed && (
            <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Management</p>
          )}
          {managementNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        {/* Support */}
        <div className="space-y-0.5">
          {!isCollapsed && (
            <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Academic Support</p>
          )}
          {supportNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom Section - Compact */}
      <div className={cn('px-3 py-2 border-t border-slate-100 space-y-1', isCollapsed && 'px-2')}>
        {/* AI Chatbot Button - Inline Style */}
        {!isCollapsed ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20"
          >
            <Bot className="h-4 w-4" />
            <span className="flex-1 text-left">AI Chatbot</span>
            <MessageSquare className="h-3.5 w-3.5 opacity-70" />
          </button>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full flex justify-center p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Bot className="h-4 w-4" />
          </button>
        )}

        <Link href="/student/profile">
          <div className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors',
            isCollapsed && 'justify-center px-2'
          )}>
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span>Settings</span>}
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* AI Chatbot Modal */}
      <UniversityFrontDeskChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </aside>
  )
}
