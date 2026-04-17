'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppStore } from '@/lib/store/appStore'
import { WritingEditor } from '@/components/trulearn/WritingEditor'
import { DeclaredPasteModal } from '@/components/trulearn/DeclaredPasteModal'
import { WritingProgress } from '@/components/trulearn/WritingProgress'
import { SessionTimer } from '@/components/trulearn/SessionTimer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Save,
  Send,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function WritePage() {
  const params = useParams()
  const assignmentId = params.id as string
  const router = useRouter()

  const {
    currentUser,
    getAssignmentById,
    getCourseById,
    getOrCreateSubmission,
    getSessionsBySubmission,
    updateSubmission,
    startActiveSession,
    endActiveSession,
    activeWritingSession,
    recordPaste,
    updateActiveSession,
  } = useAppStore()

  const [assignment, setAssignment] = useState<ReturnType<typeof getAssignmentById> | null>(null)
  const [submission, setSubmission] = useState<ReturnType<typeof getOrCreateSubmission> | null>(null)
  const [course, setCourse] = useState<ReturnType<typeof getCourseById> | null>(null)
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Paste modal state
  const [showPasteModal, setShowPasteModal] = useState(false)
  const [pendingPaste, setPendingPaste] = useState<{ wordCount: number; text: string } | null>(null)

  // Load assignment and submission
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') {
      router.push('/')
      return
    }

    const foundAssignment = getAssignmentById(assignmentId)
    if (!foundAssignment) {
      router.push('/student/assignments')
      return
    }

    setAssignment(foundAssignment)
    setCourse(getCourseById(foundAssignment.courseId))

    try {
      const sub = getOrCreateSubmission(assignmentId)
      setSubmission(sub)
      setContent(sub.content)
      setWordCount(sub.wordCount)
    } catch (error) {
      console.error('Error loading submission:', error)
      router.push('/student/assignments')
    }
  }, [currentUser, assignmentId, getAssignmentById, getCourseById, getOrCreateSubmission, router])

  // Start session on mount
  useEffect(() => {
    if (submission && !activeWritingSession) {
      startActiveSession(submission.id)
    }

    // End session on unmount
    return () => {
      if (activeWritingSession) {
        endActiveSession()
      }
    }
  }, [submission, activeWritingSession, startActiveSession, endActiveSession])

  const handleSave = useCallback(async () => {
    if (!submission) return

    setIsSaving(true)
    try {
      updateSubmission(submission.id, {
        content,
        wordCount,
      })
      setLastSaved(new Date())
    } finally {
      setIsSaving(false)
    }
  }, [submission, content, wordCount, updateSubmission])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!submission) return

    const autoSave = setInterval(() => {
      if (content !== submission.content) {
        handleSave()
      }
    }, 30000)

    return () => clearInterval(autoSave)
  }, [submission, content, handleSave])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleWordCountChange = (count: number) => {
    setWordCount(count)
    if (activeWritingSession) {
      // Update words typed (this is a simplification - in real app, track more precisely)
      updateActiveSession({ wordsTyped: count })
    }
  }

  const handlePasteDetected = (pastedWordCount: number, text: string) => {
    setPendingPaste({ wordCount: pastedWordCount, text })
    setShowPasteModal(true)
  }

  const handleDeclarePaste = (source: string) => {
    if (pendingPaste) {
      recordPaste(pendingPaste.wordCount, true, source)
    }
    setPendingPaste(null)
  }

  const handleSkipPaste = () => {
    if (pendingPaste) {
      recordPaste(pendingPaste.wordCount, false)
    }
    setPendingPaste(null)
  }

  const handleSubmit = async () => {
    if (!submission) return

    setIsSubmitting(true)
    try {
      // End the active session first
      if (activeWritingSession) {
        endActiveSession()
      }

      // Update submission status
      updateSubmission(submission.id, {
        content,
        wordCount,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      })

      setShowSubmitModal(false)
      router.push('/student/assignments')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get historical sessions for progress
  const sessions = submission ? getSessionsBySubmission(submission.id) : []
  const totalActiveMinutes = sessions.reduce((acc, s) => acc + s.activeTimeSeconds / 60, 0)
  const totalWordsTyped = sessions.reduce((acc, s) => acc + s.wordsTyped, 0)
  const totalWordsPasted = sessions.reduce((acc, s) => acc + s.wordsPasted, 0)

  if (!assignment || !submission || !course) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  const dueDate = new Date(assignment.dueDate)
  const isOverdue = dueDate < new Date()
  const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (activeWritingSession) {
                    endActiveSession()
                  }
                  router.push('/student/assignments')
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="font-semibold text-gray-900 line-clamp-1">
                  {assignment.title}
                </h1>
                <p className="text-sm text-gray-500">{course.code} - {course.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Save status */}
              <div className="text-sm text-gray-500">
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <div className="h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Saved
                  </span>
                ) : null}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>

              <Button
                size="sm"
                onClick={() => setShowSubmitModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Assignment Info */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Assignment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Description</p>
                  <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className={cn(
                    isOverdue ? "text-red-600" : "text-gray-600"
                  )}>
                    Due: {dueDate.toLocaleDateString()}
                    {!isOverdue && daysUntilDue <= 3 && (
                      <Badge variant="outline" className="ml-2 text-xs border-amber-500 text-amber-600">
                        {daysUntilDue} days left
                      </Badge>
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Requirements</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      Min {assignment.minActiveTimeMinutes} min active time
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      Min {assignment.minSessions} writing sessions
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Instructions</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {assignment.instructions}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Editor */}
          <div className="lg:col-span-6">
            <WritingEditor
              content={content}
              onChange={handleContentChange}
              onWordCountChange={handleWordCountChange}
              onPasteDetected={handlePasteDetected}
              placeholder="Start writing your assignment here..."
            />
          </div>

          {/* Right Panel - Stats & Progress */}
          <div className="lg:col-span-3 space-y-4">
            <SessionTimer isActive={!!activeWritingSession} />

            <WritingProgress
              minSessions={assignment.minSessions}
              minActiveTimeMinutes={assignment.minActiveTimeMinutes}
              targetWordCount={1000}
              currentSessions={sessions.length + (activeWritingSession ? 1 : 0)}
              currentActiveTimeMinutes={totalActiveMinutes}
              currentWordCount={wordCount}
              wordsTyped={totalWordsTyped + (activeWritingSession?.wordsTyped || 0)}
              wordsPasted={totalWordsPasted + (activeWritingSession?.wordsPasted || 0)}
              declaredPasteWords={activeWritingSession?.declaredPasteWords || 0}
              undeclaredPasteWords={activeWritingSession?.undeclaredPasteWords || 0}
            />
          </div>
        </div>
      </div>

      {/* Paste Declaration Modal */}
      <DeclaredPasteModal
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        onDeclare={handleDeclarePaste}
        onSkip={handleSkipPaste}
        pastedText={pendingPaste?.text || ''}
        wordCount={pendingPaste?.wordCount || 0}
      />

      {/* Submit Confirmation Modal */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Submit Assignment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this assignment? You won&apos;t be able to edit it after submission.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Word Count</span>
              <span className="font-medium">{wordCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Sessions Completed</span>
              <span className="font-medium">{sessions.length + (activeWritingSession ? 1 : 0)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Active Time</span>
              <span className="font-medium">{Math.round(totalActiveMinutes)} min</span>
            </div>

            {/* Warning if requirements not met */}
            {(sessions.length < assignment.minSessions || totalActiveMinutes < assignment.minActiveTimeMinutes) && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  You haven&apos;t met all the writing requirements. This may affect your authorship score.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
            >
              Continue Editing
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
