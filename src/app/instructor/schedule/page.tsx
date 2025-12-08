'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Filter,
  MoreVertical,
  GraduationCap,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

// Days of the week
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// Mock schedule data
const weeklySchedule = [
  {
    id: '1',
    title: 'ICT6001 - Applied Project',
    type: 'lecture',
    day: 'Monday',
    startTime: '9:00 AM',
    endTime: '11:00 AM',
    location: 'Room 301, Building A',
    students: 28,
    color: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: '2',
    title: 'ICT6002 - Research Methods',
    type: 'lecture',
    day: 'Monday',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    location: 'Room 205, Building B',
    students: 24,
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    id: '3',
    title: 'Office Hours',
    type: 'office',
    day: 'Tuesday',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    location: 'Office 412',
    students: 0,
    color: 'from-purple-500 to-pink-500',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: '4',
    title: 'ICT6003 - Database Systems',
    type: 'lecture',
    day: 'Tuesday',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    location: 'Room 102, Building C',
    students: 22,
    color: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    id: '5',
    title: 'ICT6004 - Cloud Computing',
    type: 'lecture',
    day: 'Wednesday',
    startTime: '9:00 AM',
    endTime: '11:00 AM',
    location: 'Room 301, Building A',
    students: 30,
    color: 'from-rose-500 to-red-500',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
  {
    id: '6',
    title: 'Department Meeting',
    type: 'meeting',
    day: 'Wednesday',
    startTime: '3:00 PM',
    endTime: '4:00 PM',
    location: 'Conference Room 1',
    students: 0,
    color: 'from-slate-500 to-slate-600',
    bgLight: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
  {
    id: '7',
    title: 'ICT6001 - Tutorial Session',
    type: 'tutorial',
    day: 'Thursday',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    location: 'Lab 201',
    students: 15,
    color: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: '8',
    title: 'Research Supervision',
    type: 'supervision',
    day: 'Thursday',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    location: 'Office 412',
    students: 5,
    color: 'from-cyan-500 to-blue-500',
    bgLight: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  {
    id: '9',
    title: 'Office Hours',
    type: 'office',
    day: 'Friday',
    startTime: '9:00 AM',
    endTime: '11:00 AM',
    location: 'Office 412',
    students: 0,
    color: 'from-purple-500 to-pink-500',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: '10',
    title: 'ICT6002 - Workshop',
    type: 'workshop',
    day: 'Friday',
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    location: 'Lab 305',
    students: 24,
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
]

// Upcoming deadlines
const upcomingDeadlines = [
  { id: '1', title: 'ICT6001 Final Report Due', date: 'Dec 18, 2025', daysLeft: 10, type: 'deadline', course: 'ICT6001', priority: 'high' },
  { id: '2', title: 'ICT6003 Project Demo', date: 'Dec 15, 2025', daysLeft: 7, type: 'presentation', course: 'ICT6003', priority: 'high' },
  { id: '3', title: 'ICT6002 Essay Submission', date: 'Dec 20, 2025', daysLeft: 12, type: 'deadline', course: 'ICT6002', priority: 'medium' },
  { id: '4', title: 'Grade Submission Deadline', date: 'Dec 22, 2025', daysLeft: 14, type: 'admin', course: 'All', priority: 'medium' },
  { id: '5', title: 'ICT6004 Lab Assessment', date: 'Dec 25, 2025', daysLeft: 17, type: 'assessment', course: 'ICT6004', priority: 'low' },
]

// Schedule stats
const scheduleStats = [
  { label: 'Classes This Week', value: '8', icon: BookOpen, color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50' },
  { label: 'Office Hours', value: '4 hrs', icon: Clock, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-50 to-pink-50' },
  { label: 'Total Students', value: '104', icon: Users, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50' },
  { label: 'Meetings', value: '3', icon: Video, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50' },
]

export default function InstructorSchedulePage() {
  const { currentUser } = useAppStore()
  const [currentWeek, setCurrentWeek] = useState('Dec 9 - 13, 2025')
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')

  if (!currentUser) return null

  const getEventsByDay = (day: string) => {
    return weeklySchedule.filter(event => event.day === day)
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture': return <BookOpen className="h-4 w-4" />
      case 'tutorial': return <GraduationCap className="h-4 w-4" />
      case 'office': return <Clock className="h-4 w-4" />
      case 'meeting': return <Video className="h-4 w-4" />
      case 'supervision': return <Users className="h-4 w-4" />
      case 'workshop': return <FileText className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const getEventTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-700'
      case 'tutorial': return 'bg-indigo-100 text-indigo-700'
      case 'office': return 'bg-purple-100 text-purple-700'
      case 'meeting': return 'bg-slate-100 text-slate-700'
      case 'supervision': return 'bg-cyan-100 text-cyan-700'
      case 'workshop': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const todaysEvents = weeklySchedule.filter(e => e.day === 'Monday')

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Schedule</h1>
          <p className="text-slate-500 mt-1">Manage your teaching schedule and appointments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Set Reminder
          </Button>
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {scheduleStats.map((stat, index) => (
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

      {/* Today's Schedule - Full Width */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              Today&apos;s Schedule
              <Badge className="bg-blue-100 text-blue-700 ml-2">Monday, Dec 9</Badge>
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todaysEvents.map((event) => (
              <div
                key={event.id}
                className={`p-6 rounded-2xl border-2 ${event.borderColor} ${event.bgLight} hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge className={`${getEventTypeBadgeColor(event.type)} px-3 py-1`}>
                    {getEventTypeIcon(event.type)}
                    <span className="ml-2 capitalize font-medium">{event.type}</span>
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-3">{event.title}</h3>
                <div className="space-y-2 text-slate-600">
                  <p className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <span className="font-medium">{event.startTime} - {event.endTime}</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span>{event.location}</span>
                  </p>
                  {event.students > 0 && (
                    <p className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-slate-400" />
                      <span>{event.students} students enrolled</span>
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <Button size="sm" className={`w-full bg-gradient-to-r ${event.color} hover:opacity-90 text-white`}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            {todaysEvents.length === 0 && (
              <div className="col-span-full p-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Classes Today</h3>
                <p className="text-slate-500">Enjoy your free day or catch up on grading!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Week Navigation */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => setCurrentWeek('Dec 2 - 6, 2025')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{currentWeek}</p>
                <p className="text-slate-500">Trimester 3, 2025</p>
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => setCurrentWeek('Dec 16 - 20, 2025')}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex gap-3">
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                onClick={() => setViewMode('week')}
                className={viewMode === 'week' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Week View
              </Button>
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                onClick={() => setViewMode('day')}
                className={viewMode === 'day' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Day View
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule - Full Width */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Day Headers */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`text-center p-4 rounded-xl ${
                  index === 0 ? 'bg-emerald-100 border-2 border-emerald-300' : 'bg-slate-100'
                }`}
              >
                <p className={`text-lg font-bold ${index === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>{day}</p>
                <p className={`text-sm ${index === 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {getEventsByDay(day).length} events
                </p>
                {index === 0 && <Badge className="mt-2 bg-emerald-600 text-white">Today</Badge>}
              </div>
            ))}
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-5 gap-4">
            {weekDays.map((day) => (
              <div key={day} className="space-y-4 min-h-[400px]">
                {getEventsByDay(day).length > 0 ? (
                  getEventsByDay(day).map((event) => (
                    <div
                      key={event.id}
                      className={`p-5 rounded-2xl text-white bg-gradient-to-br ${event.color} shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-white/25 text-white text-xs px-2 py-1">
                          {getEventTypeIcon(event.type)}
                          <span className="ml-1 capitalize">{event.type}</span>
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/20">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-bold text-base mb-3 leading-tight">{event.title}</p>
                      <div className="text-sm text-white/90 space-y-2">
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {event.startTime} - {event.endTime}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </p>
                        {event.students > 0 && (
                          <p className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {event.students} students
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 h-full flex flex-col items-center justify-center">
                    <Calendar className="h-10 w-10 mb-2 opacity-50" />
                    <p className="font-medium">No events</p>
                    <p className="text-sm">Click to add</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines - Full Width */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              Upcoming Deadlines
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              View Calendar <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className={`p-5 rounded-2xl border-2 transition-all hover:shadow-lg ${
                  deadline.priority === 'high'
                    ? 'bg-red-50 border-red-200'
                    : deadline.priority === 'medium'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="outline"
                    className={`font-mono text-xs ${
                      deadline.priority === 'high' ? 'border-red-300 text-red-700' : ''
                    }`}
                  >
                    {deadline.course}
                  </Badge>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    deadline.daysLeft <= 7
                      ? 'bg-red-100 text-red-700'
                      : deadline.daysLeft <= 14
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {deadline.daysLeft} days
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{deadline.title}</h3>
                <p className={`text-sm font-medium ${
                  deadline.priority === 'high' ? 'text-red-600' : 'text-slate-600'
                }`}>
                  {deadline.date}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Full Width */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-2xl mb-2">Quick Actions</h3>
              <p className="text-white/80">Manage your schedule efficiently</p>
            </div>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-3 px-6">
                <Plus className="h-5 w-5" />
                Schedule Office Hours
              </Button>
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-3 px-6">
                <Video className="h-5 w-5" />
                Create Online Meeting
              </Button>
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-3 px-6">
                <Calendar className="h-5 w-5" />
                Sync with Calendar
              </Button>
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-white/90 gap-3 px-6">
                <Bell className="h-5 w-5" />
                Set Reminders
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
