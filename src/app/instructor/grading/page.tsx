'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  FileText,
  User,
  BookOpen,
  Calendar,
  ChevronRight,
  Star,
  TrendingUp,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'

// Mock grading queue data
const gradingQueue = [
  {
    id: '1',
    student: 'Emmanuel Alisetti',
    avatar: 'EA',
    assignment: 'Final Report - Applied Project',
    course: 'ICT6001',
    submittedAt: '2 hours ago',
    dueDate: 'Dec 18, 2025',
    wordCount: 4500,
    integrityScore: 98,
    priority: 'high',
    rubricItems: 5,
  },
  {
    id: '2',
    student: 'Kabir Arya Niraula',
    avatar: 'KN',
    assignment: 'Research Methodology Essay',
    course: 'ICT6002',
    submittedAt: '4 hours ago',
    dueDate: 'Dec 20, 2025',
    wordCount: 3200,
    integrityScore: 95,
    priority: 'medium',
    rubricItems: 4,
  },
  {
    id: '3',
    student: 'Bernard Adjei-Yeboah',
    avatar: 'BA',
    assignment: 'Database Design Project',
    course: 'ICT6003',
    submittedAt: '6 hours ago',
    dueDate: 'Dec 15, 2025',
    wordCount: 5800,
    integrityScore: 100,
    priority: 'high',
    rubricItems: 6,
  },
]

// Recently graded
const recentlyGraded = [
  { id: '1', student: 'Sarah Chen', assignment: 'Cloud Architecture Report', grade: 'C', gradePercent: 65, course: 'ICT6004', gradedAt: '1 hour ago' },
  { id: '2', student: 'Michael Johnson', assignment: 'Literature Review', grade: 'D', gradePercent: 78, course: 'ICT6002', gradedAt: '3 hours ago' },
  { id: '3', student: 'Priya Sharma', assignment: 'System Design Document', grade: 'HD', gradePercent: 92, course: 'ICT6001', gradedAt: 'Yesterday' },
]

// Grading statistics
const gradingStats = [
  { label: 'To Grade', value: '12', icon: Clock, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50' },
  { label: 'Graded Today', value: '8', icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50' },
  { label: 'Avg Grade', value: 'D', icon: Star, color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50' },
  { label: 'Completion', value: '87%', icon: TrendingUp, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-50 to-pink-50' },
]

// Australian grading scale
const australianGrades = [
  { grade: 'HD', label: 'High Distinction', range: '85-100%', color: 'bg-emerald-500' },
  { grade: 'D', label: 'Distinction', range: '75-84%', color: 'bg-blue-500' },
  { grade: 'C', label: 'Credit', range: '65-74%', color: 'bg-amber-500' },
  { grade: 'P', label: 'Pass', range: '50-64%', color: 'bg-orange-500' },
  { grade: 'F', label: 'Fail', range: '0-49%', color: 'bg-red-500' },
]

export default function InstructorGradingPage() {
  const { currentUser } = useAppStore()
  const [selectedCourse, setSelectedCourse] = useState('all')

  if (!currentUser) return null

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Grading</h1>
          <p className="text-slate-500 mt-1">Review and grade student submissions efficiently</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Courses</option>
            <option value="ICT6001">ICT6001</option>
            <option value="ICT6002">ICT6002</option>
            <option value="ICT6003">ICT6003</option>
            <option value="ICT6004">ICT6004</option>
          </select>
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Start Grading
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gradingStats.map((stat, index) => (
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
        {/* Grading Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Grading Queue
                </CardTitle>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {gradingQueue.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradingQueue.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                      item.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                        {item.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">{item.assignment}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                              <User className="h-3 w-3" />
                              <span>{item.student}</span>
                              <span className="text-slate-300">•</span>
                              <BookOpen className="h-3 w-3" />
                              <span>{item.course}</span>
                            </div>
                          </div>
                          {item.priority === 'high' && (
                            <Badge className="bg-red-100 text-red-700 border-red-200">High Priority</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {item.dueDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {item.wordCount.toLocaleString()} words
                          </span>
                          <span className="flex items-center gap-1">
                            <ClipboardCheck className="h-3 w-3" />
                            {item.rubricItems} rubric items
                          </span>
                        </div>
                      </div>
                      <Link href={`/instructor/submissions/${item.id}`}>
                        <Button size="sm" className="gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                          Grade Now
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recently Graded */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Recently Graded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentlyGraded.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{item.assignment}</p>
                      <p className="text-xs text-slate-500">{item.student} • {item.course}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${
                        item.grade === 'HD' ? 'bg-emerald-100 text-emerald-700' :
                        item.grade === 'D' ? 'bg-blue-100 text-blue-700' :
                        item.grade === 'C' ? 'bg-amber-100 text-amber-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {item.grade} ({item.gradePercent}%)
                      </Badge>
                      <p className="text-xs text-slate-400 mt-1">{item.gradedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grading Scale Reference */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Australian Grading Scale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {australianGrades.map((grade) => (
                  <div key={grade.grade} className="flex items-center gap-3">
                    <div className={`w-12 h-8 rounded-lg ${grade.color} flex items-center justify-center text-white font-bold text-sm`}>
                      {grade.grade}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">{grade.label}</p>
                      <p className="text-xs text-slate-500">{grade.range}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grading Tips */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3">Grading Tips</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-300" />
                  Use rubrics for consistent grading
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-300" />
                  Check integrity scores first
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-300" />
                  Provide constructive feedback
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-300" />
                  Review high-priority items first
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Create Rubric
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <BarChart3 className="h-4 w-4" />
                Grade Distribution
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Clock className="h-4 w-4" />
                Bulk Grade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
