'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  FileText,
  Plus,
  Search,
  MoreVertical,
  GraduationCap,
  TrendingUp,
  Settings,
  Eye,
} from 'lucide-react'
import Link from 'next/link'

// Mock course data
const courses = [
  {
    id: '1',
    code: 'ICT6001',
    name: 'Applied Project',
    description: 'Capstone project focusing on real-world application development',
    students: 28,
    assignments: 8,
    completedAssignments: 5,
    avgGrade: 'HD',
    avgGradePercent: 85,
    trimester: 'Trimester 3, 2025',
    status: 'active',
    nextDeadline: 'Dec 18, 2025',
    pendingSubmissions: 4,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: '2',
    code: 'ICT6002',
    name: 'Research Methods',
    description: 'Academic research methodologies and thesis preparation',
    students: 24,
    assignments: 6,
    completedAssignments: 4,
    avgGrade: 'D',
    avgGradePercent: 78,
    trimester: 'Trimester 3, 2025',
    status: 'active',
    nextDeadline: 'Dec 22, 2025',
    pendingSubmissions: 2,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: '3',
    code: 'ICT6003',
    name: 'Advanced Database Systems',
    description: 'Advanced concepts in database design and optimization',
    students: 22,
    assignments: 10,
    completedAssignments: 7,
    avgGrade: 'C',
    avgGradePercent: 68,
    trimester: 'Trimester 3, 2025',
    status: 'active',
    nextDeadline: 'Dec 15, 2025',
    pendingSubmissions: 6,
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: '4',
    code: 'ICT6004',
    name: 'Cloud Computing',
    description: 'Cloud architecture, deployment, and DevOps practices',
    students: 30,
    assignments: 7,
    completedAssignments: 3,
    avgGrade: 'HD',
    avgGradePercent: 88,
    trimester: 'Trimester 3, 2025',
    status: 'active',
    nextDeadline: 'Dec 20, 2025',
    pendingSubmissions: 0,
    color: 'from-amber-500 to-orange-600',
  },
]

// Quick stats
const quickStats = [
  { label: 'Total Courses', value: '4', icon: BookOpen, color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50' },
  { label: 'Total Students', value: '104', icon: Users, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50' },
  { label: 'Active Assignments', value: '31', icon: FileText, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-50 to-pink-50' },
  { label: 'Avg Completion', value: '72%', icon: TrendingUp, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50' },
]

export default function InstructorCoursesPage() {
  const { currentUser } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  if (!currentUser) return null

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500 mt-1">Manage your courses and track student progress</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
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

      {/* Search and Filter */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses by name or code..."
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
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('completed')}
                className={filterStatus === 'completed' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className={`h-2 bg-gradient-to-r ${course.color}`} />
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {course.code}
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">{course.name}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{course.description}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-slate-900">{course.students}</p>
                  <p className="text-xs text-slate-500">Students</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-slate-900">{course.assignments}</p>
                  <p className="text-xs text-slate-500">Assignments</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-slate-900">{course.avgGrade}</p>
                  <p className="text-xs text-slate-500">Avg Grade</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Course Progress</span>
                  <span className="font-medium text-slate-900">
                    {course.completedAssignments}/{course.assignments} assignments
                  </span>
                </div>
                <Progress value={(course.completedAssignments / course.assignments) * 100} className="h-2" />
              </div>

              {/* Info Row */}
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {course.trimester}
                  </span>
                </div>
                {course.pendingSubmissions > 0 && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {course.pendingSubmissions} pending reviews
                  </Badge>
                )}
              </div>

              {/* Next Deadline */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-700">Next deadline: {course.nextDeadline}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/instructor/course/${course.id}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    View Course
                  </Button>
                </Link>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
