'use client'

import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  FileText,
  GraduationCap,
  Download,
  Award,
  Target,
  PieChart,
  Activity,
  AlertTriangle,
} from 'lucide-react'

// Course analytics data
const courseAnalytics = [
  {
    id: '1',
    code: 'ICT6001',
    name: 'Applied Project',
    students: 28,
    avgGrade: 85,
    gradeLabel: 'HD',
    completion: 75,
    submissionRate: 92,
    passRate: 100,
    trend: 'up',
  },
  {
    id: '2',
    code: 'ICT6002',
    name: 'Research Methods',
    students: 24,
    avgGrade: 78,
    gradeLabel: 'D',
    completion: 68,
    submissionRate: 88,
    passRate: 96,
    trend: 'stable',
  },
  {
    id: '3',
    code: 'ICT6003',
    name: 'Database Systems',
    students: 22,
    avgGrade: 68,
    gradeLabel: 'C',
    completion: 82,
    submissionRate: 85,
    passRate: 91,
    trend: 'down',
  },
  {
    id: '4',
    code: 'ICT6004',
    name: 'Cloud Computing',
    students: 30,
    avgGrade: 88,
    gradeLabel: 'HD',
    completion: 60,
    submissionRate: 95,
    passRate: 100,
    trend: 'up',
  },
]

// Grade distribution
const gradeDistribution = [
  { grade: 'HD', count: 32, percentage: 31, color: 'bg-emerald-500' },
  { grade: 'D', count: 28, percentage: 27, color: 'bg-blue-500' },
  { grade: 'C', count: 24, percentage: 23, color: 'bg-amber-500' },
  { grade: 'P', count: 16, percentage: 15, color: 'bg-orange-500' },
  { grade: 'F', count: 4, percentage: 4, color: 'bg-red-500' },
]

// Key metrics
const keyMetrics = [
  { label: 'Total Students', value: '104', icon: Users, color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50', change: '+12%' },
  { label: 'Avg Grade', value: '80%', icon: GraduationCap, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50', change: '+3%' },
  { label: 'Submission Rate', value: '90%', icon: FileText, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-50 to-pink-50', change: '+5%' },
  { label: 'Pass Rate', value: '96%', icon: Award, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50', change: '+2%' },
]

// Student performance tiers
const performanceTiers = [
  { tier: 'Top Performers', range: 'GPA 6.5+', count: 18, percentage: 17, icon: Award, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { tier: 'Above Average', range: 'GPA 5.5-6.4', count: 42, percentage: 40, icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { tier: 'Average', range: 'GPA 4.5-5.4', count: 32, percentage: 31, icon: Target, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { tier: 'Needs Support', range: 'GPA < 4.5', count: 12, percentage: 12, icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
]

// Weekly activity
const weeklyActivity = [
  { day: 'Mon', submissions: 24, views: 156 },
  { day: 'Tue', submissions: 18, views: 142 },
  { day: 'Wed', submissions: 32, views: 178 },
  { day: 'Thu', submissions: 28, views: 165 },
  { day: 'Fri', submissions: 45, views: 198 },
  { day: 'Sat', submissions: 12, views: 89 },
  { day: 'Sun', submissions: 8, views: 76 },
]

export default function InstructorAnalyticsPage() {
  const { currentUser } = useAppStore()

  if (!currentUser) return null

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">Track performance and insights across your courses</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
            <option>Trimester 3, 2025</option>
            <option>Trimester 2, 2025</option>
            <option>Trimester 1, 2025</option>
          </select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-br ${metric.bgColor} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mt-1`}>
                      {metric.value}
                    </p>
                    <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {metric.change} vs last trimester
                    </p>
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${metric.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gradeDistribution.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">{item.grade}</span>
                    <span className="text-slate-600">{item.count} students ({item.percentage}%)</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Weekly Activity
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                  <span className="text-slate-600">Submissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                  <span className="text-slate-600">Page Views</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Chart Area */}
              <div className="relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-slate-400">
                  <span>200</span>
                  <span>150</span>
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>

                {/* Grid lines */}
                <div className="ml-10 h-48 relative border-l border-b border-slate-200">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-t border-slate-100 w-full" />
                    ))}
                  </div>

                  {/* Bars */}
                  <div className="absolute inset-0 flex items-end justify-around px-2 pb-1">
                    {weeklyActivity.map((day, index) => (
                      <div key={index} className="flex flex-col items-center gap-1 group" style={{ width: '12%' }}>
                        {/* Values on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-slate-700 bg-white px-2 py-1 rounded shadow-sm border">
                          {day.submissions} / {day.views}
                        </div>

                        {/* Bar container */}
                        <div className="w-full flex gap-1 items-end" style={{ height: '180px' }}>
                          {/* Submissions bar */}
                          <div
                            className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-md transition-all duration-300 hover:from-blue-600 hover:to-indigo-500 shadow-sm relative group/bar"
                            style={{ height: `${(day.submissions / 50) * 100}%`, minHeight: '8px' }}
                          >
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-blue-600 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                              {day.submissions}
                            </span>
                          </div>
                          {/* Views bar */}
                          <div
                            className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-md transition-all duration-300 hover:from-emerald-600 hover:to-teal-500 shadow-sm relative group/bar"
                            style={{ height: `${(day.views / 200) * 100}%`, minHeight: '8px' }}
                          >
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-emerald-600 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                              {day.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="ml-10 flex justify-around mt-2">
                  {weeklyActivity.map((day, index) => (
                    <span key={index} className="text-xs font-medium text-slate-600" style={{ width: '12%', textAlign: 'center' }}>
                      {day.day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{weeklyActivity.reduce((sum, d) => sum + d.submissions, 0)}</p>
                  <p className="text-xs text-slate-600">Total Submissions</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-600">{weeklyActivity.reduce((sum, d) => sum + d.views, 0).toLocaleString()}</p>
                  <p className="text-xs text-slate-600">Total Page Views</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{Math.round(weeklyActivity.reduce((sum, d) => sum + d.submissions, 0) / 7)}</p>
                  <p className="text-xs text-slate-600">Avg Daily Submissions</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">Fri</p>
                  <p className="text-xs text-slate-600">Most Active Day</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tiers */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-600" />
            Student Performance Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceTiers.map((tier, index) => (
              <div key={index} className={`p-4 rounded-xl ${tier.bgColor}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-white shadow-sm ${tier.color}`}>
                    <tier.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{tier.tier}</p>
                    <p className="text-xs text-slate-500">{tier.range}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className={`text-3xl font-bold ${tier.color}`}>{tier.count}</p>
                  <p className="text-sm text-slate-500">{tier.percentage}% of class</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Analytics */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            Course Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseAnalytics.map((course) => (
              <div key={course.id} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">{course.code}</Badge>
                    <span className="font-semibold text-slate-900">{course.name}</span>
                    {course.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                    {course.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-500">{course.students} students</span>
                    <Badge className={`${
                      course.gradeLabel === 'HD' ? 'bg-emerald-100 text-emerald-700' :
                      course.gradeLabel === 'D' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      Avg: {course.gradeLabel} ({course.avgGrade}%)
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Completion</span>
                      <span className="font-medium">{course.completion}%</span>
                    </div>
                    <Progress value={course.completion} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Submission Rate</span>
                      <span className="font-medium">{course.submissionRate}%</span>
                    </div>
                    <Progress value={course.submissionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Pass Rate</span>
                      <span className="font-medium">{course.passRate}%</span>
                    </div>
                    <Progress value={course.passRate} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
