'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAppStore } from '@/lib/store/appStore'
import {
  Shield,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Send,
  BookOpen,
  Users,
  AlertTriangle,
} from 'lucide-react'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface HeaderProps {
  showTrueLearn?: boolean
}

export function Header({ showTrueLearn = false }: HeaderProps) {
  const router = useRouter()
  const { currentUser, logout } = useAppStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const studentNavItems = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/dashboard', label: 'Assignments', icon: FileText },
    { href: '/student/dashboard', label: 'My Submissions', icon: Send },
  ]

  const instructorNavItems = [
    { href: '/instructor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/instructor/dashboard', label: 'Courses', icon: BookOpen },
    { href: '/instructor/dashboard', label: 'Submissions', icon: FileText },
    { href: '/instructor/dashboard', label: 'Flagged', icon: AlertTriangle },
  ]

  const navItems = currentUser?.role === 'instructor' ? instructorNavItems : studentNavItems

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href={currentUser ? (currentUser.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard') : '/'} className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary hidden sm:inline">UniPortal</span>
          </Link>

          {showTrueLearn && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hidden md:flex">
              TrueLearn Active
            </Badge>
          )}
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {currentUser && navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{currentUser.name}</span>
                    <span className="text-xs font-normal text-slate-500">{currentUser.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/')}>
                  <Users className="h-4 w-4 mr-2" />
                  Switch User
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
