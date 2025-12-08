'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import type { Course, Submission, IntegrityReport } from '@/types'

interface InstructorDashboardProps {
  courses: Course[]
  submissions: Submission[]
  reports: IntegrityReport[]
}

export function InstructorDashboard({ courses, submissions, reports }: InstructorDashboardProps) {
  const flaggedCount = reports.filter(r => r.riskLevel === 'high').length
  const pendingReview = submissions.filter(s => s.status === 'submitted').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-slate-600">Total Students</p>
                <p className="text-2xl font-bold">
                  {courses.reduce((acc, c) => acc + c.studentIds.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-slate-600">Pending Review</p>
                <p className="text-2xl font-bold">{pendingReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-slate-600">Flagged</p>
                <p className="text-2xl font-bold">{flaggedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-slate-600">Verified</p>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.status === 'verified').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.slice(0, 5).map((submission) => {
                const report = reports.find(r => r.submissionId === submission.id)
                return (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium">Student #{submission.studentId}</p>
                      <p className="text-sm text-slate-600">
                        {submission.wordCount} words • {submission.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {report && (
                        <Badge
                          variant={report.riskLevel === 'low' ? 'default' : 'destructive'}
                        >
                          {report.combinedScore}%
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-slate-600">
                      {course.code} • {course.studentIds.length} students
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
