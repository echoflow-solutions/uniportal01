'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Settings,
  User,
  Bell,
  Shield,
  Lock,
  Palette,
  Globe,
  Mail,
  GraduationCap,
  Calendar,
  Camera,
  Save,
  Key,
  Monitor,
  Smartphone,
  Laptop,
  LogOut,
  AlertTriangle,
  Link,
  FileText,
  Clock,
} from 'lucide-react'

// Settings sections
const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'teaching', label: 'Teaching', icon: GraduationCap },
  { id: 'integrations', label: 'Integrations', icon: Link },
]

// Active sessions
const activeSessions = [
  { id: '1', device: 'MacBook Pro', location: 'Sydney, Australia', lastActive: 'Now', icon: Laptop, current: true },
  { id: '2', device: 'iPhone 15', location: 'Sydney, Australia', lastActive: '2 hours ago', icon: Smartphone, current: false },
  { id: '3', device: 'Windows PC', location: 'Melbourne, Australia', lastActive: '3 days ago', icon: Monitor, current: false },
]

export default function InstructorSettingsPage() {
  const { currentUser } = useAppStore()
  const [activeSection, setActiveSection] = useState('profile')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [submissionAlerts, setSubmissionAlerts] = useState(true)
  const [gradingReminders, setGradingReminders] = useState(true)
  const [integrityAlerts, setIntegrityAlerts] = useState(true)
  const [studentMessages, setStudentMessages] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [compactView, setCompactView] = useState(false)
  const [showActivityStatus, setShowActivityStatus] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [autoGradeAssist, setAutoGradeAssist] = useState(true)
  const [plagiarismCheck, setPlagiarismCheck] = useState(true)

  if (!currentUser) return null

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account preferences and configurations</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="border-0 shadow-lg h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <>
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        IE
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all">
                        <Camera className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Dr. Ifeanyi Egwutuoha</h3>
                      <p className="text-slate-500">Senior Lecturer</p>
                      <Badge className="mt-2 bg-emerald-100 text-emerald-700">Active</Badge>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                      <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                        <option>Dr.</option>
                        <option>Prof.</option>
                        <option>A/Prof.</option>
                        <option>Mr.</option>
                        <option>Ms.</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Ifeanyi Egwutuoha"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue=""
                        placeholder="Enter email address"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+61 2 9000 0000"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                      <input
                        type="text"
                        defaultValue=""
                        placeholder="Enter department"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Office Location</label>
                      <input
                        type="text"
                        defaultValue=""
                        placeholder="Enter office location"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                    <textarea
                      rows={3}
                      defaultValue=""
                      placeholder="Enter bio"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Academic Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Staff ID</label>
                      <input
                        type="text"
                        defaultValue="STF-2024-0001"
                        disabled
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                      <input
                        type="text"
                        defaultValue="Senior Lecturer"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Research Areas</label>
                      <input
                        type="text"
                        defaultValue="Cloud Computing, Database Systems, Machine Learning"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Office Hours</label>
                      <input
                        type="text"
                        defaultValue="Tue & Fri: 10:00 AM - 12:00 PM"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Account Section */}
          {activeSection === 'account' && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-600" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input
                      type="text"
                      defaultValue="i.egwutuoha"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>English (Australia)</option>
                      <option>English (UK)</option>
                      <option>English (US)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Australia/Sydney (AEDT)</option>
                      <option>Australia/Melbourne</option>
                      <option>Australia/Brisbane</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date Format</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-4">Danger Zone</h4>
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-700">Deactivate Account</p>
                        <p className="text-sm text-red-600">Temporarily disable your account</p>
                      </div>
                      <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100">
                        Deactivate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-emerald-600" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Notifications */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">General</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">Email Notifications</p>
                          <p className="text-sm text-slate-500">Receive updates via email</p>
                        </div>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">Push Notifications</p>
                          <p className="text-sm text-slate-500">Receive push notifications</p>
                        </div>
                      </div>
                      <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                    </div>
                  </div>
                </div>

                {/* Teaching Notifications */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Teaching</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">New Submissions</p>
                          <p className="text-sm text-slate-500">Alert when students submit work</p>
                        </div>
                      </div>
                      <Switch checked={submissionAlerts} onCheckedChange={setSubmissionAlerts} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">Grading Reminders</p>
                          <p className="text-sm text-slate-500">Remind about pending grades</p>
                        </div>
                      </div>
                      <Switch checked={gradingReminders} onCheckedChange={setGradingReminders} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">Integrity Alerts</p>
                          <p className="text-sm text-slate-500">Flag potential integrity issues</p>
                        </div>
                      </div>
                      <Switch checked={integrityAlerts} onCheckedChange={setIntegrityAlerts} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">Student Messages</p>
                          <p className="text-sm text-slate-500">Notify when students message you</p>
                        </div>
                      </div>
                      <Switch checked={studentMessages} onCheckedChange={setStudentMessages} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Show Activity Status</p>
                    <p className="text-sm text-slate-500">Let students see when you&apos;re online</p>
                  </div>
                  <Switch checked={showActivityStatus} onCheckedChange={setShowActivityStatus} />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Profile Visibility</p>
                    <p className="text-sm text-slate-500">Who can view your profile</p>
                  </div>
                  <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    <option>All Students</option>
                    <option>My Students Only</option>
                    <option>Staff Only</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Office Hours Visibility</p>
                    <p className="text-sm text-slate-500">Show office hours on profile</p>
                  </div>
                  <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    <option>Public</option>
                    <option>Students Only</option>
                    <option>Hidden</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="h-5 w-5 text-emerald-600" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Dark Mode</p>
                    <p className="text-sm text-slate-500">Use dark theme</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Compact View</p>
                    <p className="text-sm text-slate-500">Reduce spacing in lists</p>
                  </div>
                  <Switch checked={compactView} onCheckedChange={setCompactView} />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Accent Color</p>
                    <p className="text-sm text-slate-500">Primary theme color</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-emerald-500 ring-2 ring-emerald-500 ring-offset-2" />
                    <button className="w-8 h-8 rounded-full bg-blue-500" />
                    <button className="w-8 h-8 rounded-full bg-purple-500" />
                    <button className="w-8 h-8 rounded-full bg-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <>
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Lock className="h-5 w-5 text-emerald-600" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Key className="h-4 w-4" />
                      Change Password
                    </Button>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-500">Add an extra layer of security</p>
                      </div>
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-blue-600" />
                    Active Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeSessions.map((session) => (
                      <div key={session.id} className={`p-4 rounded-xl border ${session.current ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <session.icon className={`h-5 w-5 ${session.current ? 'text-emerald-600' : 'text-slate-500'}`} />
                            <div>
                              <p className="font-medium text-slate-900 flex items-center gap-2">
                                {session.device}
                                {session.current && <Badge className="bg-emerald-100 text-emerald-700 text-xs">Current</Badge>}
                              </p>
                              <p className="text-sm text-slate-500">{session.location} • {session.lastActive}</p>
                            </div>
                          </div>
                          {!session.current && (
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <LogOut className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Teaching Section */}
          {activeSection === 'teaching' && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                  Teaching Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">AI Grading Assistance</p>
                    <p className="text-sm text-slate-500">Use AI to assist with grading suggestions</p>
                  </div>
                  <Switch checked={autoGradeAssist} onCheckedChange={setAutoGradeAssist} />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Auto Plagiarism Check</p>
                    <p className="text-sm text-slate-500">Automatically check submissions for plagiarism</p>
                  </div>
                  <Switch checked={plagiarismCheck} onCheckedChange={setPlagiarismCheck} />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Default Grading Scale</p>
                    <p className="text-sm text-slate-500">Australian HD/D/C/P/F scale</p>
                  </div>
                  <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    <option>Australian (HD-F)</option>
                    <option>Percentage</option>
                    <option>Letter (A-F)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Late Submission Policy</p>
                    <p className="text-sm text-slate-500">How to handle late submissions</p>
                  </div>
                  <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    <option>Accept with Penalty</option>
                    <option>Accept without Penalty</option>
                    <option>Reject</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Section */}
          {activeSection === 'integrations' && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Link className="h-5 w-5 text-emerald-600" />
                  Connected Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Google Calendar</p>
                        <p className="text-sm text-slate-500">Sync your schedule</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Globe className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Microsoft Teams</p>
                        <p className="text-sm text-slate-500">Video conferencing</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Turnitin</p>
                        <p className="text-sm text-slate-500">Plagiarism detection</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
