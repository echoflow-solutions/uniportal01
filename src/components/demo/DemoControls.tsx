'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAppStore } from '@/lib/store/appStore'
import {
  Sparkles,
  Users,
  RefreshCw,
  ChevronRight,
  Star,
  TrendingUp,
  AlertTriangle,
  User,
  GraduationCap,
} from 'lucide-react'

interface DemoUser {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor'
  icon: React.ReactNode
  badge: string
  badgeColor: string
}

const demoUsers: DemoUser[] = [
  {
    id: 'instructor1',
    name: 'Dr. Ifeanyi Egwutuoha',
    email: 'ifeanyi.egwutuoha@demo.edu',
    role: 'instructor',
    icon: <GraduationCap className="h-4 w-4" />,
    badge: 'Instructor',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    id: 'student1',
    name: 'Emmanuel Alisetti',
    email: 'emmanuel.alisetti@demo.edu',
    role: 'student',
    icon: <Star className="h-4 w-4 text-green-500" />,
    badge: 'High Integrity',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'student5',
    name: 'Michael Thompson',
    email: 'michael.thompson@demo.edu',
    role: 'student',
    icon: <Sparkles className="h-4 w-4 text-blue-500" />,
    badge: 'Top Performer',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'student4',
    name: 'Sarah Chen',
    email: 'sarah.chen@demo.edu',
    role: 'student',
    icon: <User className="h-4 w-4 text-slate-500" />,
    badge: 'New Student',
    badgeColor: 'bg-slate-100 text-slate-700',
  },
  {
    id: 'student2',
    name: 'Kabir Arya Niraula',
    email: 'kabir.niraula@demo.edu',
    role: 'student',
    icon: <TrendingUp className="h-4 w-4 text-amber-500" />,
    badge: 'Medium Integrity',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'student3',
    name: 'Bernard Adjei-Yeboah',
    email: 'bernard.adjei-yeboah@demo.edu',
    role: 'student',
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
    badge: 'Flagged Example',
    badgeColor: 'bg-red-100 text-red-700',
  },
]

export function DemoControls() {
  const router = useRouter()
  const { currentUser, login, resetToInitialState } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleSwitchUser = (email: string, role: 'student' | 'instructor') => {
    login(email)
    setIsOpen(false)
    if (role === 'instructor') {
      router.push('/instructor/dashboard')
    } else {
      router.push('/student/dashboard')
    }
  }

  const handleReset = () => {
    resetToInitialState()
    router.push('/')
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
          size="icon"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Demo Controls
          </SheetTitle>
          <SheetDescription>
            Switch between demo users to explore different perspectives and scenarios
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Current User */}
          {currentUser && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs text-slate-500 uppercase font-medium mb-2">Currently Logged In</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-slate-500 capitalize">{currentUser.role}</p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Active
                </Badge>
              </div>
            </div>
          )}

          {/* Switch User */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-medium text-slate-700">Quick Switch</p>
            </div>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSwitchUser(user.email, user.role)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-slate-50 ${
                    currentUser?.email === user.email
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      {user.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <Badge className={`text-xs ${user.badgeColor}`}>
                        {user.badge}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Reset Data */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleReset}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Demo Data
            </Button>
            <p className="text-xs text-slate-500 text-center mt-2">
              Resets all data to initial demo state
            </p>
          </div>

          {/* Info */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Demo Mode:</strong> All data is stored locally in your browser.
              No real authentication or backend is used.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
