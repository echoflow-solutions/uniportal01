'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  AlertTriangle,
  Shield,
  Eye,
  CheckCircle2,
  XCircle,
  User,
  BookOpen,
  Calendar,
  ExternalLink,
  Clock,
  Flag,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'

// Mock flagged submissions data
const flaggedSubmissions = [
  {
    id: '1',
    student: 'External Student',
    studentId: 'STU-2024-0901',
    avatar: 'ES',
    assignment: 'Machine Learning Assignment',
    course: 'ICT6001',
    submittedAt: '2 hours ago',
    similarityScore: 78,
    riskLevel: 'high',
    flags: [
      { type: 'similarity', description: 'High similarity with online sources (78%)' },
      { type: 'pattern', description: 'Unusual writing patterns detected' },
      { type: 'ai', description: 'Potential AI-generated content detected' },
    ],
    status: 'pending',
    matchedSources: [
      { source: 'Wikipedia - Machine Learning', similarity: 45 },
      { source: 'Medium Article - ML Basics', similarity: 28 },
      { source: 'Student Paper (2023)', similarity: 5 },
    ],
  },
  {
    id: '2',
    student: 'Another Student',
    studentId: 'STU-2024-0902',
    avatar: 'AS',
    assignment: 'Research Paper',
    course: 'ICT6002',
    submittedAt: '1 day ago',
    similarityScore: 45,
    riskLevel: 'medium',
    flags: [
      { type: 'similarity', description: 'Moderate similarity with online sources (45%)' },
    ],
    status: 'pending',
    matchedSources: [
      { source: 'Academic Journal Article', similarity: 30 },
      { source: 'Textbook Reference', similarity: 15 },
    ],
  },
  {
    id: '3',
    student: 'Sarah Chen',
    studentId: 'STU-2024-0894',
    avatar: 'SC',
    assignment: 'Cloud Architecture Report',
    course: 'ICT6004',
    submittedAt: '3 days ago',
    similarityScore: 35,
    riskLevel: 'low',
    flags: [
      { type: 'similarity', description: 'Some matching text with previous submissions (35%)' },
    ],
    status: 'reviewed',
    resolution: 'Cleared - Properly cited references',
    matchedSources: [
      { source: 'Course Materials', similarity: 20 },
      { source: 'AWS Documentation', similarity: 15 },
    ],
  },
]

const flagStats = [
  { label: 'Total Flagged', value: '8', icon: Flag, color: 'from-red-500 to-rose-500', bgColor: 'from-red-50 to-rose-50' },
  { label: 'High Risk', value: '2', icon: AlertTriangle, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50' },
  { label: 'Under Review', value: '3', icon: Clock, color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50' },
  { label: 'Resolved', value: '3', icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50' },
]

export default function InstructorFlaggedPage() {
  const { currentUser } = useAppStore()
  const [filterRisk, setFilterRisk] = useState('all')

  if (!currentUser) return null

  const filteredSubmissions = flaggedSubmissions.filter(sub => {
    return filterRisk === 'all' || sub.riskLevel === filterRisk
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Flagged Work</h1>
          <p className="text-slate-500 mt-1">Review submissions flagged for potential integrity concerns</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Shield className="h-4 w-4" />
          Integrity Settings
        </Button>
      </div>

      {/* Alert Banner */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-rose-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">2 High-Risk Submissions Require Immediate Review</h3>
              <p className="text-red-100 text-sm mt-1">These submissions have been flagged with significant integrity concerns.</p>
            </div>
            <Button className="bg-white text-red-600 hover:bg-red-50">
              Review Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {flagStats.map((stat, index) => (
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

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Filter by risk:</span>
            <div className="flex gap-2">
              <Button
                variant={filterRisk === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRisk('all')}
                className={filterRisk === 'all' ? 'bg-slate-700 hover:bg-slate-800' : ''}
              >
                All
              </Button>
              <Button
                variant={filterRisk === 'high' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRisk('high')}
                className={filterRisk === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                High Risk
              </Button>
              <Button
                variant={filterRisk === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRisk('medium')}
                className={filterRisk === 'medium' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                Medium Risk
              </Button>
              <Button
                variant={filterRisk === 'low' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRisk('low')}
                className={filterRisk === 'low' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Low Risk
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flagged Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} className={`border-0 shadow-lg overflow-hidden ${
            submission.status === 'reviewed' ? 'opacity-75' : ''
          }`}>
            <div className={`h-1 ${
              submission.riskLevel === 'high' ? 'bg-red-500' :
              submission.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className={`h-14 w-14 rounded-full flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0 ${
                  submission.riskLevel === 'high'
                    ? 'bg-gradient-to-br from-red-500 to-rose-600'
                    : submission.riskLevel === 'medium'
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                }`}>
                  {submission.avatar}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{submission.assignment}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {submission.student}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {submission.course}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {submission.submittedAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(submission.riskLevel)}>
                        {submission.riskLevel === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {submission.riskLevel.charAt(0).toUpperCase() + submission.riskLevel.slice(1)} Risk
                      </Badge>
                      {submission.status === 'reviewed' && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Reviewed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Similarity Score */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Similarity Score</span>
                      <span className={`text-lg font-bold ${
                        submission.similarityScore >= 60 ? 'text-red-600' :
                        submission.similarityScore >= 40 ? 'text-amber-600' : 'text-blue-600'
                      }`}>
                        {submission.similarityScore}%
                      </span>
                    </div>
                    <Progress
                      value={submission.similarityScore}
                      className={`h-2 ${
                        submission.similarityScore >= 60 ? '[&>div]:bg-red-500' :
                        submission.similarityScore >= 40 ? '[&>div]:bg-amber-500' : '[&>div]:bg-blue-500'
                      }`}
                    />
                  </div>

                  {/* Flags */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Detected Issues:</h4>
                    <div className="space-y-2">
                      {submission.flags.map((flag, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            submission.riskLevel === 'high' ? 'text-red-500' :
                            submission.riskLevel === 'medium' ? 'text-amber-500' : 'text-blue-500'
                          }`} />
                          <span className="text-slate-600">{flag.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Matched Sources */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Matched Sources:</h4>
                    <div className="flex flex-wrap gap-2">
                      {submission.matchedSources.map((source, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {source.source} ({source.similarity}%)
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Resolution */}
                  {submission.resolution && (
                    <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <p className="text-sm text-emerald-700 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {submission.resolution}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Link href={`/instructor/submissions/${submission.id}`}>
                    <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      <Eye className="h-4 w-4" />
                      Review
                    </Button>
                  </Link>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Contact Student
                  </Button>
                  {submission.status !== 'reviewed' && (
                    <>
                      <Button variant="outline" className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                        <CheckCircle2 className="h-4 w-4" />
                        Clear
                      </Button>
                      <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <XCircle className="h-4 w-4" />
                        Escalate
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No flagged submissions</h3>
            <p className="text-slate-500">All submissions are clear for the selected filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
