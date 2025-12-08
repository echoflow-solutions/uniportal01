export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor'
  avatar?: string
}

export interface Course {
  id: string
  name: string
  code: string
  instructorId: string
  studentIds: string[]
}

export interface Assignment {
  id: string
  courseId: string
  title: string
  description: string
  instructions: string
  dueDate: string
  minSessions: number
  minActiveTimeMinutes: number
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  content: string
  wordCount: number
  status: 'draft' | 'submitted' | 'verification_pending' | 'verified' | 'flagged'
  createdAt: string
  submittedAt?: string
}

export interface WritingSession {
  id: string
  submissionId: string
  startedAt: string
  endedAt?: string
  activeTimeSeconds: number
  wordsTyped: number
  wordsPasted: number
  pasteEvents: number
  editEvents: number
}

export interface WritingEvent {
  id: string
  sessionId: string
  type: 'keystroke' | 'paste' | 'delete' | 'idle' | 'focus' | 'blur'
  timestamp: string
  data?: Record<string, unknown>
}

export interface VerificationTest {
  id: string
  submissionId: string
  questions: VerificationQuestion[]
  responses: VerificationResponse[]
  overallScore: number
  status: 'pending' | 'in_progress' | 'completed'
  startedAt?: string
  completedAt?: string
}

export interface VerificationQuestion {
  id: string
  type: 'simplify' | 'justify' | 'counter' | 'extend' | 'process'
  question: string
  expectedConcepts: string[]
}

export interface VerificationResponse {
  questionId: string
  response: string
  score: number
  feedback: string
  answeredAt: string
}

export interface IntegrityReport {
  id: string
  submissionId: string
  authorshipScore: number
  comprehensionScore: number
  styleConsistencyScore: number
  combinedScore: number
  riskLevel: 'low' | 'medium' | 'high'
  flags: string[]
  recommendation: string
  generatedAt: string
}

export interface AuthorshipAnalytics {
  totalSessions: number
  totalActiveTime: number
  wordsTyped: number
  wordsPasted: number
  pastePercentage: number
  avgWordsPerMinute: number
  revisionDepth: number
  sessionDistribution: { date: string; minutes: number }[]
  typingPattern: { time: string; wpm: number }[]
}
