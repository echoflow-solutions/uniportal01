import { useAppStore } from './appStore'
import { mockUsers } from './mockData'

// Demo user credentials for quick switching
export const demoCredentials = {
  instructor: {
    email: 'ifeanyi.egwutuoha@demo.edu',
    name: 'Dr. Ifeanyi Egwutuoha',
    role: 'instructor' as const,
    description: 'Instructor view - manage courses and review submissions',
  },
  emmanuel: {
    email: 'emmanuel.alisetti@demo.edu',
    name: 'Emmanuel Alisetti',
    role: 'student' as const,
    description: 'High integrity student - model example (89/100)',
  },
  kabir: {
    email: 'kabir.niraula@demo.edu',
    name: 'Kabir Arya Niraula',
    role: 'student' as const,
    description: 'Medium integrity - some concerns (65/100)',
  },
  bernard: {
    email: 'bernard.adjei-yeboah@demo.edu',
    name: 'Bernard Adjei-Yeboah',
    role: 'student' as const,
    description: 'Low integrity - flagged example (38/100)',
  },
  sarah: {
    email: 'sarah.chen@demo.edu',
    name: 'Sarah Chen',
    role: 'student' as const,
    description: 'New student - limited history (72/100)',
  },
  michael: {
    email: 'michael.thompson@demo.edu',
    name: 'Michael Thompson',
    role: 'student' as const,
    description: 'Excellent student - top performer (94/100)',
  },
}

export type DemoUserKey = keyof typeof demoCredentials

// Quick login functions for demo purposes
export const demoLogin = (userKey: DemoUserKey): boolean => {
  const creds = demoCredentials[userKey]
  if (!creds) return false
  return useAppStore.getState().login(creds.email)
}

// Reset demo to initial state
export const resetDemo = (): void => {
  useAppStore.getState().resetToInitialState()
}

// Get current demo user info
export const getCurrentDemoUser = (): typeof demoCredentials[DemoUserKey] | null => {
  const currentUser = useAppStore.getState().currentUser
  if (!currentUser) return null

  const entry = Object.entries(demoCredentials).find(
    ([, creds]) => creds.email === currentUser.email
  )
  return entry ? entry[1] : null
}

// Get all available demo users
export const getAllDemoUsers = () => {
  return Object.entries(demoCredentials).map(([key, creds]) => ({
    key: key as DemoUserKey,
    ...creds,
  }))
}

// Demo scenario descriptions for presentations
export const demoScenarios = {
  studentWorkflow: {
    title: 'Student Writing Workflow',
    description: 'Demonstrates the complete student experience from assignment to verification',
    steps: [
      'Login as Emmanuel (model student)',
      'View dashboard with assignments',
      'Open writing editor for Final Report',
      'Show real-time tracking of writing behavior',
      'Submit assignment and complete Teaching Test',
      'View integrity report and feedback',
    ],
    recommendedUser: 'emmanuel' as DemoUserKey,
  },
  instructorReview: {
    title: 'Instructor Review Process',
    description: 'Shows how instructors review submissions and integrity reports',
    steps: [
      'Login as Dr. Egwutuoha (instructor)',
      'View dashboard with class overview',
      'Review submission from Bernard (flagged)',
      'Examine integrity report and flags',
      'Compare with Emmanuel\'s submission (approved)',
      'Take action on flagged submission',
    ],
    recommendedUser: 'instructor' as DemoUserKey,
  },
  integrityComparison: {
    title: 'Integrity Score Comparison',
    description: 'Compares different students to show how the system identifies issues',
    steps: [
      'Login as instructor',
      'Review Emmanuel\'s report (high integrity)',
      'Review Kabir\'s report (medium integrity)',
      'Review Bernard\'s report (low integrity)',
      'Compare authorship analytics',
      'Show Teaching Test response differences',
    ],
    recommendedUser: 'instructor' as DemoUserKey,
  },
  newStudentBaseline: {
    title: 'New Student Experience',
    description: 'Shows how the system handles new students fairly',
    steps: [
      'Login as Sarah (new student)',
      'View limited submission history',
      'Show how baseline is being established',
      'Demonstrate fair evaluation for new users',
    ],
    recommendedUser: 'sarah' as DemoUserKey,
  },
  topPerformer: {
    title: 'Exemplary Student Case',
    description: 'Highlights what excellent engagement looks like',
    steps: [
      'Login as Michael (top performer)',
      'View comprehensive writing session history',
      'Show exceptional Teaching Test responses',
      'Demonstrate best practices in action',
    ],
    recommendedUser: 'michael' as DemoUserKey,
  },
}

// Helper to format dates relative to now for fresh demo data
export const formatRelativeDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`

  return d.toLocaleDateString()
}

// Generate fresh timestamps relative to current time
export const generateFreshTimestamps = () => {
  const now = new Date()

  return {
    justNow: now.toISOString(),
    hoursAgo: (hours: number) => {
      const date = new Date(now)
      date.setHours(date.getHours() - hours)
      return date.toISOString()
    },
    daysAgo: (days: number) => {
      const date = new Date(now)
      date.setDate(date.getDate() - days)
      return date.toISOString()
    },
    daysFromNow: (days: number) => {
      const date = new Date(now)
      date.setDate(date.getDate() + days)
      return date.toISOString()
    },
  }
}

// Demo mode indicator component props
export interface DemoModeIndicatorProps {
  isVisible: boolean
  currentUser: string | null
  onSwitchUser: (userKey: DemoUserKey) => void
  onReset: () => void
}

// Get integrity level color and label
export const getIntegrityDisplay = (score: number) => {
  if (score >= 80) {
    return { color: 'green', label: 'High Integrity', bgClass: 'bg-green-100 text-green-800' }
  }
  if (score >= 60) {
    return { color: 'amber', label: 'Medium Integrity', bgClass: 'bg-amber-100 text-amber-800' }
  }
  return { color: 'red', label: 'Low Integrity', bgClass: 'bg-red-100 text-red-800' }
}

// Get risk level display
export const getRiskDisplay = (riskLevel: 'low' | 'medium' | 'high') => {
  switch (riskLevel) {
    case 'low':
      return { icon: 'CheckCircle', color: 'green', bgClass: 'bg-green-100 text-green-800' }
    case 'medium':
      return { icon: 'AlertTriangle', color: 'amber', bgClass: 'bg-amber-100 text-amber-800' }
    case 'high':
      return { icon: 'XCircle', color: 'red', bgClass: 'bg-red-100 text-red-800' }
  }
}

// Export user list for demo switcher
export const demoUserList = mockUsers.map((user) => {
  const credKey = Object.keys(demoCredentials).find(
    (key) => demoCredentials[key as DemoUserKey].email === user.email
  ) as DemoUserKey | undefined

  const cred = credKey ? demoCredentials[credKey] : null

  return {
    ...user,
    demoKey: credKey,
    description: cred?.description || '',
  }
})
