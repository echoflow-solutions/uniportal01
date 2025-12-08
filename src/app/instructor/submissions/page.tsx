'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Calendar,
  User,
  BookOpen,
  Shield,
  MoreVertical,
} from 'lucide-react'
import Link from 'next/link'

// Mock submissions data
const submissions = [
  {
    id: '1',
    student: 'Emmanuel Alisetti',
    studentId: 'STU-2024-0891',
    avatar: 'EA',
    assignment: 'Final Report - Applied Project',
    course: 'ICT6001',
    submittedAt: '2 hours ago',
    submittedDate: 'Dec 8, 2025 at 5:30 PM',
    status: 'pending',
    integrityScore: 98,
    wordCount: 4500,
    fileType: 'PDF',
  },
  {
    id: '2',
    student: 'Kabir Arya Niraula',
    studentId: 'STU-2024-0892',
    avatar: 'KN',
    assignment: 'Research Methodology Essay',
    course: 'ICT6002',
    submittedAt: '4 hours ago',
    submittedDate: 'Dec 8, 2025 at 3:15 PM',
    status: 'pending',
    integrityScore: 95,
    wordCount: 3200,
    fileType: 'DOCX',
  },
  {
    id: '3',
    student: 'Bernard Adjei-Yeboah',
    studentId: 'STU-2024-0893',
    avatar: 'BA',
    assignment: 'Database Design Project',
    course: 'ICT6003',
    submittedAt: '6 hours ago',
    submittedDate: 'Dec 8, 2025 at 1:00 PM',
    status: 'pending',
    integrityScore: 100,
    wordCount: 5800,
    fileType: 'PDF',
  },
  {
    id: '4',
    student: 'Sarah Chen',
    studentId: 'STU-2024-0894',
    avatar: 'SC',
    assignment: 'Cloud Architecture Report',
    course: 'ICT6004',
    submittedAt: '1 day ago',
    submittedDate: 'Dec 7, 2025 at 11:45 AM',
    status: 'graded',
    integrityScore: 72,
    wordCount: 2800,
    fileType: 'PDF',
    grade: 'C',
    feedback: 'Good structure but needs more depth in analysis.',
  },
  {
    id: '5',
    student: 'Michael Johnson',
    studentId: 'STU-2024-0895',
    avatar: 'MJ',
    assignment: 'Literature Review',
    course: 'ICT6002',
    submittedAt: '2 days ago',
    submittedDate: 'Dec 6, 2025 at 9:30 PM',
    status: 'graded',
    integrityScore: 88,
    wordCount: 4100,
    fileType: 'DOCX',
    grade: 'D',
    feedback: 'Excellent work with comprehensive analysis.',
  },
  {
    id: '6',
    student: 'Priya Sharma',
    studentId: 'STU-2024-0896',
    avatar: 'PS',
    assignment: 'System Design Document',
    course: 'ICT6001',
    submittedAt: '3 days ago',
    submittedDate: 'Dec 5, 2025 at 4:00 PM',
    status: 'flagged',
    integrityScore: 45,
    wordCount: 3500,
    fileType: 'PDF',
    flagReason: 'High similarity detected with external sources',
  },
]

const quickStats = [
  { label: 'Total Submissions', value: '156', icon: FileText, color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50' },
  { label: 'Pending Review', value: '12', icon: Clock, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50' },
  { label: 'Graded', value: '142', icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50' },
  { label: 'Flagged', value: '2', icon: AlertTriangle, color: 'from-red-500 to-rose-500', bgColor: 'from-red-50 to-rose-50' },
]

export default function InstructorSubmissionsPage() {
  const { currentUser } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState('all')

  if (!currentUser) return null

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.assignment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus
    const matchesCourse = selectedCourse === 'all' || sub.course === selectedCourse
    return matchesSearch && matchesFilter && matchesCourse
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'graded': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'flagged': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'graded': return <CheckCircle2 className="h-4 w-4" />
      case 'flagged': return <AlertTriangle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Submissions</h1>
          <p className="text-slate-500 mt-1">Review and grade student submissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export All
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
                placeholder="Search by student or assignment..."
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
                <option value="ICT6001">ICT6001</option>
                <option value="ICT6002">ICT6002</option>
                <option value="ICT6003">ICT6003</option>
                <option value="ICT6004">ICT6004</option>
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
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
                className={filterStatus === 'pending' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'graded' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('graded')}
                className={filterStatus === 'graded' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Graded
              </Button>
              <Button
                variant={filterStatus === 'flagged' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('flagged')}
                className={filterStatus === 'flagged' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Flagged
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              All Submissions
            </CardTitle>
            <span className="text-sm text-slate-500">{filteredSubmissions.length} submissions</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                  submission.status === 'flagged'
                    ? 'bg-red-50 border-red-200'
                    : submission.status === 'pending'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0 ${
                    submission.status === 'flagged'
                      ? 'bg-gradient-to-br from-red-500 to-rose-600'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-600'
                  }`}>
                    {submission.avatar}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{submission.assignment}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-3 w-3 text-slate-400" />
                          <span className="text-sm text-slate-600">{submission.student}</span>
                          <span className="text-slate-300">•</span>
                          <BookOpen className="h-3 w-3 text-slate-400" />
                          <span className="text-sm text-slate-500">{submission.course}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(submission.status)}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1 capitalize">{submission.status}</span>
                      </Badge>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {submission.submittedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {submission.wordCount.toLocaleString()} words
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className={`h-3 w-3 ${submission.integrityScore >= 90 ? 'text-emerald-500' : submission.integrityScore >= 70 ? 'text-amber-500' : 'text-red-500'}`} />
                        {submission.integrityScore}% integrity
                      </span>
                    </div>

                    {/* Flagged Reason */}
                    {submission.status === 'flagged' && submission.flagReason && (
                      <div className="mt-3 p-2 bg-red-100 rounded-lg">
                        <p className="text-sm text-red-700 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {submission.flagReason}
                        </p>
                      </div>
                    )}

                    {/* Grade and Feedback */}
                    {submission.status === 'graded' && (
                      <div className="mt-3 p-2 bg-emerald-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-600 text-white">Grade: {submission.grade}</Badge>
                          <span className="text-sm text-emerald-700">{submission.feedback}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/instructor/submissions/${submission.id}`}>
                      <Button size="sm" className="gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                        <Eye className="h-4 w-4" />
                        Review
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No submissions found</h3>
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
