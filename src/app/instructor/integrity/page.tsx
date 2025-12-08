'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Search,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Clock,
  AlertCircle,
} from 'lucide-react'

// Mock integrity reports data
const integrityReports = [
  {
    id: '1',
    student: 'Emmanuel Alisetti',
    studentId: 'STU-2024-0891',
    avatar: 'EA',
    overallScore: 98,
    totalSubmissions: 12,
    flaggedSubmissions: 0,
    trend: 'stable',
    lastChecked: '2 hours ago',
    status: 'excellent',
  },
  {
    id: '2',
    student: 'Bernard Adjei-Yeboah',
    studentId: 'STU-2024-0893',
    avatar: 'BA',
    overallScore: 100,
    totalSubmissions: 14,
    flaggedSubmissions: 0,
    trend: 'up',
    lastChecked: '1 hour ago',
    status: 'excellent',
  },
  {
    id: '3',
    student: 'Kabir Arya Niraula',
    studentId: 'STU-2024-0892',
    avatar: 'KN',
    overallScore: 95,
    totalSubmissions: 11,
    flaggedSubmissions: 0,
    trend: 'stable',
    lastChecked: '3 hours ago',
    status: 'good',
  },
  {
    id: '4',
    student: 'Sarah Chen',
    studentId: 'STU-2024-0894',
    avatar: 'SC',
    overallScore: 72,
    totalSubmissions: 8,
    flaggedSubmissions: 2,
    trend: 'down',
    lastChecked: '1 day ago',
    status: 'at-risk',
  },
  {
    id: '5',
    student: 'Michael Johnson',
    studentId: 'STU-2024-0895',
    avatar: 'MJ',
    overallScore: 88,
    totalSubmissions: 10,
    flaggedSubmissions: 1,
    trend: 'stable',
    lastChecked: '2 days ago',
    status: 'good',
  },
]

const integrityStats = [
  { label: 'Avg Integrity Score', value: '92%', icon: Shield, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50' },
  { label: 'Clean Submissions', value: '148', icon: CheckCircle2, color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50' },
  { label: 'Flagged Cases', value: '8', icon: AlertTriangle, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50' },
  { label: 'Reports Generated', value: '24', icon: FileText, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-50 to-pink-50' },
]

const scoreDistribution = [
  { range: '90-100%', count: 68, percentage: 65, color: 'bg-emerald-500' },
  { range: '80-89%', count: 22, percentage: 21, color: 'bg-blue-500' },
  { range: '70-79%', count: 10, percentage: 10, color: 'bg-amber-500' },
  { range: 'Below 70%', count: 4, percentage: 4, color: 'bg-red-500' },
]

export default function InstructorIntegrityPage() {
  const { currentUser } = useAppStore()
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  if (!currentUser) return null

  const filteredReports = integrityReports.filter(report => {
    const matchesSearch = report.student.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string, score: number) => {
    if (status === 'excellent' || score >= 95) {
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Excellent</Badge>
    } else if (status === 'good' || score >= 80) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Good Standing</Badge>
    } else if (status === 'at-risk' || score < 80) {
      return <Badge className="bg-red-100 text-red-700 border-red-200">At Risk</Badge>
    }
    return <Badge variant="outline">Unknown</Badge>
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Integrity Reports</h1>
          <p className="text-slate-500 mt-1">Monitor academic integrity across all students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2">
            <Shield className="h-4 w-4" />
            Run Integrity Check
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {integrityStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-br ${stat.bgColor} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mt-1`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreDistribution.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.range}</span>
                    <span className="font-medium text-slate-900">{item.count} students ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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

        {/* Integrity Trends */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Integrity Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-700">+5%</p>
                <p className="text-sm text-emerald-600">Improvement this trimester</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">156</p>
                <p className="text-sm text-blue-600">Total submissions checked</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl text-center">
                <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-700">5.1%</p>
                <p className="text-sm text-amber-600">Flag rate (down from 7%)</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <h4 className="font-medium text-slate-900 mb-2">Monthly Overview</h4>
              <div className="flex items-end gap-2 h-24">
                {[85, 88, 86, 90, 87, 92, 91, 94, 92, 95, 93, 92].map((value, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${value}%` }}
                    title={`Month ${idx + 1}: ${value}%`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>Jan</span>
                <span>Jun</span>
                <span>Dec</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-slate-700 hover:bg-slate-800' : ''}
              >
                All Students
              </Button>
              <Button
                variant={filterStatus === 'excellent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('excellent')}
                className={filterStatus === 'excellent' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Excellent
              </Button>
              <Button
                variant={filterStatus === 'good' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('good')}
                className={filterStatus === 'good' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Good Standing
              </Button>
              <Button
                variant={filterStatus === 'at-risk' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('at-risk')}
                className={filterStatus === 'at-risk' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                At Risk
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Integrity List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Student Integrity Reports
            </CardTitle>
            <span className="text-sm text-slate-500">{filteredReports.length} students</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                  report.status === 'at-risk'
                    ? 'bg-red-50 border-red-200'
                    : report.status === 'excellent'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ${
                    report.status === 'at-risk'
                      ? 'bg-gradient-to-br from-red-500 to-rose-600'
                      : report.status === 'excellent'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    {report.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{report.student}</p>
                      {report.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                      {report.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                    </div>
                    <p className="text-sm text-slate-500">{report.studentId}</p>
                  </div>

                  {/* Integrity Score */}
                  <div className="text-center px-4">
                    <div className={`text-2xl font-bold ${
                      report.overallScore >= 95 ? 'text-emerald-600' :
                      report.overallScore >= 80 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {report.overallScore}%
                    </div>
                    <p className="text-xs text-slate-500">Integrity Score</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-bold text-slate-900">{report.totalSubmissions}</p>
                      <p className="text-xs text-slate-500">Submissions</p>
                    </div>
                    <div className="text-center">
                      <p className={`font-bold ${report.flaggedSubmissions > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {report.flaggedSubmissions}
                      </p>
                      <p className="text-xs text-slate-500">Flagged</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {getStatusBadge(report.status, report.overallScore)}

                  {/* Last Checked */}
                  <div className="hidden lg:block text-right text-sm text-slate-500">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {report.lastChecked}
                  </div>

                  {/* Action */}
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
