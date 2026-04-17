import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  User,
  Course,
  Assignment,
  Submission,
  WritingSession,
  WritingEvent,
  VerificationTest,
  IntegrityReport,
  AuthorshipAnalytics,
  VerificationResponse,
  ActiveWritingSession,
  PasteEvent,
} from '@/types'
import {
  mockUsers,
  mockCourses,
  mockAssignments,
  mockSubmissions,
  mockWritingSessions,
  mockWritingEvents,
  mockVerificationTests,
  mockIntegrityReports,
} from './mockData'

interface AppState {
  // State
  currentUser: User | null
  users: User[]
  courses: Course[]
  assignments: Assignment[]
  submissions: Submission[]
  writingSessions: WritingSession[]
  writingEvents: WritingEvent[]
  verificationTests: VerificationTest[]
  integrityReports: IntegrityReport[]
  isInitialized: boolean

  // Active Writing State
  activeWritingSession: ActiveWritingSession | null
  pasteEvents: PasteEvent[]

  // UI State
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void

  // Auth Actions
  login: (email: string) => boolean
  logout: () => void

  // Query Actions
  getCurrentUserSubmissions: () => Submission[]
  getAssignmentById: (id: string) => Assignment | undefined
  getSubmissionById: (id: string) => Submission | undefined
  getCourseById: (id: string) => Course | undefined
  getSubmissionsByAssignment: (assignmentId: string) => Submission[]
  getSubmissionsByStudent: (studentId: string) => Submission[]
  getSessionsBySubmission: (submissionId: string) => WritingSession[]
  getSubmissionAnalytics: (submissionId: string) => AuthorshipAnalytics | null
  getVerificationTest: (submissionId: string) => VerificationTest | undefined
  getIntegrityReport: (submissionId: string) => IntegrityReport | undefined
  getUserById: (id: string) => User | undefined
  getStudentsByCourse: (courseId: string) => User[]
  getInstructorCourses: () => Course[]
  getStudentCourses: () => Course[]
  getOrCreateSubmission: (assignmentId: string) => Submission

  // Mutation Actions
  updateSubmission: (id: string, data: Partial<Submission>) => void
  addWritingEvent: (event: WritingEvent) => void
  startWritingSession: (submissionId: string) => WritingSession
  endWritingSession: (sessionId: string) => void
  submitVerificationResponse: (
    testId: string,
    questionId: string,
    response: string
  ) => void
  createSubmission: (assignmentId: string) => Submission

  // Active Writing Actions
  startActiveSession: (submissionId: string) => ActiveWritingSession
  updateActiveSession: (data: Partial<ActiveWritingSession>) => void
  endActiveSession: () => void
  recordKeystroke: () => void
  recordPaste: (wordCount: number, isDeclared: boolean, source?: string) => void
  setIdleStatus: (isIdle: boolean) => void
  saveSessionToHistory: () => void

  // Demo Actions
  resetToInitialState: () => void
  initializeStore: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      users: [],
      courses: [],
      assignments: [],
      submissions: [],
      writingSessions: [],
      writingEvents: [],
      verificationTests: [],
      integrityReports: [],
      isInitialized: false,

      // Active Writing State
      activeWritingSession: null,
      pasteEvents: [],

      // UI State
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Initialize store with mock data
      initializeStore: () => {
        const state = get()
        if (!state.isInitialized || state.users.length === 0) {
          set({
            users: mockUsers,
            courses: mockCourses,
            assignments: mockAssignments,
            submissions: mockSubmissions,
            writingSessions: mockWritingSessions,
            writingEvents: mockWritingEvents,
            verificationTests: mockVerificationTests,
            integrityReports: mockIntegrityReports,
            isInitialized: true,
          })
        }
      },

