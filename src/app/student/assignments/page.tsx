'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  FileText,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Search,
  Upload,
  Eye,
  BookOpen,
  Target,
} from 'lucide-react'

// Mock assignments data - Australian system (Trimester 3, 2025 - 3 units enrolled)
const assignmentsData = [
  {
    id: '1',
    title: 'Final Report - Applied Project',
    course: 'ICT6001',
    courseName: 'Applied Project',
    description: 'Complete comprehensive documentation of your applied project including methodology, implementation, testing, and evaluation.',
    dueDate: '2025-12-18',
    dueTime: '11:59 PM',
    status: 'in_progress',
    priority: 'high',
    progress: 65,
    totalPoints: 100,
    weight: '40%',
    type: 'Report',
    submissionType: 'File Upload',
    instructions: 'Submit as PDF. Maximum 10,000 words. Include all appendices.',
    attachments: 2,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: '2',
    title: 'Peer Review Submission',
    course: 'ICT6001',
    courseName: 'Applied Project',
    description: 'Review and provide constructive feedback on two peer submissions assigned to you.',
    dueDate: '2025-12-15',
    dueTime: '11:59 PM',
    status: 'not_started',
    priority: 'high',
    progress: 0,
    totalPoints: 50,
    weight: '10%',
    type: 'Peer Review',
    submissionType: 'Online Form',
    instructions: 'Complete the review rubric for each assigned submission.',
    attachments: 0,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: '3',
    title: 'Research Presentation',
    course: 'ICT6002',
    courseName: 'Research Methods',
    description: 'Prepare and deliver a 15-minute presentation on your research methodology and preliminary findings.',
    dueDate: '2025-12-22',
    dueTime: '2:00 PM',
    status: 'in_progress',
    priority: 'medium',
    progress: 40,
    totalPoints: 75,
    weight: '25%',
    type: 'Presentation',
    submissionType: 'File Upload + In-class',
    instructions: 'Submit slides before presentation. Be prepared for Q&A.',
    attachments: 1,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: '4',
    title: 'Database Optimization Lab',
    course: 'ICT6003',
    courseName: 'Advanced Database Systems',
    description: 'Complete the SQL optimization exercises and document your query improvements.',
    dueDate: '2025-12-20',
    dueTime: '11:59 PM',
    status: 'in_progress',
    priority: 'medium',
    progress: 30,
    totalPoints: 60,
    weight: '15%',
    type: 'Lab Exercise',
    submissionType: 'File Upload',
    instructions: 'Include original queries, optimized versions, and execution plans.',
    attachments: 3,
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: '5',
    title: 'Literature Review Draft',
    course: 'ICT6002',
    courseName: 'Research Methods',
    description: 'Submit a draft of your literature review chapter for feedback.',
    dueDate: '2025-12-10',
    dueTime: '11:59 PM',
    status: 'submitted',
    priority: 'completed',
    progress: 100,
    totalPoints: 40,
    earnedPoints: 36,
    weight: '10%',
    type: 'Report',
    submissionType: 'File Upload',
    instructions: 'Minimum 3,000 words with at least 20 academic sources.',
    attachments: 0,
    color: 'from-emerald-600 to-teal-600',
    submittedAt: '2025-12-09',
    feedback: 'Good work! Minor revisions needed on citation format.',
  },
]

