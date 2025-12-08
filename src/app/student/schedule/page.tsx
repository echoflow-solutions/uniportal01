'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Video,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
  GraduationCap,
  Users,
  Coffee,
  Bell,
  Download,
} from 'lucide-react'

// Mock schedule data
const weeklySchedule = [
  {
    day: 'Monday',
    date: '2025-12-09',
    classes: [
      {
        id: '1',
        course: 'ICT6001',
        name: 'Applied Project',
        time: '9:00 AM - 11:00 AM',
        location: 'Room 301, Main Building',
        instructor: 'Dr. Ifeanyi Egwutuoha',
        type: 'lecture',
        color: 'from-blue-600 to-indigo-600',
      },
      {
        id: '2',
        course: 'ICT6003',
        name: 'Advanced Database Systems',
        time: '11:00 AM - 12:30 PM',
        location: 'Computer Lab 2',
        instructor: 'Dr. James Chen',
        type: 'lab',
        color: 'from-purple-600 to-pink-600',
      },
    ],
  },
  {
    day: 'Tuesday',
    date: '2025-12-10',
    classes: [
      {
        id: '3',
        course: 'ICT6002',
        name: 'Research Methods',
        time: '2:00 PM - 3:30 PM',
        location: 'Room 205, Main Building',
        instructor: 'Prof. Sarah Mitchell',
        type: 'lecture',
        color: 'from-emerald-600 to-teal-600',
      },
    ],
  },
  {
    day: 'Wednesday',
    date: '2025-12-11',
    classes: [
      {
        id: '4',
        course: 'ICT6001',
        name: 'Applied Project',
        time: '9:00 AM - 11:00 AM',
        location: 'Room 301, Main Building',
        instructor: 'Dr. Ifeanyi Egwutuoha',
        type: 'lecture',
        color: 'from-blue-600 to-indigo-600',
      },
      {
        id: '5',
        course: 'ICT6004',
        name: 'Cloud Computing',
        time: '1:00 PM - 2:30 PM',
        location: 'Room 401, ICT Building',
        instructor: 'Dr. Amara Okonkwo',
        type: 'lecture',
        color: 'from-amber-500 to-orange-500',
      },
    ],
  },
  {
    day: 'Thursday',
    date: '2025-12-12',
    classes: [
      {
        id: '6',
        course: 'ICT6002',
        name: 'Research Methods',
        time: '2:00 PM - 3:30 PM',
        location: 'Room 205, Main Building',
        instructor: 'Prof. Sarah Mitchell',
        type: 'seminar',
        color: 'from-emerald-600 to-teal-600',
      },
    ],
  },
  {
    day: 'Friday',
    date: '2025-12-13',
    classes: [
      {
        id: '7',
        course: 'ICT6003',
        name: 'Advanced Database Systems',
        time: '11:00 AM - 12:30 PM',
        location: 'Computer Lab 2',
        instructor: 'Dr. James Chen',
        type: 'lab',
        color: 'from-purple-600 to-pink-600',
      },
      {
        id: '8',
        course: 'ICT6004',
        name: 'Cloud Computing',
        time: '1:00 PM - 2:30 PM',
        location: 'Room 401, ICT Building',
        instructor: 'Dr. Amara Okonkwo',
        type: 'lab',
        color: 'from-amber-500 to-orange-500',
      },
    ],
  },
]

const upcomingEvents = [
  {
    id: '1',
    title: 'Final Report Deadline',
    course: 'ICT6001',
    date: '2025-12-18',
    time: '11:59 PM',
    type: 'deadline',
    color: 'text-red-600 bg-red-50',
  },
  {
    id: '2',
    title: 'Research Presentation',
    course: 'ICT6002',
    date: '2025-12-22',
    time: '2:00 PM',
    type: 'presentation',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    id: '3',
    title: 'Database Final Exam',
    course: 'ICT6003',
    date: '2025-12-28',
    time: '10:00 AM',
    type: 'exam',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    id: '4',
    title: 'Cloud Computing Exam',
    course: 'ICT6004',
    date: '2025-12-30',
    time: '2:00 PM',
    type: 'exam',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    id: '5',
    title: 'Semester Break Begins',
    course: null,
    date: '2026-01-05',
    time: null,
    type: 'holiday',
    color: 'text-blue-600 bg-blue-50',
  },
]

