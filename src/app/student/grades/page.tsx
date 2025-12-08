'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  GraduationCap,
  TrendingUp,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  BarChart3,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react'

// Mock grades data - Australian system (3 units per trimester, 8 credit points each)
const coursesGrades = [
  {
    id: 'ICT6001',
    code: 'ICT6001',
    name: 'Applied Project',
    credits: 8,
    instructor: 'Dr. Ifeanyi Egwutuoha',
    currentGrade: 'HD',
    gradePoints: 7.0,
    percentage: 92,
    status: 'in_progress',
    color: 'from-blue-600 to-indigo-600',
    assessments: [
      { name: 'Project Proposal', weight: 15, score: 85, maxScore: 100, status: 'graded' },
      { name: 'Progress Report 1', weight: 10, score: 90, maxScore: 100, status: 'graded' },
      { name: 'Progress Report 2', weight: 10, score: 95, maxScore: 100, status: 'graded' },
      { name: 'Peer Review', weight: 10, score: null, maxScore: 50, status: 'pending' },
      { name: 'Final Report', weight: 40, score: null, maxScore: 100, status: 'upcoming' },
      { name: 'Final Presentation', weight: 15, score: null, maxScore: 75, status: 'upcoming' },
    ],
  },
  {
    id: 'ICT6002',
    code: 'ICT6002',
    name: 'Research Methods',
    credits: 8,
    instructor: 'Prof. Sarah Mitchell',
    currentGrade: 'HD',
    gradePoints: 7.0,
    percentage: 88,
    status: 'in_progress',
    color: 'from-emerald-600 to-teal-600',
    assessments: [
      { name: 'Research Ethics Quiz', weight: 10, score: 18, maxScore: 20, status: 'graded' },
      { name: 'Literature Review Draft', weight: 15, score: 36, maxScore: 40, status: 'graded' },
      { name: 'Research Proposal', weight: 20, score: 85, maxScore: 100, status: 'graded' },
      { name: 'Methodology Chapter', weight: 15, score: null, maxScore: 60, status: 'pending' },
      { name: 'Research Presentation', weight: 25, score: null, maxScore: 75, status: 'upcoming' },
      { name: 'Final Paper', weight: 15, score: null, maxScore: 100, status: 'upcoming' },
    ],
  },
  {
    id: 'ICT6003',
    code: 'ICT6003',
    name: 'Advanced Database Systems',
    credits: 8,
    instructor: 'Dr. James Chen',
    currentGrade: 'D',
    gradePoints: 6.0,
    percentage: 78,
    status: 'in_progress',
    color: 'from-purple-600 to-pink-600',
    assessments: [
      { name: 'SQL Optimization Lab 1', weight: 10, score: 28, maxScore: 30, status: 'graded' },
      { name: 'Database Schema Design', weight: 20, score: 52, maxScore: 60, status: 'graded' },
      { name: 'SQL Optimization Lab 2', weight: 10, score: null, maxScore: 30, status: 'pending' },
      { name: 'NoSQL Project', weight: 25, score: null, maxScore: 80, status: 'upcoming' },
      { name: 'Final Exam', weight: 35, score: null, maxScore: 100, status: 'upcoming' },
    ],
  },
]

// Previous trimesters - Australian system
const previousTrimesters = [
  {
    trimester: 'Trimester 2, 2025',
    gpa: 6.67,
    credits: 24,
    courses: [
      { code: 'ICT5001', name: 'Software Engineering', grade: 'HD', credits: 8 },
      { code: 'ICT5002', name: 'Data Analytics', grade: 'D', credits: 8 },
      { code: 'ICT5003', name: 'Network Security', grade: 'HD', credits: 8 },
    ],
  },
  {
    trimester: 'Trimester 1, 2025',
    gpa: 6.33,
    credits: 24,
    courses: [
      { code: 'ICT4001', name: 'Introduction to Programming', grade: 'HD', credits: 8 },
      { code: 'ICT4002', name: 'Computer Networks', grade: 'D', credits: 8 },
      { code: 'ICT4003', name: 'Database Management', grade: 'C', credits: 8 },
    ],
  },
  {
    trimester: 'Trimester 3, 2024',
    gpa: 7.0,
    credits: 24,
    courses: [
      { code: 'ICT3001', name: 'Web Development', grade: 'HD', credits: 8 },
      { code: 'ICT3002', name: 'IT Project Management', grade: 'HD', credits: 8 },
      { code: 'ICT3003', name: 'Systems Analysis', grade: 'HD', credits: 8 },
    ],
  },
]

