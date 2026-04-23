export type DemoSessionStatus = 'active' | 'completed' | 'abandoned' | 'submitted'
export type DemoFinalizeStatus = 'pending' | 'completed' | 'skipped'
export type DemoFinalizeVerdict = 'verified' | 'review' | 'flagged' | 'skipped'
export type DemoCheckStatus = 'scheduled' | 'warning' | 'active' | 'completed' | 'expired'
export type DemoEventKind =
  | 'session_started'
  | 'session_updated'
  | 'sample_copied'
  | 'paste_detected'
  | 'check_warning'
  | 'check_started'
  | 'check_submitted'
  | 'check_completed'
  | 'session_reset'
  | 'session_closed'
  | 'session_submitted'
  | 'finalize_opened'
  | 'finalize_skipped'

export type DemoSessionPayload = {
  firstName: string
  lastName: string
  assignmentName: string
  unitName: string
  startedAt: string
  metadata?: Record<string, unknown>
}

export type DemoSessionPatch = {
  sessionStatus?: DemoSessionStatus
  endedAt?: string | null
  contentHtml?: string
  wordCount?: number
  typedWords?: number
  pastedWords?: number
  pastedChars?: number
  pasteEvents?: number
  checksTriggered?: number
  checksCompleted?: number
  currentCheckState?: string
  lastPromptQuote?: string | null
  lastPromptQuestion?: string | null
  lastPastedText?: string | null
  lastOutcomeScore?: number | null
  lastOutcomeConfidence?: string | null
  lastOutcomeFeedback?: string | null
  minutesActive?: number
  metadata?: Record<string, unknown>
  finalizeStatus?: DemoFinalizeStatus | null
  finalizeVerdict?: DemoFinalizeVerdict | null
  finalizeQuestions?: unknown[] | null
  finalizeCompletedAt?: string | null
}

export type DemoEventPayload = {
  kind: DemoEventKind
  message: string
  payload?: Record<string, unknown>
}

export type DemoCheckCreatePayload = {
  promptQuote: string
  promptQuestion: string
  pastedText: string
  warningSeconds: number
  warningStartedAt: string
}

export type DemoCheckPatchPayload = {
  status?: DemoCheckStatus
  startedAt?: string | null
  submittedAt?: string | null
  answerText?: string | null
  score?: number | null
  confidence?: string | null
  feedback?: string | null
  followUp?: boolean | null
  durationSeconds?: number | null
}

// Recycle-bin constants (shared server + client).
export const DEMO_TRASH_RETENTION_DAYS = 30

export type DemoTrashSummary = {
  id: string
  firstName: string
  lastName: string
  assignmentName: string
  unitName: string
  startedAt: string
  sessionStatus?: string
  wordCount?: number
  deletedAt: string
  purgeAt: string
}

export type DemoBulkAction = 'delete' | 'restore' | 'purge'

export type DemoBulkPayload = {
  ids: string[]
}
