'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Search,
  Mail,
  Eye,
  MoreVertical,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Download,
  MessageSquare,
} from 'lucide-react'

// Mock student data with Australian grading
const students = [
  {
    id: '1',
    name: 'Emmanuel Alisetti',
    email: 'emmanuel.alisetti@student.apic.edu.au',
    studentId: 'STU-2024-0891',
    avatar: 'EA',
    gpa: 6.5,
    gradeLabel: 'D',
    integrityScore: 98,
    submissions: 12,
    courses: ['ICT6001', 'ICT6002', 'ICT6003'],
    status: 'active',
    lastActive: '2 hours ago',
    trend: 'up',
    riskLevel: 'low',
  },
  {
    id: '2',
    name: 'Kabir Arya Niraula',
    email: 'kabir.niraula@student.apic.edu.au',
    studentId: 'STU-2024-0892',
    avatar: 'KN',
    gpa: 6.0,
    gradeLabel: 'D',
    integrityScore: 95,
    submissions: 11,
    courses: ['ICT6001', 'ICT6002'],
    status: 'active',
    lastActive: '5 hours ago',
    trend: 'stable',
    riskLevel: 'low',
  },
  {
    id: '3',
    name: 'Bernard Adjei-Yeboah',
    email: 'bernard.adjei@student.apic.edu.au',
    studentId: 'STU-2024-0893',
    avatar: 'BA',
    gpa: 6.8,
    gradeLabel: 'HD',
    integrityScore: 100,
    submissions: 14,
    courses: ['ICT6001', 'ICT6002', 'ICT6003', 'ICT6004'],
    status: 'active',
    lastActive: '1 hour ago',
    trend: 'up',
    riskLevel: 'low',
  },
  {
    id: '4',
    name: 'Sarah Chen',
    email: 'sarah.chen@student.apic.edu.au',
    studentId: 'STU-2024-0894',
    avatar: 'SC',
    gpa: 5.5,
    gradeLabel: 'C',
    integrityScore: 72,
    submissions: 8,
    courses: ['ICT6001', 'ICT6003'],
    status: 'at-risk',
    lastActive: '3 days ago',
    trend: 'down',
    riskLevel: 'high',
  },
  {
    id: '5',
    name: 'Michael Johnson',
    email: 'michael.johnson@student.apic.edu.au',
    studentId: 'STU-2024-0895',
    avatar: 'MJ',
    gpa: 5.8,
    gradeLabel: 'C',
    integrityScore: 88,
    submissions: 10,
    courses: ['ICT6002', 'ICT6004'],
    status: 'active',
    lastActive: '1 day ago',
    trend: 'stable',
    riskLevel: 'medium',
  },
  {
    id: '6',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.apic.edu.au',
    studentId: 'STU-2024-0896',
    avatar: 'PS',
    gpa: 7.0,
    gradeLabel: 'HD',
    integrityScore: 100,
    submissions: 15,
    courses: ['ICT6001', 'ICT6002', 'ICT6003', 'ICT6004'],
    status: 'active',
    lastActive: '30 minutes ago',
    trend: 'up',
    riskLevel: 'low',
  },
]

const quickStats = [
  { label: 'Total Students', value: '104', icon: Users, color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50' },
  { label: 'Active Today', value: '78', icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50' },
  { label: 'At Risk', value: '5', icon: AlertTriangle, color: 'from-red-500 to-rose-500', bgColor: 'from-red-50 to-rose-50' },
  { label: 'Avg GPA', value: '6.2', icon: GraduationCap, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-50 to-pink-50' },
]

export default function InstructorStudentsPage() {
  const { currentUser } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState('all')

  if (!currentUser) return null

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus
    const matchesCourse = selectedCourse === 'all' || student.courses.includes(selectedCourse)
    return matchesSearch && matchesFilter && matchesCourse
  })

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Students</h1>
          <p className="text-slate-500 mt-1">Monitor student progress and academic performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2">
            <MessageSquare className="h-4 w-4" />
            Message All
          </Button>
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

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">All Courses</option>
                <option value="ICT6001">ICT6001 - Applied Project</option>
                <option value="ICT6002">ICT6002 - Research Methods</option>
                <option value="ICT6003">ICT6003 - Database Systems</option>
                <option value="ICT6004">ICT6004 - Cloud Computing</option>
              </select>
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
                className={filterStatus === 'active' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Active
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

      {/* Student List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Student Directory
            </CardTitle>
            <span className="text-sm text-slate-500">{filteredStudents.length} students</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                  student.riskLevel === 'high'
                    ? 'bg-red-50 border-red-200 hover:border-red-300'
                    : student.riskLevel === 'medium'
                    ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {/* Avatar */}
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ${
                  student.riskLevel === 'high'
                    ? 'bg-gradient-to-br from-red-500 to-rose-600'
                    : student.riskLevel === 'medium'
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : 'bg-gradient-to-br from-emerald-600 to-teal-600'
                }`}>
                  {student.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{student.name}</p>
                    {student.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                    {student.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                  </div>
                  <p className="text-sm text-slate-500">{student.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs font-mono">{student.studentId}</Badge>
                    {student.status === 'at-risk' && (
                      <Badge className="bg-red-100 text-red-700 text-xs">At Risk</Badge>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">GPA</p>
                    <p className="font-bold text-slate-900">{student.gpa}</p>
                    <p className="text-xs text-slate-400">{student.gradeLabel}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Integrity</p>
                    <p className={`font-bold ${student.integrityScore >= 90 ? 'text-emerald-600' : student.integrityScore >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                      {student.integrityScore}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Submissions</p>
                    <p className="font-bold text-slate-900">{student.submissions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Courses</p>
                    <p className="font-bold text-slate-900">{student.courses.length}</p>
                  </div>
                </div>

                {/* Last Active */}
                <div className="hidden lg:block text-right">
                  <p className="text-xs text-slate-500">Last Active</p>
                  <p className="text-sm text-slate-700">{student.lastActive}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No students found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setFilterStatus('all'); setSelectedCourse('all'); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