// Australian grading system colors
const getGradeColor = (grade: string) => {
  if (grade === 'HD') return 'text-emerald-600'
  if (grade === 'D') return 'text-blue-600'
  if (grade === 'C') return 'text-amber-600'
  if (grade === 'P') return 'text-orange-600'
  return 'text-red-600'
}

const getAssessmentStatusColor = (status: string) => {
  switch (status) {
    case 'graded':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-amber-100 text-amber-700'
    case 'upcoming':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export default function GradesPage() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  // Calculate current trimester GPA (Australian 7-point scale)
  const currentCredits = coursesGrades.reduce((acc, course) => acc + course.credits, 0)
  const currentGPA = (coursesGrades.reduce((acc, course) => acc + (course.gradePoints * course.credits), 0) / currentCredits).toFixed(2)

  // Calculate cumulative GPA
  const allCredits = currentCredits + previousTrimesters.reduce((acc, tri) => acc + tri.credits, 0)
  const allGradePoints = coursesGrades.reduce((acc, course) => acc + (course.gradePoints * course.credits), 0) +
    previousTrimesters.reduce((acc, tri) => acc + (tri.gpa * tri.credits), 0)
  const cumulativeGPA = (allGradePoints / allCredits).toFixed(2)

  const toggleCourse = (id: string) => {
    setExpandedCourse(expandedCourse === id ? null : id)
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Grades</h1>
          <p className="text-lg text-slate-500 mt-2">Track your academic performance and GPA</p>
        </div>
        <Button variant="outline" className="gap-2 h-11">
          <Download className="h-5 w-5" />
          Export Transcript
        </Button>
      </div>

      {/* GPA Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-emerald-600">Current GPA</p>
                <p className="text-4xl font-bold text-emerald-700 mt-1">{currentGPA}</p>
                <p className="text-sm text-emerald-600 mt-2">Trimester 3, 2025</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-blue-600">Cumulative GPA</p>
                <p className="text-4xl font-bold text-blue-700 mt-1">{cumulativeGPA}</p>
                <p className="text-sm text-blue-600 mt-2">{allCredits} total credit points</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-purple-600">Current Credit Points</p>
                <p className="text-4xl font-bold text-purple-700 mt-1">{currentCredits}</p>
                <p className="text-sm text-purple-600 mt-2">This trimester</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-purple-100 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-amber-600">Academic Standing</p>
                <p className="text-2xl font-bold text-amber-700 mt-1">Dean&apos;s List</p>
                <p className="text-sm text-amber-600 mt-2">GPA above 6.0</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-amber-100 flex items-center justify-center">
                <Award className="h-7 w-7 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Trimester Grades */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
          <Calendar className="h-6 w-6 text-blue-600" />
          Trimester 3, 2025 - Current Trimester
        </h2>
        <div className="space-y-6">
          {coursesGrades.map((course) => {
            const isExpanded = expandedCourse === course.id
            const gradedAssessments = course.assessments.filter(a => a.status === 'graded')
            const earnedWeight = gradedAssessments.reduce((acc, a) => acc + a.weight, 0)

            return (
              <Card key={course.id} className="border-0 shadow-lg overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                <CardContent className="p-8">
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className="font-mono text-sm py-1 px-3">{course.code}</Badge>
                        <Badge className="bg-blue-100 text-blue-700 py-1 px-3">{course.credits} Credit Points</Badge>
                        <Badge className="bg-green-100 text-green-700 py-1 px-3">In Progress</Badge>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{course.name}</h3>
                      <p className="text-base text-slate-500">{course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-5xl font-bold ${getGradeColor(course.currentGrade)}`}>
                        {course.currentGrade}
                      </p>
                      <p className="text-base text-slate-500 mt-1">{course.percentage}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base text-slate-600">Graded Work</span>
                      <span className="text-base font-medium text-slate-700">{earnedWeight}% of total</span>
                    </div>
                    <Progress value={earnedWeight} className="h-3" />
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-8 text-base">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-slate-600">
                        {gradedAssessments.length} graded
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <span className="text-slate-600">
                        {course.assessments.filter(a => a.status === 'pending').length} pending
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-slate-400" />
                      <span className="text-slate-600">
                        {course.assessments.filter(a => a.status === 'upcoming').length} upcoming
                      </span>
                    </div>
                  </div>

                  {/* Expand Button */}
                  <Button
                    variant="ghost"
                    onClick={() => toggleCourse(course.id)}
                    className="mt-6 w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 h-11"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-5 w-5" />
                        Hide Assessments
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-5 w-5" />
                        View All Assessments
                      </>
                    )}
                  </Button>

                  {/* Expanded Assessments */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="space-y-3">
                        {course.assessments.map((assessment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-base text-slate-700">{assessment.name}</p>
                              <p className="text-sm text-slate-500 mt-1">Weight: {assessment.weight}%</p>
                            </div>
                            <div className="flex items-center gap-5">
                              <Badge className={`${getAssessmentStatusColor(assessment.status)} py-1 px-3`}>
                                {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                              </Badge>
                              {assessment.score !== null ? (
                                <div className="text-right">
                                  <p className="font-bold text-lg text-slate-700">
                                    {assessment.score}/{assessment.maxScore}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    {Math.round((assessment.score / assessment.maxScore) * 100)}%
                                  </p>
                                </div>
                              ) : (
                                <p className="text-base text-slate-400">—</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Previous Trimesters */}
      <div>
        <Button
          variant="ghost"
          onClick={() => setShowHistory(!showHistory)}
          className="mb-6 flex items-center gap-3 text-slate-700 h-11"
        >
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg">Previous Trimesters</span>
          {showHistory ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>

        {showHistory && (
          <div className="space-y-6">
            {previousTrimesters.map((trimester, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{trimester.trimester}</h3>
                      <p className="text-base text-slate-500 mt-1">{trimester.credits} credit points completed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-emerald-600">{trimester.gpa.toFixed(2)}</p>
                      <p className="text-base text-slate-500 mt-1">Trimester GPA</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {trimester.courses.map((course, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                          <p className="font-medium text-base text-slate-700">{course.name}</p>
                          <p className="text-sm text-slate-500 mt-1">{course.code} • {course.credits} CP</p>
                        </div>
                        <p className={`text-2xl font-bold ${getGradeColor(course.grade)}`}>{course.grade}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Grade Distribution - Australian System */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-3">
            <Star className="h-6 w-6 text-amber-500" />
            Grade Distribution (All Trimesters)
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="grid grid-cols-5 gap-6">
            {[
              { grade: 'HD', label: 'High Distinction', count: 8, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
              { grade: 'D', label: 'Distinction', count: 3, color: 'bg-blue-500', textColor: 'text-blue-600' },
              { grade: 'C', label: 'Credit', count: 1, color: 'bg-amber-500', textColor: 'text-amber-600' },
              { grade: 'P', label: 'Pass', count: 0, color: 'bg-orange-400', textColor: 'text-orange-500' },
              { grade: 'F', label: 'Fail', count: 0, color: 'bg-red-400', textColor: 'text-red-500' },
            ].map((item, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                {/* Count number above the bar */}
                <span className={`font-bold text-2xl ${item.textColor} mb-2`}>{item.count}</span>
                {/* Bar container with fixed height for alignment */}
                <div className="h-32 w-full flex items-end justify-center">
                  <div
                    className={`w-full ${item.color} rounded-xl`}
                    style={{ height: `${Math.max(item.count * 14, 16)}px` }}
                  />
                </div>
                {/* Grade label below */}
                <p className="mt-3 font-semibold text-lg text-slate-700">{item.grade}</p>
                <p className="text-xs text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
