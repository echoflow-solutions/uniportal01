'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'

export type FinalizeQuestion = {
  passageIndex: number
  passageText: string
  question: string
  excerpt: string
  difficulty: 'low' | 'medium' | 'high'
  source: 'ai' | 'fallback'
}

export type FinalizeAnsweredQuestion = FinalizeQuestion & {
  answer: string
  score: number
  confidence: 'High' | 'Medium' | 'Low'
  feedback: string
  correct: boolean
}

export type FinalizeVerdict = 'verified' | 'review' | 'flagged' | 'skipped'

export type FinalizeSubmitPayload = {
  verdict: FinalizeVerdict
  questions: FinalizeAnsweredQuestion[]
  completedAt: string
}

export type FinalizeGateProps = {
  open: boolean
  sessionId: string | null
  assignmentName: string
  unitName: string
  pastedTexts: string[]
  onClose: () => void
  onRequestSkipSubmit: () => void
  onSubmit: (payload: FinalizeSubmitPayload) => Promise<void>
}

type Phase =
  | 'loading'
  | 'ready'
  | 'grading'
  | 'question-result'
  | 'final-verdict'
  | 'error'
  | 'zero-questions'

type GradeResponse = {
  ok?: boolean
  fallback?: boolean
  grade?: {
    score: number
    confidence: 'High' | 'Medium' | 'Low'
    feedback: string
    correct: boolean
  }
  error?: string
}

type QuestionsResponse = {
  ok?: boolean
  fallback?: boolean
  questions?: FinalizeQuestion[]
  error?: string
}

const EASE = [0.16, 1, 0.3, 1] as const

function computeVerdict(answered: FinalizeAnsweredQuestion[]): FinalizeVerdict {
  if (answered.length === 0) return 'verified'
  const allCorrect = answered.every((a) => a.correct)
  if (allCorrect) return 'verified'
  const avg = answered.reduce((sum, a) => sum + a.score, 0) / answered.length
  if (avg >= 5) return 'review'
  return 'flagged'
}

function verdictLabel(v: FinalizeVerdict): string {
  if (v === 'verified') return 'Verified'
  if (v === 'review') return 'Needs review'
  if (v === 'flagged') return 'Flagged'
  return 'Skipped'
}

function verdictCopy(v: FinalizeVerdict): string {
  if (v === 'verified') {
    return 'Your answers demonstrate strong understanding of the pasted material. This submission is cleared to finalize.'
  }
  if (v === 'review') {
    return 'Some answers captured the ideas; others remained general. The submission will be sent to your instructor for review.'
  }
  if (v === 'flagged') {
    return 'Your answers did not clearly demonstrate understanding of the pasted material. The submission will be flagged for review.'
  }
  return 'Verification skipped.'
}

function verdictToneClasses(v: FinalizeVerdict): {
  border: string
  bg: string
  text: string
  dot: string
} {
  if (v === 'verified') {
    return {
      border: 'border-[rgba(22,101,52,0.22)]',
      bg: 'bg-[rgba(22,101,52,0.06)]',
      text: 'text-[var(--verified)]',
      dot: 'bg-[var(--verified)]',
    }
  }
  if (v === 'review') {
    return {
      border: 'border-[rgba(161,98,7,0.22)]',
      bg: 'bg-[rgba(161,98,7,0.06)]',
      text: 'text-[var(--pending)]',
      dot: 'bg-[var(--pending)]',
    }
  }
  return {
    border: 'border-[rgba(185,28,28,0.22)]',
    bg: 'bg-[rgba(185,28,28,0.06)]',
    text: 'text-[var(--flagged)]',
    dot: 'bg-[var(--flagged)]',
  }
}

