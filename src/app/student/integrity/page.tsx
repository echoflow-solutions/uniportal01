'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Shield,
  CheckCircle2,
  FileText,
  BookOpen,
  Scale,
  Eye,
  Download,
  ExternalLink,
  Info,
  Clock,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Users,
  GraduationCap,
} from 'lucide-react'

// Mock data
const integrityStatus = {
  status: 'good_standing',
  violations: 0,
  trainingsCompleted: 2,
  trainingsRequired: 3,
  acknowledgementSigned: true,
  lastTraining: '2025-09-15',
}

const turnitinReports = [
  {
    id: '1',
    assignment: 'Literature Review Draft',
    course: 'ICT6002',
    submittedDate: '2025-12-09',
    score: 12,
    status: 'reviewed',
    details: {
      internet: 5,
      publications: 4,
      studentPapers: 3,
    },
  },
  {
    id: '2',
    assignment: 'Project Proposal',
    course: 'ICT6001',
    submittedDate: '2025-11-28',
    score: 8,
    status: 'reviewed',
    details: {
      internet: 3,
      publications: 3,
      studentPapers: 2,
    },
  },
  {
    id: '3',
    assignment: 'Database Schema Design',
    course: 'ICT6003',
    submittedDate: '2025-12-05',
    score: 5,
    status: 'reviewed',
    details: {
      internet: 2,
      publications: 2,
      studentPapers: 1,
    },
  },
  {
    id: '4',
    assignment: 'Cloud Architecture Diagram',
    course: 'ICT6004',
    submittedDate: '2025-12-07',
    score: 3,
    status: 'pending',
    details: null,
  },
]

const guidelines = [
  {
    id: '1',
    title: 'Academic Honesty Policy',
    description: 'Comprehensive policy on academic integrity expectations and consequences.',
    type: 'policy',
    lastUpdated: '2025-08-01',
  },
  {
    id: '2',
    title: 'Proper Citation Guidelines',
    description: 'How to properly cite sources in APA, MLA, and Chicago formats.',
    type: 'guide',
    lastUpdated: '2025-07-15',
  },
  {
    id: '3',
    title: 'Understanding Plagiarism',
    description: 'What constitutes plagiarism and how to avoid it in your work.',
    type: 'guide',
    lastUpdated: '2025-06-20',
  },
  {
    id: '4',
    title: 'Group Work & Collaboration',
    description: 'Guidelines for acceptable collaboration on assignments and projects.',
    type: 'guide',
    lastUpdated: '2025-08-10',
  },
  {
    id: '5',
    title: 'AI Usage Policy',
    description: 'Policies regarding the use of AI tools like ChatGPT in academic work.',
    type: 'policy',
    lastUpdated: '2025-09-01',
  },
]

const trainings = [
  {
    id: '1',
    title: 'Academic Integrity Fundamentals',
    duration: '45 min',
    status: 'completed',
    completedDate: '2025-09-10',
    required: true,
  },
  {
    id: '2',
    title: 'Avoiding Plagiarism',
    duration: '30 min',
    status: 'completed',
    completedDate: '2025-09-15',
    required: true,
  },
  {
    id: '3',
    title: 'Research Ethics',
    duration: '60 min',
    status: 'not_started',
    completedDate: null,
    required: true,
  },
  {
    id: '4',
    title: 'AI Tools in Academia',
    duration: '25 min',
    status: 'not_started',
    completedDate: null,
    required: false,
  },
]

const getSimilarityColor = (score: number) => {
  if (score <= 15) return 'text-green-600 bg-green-50'
  if (score <= 25) return 'text-amber-600 bg-amber-50'
  return 'text-red-600 bg-red-50'
}

const getSimilarityBadge = (score: number) => {
  if (score <= 15) return { label: 'Low', color: 'bg-green-100 text-green-700' }
  if (score <= 25) return { label: 'Moderate', color: 'bg-amber-100 text-amber-700' }
  return { label: 'High', color: 'bg-red-100 text-red-700' }
}

