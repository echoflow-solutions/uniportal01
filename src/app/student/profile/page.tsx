'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Lock,
  Eye,
  Globe,
  Moon,
  Sun,
  Laptop,
  Palette,
  Languages,
  Accessibility,
  CreditCard,
  GraduationCap,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Edit3,
  Save,
  ChevronRight,
  Smartphone,
  Key,
  History,
  LogOut,
  Monitor,
  Trash2,
  Download,
  Upload,
  Link2,
  ExternalLink,
  BookOpen,
  FileText,
  Fingerprint,
  ShieldCheck,
  UserCircle,
  Settings,
  HelpCircle,
  MessageSquare,
} from 'lucide-react'

// Mock user data
const userData = {
  id: 'STU-2024-0892',
  name: 'Bernard Adjei',
  email: 'bernard.adjei@student.apic.edu.au',
  phone: '+61 4XX XXX XXX',
  dateOfBirth: '1998-05-15',
  address: '123 University Street, Sydney NSW 2000',
  enrollmentDate: '2024-02-15',
  program: 'Master of Information Technology',
  faculty: 'Faculty of Computing and Information Technology',
  campus: 'Sydney Campus',
  expectedGraduation: '2025-12-15',
  studentType: 'Full-time',
  citizenship: 'International',
  emergencyContact: {
    name: 'Grace Adjei',
    relationship: 'Mother',
    phone: '+233 XX XXX XXXX',
  },
}

// Settings sections
const settingsSections = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'account', label: 'Account', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'academic', label: 'Academic', icon: GraduationCap },
  { id: 'connected', label: 'Connected Apps', icon: Link2 },
]

// Login history mock data
const loginHistory = [
  { id: 1, device: 'MacBook Pro', location: 'Sydney, NSW', time: '2 minutes ago', current: true, browser: 'Chrome 120' },
  { id: 2, device: 'iPhone 15 Pro', location: 'Sydney, NSW', time: '3 hours ago', current: false, browser: 'Safari Mobile' },
  { id: 3, device: 'Windows PC', location: 'Sydney, NSW', time: '2 days ago', current: false, browser: 'Firefox 121' },
]

