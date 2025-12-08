'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Clock,
  Users,
  Calendar,
  FileText,
  Video,
  ChevronRight,
  Star,
  GraduationCap,
  MapPin,
  Mail,
  Play,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

// Mock course data - Australian system (3 units per trimester, 8 credit points each)
const coursesData = [
  {
    id: 'ICT6001',
    code: 'ICT6001',
    name: 'Applied Project',
    description: 'Capstone project applying ICT skills to solve real-world problems. Students work on individual or group projects under faculty supervision.',
    instructor: {
      name: 'Dr. Ifeanyi Egwutuoha',
      email: 'i.egwutuoha@apic.edu.au',
      avatar: 'IE',
      office: 'Room 204, ICT Building',
      officeHours: 'Mon & Wed, 2:00 PM - 4:00 PM',
    },
    credits: 8,
    trimester: 'Trimester 3, 2025',
    schedule: 'Mon & Wed, 9:00 AM - 11:00 AM',
    location: 'Room 301, Main Building',
    progress: 65,
    grade: 'HD',
    status: 'in_progress',
    totalStudents: 24,
    assignments: { completed: 4, total: 6 },
    nextClass: 'Tomorrow, 9:00 AM',
    announcements: 2,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'ICT6002',
    code: 'ICT6002',
    name: 'Research Methods',
    description: 'Introduction to research methodologies, data collection, analysis techniques, and academic writing for ICT research.',
    instructor: {
      name: 'Prof. Sarah Mitchell',
      email: 's.mitchell@apic.edu.au',
      avatar: 'SM',
      office: 'Room 310, Research Building',
      officeHours: 'Tue & Thu, 1:00 PM - 3:00 PM',
    },
    credits: 8,
    trimester: 'Trimester 3, 2025',
    schedule: 'Tue & Thu, 2:00 PM - 3:30 PM',
    location: 'Room 205, Main Building',
    progress: 72,
    grade: 'HD',
    status: 'in_progress',
    totalStudents: 32,
    assignments: { completed: 5, total: 7 },
    nextClass: 'Thursday, 2:00 PM',
    announcements: 1,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'ICT6003',
    code: 'ICT6003',
    name: 'Advanced Database Systems',
    description: 'Advanced concepts in database design, optimization, distributed databases, and NoSQL systems.',
    instructor: {
      name: 'Dr. James Chen',
      email: 'j.chen@apic.edu.au',
      avatar: 'JC',
      office: 'Room 412, ICT Building',
      officeHours: 'Mon & Fri, 10:00 AM - 12:00 PM',
    },
    credits: 8,
    trimester: 'Trimester 3, 2025',
    schedule: 'Mon & Fri, 11:00 AM - 12:30 PM',
    location: 'Computer Lab 2',
    progress: 58,
    grade: 'D',
    status: 'in_progress',
    totalStudents: 28,
    assignments: { completed: 3, total: 6 },
    nextClass: 'Friday, 11:00 AM',
    announcements: 0,
    color: 'from-purple-600 to-pink-600',
  },
]

const recentMaterials = [
  { id: 1, title: 'Project Guidelines v2.0', course: 'ICT6001', type: 'PDF', date: '2 days ago' },
  { id: 2, title: 'Research Ethics Lecture', course: 'ICT6002', type: 'Video', date: '3 days ago' },
  { id: 3, title: 'SQL Optimization Slides', course: 'ICT6003', type: 'PDF', date: '1 week ago' },
]

// Australian grading system colors
const getGradeColor = (grade: string) => {
  if (grade === 'HD') return 'text-emerald-600'
  if (grade === 'D') return 'text-blue-600'
  if (grade === 'C') return 'text-amber-600'
  if (grade === 'P') return 'text-orange-600'
  return 'text-red-600'
}

