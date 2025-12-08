'use client'

import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  Bell,
  CheckCircle2,
  CreditCard,
  Award,
  BarChart3,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Play,
  Shield,
} from 'lucide-react'
import Link from 'next/link'

// Mock data for dashboard - Australian system (Trimester 3, 2025)
const upcomingDeadlines = [
  { id: 1, title: 'Final Report - ICT6001', dueDate: '2025-12-18', daysLeft: 10, status: 'in_progress', priority: 'high' },
  { id: 2, title: 'Research Presentation', dueDate: '2025-12-22', daysLeft: 14, status: 'not_started', priority: 'medium' },
  { id: 3, title: 'Peer Review Submission', dueDate: '2025-12-15', daysLeft: 7, status: 'in_progress', priority: 'high' },
]

const recentActivity = [
  { id: 1, action: 'Submitted assignment', item: 'Project Proposal', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-500' },
  { id: 2, action: 'Completed verification', item: 'Literature Review', time: '1 day ago', icon: Shield, color: 'text-blue-500' },
  { id: 3, action: 'Enrolled in unit', item: 'ICT6001 Applied Project', time: '5 days ago', icon: BookOpen, color: 'text-purple-500' },
  { id: 4, action: 'Fee payment received', item: '$2,500.00', time: '1 week ago', icon: CreditCard, color: 'text-emerald-500' },
]

const todaySchedule = [
  { id: 1, time: '09:00 AM', title: 'Applied Project Lecture', location: 'Room 301', type: 'lecture' },
  { id: 2, time: '11:30 AM', title: 'Group Meeting', location: 'Library Study Room B', type: 'meeting' },
  { id: 3, time: '02:00 PM', title: 'Supervisor Consultation', location: 'Office 204', type: 'consultation' },
  { id: 4, time: '04:00 PM', title: 'AI Workshop', location: 'Computer Lab 2', type: 'workshop' },
]

// Australian 7-point GPA scale: HD=7.0, D=6.0, C=5.0, P=4.0, F=0
const quickStats = [
  { label: 'Current GPA', value: '6.67', icon: Award, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50' },
  { label: 'Units Enrolled', value: '3', icon: BookOpen, color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50' },
  { label: 'Pending Tasks', value: '5', icon: FileText, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-50 to-pink-50' },
  { label: 'Integrity Score', value: '92%', icon: Shield, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50' },
]

// Australian grading: HD (High Distinction), D (Distinction), C (Credit), P (Pass), F (Fail)
const unitProgress = [
  { id: 1, name: 'ICT6001 Applied Project', progress: 65, grade: 'HD', color: 'bg-blue-500' },
  { id: 2, name: 'ICT6002 Research Methods', progress: 72, grade: 'HD', color: 'bg-emerald-500' },
  { id: 3, name: 'ICT6003 Advanced Database Systems', progress: 58, grade: 'D', color: 'bg-purple-500' },
]

export default function StudentDashboardPage() {
  const { currentUser } = useAppStore()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const firstName = currentUser?.name.split(' ')[0] || 'Student'

  return (
    <div className="space-y-10 pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            {getGreeting()}, {firstName}! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-lg text-slate-500 mt-2">
            Here&apos;s what&apos;s happening with your academic journey today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/student/notifications">
            <Button variant="outline" className="gap-2 h-11 px-5">
              <Bell className="h-5 w-5" />
              <span className="hidden sm:inline">Notifications</span>
              <Badge className="bg-red-500 text-white text-xs px-1.5">3</Badge>
            </Button>
          </Link>
          <Link href="/student/ai-assistant">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 h-11 px-5">
              <MessageSquare className="h-5 w-5" />
              AI Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-br ${stat.bgColor} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-slate-600">{stat.label}</p>
                    <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mt-2`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-4 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - 2 cols wide */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Deadlines */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <Clock className="h-6 w-6 text-orange-500" />
                Upcoming Deadlines
              </CardTitle>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 h-10">
                View All <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center gap-5 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className={`p-3 rounded-lg ${
                    deadline.priority === 'high' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    <FileText className={`h-6 w-6 ${
                      deadline.priority === 'high' ? 'text-red-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base text-slate-900 truncate">{deadline.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-500">Due {deadline.dueDate}</span>
                      <Badge variant={deadline.daysLeft <= 7 ? 'destructive' : 'secondary'} className="text-sm py-0.5 px-2">
                        {deadline.daysLeft} days left
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity h-10">
                    <Play className="h-4 w-4 mr-2" /> Continue
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Unit Progress */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                Unit Progress
              </CardTitle>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 h-10">
                View All <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {unitProgress.map((unit) => (
                <div key={unit.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${unit.color}`} />
                      <span className="font-medium text-base text-slate-700">{unit.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm font-semibold py-0.5 px-3">
                        {unit.grade}
                      </Badge>
                      <span className="text-base font-semibold text-slate-600">{unit.progress}%</span>
                    </div>
                  </div>
                  <Progress value={unit.progress} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-purple-500" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 h-10">
                View All <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-5 relative">
                      <div className={`relative z-10 p-2.5 bg-white rounded-full border-2 border-slate-200 ${activity.color}`}>
                        <activity.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-base font-medium text-slate-900">{activity.action}</p>
                        <p className="text-base text-slate-500 mt-1">{activity.item}</p>
                        <p className="text-sm text-slate-400 mt-2">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Today's Schedule */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <Calendar className="h-6 w-6 text-indigo-500" />
                Today&apos;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaySchedule.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors"
                >
                  <div className="text-center">
                    <p className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                      {item.time}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{item.location}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Fee Status */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-base font-medium text-emerald-100">Fee Status</p>
                  <p className="text-xl font-bold text-white">Paid in Full</p>
                </div>
              </div>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-slate-500">Total Fees</span>
                <span className="font-semibold text-slate-900">$12,500.00</span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span className="text-slate-500">Paid</span>
                <span className="font-semibold text-emerald-600">$12,500.00</span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span className="text-slate-500">Outstanding</span>
                <span className="font-semibold text-slate-900">$0.00</span>
              </div>
              <Progress value={100} className="h-2.5 mt-3" />
              <Button variant="outline" className="w-full mt-3 h-10">
                View Statement
              </Button>
            </CardContent>
          </Card>

          {/* Academic Integrity */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-base font-medium text-blue-100">TrueLearn Score</p>
                  <p className="text-xl font-bold text-white">92 / 100</p>
                </div>
              </div>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-slate-500">Authorship Score</span>
                <span className="font-semibold text-slate-900">95%</span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span className="text-slate-500">Comprehension</span>
                <span className="font-semibold text-slate-900">88%</span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span className="text-slate-500">Consistency</span>
                <span className="font-semibold text-slate-900">93%</span>
              </div>
              <div className="pt-3 border-t border-slate-100 mt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-base font-medium text-green-600">Good Standing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant Quick Access */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-semibold text-lg">AI Study Assistant</p>
                  <p className="text-base text-violet-200">Powered by GPT-4</p>
                </div>
              </div>
              <p className="text-base text-violet-100 mb-5">
                Get instant help with assignments, research, and study materials.
              </p>
              <Button className="w-full bg-white text-violet-600 hover:bg-violet-50 h-11">
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