export function FinalizeGate({
  open,
  sessionId,
  assignmentName,
  unitName,
  pastedTexts,
  onClose,
  onRequestSkipSubmit,
  onSubmit,
}: FinalizeGateProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [questions, setQuestions] = useState<FinalizeQuestion[]>([])
  const [answered, setAnswered] = useState<FinalizeAnsweredQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [currentGrade, setCurrentGrade] = useState<FinalizeAnsweredQuestion | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [gradeError, setGradeError] = useState<string | null>(null)
  const [gradeRetryCount, setGradeRetryCount] = useState(0)
  const [showFullPassage, setShowFullPassage] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const headingId = 'finalize-gate-heading'
  const liveRegionRef = useRef<HTMLDivElement | null>(null)

  const currentQuestion = questions[currentIndex]
  const total = questions.length
  const answeredCount = answered.length

  const resetState = useCallback(() => {
    setPhase('loading')
    setQuestions([])
    setAnswered([])
    setCurrentIndex(0)
    setCurrentAnswer('')
    setCurrentGrade(null)
    setIsSubmitting(false)
    setLoadError(null)
    setGradeError(null)
    setGradeRetryCount(0)
    setShowFullPassage(false)
    setUsedFallback(false)
  }, [])

  const loadQuestions = useCallback(async () => {
    setPhase('loading')
    setLoadError(null)
    setUsedFallback(false)
    try {
      const response = await fetch('/api/demo/verify/finalize/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, assignmentName, unitName, pastedTexts }),
      })
      const payload = (await response.json().catch(() => null)) as QuestionsResponse | null

      if (!response.ok || !payload) {
        throw new Error(payload?.error ?? 'Could not load verification questions.')
      }

      if (payload.error) {
        throw new Error(payload.error)
      }

      const list = Array.isArray(payload.questions) ? payload.questions : []

      if (list.length === 0) {
        setQuestions([])
        setPhase('zero-questions')
        return
      }

      setQuestions(list)
      setCurrentIndex(0)
      setCurrentAnswer('')
      setCurrentGrade(null)
      setUsedFallback(Boolean(payload.fallback))
      setPhase('ready')
    } catch (err) {
      console.error('[finalize-gate] Failed to load questions', err)
      setLoadError(err instanceof Error ? err.message : 'Unexpected error loading questions.')
      setPhase('error')
    }
  }, [sessionId, assignmentName, unitName, pastedTexts])

  // Kick off load on open.
  useEffect(() => {
    if (!open) {
      resetState()
      return
    }
    void loadQuestions()
    // We intentionally depend only on `open` so that loadQuestions is only
    // retriggered when the modal opens, not when parent props shift.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Escape to close.
  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, isSubmitting, onClose])

  // Focus the textarea whenever a new question renders.
  useEffect(() => {
    if (phase === 'ready' && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [phase, currentIndex])

  // Announce state changes.
  useEffect(() => {
    if (!liveRegionRef.current) return
    if (phase === 'ready' && total > 0) {
      liveRegionRef.current.textContent = `Question ${currentIndex + 1} of ${total}.`
    } else if (phase === 'question-result' && currentGrade) {
      liveRegionRef.current.textContent = `Answer graded. Score ${currentGrade.score} out of 10.`
    } else if (phase === 'final-verdict') {
      const v = computeVerdict(answered)
      liveRegionRef.current.textContent = `Final verification: ${verdictLabel(v)}.`
    }
  }, [phase, currentIndex, total, currentGrade, answered])

  const gradeCurrent = useCallback(async () => {
    if (!currentQuestion) return
    setPhase('grading')
    setGradeError(null)
    try {
      const response = await fetch('/api/demo/verify/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pastedText: currentQuestion.passageText,
          question: currentQuestion.question,
          answer: currentAnswer,
          assignmentName,
          unitName,
        }),
      })

      const payload = (await response.json().catch(() => null)) as GradeResponse | null

      if (!response.ok || !payload) {
        throw new Error(payload?.error ?? 'Grading request failed.')
      }

      if (payload.error) {
        throw new Error(payload.error)
      }

      if (!payload.grade) {
        throw new Error('Grader did not return a result.')
      }

      const graded: FinalizeAnsweredQuestion = {
        ...currentQuestion,
        answer: currentAnswer,
        score: payload.grade.score,
        confidence: payload.grade.confidence,
        feedback: payload.grade.feedback,
        correct: payload.grade.correct,
      }
      setCurrentGrade(graded)
      setAnswered((prev) => [...prev, graded])
      setPhase('question-result')
      setGradeRetryCount(0)
    } catch (err) {
      console.error('[finalize-gate] Grading failed', err)
      setGradeError(err instanceof Error ? err.message : 'Grading unavailable.')
      setGradeRetryCount((n) => n + 1)
      setPhase('ready')
    }
  }, [currentQuestion, currentAnswer, assignmentName, unitName])

  const handleSkipGrade = useCallback(() => {
    if (!currentQuestion) return
    const graded: FinalizeAnsweredQuestion = {
      ...currentQuestion,
      answer: currentAnswer,
      score: 0,
      confidence: 'Low',
      feedback: 'Grading unavailable — review manually.',
      correct: false,
    }
    setCurrentGrade(graded)
    setAnswered((prev) => [...prev, graded])
    setPhase('question-result')
    setGradeError(null)
    setGradeRetryCount(0)
  }, [currentQuestion, currentAnswer])

  const handleContinue = useCallback(() => {
    const nextIndex = currentIndex + 1
    setCurrentAnswer('')
    setCurrentGrade(null)
    setShowFullPassage(false)
    if (nextIndex >= total) {
      setPhase('final-verdict')
    } else {
      setCurrentIndex(nextIndex)
      setPhase('ready')
    }
  }, [currentIndex, total])

  const handleZeroSubmit = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await onSubmit({
        verdict: 'verified',
        questions: [],
        completedAt: new Date().toISOString(),
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, onSubmit])

  const handleFinalSubmit = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await onSubmit({
        verdict: computeVerdict(answered),
        questions: answered,
        completedAt: new Date().toISOString(),
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, onSubmit, answered])

  const verdict = useMemo(() => computeVerdict(answered), [answered])
  const verdictTones = useMemo(() => verdictToneClasses(verdict), [verdict])
  const strongCount = useMemo(() => answered.filter((a) => a.correct).length, [answered])

  if (!open) return null

  const canRetry = gradeRetryCount < 2
  const isGrading = phase === 'grading'

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
      >
        <motion.div
          key="finalize-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="absolute inset-0 bg-[rgba(10,10,10,0.42)] backdrop-blur-md"
          onClick={() => {
            if (!isSubmitting) onClose()
          }}
          aria-hidden
        />

        <motion.div
          key="finalize-card"
          initial={{ opacity: 0, y: 14, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.985 }}
          transition={{ duration: 0.42, ease: EASE }}
          className="relative z-10 w-full max-w-[32rem] overflow-hidden rounded-[1.6rem] border border-[var(--bone)] bg-[rgba(250,247,242,0.98)] text-[var(--ink)] shadow-[0_40px_120px_rgba(10,10,10,0.22)]"
        >
          <div
            ref={liveRegionRef}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />

          {/* Top bar with return link + kicker */}
          <div className="flex items-center justify-between border-b border-[rgba(10,10,10,0.06)] px-6 py-3.5">
            <button
              type="button"
              onClick={() => {
                if (!isSubmitting) onClose()
              }}
              disabled={isSubmitting}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--slate)] transition hover:bg-[rgba(10,10,10,0.04)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Return to editor
            </button>
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.22em] text-[var(--ash)]">
              Final verification
            </span>
          </div>

          <div className="px-6 pt-6 pb-7 md:px-7 md:pb-8">
            {/* Heading + progress dots (shown in most phases) */}
            {phase !== 'error' && phase !== 'zero-questions' ? (
              <div>
                <p className="editorial-kicker">Final verification</p>
                <h2
                  id={headingId}
                  className="mt-3 font-display text-[2rem] leading-[0.98] tracking-[-0.04em] text-[var(--ink)] md:text-[2.2rem]"
                >
                  Before you submit
                </h2>

                {total > 0 ? (
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex items-center gap-1.5" aria-hidden>
                      {questions.map((_, i) => {
                        const isAnswered = i < answeredCount
                        const isCurrent = i === currentIndex && phase !== 'final-verdict'
                        return (
                          <span
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              isCurrent
                                ? 'w-6 bg-[var(--ink)]'
                                : isAnswered
                                  ? 'w-3 bg-[var(--verified)]'
                                  : 'w-3 bg-[rgba(10,10,10,0.12)]'
                            }`}
                          />
                        )
                      })}
                    </div>
                    <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                      {phase === 'final-verdict'
                        ? `${answeredCount} of ${total} answered`
                        : `Question ${Math.min(currentIndex + 1, total)} of ${total}`}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Body: phase-specific */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {phase === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex flex-col items-center gap-4 rounded-[1.25rem] border border-dashed border-[var(--bone)] bg-white/60 px-6 py-9 text-center"
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-[var(--slate)]" aria-hidden />
                    <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">
                      Preparing your questions
                    </p>
                    <p className="max-w-sm text-[14px] leading-6 text-[var(--graphite)]">
                      We&rsquo;re generating short comprehension checks from the passages you
                      pasted. This takes a moment.
                    </p>
                  </motion.div>
                ) : null}

                {phase === 'error' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="rounded-[1.25rem] border border-[rgba(185,28,28,0.22)] bg-[rgba(185,28,28,0.04)] p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(185,28,28,0.1)] text-[var(--flagged)]"
                        aria-hidden
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="editorial-kicker text-[var(--flagged)]">
                          Could not load verification
                        </p>
                        <h3
                          id={headingId}
                          className="mt-2 font-display text-[1.35rem] leading-tight tracking-[-0.03em] text-[var(--ink)]"
                        >
                          Something went wrong
                        </h3>
                        <p className="mt-2 text-[14px] leading-6 text-[var(--graphite)]">
                          {loadError ?? 'We could not prepare your verification questions.'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={onRequestSkipSubmit}
                        className="focus-ring font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--slate)] underline-offset-4 hover:text-[var(--flagged)] hover:underline"
                      >
                        Submit without verifying →
                      </button>
                      <button
                        type="button"
                        onClick={() => void loadQuestions()}
                        className="button-ink focus-ring"
                      >
                        Retry
                      </button>
                    </div>
                  </motion.div>
                ) : null}

                {phase === 'zero-questions' ? (
                  <motion.div
                    key="zero"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.32, ease: EASE }}
                    className="rounded-[1.25rem] border border-[rgba(22,101,52,0.2)] bg-[rgba(22,101,52,0.04)] p-6"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(22,101,52,0.1)] text-[var(--verified)]"
                        aria-hidden
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="editorial-kicker text-[var(--verified)]">
                          Nothing to verify
                        </p>
                        <h2
                          id={headingId}
                          className="mt-2 font-display text-[1.6rem] leading-tight tracking-[-0.035em] text-[var(--ink)]"
                        >
                          You didn&rsquo;t paste external content
                        </h2>
                        <p className="mt-2 text-[14px] leading-6 text-[var(--graphite)]">
                          Your submission was written in-session. There&rsquo;s nothing to check
                          before submitting — click below to finalize.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => void handleZeroSubmit()}
                        disabled={isSubmitting}
                        className="button-ink focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        ) : null}
                        {isSubmitting ? 'Submitting…' : 'Submit now'}
                      </button>
                    </div>
                  </motion.div>
                ) : null}

                {(phase === 'ready' || phase === 'grading') && currentQuestion ? (
                  <motion.div
                    key={`question-${currentIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.36, ease: EASE }}
                  >
                    {usedFallback ? (
                      <p className="mb-3 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--pending)]">
                        Using fallback prompts
                      </p>
                    ) : null}

                    {/* Passage card */}
                    <div className="rounded-[1.2rem] border border-[var(--bone)] bg-white/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono-ui text-[10px] uppercase tracking-[0.22em] text-[var(--ash)]">
                          Passage
                        </span>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono-ui text-[9.5px] uppercase tracking-[0.18em] ${
                            currentQuestion.difficulty === 'high'
                              ? 'border-[rgba(185,28,28,0.2)] bg-[rgba(185,28,28,0.05)] text-[var(--flagged)]'
                              : currentQuestion.difficulty === 'medium'
                                ? 'border-[rgba(161,98,7,0.2)] bg-[rgba(161,98,7,0.06)] text-[var(--pending)]'
                                : 'border-[rgba(22,101,52,0.2)] bg-[rgba(22,101,52,0.06)] text-[var(--verified)]'
                          }`}
                        >
                          {currentQuestion.difficulty}
                        </span>
                      </div>
                      <p className="mt-2 font-display text-[1.05rem] leading-7 tracking-[-0.01em] text-[var(--graphite)]">
                        &ldquo;{currentQuestion.excerpt}&rdquo;
                      </p>
                      {currentQuestion.passageText &&
                      currentQuestion.passageText.trim() !== currentQuestion.excerpt.trim() ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowFullPassage((v) => !v)}
                            className="focus-ring mt-3 font-mono-ui text-[10.5px] uppercase tracking-[0.2em] text-[var(--slate)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
                          >
                            {showFullPassage ? 'Hide full passage' : 'Show full passage'}
                          </button>
                          <AnimatePresence initial={false}>
                            {showFullPassage ? (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className="mt-3 overflow-hidden text-[13.5px] leading-6 text-[var(--slate)]"
                              >
                                {currentQuestion.passageText}
                              </motion.p>
                            ) : null}
                          </AnimatePresence>
                        </>
                      ) : null}
                    </div>

                    {/* Question */}
                    <div className="mt-5">
                      <p className="editorial-kicker">Question</p>
                      <p className="mt-2 font-display text-[1.2rem] leading-8 tracking-[-0.02em] text-[var(--ink)]">
                        {currentQuestion.question}
                      </p>
                    </div>

                    {/* Answer textarea */}
                    <textarea
                      ref={textareaRef}
                      value={currentAnswer}
                      onChange={(event) => setCurrentAnswer(event.target.value)}
                      disabled={isGrading}
                      placeholder="Answer in a few sentences, in your own words…"
                      className="mt-4 min-h-[10rem] w-full resize-none rounded-[1.2rem] border border-[var(--bone)] bg-white/90 px-4 py-3.5 text-[15px] leading-7 text-[var(--graphite)] outline-none transition focus:border-[rgba(10,10,10,0.18)] disabled:opacity-60"
                    />

                    {/* Grade error */}
                    {gradeError ? (
                      <div className="mt-3 rounded-[1rem] border border-[rgba(185,28,28,0.2)] bg-[rgba(185,28,28,0.04)] p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--flagged)]"
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-mono-ui text-[10.5px] uppercase tracking-[0.18em] text-[var(--flagged)]">
                              Grading failed
                            </p>
                            <p className="mt-1 text-[13px] leading-5 text-[var(--graphite)]">
                              {gradeError}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                              {canRetry ? (
                                <button
                                  type="button"
                                  onClick={() => void gradeCurrent()}
                                  disabled={isGrading || currentAnswer.trim().length === 0}
                                  className="focus-ring rounded-full border border-[rgba(185,28,28,0.3)] px-3 py-1 font-mono-ui text-[10.5px] uppercase tracking-[0.18em] text-[var(--flagged)] transition hover:bg-[rgba(185,28,28,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Retry grading
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleSkipGrade}
                                  className="focus-ring rounded-full border border-[var(--bone)] px-3 py-1 font-mono-ui text-[10.5px] uppercase tracking-[0.18em] text-[var(--slate)] transition hover:bg-[rgba(10,10,10,0.04)]"
                                >
                                  Skip this question
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Controls */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={onRequestSkipSubmit}
                        disabled={isGrading}
                        className="focus-ring font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--slate)] underline-offset-4 hover:text-[var(--flagged)] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Submit without verifying →
                      </button>
                      <button
                        type="button"
                        onClick={() => void gradeCurrent()}
                        disabled={isGrading || currentAnswer.trim().length === 0}
                        className="button-ink focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isGrading ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        ) : null}
                        {isGrading ? 'Grading…' : 'Submit answer'}
                      </button>
                    </div>
                  </motion.div>
                ) : null}

                {phase === 'question-result' && currentGrade ? (
                  <motion.div
                    key={`result-${currentIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.36, ease: EASE }}
                    className="rounded-[1.25rem] border border-[var(--bone)] bg-white/85 p-5"
                  >
                    <p className="editorial-kicker">Answer recorded</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <p
                        className={`font-mono-ui text-[13px] uppercase tracking-[0.16em] ${
                          currentGrade.score >= 7
                            ? 'text-[var(--verified)]'
                            : currentGrade.score >= 5
                              ? 'text-[var(--pending)]'
                              : 'text-[var(--flagged)]'
                        }`}
                      >
                        Score: {currentGrade.score} / 10
                      </p>
                      <p
                        className={`font-mono-ui text-[13px] uppercase tracking-[0.16em] ${
                          currentGrade.confidence === 'High'
                            ? 'text-[var(--verified)]'
                            : currentGrade.confidence === 'Medium'
                              ? 'text-[var(--pending)]'
                              : 'text-[var(--flagged)]'
                        }`}
                      >
                        Confidence: {currentGrade.confidence}
                      </p>
                    </div>

                    <p className="mt-4 text-[14.5px] leading-7 text-[var(--graphite)]">
                      {currentGrade.feedback}
                    </p>

                    <div className="mt-6 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleContinue}
                        className="button-ink focus-ring"
                      >
                        {currentIndex + 1 >= total ? 'See verdict →' : 'Continue →'}
                      </button>
                    </div>
                  </motion.div>
                ) : null}

                {phase === 'final-verdict' ? (
                  <motion.div
                    key="final"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.42, ease: EASE }}
                    className={`rounded-[1.3rem] border ${verdictTones.border} ${verdictTones.bg} p-5`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.7)] ${verdictTones.text}`}
                        aria-hidden
                      >
                        {verdict === 'verified' ? (
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        ) : verdict === 'review' ? (
                          <ShieldCheck className="h-4.5 w-4.5" />
                        ) : (
                          <AlertTriangle className="h-4.5 w-4.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`font-mono-ui text-[10.5px] uppercase tracking-[0.22em] ${verdictTones.text}`}
                        >
                          Final verification
                        </p>
                        <h3 className="mt-1 font-display text-[1.7rem] leading-tight tracking-[-0.035em] text-[var(--ink)]">
                          {verdictLabel(verdict)}
                        </h3>
                        <p className="mt-2 text-[14px] leading-7 text-[var(--graphite)]">
                          {verdictCopy(verdict)}
                        </p>
                        <p
                          className={`mt-4 font-mono-ui text-[11px] uppercase tracking-[0.18em] ${verdictTones.text}`}
                        >
                          {strongCount} of {total} strong answer{total === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={onRequestSkipSubmit}
                        disabled={isSubmitting}
                        className="focus-ring font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--slate)] underline-offset-4 hover:text-[var(--ink)] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel submission
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleFinalSubmit()}
                        disabled={isSubmitting}
                        className="button-ink focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        ) : null}
                        {isSubmitting ? 'Submitting…' : 'Submit and exit'}
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default FinalizeGate