// Connected apps mock data
const connectedApps = [
  { id: 1, name: 'Google Workspace', icon: '🔵', connected: true, lastUsed: '1 hour ago', permissions: ['Email', 'Calendar', 'Drive'] },
  { id: 2, name: 'Microsoft 365', icon: '🟠', connected: true, lastUsed: '3 days ago', permissions: ['OneDrive', 'Teams'] },
  { id: 3, name: 'Library Services', icon: '📚', connected: true, lastUsed: '1 week ago', permissions: ['Borrowing', 'Resources'] },
  { id: 4, name: 'Canvas LMS', icon: '🎓', connected: false, lastUsed: 'Never', permissions: [] },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function ProfileSettingsPage() {
  const { currentUser } = useAppStore()
  const [activeSection, setActiveSection] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailAssignments: true,
    emailGrades: true,
    emailAnnouncements: true,
    emailDeadlines: true,
    pushEnabled: true,
    pushAssignments: true,
    pushGrades: false,
    smsEnabled: false,
    smsUrgent: false,
    digestFrequency: 'daily',
  })

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'classmates',
    showOnlineStatus: true,
    showActivityStatus: true,
    allowMessaging: true,
    showEnrollments: false,
    dataSharing: false,
  })

  // Appearance settings state
  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium',
    language: 'en-AU',
    reducedMotion: false,
    highContrast: false,
  })

  // Security settings state
  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    twoFactorMethod: 'authenticator',
    loginAlerts: true,
    sessionTimeout: '30',
  })

  // Academic preferences state
  const [academic, setAcademic] = useState({
    defaultCalendarView: 'week',
    reminderTiming: '1day',
    gradeDisplayFormat: 'both',
    showGpaInHeader: true,
    autoEnrollTutorials: true,
  })

  const displayName = currentUser?.name || userData.name

  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-32 relative">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        </div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
            <div className="relative group">
              <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl">
                {getInitials(displayName)}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4 w-4 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 sm:pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{displayName}</h2>
                  <p className="text-slate-500">{userData.program}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active Student
                  </Badge>
                  <Button
                    variant={isEditing ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Personal Information
          </CardTitle>
          <CardDescription>Your basic personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Full Name</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <User className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{displayName}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Student ID</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-slate-400" />
                <span className="font-medium font-mono">{userData.id}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Email Address</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{userData.email}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Phone Number</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{userData.phone}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Date of Birth</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Calendar className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{new Date(userData.dateOfBirth).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Address</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{userData.address}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            Academic Information
          </CardTitle>
          <CardDescription>Your enrollment and program details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Program</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{userData.program}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Faculty</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Building2 className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{userData.faculty}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Campus</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{userData.campus}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Enrollment Date</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Calendar className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{new Date(userData.enrollmentDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Student Type</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <User className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{userData.studentType} | {userData.citizenship}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Expected Graduation</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <GraduationCap className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{new Date(userData.expectedGraduation).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Emergency Contact
          </CardTitle>
          <CardDescription>Contact person in case of emergency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Contact Name</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <User className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{userData.emergencyContact.name}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Relationship</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <User className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{userData.emergencyContact.relationship}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Phone Number</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="h-5 w-5 text-slate-400" />
                <span className="font-medium">{userData.emergencyContact.phone}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAccountSection = () => (
    <div className="space-y-6">
      {/* Email Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Email Settings
          </CardTitle>
          <CardDescription>Manage your email preferences and forwarding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium">Primary Email</p>
              <p className="text-sm text-slate-500">{userData.email}</p>
            </div>
            <Badge className="bg-green-100 text-green-700">Verified</Badge>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Email Forwarding</p>
              <p className="text-sm text-slate-500">Forward university emails to personal account</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" />
            Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium">Password Strength</p>
              <p className="text-sm text-slate-500">Last changed 45 days ago</p>
            </div>
            <Badge className="bg-green-100 text-green-700">Strong</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={85} className="flex-1 h-2" />
            <span className="text-sm text-slate-500">85%</span>
          </div>
          <Button variant="outline" className="w-full gap-2">
            <Key className="h-4 w-4" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-500" />
            Account Actions
          </CardTitle>
          <CardDescription>Export data or manage your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3">
            <Download className="h-4 w-4" />
            Download My Data
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Upload className="h-4 w-4" />
            Import Settings
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            Request Account Deletion
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Email Notifications
          </CardTitle>
          <CardDescription>Choose what email notifications you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'emailAssignments', label: 'Assignment Updates', desc: 'New assignments and submission confirmations' },
            { key: 'emailGrades', label: 'Grade Notifications', desc: 'When grades are posted for your submissions' },
            { key: 'emailAnnouncements', label: 'Course Announcements', desc: 'Important updates from your instructors' },
            { key: 'emailDeadlines', label: 'Deadline Reminders', desc: 'Reminders before assignment due dates' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications] as boolean}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-indigo-500" />
            Push Notifications
          </CardTitle>
          <CardDescription>Receive instant notifications on your devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="font-medium">Enable Push Notifications</p>
                <p className="text-sm text-slate-500">Receive notifications on this device</p>
              </div>
            </div>
            <Switch
              checked={notifications.pushEnabled}
              onCheckedChange={(checked) => setNotifications({ ...notifications, pushEnabled: checked })}
            />
          </div>
          {notifications.pushEnabled && (
            <div className="pl-4 space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Assignment reminders</span>
                <Switch
                  checked={notifications.pushAssignments}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushAssignments: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Grade notifications</span>
                <Switch
                  checked={notifications.pushGrades}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushGrades: checked })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Digest Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-500" />
            Email Digest
          </CardTitle>
          <CardDescription>How often would you like to receive summary emails?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {['realtime', 'daily', 'weekly'].map((freq) => (
              <button
                key={freq}
                onClick={() => setNotifications({ ...notifications, digestFrequency: freq })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  notifications.digestFrequency === freq
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-medium capitalize">{freq === 'realtime' ? 'Real-time' : freq}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {freq === 'realtime' && 'Instant notifications'}
                  {freq === 'daily' && 'Once per day'}
                  {freq === 'weekly' && 'Weekly summary'}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPrivacySection = () => (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            Profile Visibility
          </CardTitle>
          <CardDescription>Control who can see your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {['public', 'classmates', 'private'].map((visibility) => (
              <button
                key={visibility}
                onClick={() => setPrivacy({ ...privacy, profileVisibility: visibility })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  privacy.profileVisibility === visibility
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-medium capitalize">{visibility}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {visibility === 'public' && 'Anyone at APIC'}
                  {visibility === 'classmates' && 'Only classmates'}
                  {visibility === 'private' && 'Only you'}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-500" />
            Activity & Status
          </CardTitle>
          <CardDescription>Manage your online presence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'showOnlineStatus', label: 'Show Online Status', desc: 'Let others see when you are online' },
            { key: 'showActivityStatus', label: 'Show Activity', desc: 'Display your recent activity to others' },
            { key: 'allowMessaging', label: 'Allow Direct Messages', desc: 'Let classmates and staff message you' },
            { key: 'showEnrollments', label: 'Show Enrollments', desc: 'Display your enrolled courses publicly' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <Switch
                checked={privacy[item.key as keyof typeof privacy] as boolean}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, [item.key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            Data & Analytics
          </CardTitle>
          <CardDescription>Control how your data is used</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Anonymous Analytics</p>
              <p className="text-sm text-slate-500">Help improve the platform with anonymous usage data</p>
            </div>
            <Switch
              checked={privacy.dataSharing}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
            />
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Your Data is Protected</p>
                <p className="text-sm text-blue-700 mt-1">
                  We comply with Australian Privacy Principles and never sell your personal data to third parties.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      {/* Theme */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-500" />
            Theme
          </CardTitle>
          <CardDescription>Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
              { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
              { id: 'system', label: 'System', icon: Laptop, desc: 'Match device settings' },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => setAppearance({ ...appearance, theme: theme.id })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  appearance.theme === theme.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-lg mx-auto w-fit ${
                  theme.id === 'light' ? 'bg-amber-100' : theme.id === 'dark' ? 'bg-slate-800' : 'bg-gradient-to-r from-amber-100 to-slate-800'
                }`}>
                  <theme.icon className={`h-6 w-6 ${theme.id === 'dark' ? 'text-white' : 'text-slate-700'}`} />
                </div>
                <p className="font-medium mt-3">{theme.label}</p>
                <p className="text-xs text-slate-500">{theme.desc}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Font Size
          </CardTitle>
          <CardDescription>Adjust text size for better readability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {['small', 'medium', 'large', 'xlarge'].map((size) => (
              <button
                key={size}
                onClick={() => setAppearance({ ...appearance, fontSize: size })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  appearance.fontSize === size
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className={`font-medium ${
                  size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : size === 'large' ? 'text-base' : 'text-lg'
                }`}>
                  Aa
                </p>
                <p className="text-xs text-slate-500 mt-1 capitalize">{size === 'xlarge' ? 'X-Large' : size}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Languages className="h-5 w-5 text-emerald-500" />
            Language & Region
          </CardTitle>
          <CardDescription>Set your preferred language and date format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-slate-400" />
              <div>
                <p className="font-medium">English (Australia)</p>
                <p className="text-sm text-slate-500">Date format: DD/MM/YYYY</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-indigo-500" />
            Accessibility
          </CardTitle>
          <CardDescription>Make the platform more accessible for your needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Reduced Motion</p>
              <p className="text-sm text-slate-500">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={appearance.reducedMotion}
              onCheckedChange={(checked) => setAppearance({ ...appearance, reducedMotion: checked })}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">High Contrast</p>
              <p className="text-sm text-slate-500">Increase color contrast for better visibility</p>
            </div>
            <Switch
              checked={appearance.highContrast}
              onCheckedChange={(checked) => setAppearance({ ...appearance, highContrast: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSecuritySection = () => (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-emerald-500" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-900">2FA is Enabled</p>
                <p className="text-sm text-emerald-700">Using Authenticator App</p>
              </div>
            </div>
            <Switch
              checked={security.twoFactorEnabled}
              onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
            />
          </div>
          {security.twoFactorEnabled && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'authenticator', label: 'Authenticator App', desc: 'Google/Microsoft Authenticator' },
                { id: 'sms', label: 'SMS Code', desc: 'Text message to phone' },
                { id: 'email', label: 'Email Code', desc: 'Code sent to email' },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSecurity({ ...security, twoFactorMethod: method.id })}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    security.twoFactorMethod === method.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-medium text-sm">{method.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{method.desc}</p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login Alerts */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            Security Alerts
          </CardTitle>
          <CardDescription>Get notified about suspicious account activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Login Alerts</p>
              <p className="text-sm text-slate-500">Email me when a new device logs in</p>
            </div>
            <Switch
              checked={security.loginAlerts}
              onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-slate-500">Automatically log out after inactivity</p>
            </div>
            <select
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="h-5 w-5 text-blue-500" />
            Active Sessions
          </CardTitle>
          <CardDescription>Devices currently logged into your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loginHistory.map((session) => (
            <div key={session.id} className={`flex items-center justify-between p-4 rounded-lg ${
              session.current ? 'bg-blue-50 border border-blue-100' : 'border'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${session.current ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  <Monitor className={`h-5 w-5 ${session.current ? 'text-blue-600' : 'text-slate-500'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{session.device}</p>
                    {session.current && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">Current</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{session.browser} • {session.location}</p>
                  <p className="text-xs text-slate-400">{session.time}</p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out All Other Devices
          </Button>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-purple-500" />
            Login History
          </CardTitle>
          <CardDescription>Recent account access activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full gap-2">
            <History className="h-4 w-4" />
            View Full Login History
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderAcademicSection = () => (
    <div className="space-y-6">
      {/* Calendar Preferences */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Calendar Preferences
          </CardTitle>
          <CardDescription>Customize your academic calendar view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {['day', 'week', 'month'].map((view) => (
              <button
                key={view}
                onClick={() => setAcademic({ ...academic, defaultCalendarView: view })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  academic.defaultCalendarView === view
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-medium capitalize">{view} View</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reminder Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            Assignment Reminders
          </CardTitle>
          <CardDescription>When should we remind you about upcoming deadlines?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: '1hour', label: '1 Hour' },
              { id: '1day', label: '1 Day' },
              { id: '3days', label: '3 Days' },
              { id: '1week', label: '1 Week' },
            ].map((timing) => (
              <button
                key={timing.id}
                onClick={() => setAcademic({ ...academic, reminderTiming: timing.id })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  academic.reminderTiming === timing.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-medium text-sm">{timing.label}</p>
                <p className="text-xs text-slate-500">before due</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade Display */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            Grade Display
          </CardTitle>
          <CardDescription>How would you like to see your grades?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'letter', label: 'Letter Grade', example: 'HD, D, C, P' },
              { id: 'percentage', label: 'Percentage', example: '85%, 92%' },
              { id: 'both', label: 'Both', example: 'HD (92%)' },
            ].map((format) => (
              <button
                key={format.id}
                onClick={() => setAcademic({ ...academic, gradeDisplayFormat: format.id })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  academic.gradeDisplayFormat === format.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-medium">{format.label}</p>
                <p className="text-xs text-slate-500 mt-1">{format.example}</p>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Show GPA in Header</p>
              <p className="text-sm text-slate-500">Display your current GPA on the dashboard</p>
            </div>
            <Switch
              checked={academic.showGpaInHeader}
              onCheckedChange={(checked) => setAcademic({ ...academic, showGpaInHeader: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Preferences */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            Enrollment Preferences
          </CardTitle>
          <CardDescription>Customize your enrollment experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Auto-enroll in Tutorials</p>
              <p className="text-sm text-slate-500">Automatically enroll in available tutorial slots</p>
            </div>
            <Switch
              checked={academic.autoEnrollTutorials}
              onCheckedChange={(checked) => setAcademic({ ...academic, autoEnrollTutorials: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderConnectedSection = () => (
    <div className="space-y-6">
      {/* Connected Apps */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5 text-blue-500" />
            Connected Applications
          </CardTitle>
          <CardDescription>Manage third-party apps connected to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedApps.map((app) => (
            <div key={app.id} className={`p-4 rounded-lg border ${app.connected ? 'border-slate-200' : 'border-dashed border-slate-300'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{app.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{app.name}</p>
                      {app.connected && (
                        <Badge className="bg-green-100 text-green-700 text-xs">Connected</Badge>
                      )}
                    </div>
                    {app.connected ? (
                      <p className="text-sm text-slate-500">Last used: {app.lastUsed}</p>
                    ) : (
                      <p className="text-sm text-slate-500">Not connected</p>
                    )}
                  </div>
                </div>
                {app.connected ? (
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Disconnect
                  </Button>
                ) : (
                  <Button size="sm" className="gap-2">
                    <Link2 className="h-4 w-4" />
                    Connect
                  </Button>
                )}
              </div>
              {app.connected && app.permissions.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-slate-500 mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {app.permissions.map((perm) => (
                      <Badge key={perm} variant="outline" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Access */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-500" />
            API Access
          </CardTitle>
          <CardDescription>Manage developer access tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Developer Access</p>
                <p className="text-sm text-amber-700 mt-1">
                  API access is restricted to approved developers. Contact IT support if you need API access for a project.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5 text-indigo-500" />
            Data Portability
          </CardTitle>
          <CardDescription>Export your data to other services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3">
            <Calendar className="h-4 w-4" />
            Export Calendar (iCal)
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <GraduationCap className="h-4 w-4" />
            Export Grades (PDF)
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <FileText className="h-4 w-4" />
            Export All Data (ZIP)
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection()
      case 'account':
        return renderAccountSection()
      case 'notifications':
        return renderNotificationsSection()
      case 'privacy':
        return renderPrivacySection()
      case 'appearance':
        return renderAppearanceSection()
      case 'security':
        return renderSecuritySection()
      case 'academic':
        return renderAcademicSection()
      case 'connected':
        return renderConnectedSection()
      default:
        return renderProfileSection()
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg sticky top-6">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
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

          {/* Quick Actions Card */}
          <Card className="border-0 shadow-lg mt-4">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm text-slate-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  )
}
