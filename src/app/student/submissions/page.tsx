'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  MessageSquare,
  Search,
  Upload,
  File,
  Image as ImageIcon,
  FileCode,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Star,
  RefreshCw,
} from 'lucide-react'

// Mock submissions data - Australian system (Trimester 3, 2025 - 3 units enrolled)
const submissionsData = [
  {
    id: '1',
    assignmentTitle: 'Literature Review Draft',
    course: 'ICT6002',
    courseName: 'Research Methods',
    submittedAt: '2025-12-09T14:30:00',
    dueDate: '2025-12-10T23:59:00',
    status: 'graded',
    grade: 36,
    totalPoints: 40,
    percentage: 90,
    feedback: 'Excellent work on the literature review. Your analysis of the sources is thorough and well-organized. Minor revisions needed on citation format - please ensure all in-text citations follow APA 7th edition guidelines consistently. The synthesis of sources is particularly strong.',
    files: [
      { name: 'Literature_Review_Draft_v2.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'References.docx', size: '156 KB', type: 'doc' },
    ],
    instructor: 'Prof. Sarah Mitchell',
    turnitinScore: 12,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: '2',
    assignmentTitle: 'Database Schema Design',
    course: 'ICT6003',
    courseName: 'Advanced Database Systems',
    submittedAt: '2025-12-05T22:45:00',
    dueDate: '2025-12-06T23:59:00',
    status: 'graded',
    grade: 52,
    totalPoints: 60,
    percentage: 87,
    feedback: 'Good understanding of normalization principles. The ER diagram is well-structured. Consider adding more indexes for query optimization. The documentation could be more detailed regarding the rationale for design decisions.',
    files: [
      { name: 'Database_Schema.sql', size: '45 KB', type: 'code' },
      { name: 'ER_Diagram.png', size: '1.2 MB', type: 'image' },
      { name: 'Design_Document.pdf', size: '890 KB', type: 'pdf' },
    ],
    instructor: 'Dr. James Chen',
    turnitinScore: 5,
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: '3',
    assignmentTitle: 'Project Proposal',
    course: 'ICT6001',
    courseName: 'Applied Project',
    submittedAt: '2025-11-28T16:20:00',
    dueDate: '2025-11-30T23:59:00',
    status: 'graded',
    grade: 85,
    totalPoints: 100,
    percentage: 85,
    feedback: 'Strong project proposal with clear objectives and methodology. The scope is appropriate for a trimester-long project. Please elaborate on the risk mitigation strategies and provide more detail on the testing approach.',
    files: [
      { name: 'Project_Proposal_Final.pdf', size: '3.1 MB', type: 'pdf' },
      { name: 'Gantt_Chart.xlsx', size: '234 KB', type: 'doc' },
    ],
    instructor: 'Dr. Ifeanyi Egwutuoha',
    turnitinScore: 8,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: '4',
    assignmentTitle: 'Research Ethics Quiz',
    course: 'ICT6002',
    courseName: 'Research Methods',
    submittedAt: '2025-11-20T10:30:00',
    dueDate: '2025-11-20T12:00:00',
    status: 'graded',
    grade: 18,
    totalPoints: 20,
    percentage: 90,
    feedback: 'Excellent understanding of research ethics principles. All scenarios were handled appropriately.',
    files: [
      { name: 'Quiz_Responses.json', size: '12 KB', type: 'code' },
    ],
    instructor: 'Prof. Sarah Mitchell',
    turnitinScore: null,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: '5',
    assignmentTitle: 'SQL Optimization Exercise 1',
    course: 'ICT6003',
    courseName: 'Advanced Database Systems',
    submittedAt: '2025-11-15T18:00:00',
    dueDate: '2025-11-15T23:59:00',
    status: 'graded',
    grade: 28,
    totalPoints: 30,
    percentage: 93,
    feedback: 'Excellent query optimization techniques demonstrated. The execution plan analysis was thorough.',
    files: [
      { name: 'Optimized_Queries.sql', size: '23 KB', type: 'code' },
    ],
    instructor: 'Dr. James Chen',
    turnitinScore: null,
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: '6',
    assignmentTitle: 'Database Optimization Lab',
    course: 'ICT6003',
    courseName: 'Advanced Database Systems',
    submittedAt: '2025-12-07T20:15:00',
    dueDate: '2025-12-08T23:59:00',
    status: 'pending',
    grade: null,
    totalPoints: 60,
    percentage: null,
    feedback: null,
    files: [
      { name: 'Optimization_Results.sql', size: '45 KB', type: 'code' },
      { name: 'Lab_Report.pdf', size: '1.8 MB', type: 'pdf' },
    ],
    instructor: 'Dr. James Chen',
    turnitinScore: 3,
    color: 'from-purple-600 to-pink-600',
  },
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'graded':
      return { label: 'Graded', color: 'bg-green-100 text-green-700', icon: CheckCircle2 }
    case 'pending':
      return { label: 'Pending Review', color: 'bg-amber-100 text-amber-700', icon: Clock }
    case 'late':
      return { label: 'Late Submission', color: 'bg-red-100 text-red-700', icon: AlertCircle }
    case 'resubmit':
      return { label: 'Resubmission Required', color: 'bg-purple-100 text-purple-700', icon: RefreshCw }
    default:
      return { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: FileText }
  }
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-4 w-4 text-red-500" />
    case 'doc':
      return <File className="h-4 w-4 text-blue-500" />
    case 'image':
      return <ImageIcon className="h-4 w-4 text-purple-500" />
    case 'code':
      return <FileCode className="h-4 w-4 text-green-500" />
    default:
      return <Paperclip className="h-4 w-4 text-slate-500" />
  }
}

