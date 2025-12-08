'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  AlertTriangle,
  MessageSquare,
  FileText,
  CheckCircle2,
  Calendar,
  GraduationCap,
  ChevronRight,
  MailOpen,
  Filter,
} from 'lucide-react'

// Mock notifications data
const notificationsData = [
  {
    id: '1',
    type: 'urgent',
    category: 'assignment',
    title: 'Assignment Due Today!',
    message: 'Your "Final Report - ICT6001 Applied Project" is due today at 11:59 PM. Please ensure you submit before the deadline to avoid late penalties.',
    sender: null,
    time: '2 hours ago',
    date: 'Today',
    read: false,
    actionUrl: '/student/assignments',
    actionLabel: 'Submit Now',
  },
  {
    id: '2',
    type: 'urgent',
    category: 'message',
    title: 'Message from Dr. Ifeanyi Egwutuoha',
    message: 'Dear Bernard, I\'ve reviewed your draft submission for the Applied Project. Please see my feedback and make the necessary revisions before the final submission. I\'m available during office hours tomorrow if you need clarification. Best regards, Dr. Egwutuoha',
    sender: {
      name: 'Dr. Ifeanyi Egwutuoha',
      role: 'Course Coordinator - ICT6001',
      avatar: 'IE',
    },
    time: '5 hours ago',
    date: 'Today',
    read: false,
    actionUrl: '/student/ai-assistant',
    actionLabel: 'View & Reply',
  },
  {
    id: '3',
    type: 'warning',
    category: 'deadline',
    title: 'Upcoming Deadline: Research Presentation',
    message: 'Your research presentation for ICT6002 Research Methods is due in 3 days (December 11, 2024). Make sure to upload your slides and any supporting materials.',
    sender: null,
    time: '1 day ago',
    date: 'Yesterday',
    read: false,
    actionUrl: '/student/assignments',
    actionLabel: 'View Details',
  },
  {
    id: '4',
    type: 'info',
    category: 'grade',
    title: 'New Grade Posted',
    message: 'Your grade for "Data Analytics Quiz #3" has been posted. You achieved a High Distinction (HD) with a score of 92/100. Great work!',
    sender: null,
    time: '2 days ago',
    date: 'Dec 6, 2024',
    read: true,
    actionUrl: '/student/grades',
    actionLabel: 'View Grade',
  },
  {
    id: '5',
    type: 'info',
    category: 'announcement',
    title: 'Campus Library Extended Hours',
    message: 'The APIC campus library will have extended hours during the exam period (Dec 10-20). Open from 7:00 AM to 11:00 PM daily, including weekends.',
    sender: null,
    time: '3 days ago',
    date: 'Dec 5, 2024',
    read: true,
    actionUrl: null,
    actionLabel: null,
  },
]

function getNotificationIcon(type: string, category: string) {
  if (category === 'message') return MessageSquare
  if (category === 'assignment') return FileText
  if (category === 'deadline') return Calendar
  if (category === 'grade') return GraduationCap
  if (type === 'urgent') return AlertTriangle
  return Bell
}

function getNotificationColor(type: string) {
  switch (type) {
    case 'urgent':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        badge: 'bg-red-100 text-red-700',
      }
    case 'warning':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-700',
      }
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700',
      }
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter((n) => !n.read).length
  const urgentCount = notifications.filter((n) => n.type === 'urgent' && !n.read).length

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">
            You have <span className="font-semibold text-blue-600">{unreadCount} unread</span> notifications
            {urgentCount > 0 && (
              <span className="text-red-600"> including <span className="font-semibold">{urgentCount} urgent</span></span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className={filter === 'unread' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            {filter === 'all' ? 'Show Unread' : 'Show All'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Urgent Alerts Banner */}
      {urgentCount > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-rose-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 text-white">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">Urgent Attention Required</p>
                <p className="text-red-100 text-sm">
                  You have {urgentCount} urgent notification{urgentCount > 1 ? 's' : ''} that require{urgentCount === 1 ? 's' : ''} immediate attention
                </p>
              </div>
              <Button variant="secondary" className="bg-white hover:bg-slate-100 text-red-600">
                View Urgent
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type, notification.category)
          const colors = getNotificationColor(notification.type)

          return (
            <Card
              key={notification.id}
              className={`border-0 shadow-lg transition-all duration-200 hover:shadow-xl ${
                !notification.read ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <CardContent className="p-0">
                <div className={`flex gap-4 p-5 ${!notification.read ? colors.bg : 'bg-white'} rounded-xl`}>
                  {/* Icon */}
                  <div className={`h-12 w-12 rounded-xl ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${colors.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        {!notification.read && (
                          <span className="h-2 w-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className={`text-xs ${colors.badge}`}>
                          {notification.type === 'urgent' ? 'Urgent' : notification.type === 'warning' ? 'Attention' : 'Info'}
                        </Badge>
                        <span className="text-xs text-slate-400">{notification.time}</span>
                      </div>
                    </div>

                    {/* Sender Info (for messages) */}
                    {notification.sender && (
                      <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg border border-slate-100">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                          {notification.sender.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{notification.sender.name}</p>
                          <p className="text-xs text-slate-500">{notification.sender.role}</p>
                        </div>
                      </div>
                    )}

                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {notification.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {notification.actionUrl && notification.actionLabel && (
                        <Button
                          size="sm"
                          className={
                            notification.type === 'urgent'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }
                        >
                          {notification.actionLabel}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <MailOpen className="h-4 w-4 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Notifications</h3>
            <p className="text-slate-500">
              {filter === 'unread' ? "You're all caught up! No unread notifications." : 'You have no notifications yet.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Notification Tips</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>- Red urgent notifications require immediate action</li>
                <li>- Amber warnings indicate upcoming deadlines</li>
                <li>- Blue notifications are general information</li>
                <li>- Messages from lecturers appear with their profile</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
