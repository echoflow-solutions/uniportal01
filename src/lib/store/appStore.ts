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
      storage: createJSONStorage(() => localStorage),
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