const getGradeColor = (percentage: number | null) => {
  if (percentage === null) return 'text-slate-500'
  if (percentage >= 90) return 'text-emerald-600'
  if (percentage >= 80) return 'text-blue-600'
  if (percentage >= 70) return 'text-amber-600'
  if (percentage >= 60) return 'text-orange-600'
  return 'text-red-600'
}

export default function SubmissionsPage() {
  const [filter, setFilter] = useState<'all' | 'graded' | 'pending'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null)

  const filteredSubmissions = submissionsData.filter(submission => {
    if (filter === 'graded' && submission.status !== 'graded' && submission.status !== 'late') return false
    if (filter === 'pending' && submission.status !== 'pending') return false
    if (searchQuery && !submission.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const gradedCount = submissionsData.filter(s => s.status === 'graded' || s.status === 'late').length
  const pendingCount = submissionsData.filter(s => s.status === 'pending').length
  const averageGrade = Math.round(
    submissionsData
      .filter(s => s.percentage !== null)
      .reduce((acc, s) => acc + (s.percentage || 0), 0) /
    submissionsData.filter(s => s.percentage !== null).length
  )

  const toggleExpanded = (id: string) => {
    setExpandedSubmission(expandedSubmission === id ? null : id)
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Submissions</h1>
          <p className="text-lg text-slate-500 mt-2">View and track all your submitted coursework</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search submissions..."
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
                <p className="text-base text-blue-600">Total Submissions</p>
                <p className="text-4xl font-bold text-blue-700 mt-1">{submissionsData.length}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <Upload className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-emerald-600">Graded</p>
                <p className="text-4xl font-bold text-emerald-700 mt-1">{gradedCount}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-amber-600">Pending Review</p>
                <p className="text-4xl font-bold text-amber-700 mt-1">{pendingCount}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="h-7 w-7 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-purple-600">Average Grade</p>
                <p className="text-4xl font-bold text-purple-700 mt-1">{averageGrade}%</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-purple-100 flex items-center justify-center">
                <Star className="h-7 w-7 text-purple-600" />
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
          All ({submissionsData.length})
        </Button>
        <Button
          variant={filter === 'graded' ? 'default' : 'outline'}
          onClick={() => setFilter('graded')}
          className={`h-11 px-6 ${filter === 'graded' ? 'bg-emerald-600' : ''}`}
        >
          Graded ({gradedCount})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          className={`h-11 px-6 ${filter === 'pending' ? 'bg-amber-600' : ''}`}
        >
          Pending ({pendingCount})
        </Button>
      </div>

      {/* Submissions List */}
      <div className="space-y-6">
        {filteredSubmissions.map((submission) => {
          const statusInfo = getStatusInfo(submission.status)
          const StatusIcon = statusInfo.icon
          const isExpanded = expandedSubmission === submission.id

          return (
            <Card key={submission.id} className="border-0 shadow-lg overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${submission.color}`} />
              <CardContent className="p-8">
                {/* Main Content */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="font-mono text-sm py-1 px-3">{submission.course}</Badge>
                      <Badge className={`${statusInfo.color} py-1 px-3`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      {submission.turnitinScore !== null && (
                        <Badge variant="outline" className="text-sm py-1 px-3">
                          Turnitin: {submission.turnitinScore}%
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">{submission.assignmentTitle}</h3>
                    <p className="text-base text-slate-500 mb-4">{submission.courseName}</p>

                    <div className="flex flex-wrap items-center gap-5 text-base text-slate-500">
                      <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>Due: {new Date(submission.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-5 w-5" />
                        <span>{submission.files.length} file(s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Grade Display */}
                  <div className="text-right">
                    {submission.status === 'graded' || submission.status === 'late' ? (
                      <div className="text-center">
                        <p className={`text-4xl font-bold ${getGradeColor(submission.percentage)}`}>
                          {submission.percentage}%
                        </p>
                        <p className="text-base text-slate-500 mt-1">
                          {submission.grade}/{submission.totalPoints} pts
                        </p>
                        {submission.status === 'late' && 'latePenalty' in submission && (
                          <Badge className="bg-red-100 text-red-600 mt-2 text-sm py-1 px-3">
                            -{(submission as { latePenalty?: number }).latePenalty}% late
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="px-5 py-3 bg-amber-50 rounded-xl">
                        <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                        <p className="text-sm text-amber-600">Awaiting Grade</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <Button
                  variant="ghost"
                  onClick={() => toggleExpanded(submission.id)}
                  className="mt-6 w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 h-11"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-5 w-5" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-5 w-5" />
                      View Details
                    </>
                  )}
                </Button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t space-y-6">
                    {/* Submitted Files */}
                    <div>
                      <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Paperclip className="h-5 w-5" />
                        Submitted Files
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {submission.files.map((file, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                            {getFileIcon(file.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-medium text-slate-700 truncate">{file.name}</p>
                              <p className="text-sm text-slate-500 mt-1">{file.size}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                              <Download className="h-5 w-5 text-slate-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    {submission.feedback && (
                      <div>
                        <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          Instructor Feedback
                        </h4>
                        <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="text-base text-slate-700">{submission.feedback}</p>
                          <p className="text-sm text-slate-500 mt-3">— {submission.instructor}</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      <Button variant="outline" className="gap-2 h-11">
                        <Eye className="h-5 w-5" />
                        View Submission
                      </Button>
                      <Button variant="outline" className="gap-2 h-11">
                        <Download className="h-5 w-5" />
                        Download All
                      </Button>
                      {submission.status === 'pending' && (
                        <Button variant="outline" className="gap-2 h-11 text-amber-600 border-amber-200 hover:bg-amber-50">
                          <RefreshCw className="h-5 w-5" />
                          Update Submission
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-16 text-center">
            <Upload className="h-16 w-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">No submissions found</h3>
            <p className="text-base text-slate-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