const getDaysUntilDue = (dueDate: string) => {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getStatusInfo = (status: string, daysLeft: number) => {
  if (status === 'submitted') {
    return { label: 'Submitted', color: 'bg-green-100 text-green-700', icon: CheckCircle2 }
  }
  if (status === 'in_progress') {
    if (daysLeft <= 3) {
      return { label: 'Due Soon', color: 'bg-red-100 text-red-700', icon: AlertTriangle }
    }
    return { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock }
  }
  if (daysLeft <= 3) {
    return { label: 'Urgent', color: 'bg-red-100 text-red-700', icon: AlertTriangle }
  }
  return { label: 'Not Started', color: 'bg-slate-100 text-slate-700', icon: Circle }
}

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAssignments = assignmentsData.filter(assignment => {
    if (filter === 'pending' && assignment.status === 'submitted') return false
    if (filter === 'submitted' && assignment.status !== 'submitted') return false
    if (searchQuery && !assignment.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const pendingCount = assignmentsData.filter(a => a.status !== 'submitted').length
  const submittedCount = assignmentsData.filter(a => a.status === 'submitted').length
  const urgentCount = assignmentsData.filter(a => a.status !== 'submitted' && getDaysUntilDue(a.dueDate) <= 7).length

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
          <p className="text-lg text-slate-500 mt-2">Track and manage your coursework submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-72"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-blue-600">Total Assignments</p>
                <p className="text-4xl font-bold text-blue-700 mt-1">{assignmentsData.length}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-amber-600">Pending</p>
                <p className="text-4xl font-bold text-amber-700 mt-1">{pendingCount}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="h-7 w-7 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-red-600">Due This Week</p>
                <p className="text-4xl font-bold text-red-700 mt-1">{urgentCount}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-emerald-600">Submitted</p>
                <p className="text-4xl font-bold text-emerald-700 mt-1">{submittedCount}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={`h-11 px-6 ${filter === 'all' ? 'bg-blue-600' : ''}`}
        >
          All ({assignmentsData.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          className={`h-11 px-6 ${filter === 'pending' ? 'bg-amber-600' : ''}`}
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === 'submitted' ? 'default' : 'outline'}
          onClick={() => setFilter('submitted')}
          className={`h-11 px-6 ${filter === 'submitted' ? 'bg-emerald-600' : ''}`}
        >
          Submitted ({submittedCount})
        </Button>
      </div>

      {/* Assignments List */}
      <div className="space-y-6">
        {filteredAssignments.map((assignment) => {
          const daysLeft = getDaysUntilDue(assignment.dueDate)
          const statusInfo = getStatusInfo(assignment.status, daysLeft)
          const StatusIcon = statusInfo.icon

          return (
            <Card key={assignment.id} className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`h-2 bg-gradient-to-r ${assignment.color}`} />
              <CardContent className="p-8">
                <div className="flex items-start gap-8">
                  {/* Left: Assignment Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="font-mono text-sm py-1 px-3">{assignment.course}</Badge>
                      <Badge className={`${statusInfo.color} py-1 px-3`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <Badge variant="outline" className="text-sm py-1 px-3">{assignment.type}</Badge>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">{assignment.title}</h3>
                    <p className="text-base text-slate-600 mb-5">{assignment.description}</p>

                    <div className="flex flex-wrap items-center gap-5 text-base text-slate-500">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <span>{assignment.courseName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {assignment.dueTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        <span>{assignment.totalPoints} points ({assignment.weight})</span>
                      </div>
                    </div>

                    {assignment.status !== 'submitted' && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base text-slate-600">Progress</span>
                          <span className="text-base font-semibold">{assignment.progress}%</span>
                        </div>
                        <Progress value={assignment.progress} className="h-3" />
                      </div>
                    )}

                    {assignment.status === 'submitted' && assignment.feedback && (
                      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-base text-green-700">
                          <strong>Feedback:</strong> {assignment.feedback}
                        </p>
                        {assignment.earnedPoints && (
                          <p className="text-base text-green-600 mt-2">
                            Score: {assignment.earnedPoints}/{assignment.totalPoints} points
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions & Due Info */}
                  <div className="text-right space-y-4">
                    {assignment.status !== 'submitted' ? (
                      <>
                        <div className={`px-5 py-3 rounded-xl ${daysLeft <= 3 ? 'bg-red-50' : daysLeft <= 7 ? 'bg-amber-50' : 'bg-slate-50'}`}>
                          <p className={`text-3xl font-bold ${daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-amber-600' : 'text-slate-700'}`}>
                            {daysLeft}
                          </p>
                          <p className={`text-sm ${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-amber-500' : 'text-slate-500'}`}>
                            days left
                          </p>
                        </div>
                        <Button className={`w-full gap-2 h-11 bg-gradient-to-r ${assignment.color}`}>
                          <Upload className="h-5 w-5" />
                          {assignment.progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="px-5 py-3 rounded-xl bg-green-50">
                          <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm text-green-600">Submitted</p>
                          <p className="text-sm text-green-500">{assignment.submittedAt}</p>
                        </div>
                        <Button variant="outline" className="w-full gap-2 h-11">
                          <Eye className="h-5 w-5" />
                          View
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-16 text-center">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">No assignments found</h3>
            <p className="text-base text-slate-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
