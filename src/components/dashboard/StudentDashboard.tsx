'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, FileText, CheckCircle } from 'lucide-react'
import type { Assignment, Submission } from '@/types'

interface StudentDashboardProps {
  assignments: Assignment[]
  submissions: Submission[]
}

export function StudentDashboard({ assignments, submissions }: StudentDashboardProps) {
  const pendingCount = assignments.filter(a =>
    !submissions.find(s => s.assignmentId === a.id && s.status === 'verified')
  ).length

  const submittedCount = submissions.filter(s =>
    s.status === 'submitted' || s.status === 'verified'
  ).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-slate-600">Active Assignments</p>
                <p className="text-2xl font-bold">{assignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-slate-600">Submitted</p>
                <p className="text-2xl font-bold">{submittedCount}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.slice(0, 5).map((assignment) => {
              const submission = submissions.find(s => s.assignmentId === assignment.id)
              return (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-slate-600">Due: {assignment.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={submission?.status === 'verified' ? 'default' : 'outline'}>
                      {submission?.status || 'Not Started'}
                    </Badge>
                    <Button size="sm">
                      {submission ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
