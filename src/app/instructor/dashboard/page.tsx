'use client'

import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  BookOpen,
  FileText,
  AlertTriangle,
  Clock,
  Calendar,
  Eye,
  BarChart3,
  Shield,
  ArrowRight,
  GraduationCap,
} from 'lucide-react'
import Link from 'next/link'

// Mock data for students
const studentData = [
  { id: '1', name: 'Emmanuel Alisetti', email: 'emmanuel@apic.edu', gpa: 3.8, integrityScore: 98, submissions: 12, avatar: 'EA' },
  { id: '2', name: 'Kabir Arya Niraula', email: 'kabir@apic.edu', gpa: 3.6, integrityScore: 95, submissions: 11, avatar: 'KN' },
  { id: '3', name: 'Bernard Adjei-Yeboah', email: 'bernard@apic.edu', gpa: 3.9, integrityScore: 100, submissions: 14, avatar: 'BA' },
]

// Mock submissions requiring review
const pendingSubmissions = [
  { id: '1', student: 'Emmanuel Alisetti', assignment: 'Data Structures Final', course: 'CS201', submittedAt: '2 hours ago', status: 'pending' },
  { id: '2', student: 'Kabir Arya Niraula', assignment: 'Algorithm Analysis Essay', course: 'CS301', submittedAt: '4 hours ago', status: 'pending' },
  { id: '3', student: 'Bernard Adjei-Yeboah', assignment: 'Database Design Project', course: 'CS401', submittedAt: '6 hours ago', status: 'pending' },
  { id: '4', student: 'Emmanuel Alisetti', assignment: 'Software Engineering Report', course: 'CS350', submittedAt: '1 day ago', status: 'pending' },
]

// Flagged submissions
const flaggedSubmissions = [
  { id: '1', student: 'External Student', assignment: 'Machine Learning Assignment', similarity: 78, riskLevel: 'high', flags: ['High similarity', 'Unusual patterns'] },
  { id: '2', student: 'Another Student', assignment: 'Research Paper', similarity: 45, riskLevel: 'medium', flags: ['Moderate similarity'] },
]

// Course data
const courseData = [
  { id: '1', name: 'Data Structures', code: 'CS201', students: 28, avgGrade: 'B+', completion: 75 },
  { id: '2', name: 'Algorithm Analysis', code: 'CS301', students: 24, avgGrade: 'A-', completion: 68 },
  { id: '3', name: 'Database Systems', code: 'CS401', students: 22, avgGrade: 'B', completion: 82 },
  { id: '4', name: 'Software Engineering', code: 'CS350', students: 30, avgGrade: 'B+', completion: 60 },
]

// Upcoming deadlines
const upcomingDeadlines = [
  { id: '1', assignment: 'Algorithm Quiz #5', course: 'CS301', dueDate: 'Dec 10, 2024', students: 24 },
  { id: '2', assignment: 'Final Project Submission', course: 'CS401', dueDate: 'Dec 15, 2024', students: 22 },
  { id: '3', assignment: 'Midterm Exam', course: 'CS201', dueDate: 'Dec 18, 2024', students: 28 },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function InstructorDashboardPage() {
  const { currentUser } = useAppStore()

  if (!currentUser) return null

  const lastName = currentUser.name.split(' ').slice(-1)[0]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {getGreeting()}, Dr. {lastName}
          </h1>
          <p className="text-slate-500 mt-1">
            Here&apos;s your teaching overview for today. You have <span className="font-semibold text-emerald-600">{pendingSubmissions.length} submissions</span> to review.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-200">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-emerald-500 to-teal-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-white mt-1">104</p>
                <p className="text-emerald-200 text-xs mt-1">Across 4 courses</p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Users className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-500 to-indigo-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Courses</p>
                <p className="text-3xl font-bold text-white mt-1">4</p>
                <p className="text-blue-200 text-xs mt-1">This semester</p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-amber-500 to-orange-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Pending Reviews</p>
                <p className="text-3xl font-bold text-white mt-1">{pendingSubmissions.length}</p>
                <p className="text-amber-200 text-xs mt-1">Needs attention</p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-red-500 to-rose-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Flagged Work</p>
                <p className="text-3xl font-bold text-white mt-1">{flaggedSubmissions.length}</p>
                <p className="text-red-200 text-xs mt-1">Requires review</p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Overview */}
        <Card className="lg:col-span-2 border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Student Overview
              </CardTitle>
              <Link href="/instructor/students">
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentData.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-emerald-500/25">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.email}</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-xs text-slate-500">GPA</p>
                    <p className="font-bold text-slate-900">{student.gpa}</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-xs text-slate-500">Integrity</p>
                    <p className={`font-bold ${student.integrityScore >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {student.integrityScore}%
                    </p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-xs text-slate-500">Submissions</p>
                    <p className="font-bold text-slate-900">{student.submissions}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flagged Submissions Alert */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Flagged Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flaggedSubmissions.map((item) => (
                <div key={item.id} className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{item.student}</p>
                      <p className="text-xs text-slate-500">{item.assignment}</p>
                    </div>
                    <Badge variant={item.riskLevel === 'high' ? 'destructive' : 'outline'} className="text-xs">
                      {item.riskLevel === 'high' ? 'High Risk' : 'Medium Risk'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">{item.similarity}% similarity</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.flags.map((flag, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <Link href="/instructor/flagged">
                <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  Review All Flagged
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Submissions */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Pending Submissions
              </CardTitle>
              <Link href="/instructor/submissions">
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{submission.assignment}</p>
                    <p className="text-xs text-slate-500">{submission.student} - {submission.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                      {submission.submittedAt}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Performance */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Course Performance
              </CardTitle>
              <Link href="/instructor/analytics">
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                  Analytics
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseData.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{course.name}</p>
                      <p className="text-xs text-slate-500">{course.code} - {course.students} students</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Avg: {course.avgGrade}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={course.completion} className="h-2 flex-1" />
                    <span className="text-xs text-slate-500 w-10">{course.completion}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Upcoming Assignment Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <Badge variant="outline" className="text-xs bg-white text-purple-700 border-purple-200">
                    {deadline.course}
                  </Badge>
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{deadline.assignment}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {deadline.dueDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {deadline.students} students
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-r from-emerald-600 to-teal-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-xl font-bold mb-1">Quick Actions</h3>
              <p className="text-emerald-100 text-sm">Manage your teaching workflow efficiently</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <GraduationCap className="h-4 w-4 mr-2" />
                Grade Submissions
              </Button>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button variant="secondary" className="bg-white hover:bg-slate-100 text-emerald-700">
                <Shield className="h-4 w-4 mr-2" />
                Integrity Check
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
