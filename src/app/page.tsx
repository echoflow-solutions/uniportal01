'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppStore } from '@/lib/store/appStore'
import {
  Shield,
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  BookOpen,
  BarChart3,
  Sparkles,
  ArrowRight,
  CreditCard,
  Calendar,
  CheckCircle2,
  MessageSquareText,
} from 'lucide-react'

// Demo credentials
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

export default function LoginPage() {
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
    logout() // Clear any existing session
  }, [initializeStore, logout])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const success = login(email)
    if (success) {
      // Determine role and redirect
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
      {/* Left Side - Blue Gradient Background */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          {/* Animated Shapes */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 text-white w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* APIC Logo */}
              <div className="bg-white rounded-xl p-3 shadow-xl">
                <Image
                  src="/apic-logo.png"
                  alt="Asia Pacific International College"
                  width={140}
                  height={42}
                  className="h-9 w-auto"
                />
              </div>
              <div className="h-8 w-px bg-white/30" />
              {/* UniPortal */}
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">UniPortal</h1>
                  <p className="text-xs text-blue-200">University Management System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8 py-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-slate-800">Master&apos;s Final Assessment</span>
            </div>

            {/* Hero */}
            <div className="space-y-4">
              <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
                Your Complete<br />
                <span className="text-cyan-300">University Portal</span>
              </h2>
              <p className="text-lg text-blue-100 max-w-lg">
                Access courses, manage fees, track academic progress, and ensure integrity — everything you need in one place.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <feature.icon className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-slate-900">{feature.title}</span>
                    <span className="text-slate-500 text-xs block">{feature.description}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-300" />
                <span className="text-sm text-white font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-300" />
                <span className="text-sm text-white font-medium">Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-300" />
                <span className="text-sm text-white font-medium">Secure Platform</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-blue-200">
            <div>
              <p className="font-medium text-white">Asia Pacific International College</p>
              <p className="text-blue-200 mt-1">ICT6001 Applied Project · Trimester 3, 2025</p>
              <p className="text-xs text-blue-300 mt-1">Lecturer: <span className="text-white">Dr. Ifeanyi Egwutuoha</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-300 mb-1">Developed by</p>
              <p className="text-white font-medium text-sm">Bernard Adjei-Yeboah - 202401320</p>
              <p className="text-white font-medium text-sm">Emmanuel Alisetti - 202500143</p>
              <p className="text-white font-medium text-sm">Kabir Arya Niraula - 202500531</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Mobile Header */}
        <header className="lg:hidden p-6">
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
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </header>

        {/* Login Content */}
        <main className="flex-1 flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 lg:p-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100">
                        <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          Sign In
                        </TabsTrigger>
                        <TabsTrigger value="demo" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          Demo Access
                        </TabsTrigger>
                      </TabsList>

                      {/* Login Form Tab */}
                      <TabsContent value="login" className="space-y-5">
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-slate-900">Welcome Back</h3>
                          <p className="text-slate-500 text-sm">Sign in to your account</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 text-sm">Email Address</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 text-sm">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                              {error}
                            </div>
                          )}

                          <Button
                            type="submit"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Signing in...</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <span>Sign In</span>
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            )}
                          </Button>
                        </form>
                      </TabsContent>

                      {/* Demo Access Tab */}
                      <TabsContent value="demo" className="space-y-4">
                        <div className="text-center mb-2">
                          <h3 className="text-xl font-bold text-slate-900">Quick Demo Access</h3>
                          <p className="text-slate-500 text-sm">Select an account to explore</p>
                        </div>

                        {/* Lecturer */}
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lecturer</p>
                          <button
                            onClick={() => handleQuickLogin(demoCredentials.lecturer.email, 'instructor')}
                            disabled={isLoading}
                            className="w-full p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-300 group text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                DE
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-900 text-sm">{demoCredentials.lecturer.name}</span>
                                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Lecturer</span>
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                          </button>
                        </div>

                        {/* Students */}
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Students</p>
                          <div className="space-y-2">
                            {demoCredentials.students.map((student, index) => (
                              <button
                                key={index}
                                onClick={() => handleQuickLogin(student.email, 'student')}
                                disabled={isLoading}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all duration-300 group text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-semibold text-xs">
                                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="font-medium text-slate-900 text-sm">{student.name}</span>
                                  </div>
                                  <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {isLoading && (
                          <div className="flex items-center justify-center gap-2 text-blue-600 py-2">
                            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            <span className="text-sm">Logging in...</span>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer - Only shows on mobile */}
        <footer className="lg:hidden p-6">
          <div className="flex flex-col items-center gap-2 text-sm text-slate-500 text-center">
            <p>ICT6001 Applied Project · Trimester 3, 2025</p>
            <p className="text-xs">Developed by</p>
            <div className="text-xs space-y-0.5">
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
