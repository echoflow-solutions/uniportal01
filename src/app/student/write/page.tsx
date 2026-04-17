'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  PenLine,
  Clock,
  Calendar,
  FileText,
  Activity,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Assignment, Submission, WritingSession } from '@/types'

interface AssignmentWithProgress extends Assignment {
  submission?: Submission
  sessions: WritingSession[]
  course: { code: string; name: string }
}

export default function TrueLearnWritePage() {
  const router = useRouter()
  const {
    currentUser,
    assignments,
    submissions,
    writingSessions,
    courses,
    getStudentCourses,
  } = useAppStore()

  const [assignmentsWithProgress, setAssignmentsWithProgress] = useState<AssignmentWithProgress[]>([])

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') {
      router.push('/')
      return
    }

    // Get student's courses
    const studentCourses = getStudentCourses()
    const studentCourseIds = studentCourses.map(c => c.id)

    // Filter assignments for student's courses
    const relevantAssignments = assignments.filter(a =>
      studentCourseIds.includes(a.courseId)
    )

    // Build assignments with progress
    const withProgress: AssignmentWithProgress[] = relevantAssignments.map(assignment => {
      const submission = submissions.find(
        s => s.assignmentId === assignment.id && s.studentId === currentUser.id
      )
      const sessions = submission
        ? writingSessions.filter(ws => ws.submissionId === submission.id)
        : []
      const course = courses.find(c => c.id === assignment.courseId)

      return {
        ...assignment,
        submission,
        sessions,
        course: course ? { code: course.code, name: course.name } : { code: '', name: '' },
      }
    })

    // Sort by due date (soonest first)
    withProgress.sort((a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )

    setAssignmentsWithProgress(withProgress)
  }, [currentUser, assignments, submissions, writingSessions, courses, getStudentCourses, router])

  if (!currentUser) {
    return null
  }

  const getStatusBadge = (assignment: AssignmentWithProgress) => {
    if (!assignment.submission) {
      return <Badge variant="outline" className="bg-gray-50">Not Started</Badge>
    }
    switch (assignment.submission.status) {
      case 'draft':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>
      case 'submitted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Submitted</Badge>
      case 'verified':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Verified</Badge>
      case 'flagged':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Flagged</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getDueStatus = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil < 0) {
      return { text: 'Overdue', className: 'text-red-600' }
    } else if (daysUntil === 0) {
      return { text: 'Due Today', className: 'text-amber-600' }
    } else if (daysUntil <= 3) {
      return { text: `${daysUntil} days left`, className: 'text-amber-600' }
    }
    return { text: `${daysUntil} days left`, className: 'text-gray-600' }
  }

  // Filter assignments that are not yet submitted
  const activeAssignments = assignmentsWithProgress.filter(
    a => !a.submission || a.submission.status === 'draft'
  )
  const completedAssignments = assignmentsWithProgress.filter(
    a => a.submission && a.submission.status !== 'draft'
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <PenLine className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TrueLearn Write</h1>
            <p className="text-gray-600">Write and track your assignments with real-time analytics</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">About TrueLearn</h3>
              <p className="text-sm text-gray-600 mt-1">
                TrueLearn tracks your writing process to verify authorship. It monitors typing patterns,
                session times, and paste events. Complete the minimum sessions and active time to build
                a strong authorship profile.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Assignments */}
      {activeAssignments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Assignments</h2>
          <div className="grid gap-4">
            {activeAssignments.map((assignment) => {
              const dueStatus = getDueStatus(assignment.dueDate)
              const totalActiveTime = assignment.sessions.reduce((acc, s) => acc + s.activeTimeSeconds / 60, 0)
              const sessionProgress = Math.min((assignment.sessions.length / assignment.minSessions) * 100, 100)
              const timeProgress = Math.min((totalActiveTime / assignment.minActiveTimeMinutes) * 100, 100)

              return (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs font-normal">
                            {assignment.course.code}
                          </Badge>
                          {getStatusBadge(assignment)}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{assignment.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {assignment.description}
                        </p>

                        {/* Progress indicators */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-500 flex items-center gap-1">
                                <Activity className="h-3.5 w-3.5" />
                                Sessions
                              </span>
                              <span className="font-medium">
                                {assignment.sessions.length}/{assignment.minSessions}
                              </span>
                            </div>
                            <Progress value={sessionProgress} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-500 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Active Time
                              </span>
                              <span className="font-medium">
                                {Math.round(totalActiveTime)}m/{assignment.minActiveTimeMinutes}m
                              </span>
                            </div>
                            <Progress value={timeProgress} className="h-1.5" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className={cn("text-sm flex items-center gap-1", dueStatus.className)}>
                          <Calendar className="h-4 w-4" />
                          {dueStatus.text}
                        </div>
                        <Link href={`/student/write/${assignment.id}`}>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            {assignment.submission ? 'Continue Writing' : 'Start Writing'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed/Submitted Assignments */}
      {completedAssignments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Assignments</h2>
          <div className="grid gap-3">
            {completedAssignments.map((assignment) => (
              <Link key={assignment.id} href={`/student/write/${assignment.id}`}>
                <Card className="bg-gray-50/50 hover:bg-gray-100/50 hover:shadow-sm transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{assignment.title}</span>
                            <Badge variant="outline" className="text-xs font-normal">
                              {assignment.course.code}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {assignment.sessions.length} sessions completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(assignment)}
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {assignmentsWithProgress.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Available</h3>
            <p className="text-gray-500">
              You don&apos;t have any assignments to work on right now.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