const getClassTypeIcon = (type: string) => {
  switch (type) {
    case 'lecture':
      return <BookOpen className="h-4 w-4" />
    case 'lab':
      return <Video className="h-4 w-4" />
    case 'seminar':
      return <Users className="h-4 w-4" />
    default:
      return <BookOpen className="h-4 w-4" />
  }
}

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'deadline':
      return <AlertCircle className="h-4 w-4" />
    case 'exam':
      return <FileText className="h-4 w-4" />
    case 'presentation':
      return <GraduationCap className="h-4 w-4" />
    case 'holiday':
      return <Coffee className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export default function SchedulePage() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // Calculate total class hours this week
  const totalHours = weeklySchedule.reduce((acc, day) => {
    return acc + day.classes.reduce((classAcc, cls) => {
      const [start, end] = cls.time.split(' - ')
      const startHour = parseInt(start.split(':')[0]) + (start.includes('PM') && !start.includes('12') ? 12 : 0)
      const endHour = parseInt(end.split(':')[0]) + (end.includes('PM') && !end.includes('12') ? 12 : 0)
      const startMin = parseInt(start.split(':')[1])
      const endMin = parseInt(end.split(':')[1])
      return classAcc + ((endHour * 60 + endMin) - (startHour * 60 + startMin)) / 60
    }, 0)
  }, 0)

  const totalClasses = weeklySchedule.reduce((acc, day) => acc + day.classes.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Schedule</h1>
          <p className="text-slate-500 mt-1">Fall 2025 • Week of December 9 - 13, 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className={viewMode === 'week' ? 'bg-white shadow-sm' : ''}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
              className={viewMode === 'day' ? 'bg-white shadow-sm' : ''}
            >
              Day
            </Button>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Classes This Week</p>
                <p className="text-2xl font-bold text-blue-700">{totalClasses}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Hours of Instruction</p>
                <p className="text-2xl font-bold text-emerald-700">{totalHours.toFixed(1)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Upcoming Deadlines</p>
                <p className="text-2xl font-bold text-amber-700">{upcomingEvents.filter(e => e.type === 'deadline').length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Exams Scheduled</p>
                <p className="text-2xl font-bold text-purple-700">{upcomingEvents.filter(e => e.type === 'exam').length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous Week
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCurrentWeekOffset(0)}>
          Today
        </Button>
        <Button variant="outline" size="sm" onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}>
          Next Week
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Weekly Schedule */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            {weeklySchedule.map((day) => {
              const isToday = day.date === todayStr

              return (
                <Card key={day.day} className={`border-0 shadow-lg ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader className={`pb-3 ${isToday ? 'bg-blue-50' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          isToday ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          <span className="font-bold text-sm">{new Date(day.date).getDate()}</span>
                        </div>
                        <div>
                          <CardTitle className="text-base">{day.day}</CardTitle>
                          <p className="text-xs text-slate-500">
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      {isToday && (
                        <Badge className="bg-blue-600">Today</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {day.classes.length > 0 ? (
                      <div className="space-y-3">
                        {day.classes.map((cls) => (
                          <div key={cls.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className={`h-12 w-1 rounded-full bg-gradient-to-b ${cls.color}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="font-mono text-xs">{cls.course}</Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {getClassTypeIcon(cls.type)}
                                  <span className="ml-1">{cls.type}</span>
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-slate-900">{cls.name}</h4>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{cls.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{cls.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="h-4 w-4" />
                                  <span>{cls.instructor}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        <Coffee className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No classes scheduled</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className={`p-3 rounded-lg ${event.color}`}>
                  <div className="flex items-start gap-3">
                    {getEventTypeIcon(event.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      {event.course && (
                        <p className="text-xs opacity-75">{event.course}</p>
                      )}
                      <p className="text-xs mt-1">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {event.time && ` at ${event.time}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0 justify-start gap-2">
                  <Video className="h-4 w-4" />
                  Join Online Class
                </Button>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0 justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  Sync to Calendar
                </Button>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0 justify-start gap-2">
                  <Bell className="h-4 w-4" />
                  Set Reminders
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Today's Summary */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                Today&apos;s Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <span className="text-sm text-emerald-700">Next Class</span>
                  <span className="text-sm font-semibold text-emerald-800">Applied Project</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Starts in</span>
                  <span className="text-sm font-semibold text-slate-800">2h 30m</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Location</span>
                  <span className="text-sm font-semibold text-slate-800">Room 301</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