export default function IntegrityPage() {
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const [showAllGuidelines, setShowAllGuidelines] = useState(false)

  const completedTrainings = trainings.filter(t => t.status === 'completed').length
  const requiredTrainings = trainings.filter(t => t.required).length
  const averageSimilarity = Math.round(
    turnitinReports.filter(r => r.score !== null).reduce((acc, r) => acc + r.score, 0) /
    turnitinReports.filter(r => r.score !== null).length
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Integrity</h1>
          <p className="text-slate-500 mt-1">Maintain academic honesty and view your integrity reports</p>
        </div>
        <Badge className={integrityStatus.status === 'good_standing' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
          <Shield className="h-4 w-4 mr-1" />
          {integrityStatus.status === 'good_standing' ? 'Good Standing' : 'Review Required'}
        </Badge>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Integrity Status</p>
                <p className="text-lg font-bold text-emerald-700">Good Standing</p>
                <p className="text-xs text-emerald-600 mt-1">No violations</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Avg. Similarity</p>
                <p className="text-2xl font-bold text-blue-700">{averageSimilarity}%</p>
                <p className="text-xs text-blue-600 mt-1">Across submissions</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileSearch className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Trainings</p>
                <p className="text-2xl font-bold text-purple-700">{completedTrainings}/{requiredTrainings}</p>
                <p className="text-xs text-purple-600 mt-1">Required completed</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Policy Acknowledged</p>
                <p className="text-lg font-bold text-amber-700">Yes</p>
                <p className="text-xs text-amber-600 mt-1">Fall 2025</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Scale className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Turnitin Reports */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-blue-600" />
              Similarity Reports
            </h2>
            <div className="space-y-4">
              {turnitinReports.map((report) => {
                const isExpanded = expandedReport === report.id
                const similarity = getSimilarityBadge(report.score)

                return (
                  <Card key={report.id} className="border-0 shadow-lg">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-mono text-xs">{report.course}</Badge>
                            {report.status === 'reviewed' ? (
                              <Badge className={similarity.color}>{similarity.label} Match</Badge>
                            ) : (
                              <Badge className="bg-slate-100 text-slate-600">
                                <Clock className="h-3 w-3 mr-1" />
                                Processing
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900">{report.assignment}</h3>
                          <p className="text-sm text-slate-500 mt-1">
                            Submitted: {new Date(report.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg text-center ${getSimilarityColor(report.score)}`}>
                          <p className="text-2xl font-bold">{report.score}%</p>
                          <p className="text-xs">Similarity</p>
                        </div>
                      </div>

                      {report.status === 'reviewed' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                            className="mt-3 w-full flex items-center justify-center gap-2 text-slate-500"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            {isExpanded ? 'Hide Details' : 'View Breakdown'}
                          </Button>

                          {isExpanded && report.details && (
                            <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <p className="text-lg font-bold text-slate-700">{report.details.internet}%</p>
                                <p className="text-xs text-slate-500">Internet Sources</p>
                              </div>
                              <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <p className="text-lg font-bold text-slate-700">{report.details.publications}%</p>
                                <p className="text-xs text-slate-500">Publications</p>
                              </div>
                              <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <p className="text-lg font-bold text-slate-700">{report.details.studentPapers}%</p>
                                <p className="text-xs text-slate-500">Student Papers</p>
                              </div>
                              <div className="col-span-3 flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 gap-2">
                                  <Eye className="h-4 w-4" />
                                  View Full Report
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 gap-2">
                                  <Download className="h-4 w-4" />
                                  Download PDF
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Required Trainings */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Integrity Trainings
            </h2>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-5">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Training Progress</span>
                    <span className="text-sm font-semibold text-slate-900">{completedTrainings} of {requiredTrainings} required</span>
                  </div>
                  <Progress value={(completedTrainings / requiredTrainings) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  {trainings.map((training) => (
                    <div key={training.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          training.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {training.status === 'completed'
                            ? <CheckCircle2 className="h-5 w-5" />
                            : <BookOpen className="h-5 w-5" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{training.title}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>{training.duration}</span>
                            {training.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {training.status === 'completed' ? (
                        <Badge className="bg-green-100 text-green-700">Completed</Badge>
                      ) : (
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                          Start
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Guidelines & Policies */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                Guidelines & Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(showAllGuidelines ? guidelines : guidelines.slice(0, 3)).map((guide) => (
                <div key={guide.id} className="p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      guide.type === 'policy' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {guide.type === 'policy' ? <Shield className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900">{guide.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{guide.description}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllGuidelines(!showAllGuidelines)}
                className="w-full text-blue-600"
              >
                {showAllGuidelines ? 'Show Less' : 'View All Guidelines'}
              </Button>
            </CardContent>
          </Card>

          {/* Integrity Tips */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Tips for Academic Success
              </h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Always cite your sources properly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Paraphrase in your own words</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Use quotation marks for direct quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Submit your own original work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Ask instructors if unsure</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                If you have questions about academic integrity or need support with citations, we&apos;re here to help.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Contact Academic Affairs
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen className="h-4 w-4" />
                  Writing Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