export default function CoursesPage() {
  const [, setSelectedCourse] = useState<string | null>(null)

  const totalCredits = coursesData.reduce((acc, course) => acc + course.credits, 0)
  const averageProgress = Math.round(coursesData.reduce((acc, course) => acc + course.progress, 0) / coursesData.length)

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Units</h1>
          <p className="text-lg text-slate-500 mt-2">Trimester 3, 2025 • {coursesData.length} units enrolled</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 rounded-xl border border-blue-100">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Credit Points</p>
              <p className="text-xl font-bold text-blue-700">{totalCredits}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="text-sm text-emerald-600">Avg. Progress</p>
              <p className="text-xl font-bold text-emerald-700">{averageProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coursesData.map((course) => (
          <Card key={course.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCourse(course.id)}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <Badge className={`bg-gradient-to-r ${course.color} text-white py-1 px-3`}>{course.code}</Badge>
                <span className={`text-2xl font-bold ${getGradeColor(course.grade)}`}>{course.grade}</span>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1">{course.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{course.instructor.name}</p>
              <Progress value={course.progress} className="h-2.5" />
              <p className="text-sm text-slate-500 mt-3">{course.progress}% complete</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Unit Details</h2>
          </div>

          {coursesData.map((course) => (
            <Card key={course.id} className="border-0 shadow-lg overflow-hidden">
              <div className={`h-3 bg-gradient-to-r ${course.color}`} />
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="font-mono text-sm py-1 px-3">{course.code}</Badge>
                      <Badge className="bg-green-100 text-green-700 py-1 px-3">In Progress</Badge>
                      {course.announcements > 0 && (
                        <Badge className="bg-red-100 text-red-600 py-1 px-3">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {course.announcements} new
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{course.name}</h3>
                    <p className="text-base text-slate-600 mb-5">{course.description}</p>
                  </div>
                  <div className="text-right ml-6">
                    <div className={`text-4xl font-bold ${getGradeColor(course.grade)}`}>{course.grade}</div>
                    <p className="text-sm text-slate-500 mt-1">Current Grade</p>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-xl mb-6">
                  <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${course.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {course.instructor.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-slate-900">{course.instructor.name}</p>
                    <p className="text-base text-slate-500">{course.instructor.office}</p>
                  </div>
                  <Button variant="outline" className="gap-2 h-10">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                </div>

                {/* Course Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
                  <div className="flex items-center gap-3 text-base">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-600">{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-3 text-base">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-600">{course.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-base">
                    <Users className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-600">{course.totalStudents} students</span>
                  </div>
                  <div className="flex items-center gap-3 text-base">
                    <Star className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-600">{course.credits} CP</span>
                  </div>
                </div>

                {/* Progress and Actions */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex-1 mr-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base text-slate-600">Unit Progress</span>
                      <span className="text-base font-semibold text-slate-900">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-3" />
                    <p className="text-sm text-slate-500 mt-2">
                      {course.assignments.completed}/{course.assignments.total} assignments completed
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 h-11">
                      <FileText className="h-5 w-5" />
                      Materials
                    </Button>
                    <Button className={`gap-2 bg-gradient-to-r ${course.color} hover:opacity-90 h-11`}>
                      <Play className="h-5 w-5" />
                      Continue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Classes */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <Calendar className="h-6 w-6 text-blue-600" />
                Upcoming Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {coursesData.map((course) => (
                <div key={course.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base text-slate-900 truncate">{course.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{course.nextClass}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Materials */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <FileText className="h-6 w-6 text-emerald-600" />
                Recent Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMaterials.map((material) => (
                <div key={material.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    material.type === 'PDF' ? 'bg-red-100 text-red-600' :
                    material.type === 'Video' ? 'bg-purple-100 text-purple-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {material.type === 'Video' ? <Video className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base text-slate-900 truncate">{material.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{material.course} • {material.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-11">
                View All Materials
              </Button>
            </CardContent>
          </Card>

          {/* Office Hours */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-3">
                <Clock className="h-6 w-6" />
                Office Hours Today
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="font-medium text-lg">Dr. Ifeanyi Egwutuoha</p>
                  <p className="text-base text-blue-100 mt-1">2:00 PM - 4:00 PM</p>
                  <p className="text-sm text-blue-200 mt-2">Room 204, ICT Building</p>
                </div>
              </div>
              <Button className="w-full mt-5 bg-white text-blue-600 hover:bg-blue-50 h-11">
                Book Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