      // Auth Actions
      login: (email: string) => {
        const state = get()
        // Initialize if not already done
        if (!state.isInitialized) {
          state.initializeStore()
        }
        const updatedState = get()
        const user = updatedState.users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )
        if (user) {
          set({ currentUser: user })
          return true
        }
        return false
      },

      logout: () => {
        set({ currentUser: null })
      },

      // Query Actions
      getCurrentUserSubmissions: () => {
        const { currentUser, submissions } = get()
        if (!currentUser || currentUser.role !== 'student') return []
        return submissions.filter((s) => s.studentId === currentUser.id)
      },

      getAssignmentById: (id: string) => {
        return get().assignments.find((a) => a.id === id)
      },

      getSubmissionById: (id: string) => {
        return get().submissions.find((s) => s.id === id)
      },

      getCourseById: (id: string) => {
        return get().courses.find((c) => c.id === id)
      },

      getSubmissionsByAssignment: (assignmentId: string) => {
        return get().submissions.filter((s) => s.assignmentId === assignmentId)
      },

      getSubmissionsByStudent: (studentId: string) => {
        return get().submissions.filter((s) => s.studentId === studentId)
      },

      getSessionsBySubmission: (submissionId: string) => {
        return get().writingSessions.filter(
          (s) => s.submissionId === submissionId
        )
      },

      getSubmissionAnalytics: (submissionId: string) => {
        const sessions = get().writingSessions.filter(
          (s) => s.submissionId === submissionId
        )

        if (sessions.length === 0) return null

        const totalActiveTime = sessions.reduce(
          (acc, s) => acc + s.activeTimeSeconds,
          0
        )
        const wordsTyped = sessions.reduce((acc, s) => acc + s.wordsTyped, 0)
        const wordsPasted = sessions.reduce((acc, s) => acc + s.wordsPasted, 0)
        const totalWords = wordsTyped + wordsPasted
        const pastePercentage =
          totalWords > 0 ? (wordsPasted / totalWords) * 100 : 0
        const avgWordsPerMinute =
          totalActiveTime > 0 ? (wordsTyped / totalActiveTime) * 60 : 0
        const revisionDepth =
          sessions.reduce((acc, s) => acc + s.editEvents, 0) / totalWords || 0

        // Generate session distribution data
        const sessionDistribution = sessions.map((s) => ({
          date: new Date(s.startedAt).toLocaleDateString(),
          minutes: Math.round(s.activeTimeSeconds / 60),
        }))

        // Generate typing pattern (simulated hourly WPM)
        const typingPattern = sessions.map((s) => ({
          time: new Date(s.startedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          wpm: Math.round((s.wordsTyped / s.activeTimeSeconds) * 60),
        }))

        return {
          totalSessions: sessions.length,
          totalActiveTime,
          wordsTyped,
          wordsPasted,
          pastePercentage,
          avgWordsPerMinute,
          revisionDepth,
          sessionDistribution,
          typingPattern,
        }
      },

      getVerificationTest: (submissionId: string) => {
        return get().verificationTests.find(
          (t) => t.submissionId === submissionId
        )
      },

      getIntegrityReport: (submissionId: string) => {
        return get().integrityReports.find(
          (r) => r.submissionId === submissionId
        )
      },

      getUserById: (id: string) => {
        return get().users.find((u) => u.id === id)
      },

      getStudentsByCourse: (courseId: string) => {
        const course = get().courses.find((c) => c.id === courseId)
        if (!course) return []
        return get().users.filter((u) => course.studentIds.includes(u.id))
      },

      getInstructorCourses: () => {
        const { currentUser, courses } = get()
        if (!currentUser || currentUser.role !== 'instructor') return []
        return courses.filter((c) => c.instructorId === currentUser.id)
      },

      getStudentCourses: () => {
        const { currentUser, courses } = get()
        if (!currentUser || currentUser.role !== 'student') return []
        return courses.filter((c) => c.studentIds.includes(currentUser.id))
      },

      getOrCreateSubmission: (assignmentId: string) => {
        const { currentUser, submissions, createSubmission } = get()
        if (!currentUser || currentUser.role !== 'student') {
          throw new Error('Must be logged in as a student')
        }

        // Check for existing draft submission
        const existing = submissions.find(
          (s) => s.assignmentId === assignmentId &&
                 s.studentId === currentUser.id &&
                 s.status === 'draft'
        )

        if (existing) return existing
        return createSubmission(assignmentId)
      },

      // Mutation Actions
      updateSubmission: (id: string, data: Partial<Submission>) => {
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        }))
      },

      addWritingEvent: (event: WritingEvent) => {
        set((state) => ({
          writingEvents: [...state.writingEvents, event],
        }))
      },

      startWritingSession: (submissionId: string) => {
        const newSession: WritingSession = {
          id: `session-${generateId()}`,
          submissionId,
          startedAt: new Date().toISOString(),
          activeTimeSeconds: 0,
          wordsTyped: 0,
          wordsPasted: 0,
          pasteEvents: 0,
          editEvents: 0,
        }
        set((state) => ({
          writingSessions: [...state.writingSessions, newSession],
        }))
        return newSession
      },

      endWritingSession: (sessionId: string) => {
        set((state) => ({
          writingSessions: state.writingSessions.map((s) =>
            s.id === sessionId ? { ...s, endedAt: new Date().toISOString() } : s
          ),
        }))
      },

      submitVerificationResponse: (
        testId: string,
        questionId: string,
        response: string
      ) => {
        const newResponse: VerificationResponse = {
          questionId,
          response,
          score: 0, // Would be calculated by AI in real system
          feedback: 'Response recorded',
          answeredAt: new Date().toISOString(),
        }

        set((state) => ({
          verificationTests: state.verificationTests.map((t) =>
            t.id === testId
              ? {
                  ...t,
                  responses: [...t.responses, newResponse],
                  status:
                    t.responses.length + 1 >= t.questions.length
                      ? 'completed'
                      : 'in_progress',
                }
              : t
          ),
        }))
      },

      createSubmission: (assignmentId: string) => {
        const { currentUser } = get()
        if (!currentUser || currentUser.role !== 'student') {
          throw new Error('Must be logged in as a student')
        }

        const newSubmission: Submission = {
          id: `sub-${generateId()}`,
          assignmentId,
          studentId: currentUser.id,
          content: '',
          wordCount: 0,
          status: 'draft',
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          submissions: [...state.submissions, newSubmission],
        }))

        return newSubmission
      },

      // Active Writing Actions
      startActiveSession: (submissionId: string) => {
        const newSession: ActiveWritingSession = {
          id: `active-${generateId()}`,
          submissionId,
          startedAt: new Date().toISOString(),
          keystrokeCount: 0,
          wordsTyped: 0,
          wordsPasted: 0,
          declaredPasteWords: 0,
          undeclaredPasteWords: 0,
          pasteEvents: 0,
          editEvents: 0,
          lastActivityAt: new Date().toISOString(),
          isIdle: false,
        }
        set({ activeWritingSession: newSession })
        return newSession
      },

      updateActiveSession: (data: Partial<ActiveWritingSession>) => {
        set((state) => ({
          activeWritingSession: state.activeWritingSession
            ? { ...state.activeWritingSession, ...data }
            : null,
        }))
      },

      endActiveSession: () => {
        const { activeWritingSession, saveSessionToHistory } = get()
        if (activeWritingSession) {
          saveSessionToHistory()
          set({ activeWritingSession: null, pasteEvents: [] })
        }
      },

      recordKeystroke: () => {
        set((state) => {
          if (!state.activeWritingSession) return state
          return {
            activeWritingSession: {
              ...state.activeWritingSession,
              keystrokeCount: state.activeWritingSession.keystrokeCount + 1,
              lastActivityAt: new Date().toISOString(),
              isIdle: false,
            },
          }
        })
      },

      recordPaste: (wordCount: number, isDeclared: boolean, source?: string) => {
        const { activeWritingSession } = get()
        if (!activeWritingSession) return

        const pasteEvent: PasteEvent = {
          id: `paste-${generateId()}`,
          sessionId: activeWritingSession.id,
          timestamp: new Date().toISOString(),
          wordCount,
          characterCount: wordCount * 5, // Approximate
          isDeclared,
          source,
        }

        set((state) => ({
          pasteEvents: [...state.pasteEvents, pasteEvent],
          activeWritingSession: state.activeWritingSession
            ? {
                ...state.activeWritingSession,
                wordsPasted: state.activeWritingSession.wordsPasted + wordCount,
                declaredPasteWords: isDeclared
                  ? state.activeWritingSession.declaredPasteWords + wordCount
                  : state.activeWritingSession.declaredPasteWords,
                undeclaredPasteWords: !isDeclared
                  ? state.activeWritingSession.undeclaredPasteWords + wordCount
                  : state.activeWritingSession.undeclaredPasteWords,
                pasteEvents: state.activeWritingSession.pasteEvents + 1,
                lastActivityAt: new Date().toISOString(),
                isIdle: false,
              }
            : null,
        }))
      },

      setIdleStatus: (isIdle: boolean) => {
        set((state) => ({
          activeWritingSession: state.activeWritingSession
            ? { ...state.activeWritingSession, isIdle }
            : null,
        }))
      },

      saveSessionToHistory: () => {
        const { activeWritingSession, pasteEvents } = get()
        if (!activeWritingSession) return

        const startTime = new Date(activeWritingSession.startedAt).getTime()
        const endTime = new Date().getTime()
        const activeTimeSeconds = Math.round((endTime - startTime) / 1000)

        const historicalSession: WritingSession = {
          id: `session-${generateId()}`,
          submissionId: activeWritingSession.submissionId,
          startedAt: activeWritingSession.startedAt,
          endedAt: new Date().toISOString(),
          activeTimeSeconds,
          wordsTyped: activeWritingSession.wordsTyped,
          wordsPasted: activeWritingSession.wordsPasted,
          pasteEvents: activeWritingSession.pasteEvents,
          editEvents: activeWritingSession.editEvents,
        }

        // Create writing events for paste events
        const writingEvents: WritingEvent[] = pasteEvents.map((pe) => ({
          id: `event-${generateId()}`,
          sessionId: historicalSession.id,
          type: 'paste' as const,
          timestamp: pe.timestamp,
          data: {
            wordCount: pe.wordCount,
            isDeclared: pe.isDeclared,
            source: pe.source,
          },
        }))

        set((state) => ({
          writingSessions: [...state.writingSessions, historicalSession],
          writingEvents: [...state.writingEvents, ...writingEvents],
        }))
      },

      // Demo Actions
      resetToInitialState: () => {
        set({
          currentUser: null,
          users: mockUsers,
          courses: mockCourses,
          assignments: mockAssignments,
          submissions: mockSubmissions,
          writingSessions: mockWritingSessions,
          writingEvents: mockWritingEvents,
          verificationTests: mockVerificationTests,
          integrityReports: mockIntegrityReports,
          isInitialized: true,
        })
      },
    }),
    {
      name: 'uniportal-storage',
      version: 2, // Increment this to force reload mock data
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, version) => {
        // When version changes, reset isInitialized to force reload of mock data
        if (version < 2) {
          return { isInitialized: false }
        }
        return persistedState as Record<string, unknown>
      },
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
        courses: state.courses,
        assignments: state.assignments,
        submissions: state.submissions,
        writingSessions: state.writingSessions,
        writingEvents: state.writingEvents,
        verificationTests: state.verificationTests,
        integrityReports: state.integrityReports,
        isInitialized: state.isInitialized,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)

// Initialize store on import (client-side only)
if (typeof window !== 'undefined') {
  // Delay initialization to ensure hydration completes
  setTimeout(() => {
    useAppStore.getState().initializeStore()
  }, 0)
}
