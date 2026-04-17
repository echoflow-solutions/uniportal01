'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  MessageSquareText,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store/appStore'

const demoCredentials = {
  lecturer: {
    email: 'ifeanyi.egwutuoha@demo.edu',
    password: 'demo123',
    name: 'Dr. Ifeanyi Egwutuoha',
  },
  students: [
    { email: 'emmanuel.alisetti@demo.edu', password: 'demo123', name: 'Emmanuel Alisetti' },
    { email: 'kabir.niraula@demo.edu', password: 'demo123', name: 'Kabir Arya Niraula' },
    { email: 'bernard.adjei-yeboah@demo.edu', password: 'demo123', name: 'Bernard Adjei-Yeboah' },
  ],
}

const features = [
  { icon: BookOpen, title: 'Courses', description: 'Enroll & track progress' },
  { icon: CreditCard, title: 'Fees', description: 'Payments & balances' },
  { icon: Shield, title: 'Integrity', description: 'TrueLearn verification' },
  { icon: BarChart3, title: 'Grades', description: 'Reports & analytics' },
  { icon: Calendar, title: 'Schedule', description: 'Timetables & events' },
  { icon: MessageSquareText, title: 'AI Assistant', description: 'Smart chatbot support' },
]

export function LoginExperience() {
  const router = useRouter()
  const { login, logout, initializeStore } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('login')

  useEffect(() => {
    initializeStore()
    logout()
  }, [initializeStore, logout])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    const success = login(email)
    if (success) {
      const isLecturer = email === demoCredentials.lecturer.email
      router.push(isLecturer ? '/instructor/dashboard' : '/student/dashboard')
    } else {
      setError('Invalid credentials. Please use a demo account.')
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (userEmail: string, role: 'student' | 'instructor') => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = login(userEmail)
    if (success) {
      router.push(role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white xl:p-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="rounded-xl bg-white p-4 shadow-xl">
                <Image
                  src="/apic-logo.png"
                  alt="Asia Pacific International College"
                  width={160}
                  height={48}
                  className="h-11 w-auto"
                />
              </div>
              <div className="h-10 w-px bg-white/30" />
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">UniPortal</h1>
                  <p className="text-sm text-blue-200">University Management System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-base text-blue-200">
              <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
              <span>Online</span>
            </div>
          </div>

          <div className="space-y-10 py-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/90 px-5 py-2.5 text-base font-semibold shadow-lg backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-slate-800">Master&apos;s Final Assessment</span>
            </div>

            <div className="space-y-5">
              <h2 className="text-5xl font-bold leading-tight xl:text-6xl">
                Your Complete
                <br />
                <span className="text-cyan-300">University Portal</span>
              </h2>
              <p className="max-w-xl text-xl leading-relaxed text-blue-100">
                Access courses, manage fees, track academic progress, and ensure integrity —
                everything you need in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group flex items-center gap-4 rounded-2xl bg-white/90 p-5 shadow-lg transition-all duration-300 hover:bg-white hover:shadow-xl"
                >
                  <div className="rounded-xl bg-blue-100 p-3">
                    <feature.icon className="h-6 w-6 text-blue-600 transition-transform group-hover:scale-110" />
                  </div>
                  <div>
                    <span className="block text-base font-bold text-slate-900">{feature.title}</span>
                    <span className="mt-0.5 block text-sm text-slate-500">{feature.description}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-4">
              <div className="flex items-center gap-2.5 rounded-full bg-white/20 px-5 py-2.5">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span className="text-base font-medium text-white">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-full bg-white/20 px-5 py-2.5">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span className="text-base font-medium text-white">Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-full bg-white/20 px-5 py-2.5">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span className="text-base font-medium text-white">Secure Platform</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-base text-blue-200">
            <div>
              <p className="text-lg font-semibold text-white">Asia Pacific International College</p>
              <p className="mt-1.5 text-base text-blue-200">ICT6001 Applied Project · Trimester 3, 2025</p>
              <p className="mt-1.5 text-sm text-blue-300">
                Lecturer: <span className="font-medium text-white">Dr. Ifeanyi Egwutuoha</span>
              </p>
            </div>
            <div className="text-right">
              <p className="mb-2 text-sm text-blue-300">Developed by</p>
              <p className="text-base font-medium text-white">Bernard Adjei-Yeboah - 202401320</p>
              <p className="text-base font-medium text-white">Emmanuel Alisetti - 202500143</p>
              <p className="text-base font-medium text-white">Kabir Arya Niraula - 202500531</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="p-6 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/apic-logo.png"
                alt="Asia Pacific International College"
                width={120}
                height={36}
                className="h-8 w-auto"
              />
              <div className="h-6 w-px bg-slate-300" />
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-slate-900">UniPortal</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-lg">
            <Card className="border-0 bg-white/80 shadow-2xl shadow-slate-200/60 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-8 grid h-12 w-full grid-cols-2 bg-slate-100">
                    <TabsTrigger
                      value="login"
                      className="text-base font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="demo"
                      className="text-base font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Demo Access
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex min-h-[520px] flex-col">
                    <TabsContent value="login" className="mt-0 flex flex-1 flex-col justify-center space-y-6">
                      <div className="mb-6 text-center">
                        <h3 className="text-2xl font-bold text-slate-900">Welcome Back</h3>
                        <p className="mt-1 text-base text-slate-500">Sign in to your account</p>
                      </div>

                      <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-base font-medium text-slate-700">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              autoComplete="email"
                              className="h-14 border-slate-200 pl-12 text-base focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-base font-medium text-slate-700">
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              autoComplete="current-password"
                              className="h-14 border-slate-200 pl-12 pr-12 text-base focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        {error ? (
                          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-600">
                            {error}
                          </div>
                        ) : null}

                        <Button
                          type="submit"
                          className="mt-2 h-14 w-full bg-blue-600 text-lg font-semibold text-white hover:bg-blue-700"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              <span>Signing in...</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <span>Sign In</span>
                              <ArrowRight className="h-5 w-5" />
                            </span>
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="demo" className="mt-0 space-y-5">
                      <div className="mb-6 text-center">
                        <h3 className="text-2xl font-bold text-slate-900">Quick Demo Access</h3>
                        <p className="mt-1 text-base text-slate-500">Select an account to explore</p>
                      </div>

                      <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                          Lecturer
                        </p>
                        <button
                          onClick={() => handleQuickLogin(demoCredentials.lecturer.email, 'instructor')}
                          disabled={isLoading}
                          className="group w-full rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 text-left transition-all duration-300 hover:border-blue-400 hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white">
                              IE
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-base font-semibold text-slate-900">
                                  {demoCredentials.lecturer.name}
                                </span>
                                <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white">
                                  Lecturer
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-blue-600" />
                          </div>
                        </button>
                      </div>

                      <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                          Students
                        </p>
                        <div className="space-y-3">
                          {demoCredentials.students.map((student) => (
                            <button
                              key={student.email}
                              onClick={() => handleQuickLogin(student.email, 'student')}
                              disabled={isLoading}
                              className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-300 hover:border-slate-300 hover:shadow-sm"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                                  {student.name
                                    .split(' ')
                                    .map((part) => part[0])
                                    .join('')
                                    .slice(0, 2)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-base font-medium text-slate-900">{student.name}</span>
                                </div>
                                <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-slate-600" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3 py-3 text-blue-600">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                          <span className="text-base">Logging in...</span>
                        </div>
                      ) : null}
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="p-6 lg:hidden">
          <div className="flex flex-col items-center gap-2 text-center text-sm text-slate-500">
            <p>ICT6001 Applied Project · Trimester 3, 2025</p>
            <p className="text-xs">Developed by</p>
            <div className="space-y-0.5 text-xs">
              <p className="font-medium text-slate-700">Bernard Adjei-Yeboah - 202401320</p>
              <p className="font-medium text-slate-700">Emmanuel Alisetti - 202500143</p>
              <p className="font-medium text-slate-700">Kabir Arya Niraula - 202500531</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
