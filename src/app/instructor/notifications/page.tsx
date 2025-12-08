'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  FileText,
  User,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Settings,
  Trash2,
  Archive,
  Search,
  MoreVertical,
  GraduationCap,
  Check,
  X,
} from 'lucide-react'

// Mock notifications
const notifications = [
  {
    id: '1',
    type: 'submission',
    title: 'New Submission Received',
    message: 'Emmanuel Alisetti submitted "Final Report - Applied Project" for ICT6001',
    time: '10 minutes ago',
    read: false,
    priority: 'normal',
    icon: FileText,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: '2',
    type: 'integrity',
    title: 'Integrity Alert',
    message: 'A submission in ICT6002 has been flagged with 78% similarity score',
    time: '25 minutes ago',
    read: false,
    priority: 'high',
    icon: AlertTriangle,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
  },
  {
    id: '3',
    type: 'message',
    title: 'Student Message',
    message: 'Bernard Adjei-Yeboah sent you a message about the assignment deadline',
    time: '1 hour ago',
    read: false,
    priority: 'normal',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
  },
  {
    id: '4',
    type: 'deadline',
    title: 'Grading Deadline Reminder',
    message: 'ICT6001 final grades are due in 3 days (Dec 22, 2025)',
    time: '2 hours ago',
    read: false,
    priority: 'high',
    icon: Calendar,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
  },
  {
    id: '5',
    type: 'submission',
    title: 'Multiple Submissions',
    message: '5 new submissions received for ICT6003 Database Design Project',
    time: '3 hours ago',
    read: true,
    priority: 'normal',
    icon: FileText,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: '6',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Dec 12, 2025 from 2:00 AM - 4:00 AM AEDT',
    time: '5 hours ago',
    read: true,
    priority: 'low',
    icon: Settings,
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
  },
  {
    id: '7',
    type: 'student',
    title: 'Student at Risk',
    message: 'Sarah Chen has missed 3 consecutive submissions in ICT6004',
    time: '1 day ago',
    read: true,
    priority: 'high',
    icon: User,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
  },
  {
    id: '8',
    type: 'grade',
    title: 'Grade Published',
    message: 'Grades for ICT6002 Research Methodology Essay have been published',
    time: '2 days ago',
    read: true,
    priority: 'normal',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
  },
]

// Notification stats
const notificationStats = [
  { label: 'Unread', value: '4', icon: Bell, color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50' },
  { label: 'Submissions', value: '12', icon: FileText, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50' },
  { label: 'Alerts', value: '3', icon: AlertTriangle, color: 'from-red-500 to-rose-500', bgColor: 'from-red-50 to-rose-50' },
  { label: 'Messages', value: '5', icon: MessageSquare, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-50 to-pink-50' },
]

export default function InstructorNotificationsPage() {
  const { currentUser } = useAppStore()
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  if (!currentUser) return null

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'unread' && !notification.read) ||
      notification.type === filterType
    return matchesSearch && matchesFilter
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    }
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated with your teaching activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Mark All Read
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {notificationStats.map((stat, index) => (
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

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
                className={filterType === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                All
              </Button>
              <Button
                variant={filterType === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('unread')}
                className={filterType === 'unread' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filterType === 'submission' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('submission')}
                className={filterType === 'submission' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Submissions
              </Button>
              <Button
                variant={filterType === 'integrity' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('integrity')}
                className={filterType === 'integrity' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Alerts
              </Button>
              <Button
                variant={filterType === 'message' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('message')}
                className={filterType === 'message' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                Messages
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white">{selectedNotifications.length} selected</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1">
                  <Check className="h-4 w-4" />
                  Mark as Read
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1">
                  <Archive className="h-4 w-4" />
                  Archive
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0" onClick={() => setSelectedNotifications([])}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-600" />
              All Notifications
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={selectAll}>
                {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                  !notification.read
                    ? `${notification.bgColor} border-${notification.type === 'integrity' ? 'red' : 'blue'}-200`
                    : 'bg-white border-slate-200'
                } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-emerald-500' : ''}`}
                onClick={() => toggleSelectNotification(notification.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <div className={`h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    selectedNotifications.includes(notification.id)
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'border-slate-300'
                  }`}>
                    {selectedNotifications.includes(notification.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${notification.color} flex-shrink-0`}>
                    <notification.icon className="h-5 w-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                          {notification.priority === 'high' && (
                            <Badge className="bg-red-100 text-red-700 text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${!notification.read ? 'text-slate-600' : 'text-slate-500'}`}>
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-slate-400">{notification.time}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No notifications</h3>
                <p className="text-slate-500">You&apos;re all caught up!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* High Priority */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.filter((n) => n.priority === 'high').slice(0, 3).map((notification) => (
                <div key={notification.id} className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="font-medium text-red-900 text-sm">{notification.title}</p>
                  <p className="text-xs text-red-600 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.filter((n) => n.type === 'submission').slice(0, 3).map((notification) => (
                <div key={notification.id} className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="font-medium text-blue-900 text-sm">{notification.title}</p>
                  <p className="text-xs text-blue-600 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.filter((n) => n.type === 'message').slice(0, 3).map((notification) => (
                <div key={notification.id} className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="font-medium text-purple-900 text-sm">{notification.title}</p>
                  <p className="text-xs text-purple-600 mt-1">{notification.time}</p>
                </div>
              ))}
              {notifications.filter((n) => n.type === 'message').length === 0 && (
                <div className="text-center py-4 text-slate-400 text-sm">
                  No messages
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
