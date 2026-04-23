'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Activity,
  ArchiveRestore,
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Clock3,
  Database,
  FileText,
  Gauge,
  GraduationCap,
  LogOut,
  PenLine,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Undo2,
  UserRound,
} from 'lucide-react'
import { WritingEditor } from '@/components/trulearn/WritingEditor'
import { ConfirmDialog, type ConfirmDialogTone } from '@/components/ui/confirm-dialog'
import {
  FinalizeGate,
  type FinalizeSubmitPayload,
} from '@/components/demo/finalize-gate'
import type {
  DemoCheckCreatePayload,
  DemoCheckPatchPayload,
  DemoEventKind,
  DemoEventPayload,
  DemoSessionPatch,
  DemoSessionPayload,
  DemoTrashSummary,
} from '@/lib/demo-persistence'
import { DEMO_TRASH_RETENTION_DAYS } from '@/lib/demo-persistence'

type DemoStep = 'intake' | 'workspace'
type CheckState = 'idle' | 'warning' | 'active' | 'result'
type PersistenceState = 'idle' | 'saving' | 'saved' | 'error'

type DemoForm = {
  firstName: string
  lastName: string
  assignmentName: string
  unitName: string
}

type CheckOutcome = {
  score: number
  confidence: 'Low' | 'Medium' | 'High'
  feedback: string
  followUp: boolean
}

type PromptConfig = {
  quote: string
  question: string
  keywords: string[]
}

type DemoSessionSummary = {
  id: string
  firstName: string
  lastName: string
  assignmentName: string
  unitName: string
  startedAt: string
  endedAt?: string | null
  sessionStatus?: string
  wordCount?: number
  typedWords?: number
  pastedWords?: number
  pasteEvents?: number
  checksTriggered?: number
  checksCompleted?: number
  minutesActive?: number
  updatedAt?: string
}

type DemoSessionRecord = {
  id: string
  firstName: string
  lastName: string
  assignmentName: string
  unitName: string
  startedAt: string
  endedAt?: string | null
  sessionStatus?: string
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
}

const INITIAL_FORM: DemoForm = {
  firstName: '',
  lastName: '',
  assignmentName: '',
  unitName: '',
}

const demoParagraph = `The rapid proliferation of generative artificial intelligence in
higher education has fundamentally destabilized traditional
assessment paradigms. Authentication frameworks that relied on
content analysis — plagiarism detection, stylometric analysis,
and corpus matching — have been rendered increasingly obsolete
by transformer-based language models capable of producing
original, contextually appropriate prose at scale. This epistemic
rupture necessitates a methodological pivot from product-based
to process-based verification, wherein institutions assess not
the artifact itself but the cognitive engagement that produced
it. Such approaches center on demonstrable comprehension rather
than forensic text analysis, repositioning academic integrity as
an evidentiary rather than diagnostic concern.`

const defaultPrompt: PromptConfig = {
  quote:
    'This epistemic rupture necessitates a methodological pivot from product-based to process-based verification.',
  question:
    'Explain what you meant by “this epistemic rupture necessitates a methodological pivot from product-based to process-based verification.”',
  keywords: ['epistemic', 'methodological', 'process-based', 'product-based', 'verification'],
}

const fallbackPrompt: PromptConfig = {
  quote:
    'Stakeholder salience refers to the prioritization of stakeholder claims based on three interdependent attributes.',
  question:
    'Explain what you meant by “stakeholder salience refers to the prioritization of stakeholder claims based on three interdependent attributes.”',
  keywords: ['power', 'legitimacy', 'urgency', 'stakeholder'],
}

const ACTIVE_SESSION_KEY = 'uniportal-demo-active-session'
const FORM_DRAFT_KEY = 'uniportal-demo-form'

// Verify trigger thresholds — a paste must meet one of these to fire a check.
const VERIFY_PASTE_MIN_WORDS = 20
const VERIFY_PASTE_MIN_CHARS = 120

// Check timing
const VERIFY_WARNING_SECONDS = 10
const VERIFY_ACTIVE_SECONDS = 60
const VERIFY_PASTE_DELAY_MS = 900

// Adaptive cadence cooldowns (after a check completes, the next check is locked out for this long).
// Philosophy: stay out of the writer's way during flow. The real trust gate is the pre-submit
// verification step, not the live checks. Live checks exist to sample behaviour, not to grade.
const VERIFY_COOLDOWN_PASS_MS = 300_000 // 5 min after strong pass — system lays low
const VERIFY_COOLDOWN_PARTIAL_MS = 180_000 // 3 min after partial
const VERIFY_COOLDOWN_FAIL_MS = 120_000 // 2 min after fail/skip — still shortest tier, but no longer feels like harassment

type CadenceTier = 'relaxed' | 'standard' | 'heightened'
type QuestionSource = 'ai' | 'fallback'

type VerifyQuestionPayload = {
  question: string
  excerpt: string
  difficulty: 'low' | 'medium' | 'high'
}

type VerifyGradePayload = {
  score: number
  confidence: 'High' | 'Medium' | 'Low'
  feedback: string
  correct: boolean
}

function persistFormDraft(nextForm: DemoForm) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(nextForm))
  } catch (error) {
    console.error('Failed to persist demo form draft', error)
  }
}

async function requestJson<T>(url: string, options: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  const payload = (await response.json().catch(() => null)) as { error?: string } | null

  if (!response.ok) {
    throw new Error(payload?.error ?? 'Request failed.')
  }

  return payload as T
}

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function formatClock(date: Date | null) {
  if (!date) return '—'
  return date.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function derivePrompt(text: string): PromptConfig {
  if (text.toLowerCase().includes('epistemic rupture')) {
    return defaultPrompt
  }

  return fallbackPrompt
}

function promptFromStoredValues(quote?: string | null, question?: string | null): PromptConfig {
  const base =
    quote?.toLowerCase().includes('epistemic rupture') ||
    question?.toLowerCase().includes('epistemic rupture')
      ? defaultPrompt
      : fallbackPrompt

  return {
    ...base,
    quote: quote || base.quote,
    question: question || base.question,
  }
}

function evaluateAnswer(answer: string, prompt: PromptConfig): CheckOutcome {
  const normalized = answer.toLowerCase()
  const matches = prompt.keywords.filter((keyword) => normalized.includes(keyword.toLowerCase())).length

  if (matches >= 4) {
    return {
      score: 9,
      confidence: 'High',
      followUp: false,
      feedback:
        'The response identifies the conceptual pivot clearly and shows direct understanding of the underlying verification model.',
    }
  }

  if (matches >= 2) {
    return {
      score: 6,
      confidence: 'Medium',
      followUp: true,
      feedback:
        'The answer captures part of the concept, but it remains too general and does not fully explain the operative terms in the source passage.',
    }
  }

  return {
    score: 3,
    confidence: 'Low',
    followUp: true,
    feedback:
      'The answer paraphrases around the sentence without demonstrating clear understanding of the dense terms or the process-based verification shift.',
  }
}

function ToneChip({
  label,
  tone,
}: {
  label: string
  tone: 'neutral' | 'verified' | 'pending' | 'flagged' | 'accent'
}) {
  const tones = {
    neutral:
      'border-[var(--bone)] bg-[rgba(255,255,255,0.75)] text-[var(--graphite)]',
    verified:
      'border-[rgba(21,128,61,0.12)] bg-[rgba(21,128,61,0.06)] text-[var(--verified)]',
    pending:
      'border-[rgba(161,98,7,0.12)] bg-[rgba(161,98,7,0.06)] text-[var(--pending)]',
    flagged:
      'border-[rgba(185,28,28,0.12)] bg-[rgba(185,28,28,0.06)] text-[var(--flagged)]',
    accent:
      'border-[rgba(30,64,175,0.12)] bg-[rgba(30,64,175,0.06)] text-[var(--accent-strong)]',
  } as const

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 font-mono-ui text-[11px] uppercase tracking-[0.18em] ${tones[tone]}`}
    >
      {label}
    </span>
  )
}

function StatTile({
  label,
  value,
  hint,
  tone = 'neutral',
  icon,
}: {
  label: string
  value: string | number
  hint?: string
  tone?: 'neutral' | 'verified' | 'pending' | 'flagged' | 'accent'
  icon?: React.ReactNode
}) {
  const accents = {
    neutral: 'text-[var(--ink)]',
    verified: 'text-[var(--verified)]',
    pending: 'text-[var(--pending)]',
    flagged: 'text-[var(--flagged)]',
    accent: 'text-[var(--accent-strong)]',
  } as const

  return (
    <div className="relative overflow-hidden rounded-[1.2rem] border border-[var(--bone)] bg-white/78 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--ash)]">
          {label}
        </span>
        {icon ? <span className="text-[var(--slate)]">{icon}</span> : null}
      </div>
      <div className={`mt-2 font-display text-[1.85rem] leading-none tracking-[-0.03em] ${accents[tone]}`}>
        {value}
      </div>
      {hint ? (
        <div className="mt-1 text-[11px] leading-5 text-[var(--slate)]">{hint}</div>
      ) : null}
    </div>
  )
}

function ProgressBar({
  value,
  tone = 'verified',
}: {
  value: number
  tone?: 'verified' | 'pending' | 'flagged' | 'accent'
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const fill = {
    verified: 'bg-[var(--verified)]',
    pending: 'bg-[var(--pending)]',
    flagged: 'bg-[var(--flagged)]',
    accent: 'bg-[var(--accent-strong)]',
  }[tone]
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(10,10,10,0.06)]">
      <div
        className={`h-full ${fill} transition-[width] duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

function SidebarCard({
  kicker,
  title,
  children,
  className,
  bodyClassName,
}: {
  kicker: string
  title: string
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={`paper-panel rounded-[1.8rem] p-5 md:p-6${className ? ` ${className}` : ''}`}>
      <p className="editorial-kicker">{kicker}</p>
      <h2 className="mt-3 font-display text-[2rem] leading-none tracking-[-0.045em] text-[var(--ink)]">
        {title}
      </h2>
      <div className={`mt-5${bodyClassName ? ` ${bodyClassName}` : ''}`}>{children}</div>
    </section>
  )
}

function formatRelativeDate(iso: string) {
  try {
    const date = new Date(iso)
    const diffMs = Date.now() - date.getTime()
    const diffMin = Math.round(diffMs / 60000)
    if (diffMin < 1) return 'just now'
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHr = Math.round(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h ago`
    const diffDay = Math.round(diffHr / 24)
    if (diffDay < 7) return `${diffDay}d ago`
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

function statusToneFor(status?: string): 'verified' | 'pending' | 'neutral' | 'flagged' {
  if (status === 'completed') return 'verified'
  if (status === 'active') return 'pending'
  if (status === 'abandoned') return 'neutral'
  return 'neutral'
}

function statusLabelFor(status?: string): string {
  if (status === 'completed') return 'Completed'
  if (status === 'active') return 'In progress'
  if (status === 'abandoned') return 'Paused'
  return status ?? 'Active'
}

type PastSessionsView = 'active' | 'trash'

function formatPurgeCountdown(purgeAt: string): string {
  const ms = new Date(purgeAt).getTime() - Date.now()
  if (!Number.isFinite(ms)) return 'Purge scheduled'
  if (ms <= 0) return 'Purge imminent'
  const days = Math.floor(ms / (24 * 60 * 60 * 1000))
  if (days >= 1) return `Purges in ${days} day${days === 1 ? '' : 's'}`
  const hours = Math.floor(ms / (60 * 60 * 1000))
  if (hours >= 1) return `Purges in ${hours} hr${hours === 1 ? '' : 's'}`
  const minutes = Math.max(1, Math.floor(ms / (60 * 1000)))
  return `Purges in ${minutes} min`
}

function PastSessionsPanel({
  sessions,
  trashSessions,
  isLoading,
  isLoadingTrash,
  view,
  onViewChange,
  selectedIds,
  onToggleSelect,
  onClearSelection,
  onSelectAllVisible,
  onResume,
  onPrefill,
  onRequestDelete,
  onRequestBulkDelete,
  onRequestDeleteAll,
  onRequestRestore,
  onRequestBulkRestore,
  onRequestPurge,
  onRequestBulkPurge,
  onRequestEmptyTrash,
}: {
  sessions: DemoSessionSummary[]
  trashSessions: DemoTrashSummary[]
  isLoading: boolean
  isLoadingTrash: boolean
  view: PastSessionsView
  onViewChange: (next: PastSessionsView) => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onClearSelection: () => void
  onSelectAllVisible: () => void
  onResume: (sessionId: string) => void
  onPrefill: (session: DemoSessionSummary) => void
  onRequestDelete: (session: DemoSessionSummary) => void
  onRequestBulkDelete: () => void
  onRequestDeleteAll: () => void
  onRequestRestore: (session: DemoTrashSummary) => void
  onRequestBulkRestore: () => void
  onRequestPurge: (session: DemoTrashSummary) => void
  onRequestBulkPurge: () => void
  onRequestEmptyTrash: () => void
}) {
  const grouped = new Map<string, { firstName: string; lastName: string; sessions: DemoSessionSummary[] }>()
  sessions.forEach((session) => {
    const key = `${session.firstName.toLowerCase()}|${session.lastName.toLowerCase()}`
    const bucket = grouped.get(key)
    if (bucket) {
      bucket.sessions.push(session)
    } else {
      grouped.set(key, {
        firstName: session.firstName,
        lastName: session.lastName,
        sessions: [session],
      })
    }
  })

  const groups = Array.from(grouped.values()).sort((a, b) => {
    const latestA = a.sessions[0]?.startedAt ?? ''
    const latestB = b.sessions[0]?.startedAt ?? ''
    return latestB.localeCompare(latestA)
  })

  const activeCount = sessions.length
  const trashCount = trashSessions.length
  const selectionCount = selectedIds.size
  const visibleIds = view === 'active' ? sessions.map((s) => s.id) : trashSessions.map((s) => s.id)
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id))

  const currentLoading = view === 'active' ? isLoading : isLoadingTrash

  const tabClass = (isActive: boolean) =>
    `inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors ${
      isActive
        ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
        : 'border-[var(--bone)] bg-white/70 text-[var(--slate)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
    }`

  return (
    <div className="paper-panel mt-12 rounded-[2.2rem] p-6 shadow-[0_28px_90px_rgba(10,10,10,0.08)] md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--bone)] pb-5">
        <div>
          <p className="editorial-kicker">Past sessions</p>
          <h2 className="mt-3 font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--ink)]">
            {view === 'active' ? 'Resume a prior draft' : 'Recycle bin'}
          </h2>
          <p className="mt-2 max-w-[44rem] text-sm leading-7 text-[var(--slate)]">
            {view === 'active'
              ? 'Every prior session is preserved automatically. Pick a student to see their sessions, resume the writing, prefill the form, or move a session to the recycle bin.'
              : `Deleted sessions stay here for ${DEMO_TRASH_RETENTION_DAYS} days, then they're permanently removed. Restore what you still need or empty the bin to purge everything now.`}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                currentLoading ? 'animate-pulse bg-[var(--pending)]' : 'bg-[var(--verified)]'
              }`}
              aria-hidden
            />
            {currentLoading ? 'Syncing…' : 'Live · auto-refreshing'}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" className={tabClass(view === 'active')} onClick={() => onViewChange('active')}>
          <FileText className="h-3.5 w-3.5" />
          Active
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] tracking-[0.12em] ${
              view === 'active' ? 'bg-white/15 text-[var(--paper)]' : 'bg-[var(--bone)] text-[var(--slate)]'
            }`}
          >
            {activeCount}
          </span>
        </button>
        <button type="button" className={tabClass(view === 'trash')} onClick={() => onViewChange('trash')}>
          <Trash2 className="h-3.5 w-3.5" />
          Recycle bin
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] tracking-[0.12em] ${
              view === 'trash' ? 'bg-white/15 text-[var(--paper)]' : 'bg-[var(--bone)] text-[var(--slate)]'
            }`}
          >
            {trashCount}
          </span>
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {visibleIds.length > 0 ? (
            <button
              type="button"
              onClick={allVisibleSelected ? onClearSelection : onSelectAllVisible}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--bone)] bg-white/70 px-4 py-1.5 text-xs font-medium text-[var(--slate)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              {allVisibleSelected ? 'Clear selection' : 'Select all'}
            </button>
          ) : null}

          {view === 'active' && activeCount > 0 ? (
            <button
              type="button"
              onClick={onRequestDeleteAll}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/70 px-4 py-1.5 text-xs font-medium text-red-700 transition-colors hover:border-red-400 hover:bg-red-50"
              title="Move every active session to the recycle bin. You'll have 30 days to restore them."
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete all
            </button>
          ) : null}

          {view === 'trash' && trashCount > 0 ? (
            <button
              type="button"
              onClick={onRequestEmptyTrash}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/70 px-4 py-1.5 text-xs font-medium text-red-700 transition-colors hover:border-red-400 hover:bg-red-50"
              title="Permanently delete everything in the recycle bin. This cannot be undone."
            >
              <Trash2 className="h-3.5 w-3.5" />
              Empty bin
            </button>
          ) : null}
        </div>
      </div>

      {selectionCount > 0 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-[var(--ink)] bg-[var(--ink)]/95 px-4 py-3 text-[var(--paper)]">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-white/70">Selected</span>
            <span className="font-display text-lg leading-none">{selectionCount}</span>
            <span className="text-xs text-white/60">
              {view === 'active' ? 'ready to move to the recycle bin' : 'ready to restore or permanently delete'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/0 px-3 py-1.5 text-xs text-white/85 transition-colors hover:bg-white/10"
            >
              Clear
            </button>
            {view === 'active' ? (
              <button
                type="button"
                onClick={onRequestBulkDelete}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete {selectionCount}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onRequestBulkRestore}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
                >
                  <ArchiveRestore className="h-3.5 w-3.5" />
                  Restore {selectionCount}
                </button>
                <button
                  type="button"
                  onClick={onRequestBulkPurge}
                  className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete forever
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      {view === 'active' ? (
        groups.length === 0 ? (
          <p className="mt-6 text-sm leading-7 text-[var(--slate)]">
            {isLoading ? 'Loading past sessions…' : 'No sessions yet. Start one above to see it appear here.'}
          </p>
        ) : (
          <div className="mt-6 space-y-6">
            {groups.map((group) => (
              <div
                key={`${group.firstName}-${group.lastName}`}
                className="rounded-[1.5rem] border border-[var(--bone)] bg-[rgba(255,255,255,0.6)] p-5 md:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserRound className="h-4 w-4 text-[var(--ash)]" />
                    <p className="font-display text-[1.35rem] leading-none tracking-[-0.03em] text-[var(--ink)]">
                      {group.firstName} {group.lastName}
                    </p>
                    <ToneChip
                      label={`${group.sessions.length} session${group.sessions.length === 1 ? '' : 's'}`}
                      tone="neutral"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onPrefill(group.sessions[0])}
                    className="button-secondary focus-ring"
                    title="Copy this student's name, assignment and unit into the form above so you can start a new session without retyping."
                  >
                    Prefill the form
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  {group.sessions.map((session) => {
                    const selected = selectedIds.has(session.id)
                    return (
                      <div
                        key={session.id}
                        className={`flex flex-wrap items-center justify-between gap-4 rounded-[1.2rem] border bg-white px-4 py-3 transition-colors md:px-5 md:py-4 ${
                          selected ? 'border-[var(--ink)] shadow-[0_0_0_1px_var(--ink)]' : 'border-[var(--bone)]'
                        }`}
                      >
                        <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => onToggleSelect(session.id)}
                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-[var(--bone)] text-[var(--ink)] focus:ring-[var(--ink)]"
                            aria-label={`Select session for ${session.assignmentName}`}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-display text-[1.05rem] text-[var(--ink)]">
                                {session.assignmentName}
                              </p>
                              <ToneChip
                                label={statusLabelFor(session.sessionStatus)}
                                tone={statusToneFor(session.sessionStatus)}
                              />
                            </div>
                            <p className="mt-1 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--ash)]">
                              {session.unitName} · started {formatRelativeDate(session.startedAt)} ·{' '}
                              {session.wordCount ?? 0} words · {session.minutesActive ?? 0} min
                            </p>
                          </div>
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onResume(session.id)}
                            className="button-ink focus-ring"
                          >
                            Resume
                          </button>
                          <button
                            type="button"
                            onClick={() => onRequestDelete(session)}
                            className="inline-flex items-center justify-center rounded-full border border-[var(--bone)] bg-white/80 p-2 text-[var(--slate)] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                            title="Move this session to the recycle bin"
                            aria-label={`Delete session for ${session.assignmentName}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      ) : trashCount === 0 ? (
        <p className="mt-6 text-sm leading-7 text-[var(--slate)]">
          {isLoadingTrash
            ? 'Loading recycle bin…'
            : 'The recycle bin is empty. Deleted sessions will appear here and stay for 30 days before being permanently removed.'}
        </p>
      ) : (
        <div className="mt-6 grid gap-3">
          {trashSessions.map((session) => {
            const selected = selectedIds.has(session.id)
            return (
              <div
                key={session.id}
                className={`flex flex-wrap items-center justify-between gap-4 rounded-[1.2rem] border bg-white px-4 py-3 transition-colors md:px-5 md:py-4 ${
                  selected ? 'border-[var(--ink)] shadow-[0_0_0_1px_var(--ink)]' : 'border-[var(--bone)]'
                }`}
              >
                <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelect(session.id)}
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-[var(--bone)] text-[var(--ink)] focus:ring-[var(--ink)]"
                    aria-label={`Select trashed session for ${session.assignmentName}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-display text-[1.05rem] text-[var(--ink)]">
                        {session.assignmentName || 'Untitled assignment'}
                      </p>
                      <ToneChip label={statusLabelFor(session.sessionStatus)} tone={statusToneFor(session.sessionStatus)} />
                      <ToneChip label={formatPurgeCountdown(session.purgeAt)} tone="pending" />
                    </div>
                    <p className="mt-1 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--ash)]">
                      {session.firstName} {session.lastName} · {session.unitName || 'Unit —'} · started{' '}
                      {formatRelativeDate(session.startedAt)} · deleted {formatRelativeDate(session.deletedAt)} ·{' '}
                      {session.wordCount ?? 0} words
                    </p>
                  </div>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRequestRestore(session)}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3.5 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                    Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => onRequestPurge(session)}
                    className="inline-flex items-center justify-center rounded-full border border-[var(--bone)] bg-white/80 p-2 text-[var(--slate)] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                    title="Permanently delete this session"
                    aria-label={`Permanently delete session for ${session.assignmentName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function DemoPage() {
  const router = useRouter()
  const answerRef = useRef('')
  const warningTimerRef = useRef<number | null>(null)
  const activeTimerRef = useRef<number | null>(null)
  const formRef = useRef<DemoForm>(INITIAL_FORM)

  const [step, setStep] = useState<DemoStep>('intake')
  const [form, setForm] = useState<DemoForm>(INITIAL_FORM)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentCheckId, setCurrentCheckId] = useState<string | null>(null)
  const [startedAt, setStartedAt] = useState<Date | null>(null)
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const sessionSecondsRef = useRef(0)
  const sessionMetadataRef = useRef<Record<string, unknown>>({})
  const [isStarting, setIsStarting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(true)
  const [persistenceState, setPersistenceState] = useState<PersistenceState>('idle')
  const [persistenceMessage, setPersistenceMessage] = useState('Ready to start a live session')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [typedWords, setTypedWords] = useState(0)
  const [pastedWords, setPastedWords] = useState(0)
  const [pastedChars, setPastedChars] = useState(0)
  const [pasteEvents, setPasteEvents] = useState(0)

  const [checkState, setCheckState] = useState<CheckState>('idle')
  const [warningSeconds, setWarningSeconds] = useState(VERIFY_WARNING_SECONDS)
  const [checkSeconds, setCheckSeconds] = useState(VERIFY_ACTIVE_SECONDS)
  const [answer, setAnswer] = useState('')
  const [prompt, setPrompt] = useState<PromptConfig>(defaultPrompt)
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null)
  const [checksTriggered, setChecksTriggered] = useState(0)
  const [checksCompleted, setChecksCompleted] = useState(0)
  const [lastPastedText, setLastPastedText] = useState('')
  // Full history of every paste event, in order. Fed to the pre-submit Verify gate so it can
  // pick which passages to quiz on. Capped at 10 entries × 3000 chars each when persisted.
  const [pastedTextsHistory, setPastedTextsHistory] = useState<string[]>([])
  const pastedTextsHistoryRef = useRef<string[]>([])
  // Pre-submit verification gate
  const [finalizeGateOpen, setFinalizeGateOpen] = useState(false)
  const [isSubmittingFinalize, setIsSubmittingFinalize] = useState(false)
  // Adaptive + AI state
  const [cadenceTier, setCadenceTier] = useState<CadenceTier>('standard')
  const [nextAllowedCheckAt, setNextAllowedCheckAt] = useState<number | null>(null)
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false)
  const [isGrading, setIsGrading] = useState(false)
  const [questionSource, setQuestionSource] = useState<QuestionSource>('fallback')
  const [skippedThisCheck, setSkippedThisCheck] = useState(false)
  const checkStateRef = useRef<CheckState>('idle')
  const nextAllowedCheckAtRef = useRef<number | null>(null)
  const pastedTextForCheckRef = useRef<string>('')
  const resultDismissTimerRef = useRef<number | null>(null)
  // Single-shot guard: set to true on the FIRST completeCheck call for a trigger session,
  // reset when a new trigger session begins. Prevents duplicate completions from leaked
  // timers, strict-mode updater replays, or late async callbacks.
  const checkCompletedRef = useRef<boolean>(true)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [copied, setCopied] = useState(false)
  const [nowTick, setNowTick] = useState(() => Date.now())
  const [eventLog, setEventLog] = useState<Array<{ message: string; at: number }>>(() => {
    const now = Date.now()
    return [
      { message: 'Demo workspace idle', at: now },
      { message: 'Start a session to begin capturing evidence', at: now },
    ]
  })
  const [pastSessions, setPastSessions] = useState<DemoSessionSummary[]>([])
  const [isLoadingPast, setIsLoadingPast] = useState(false)
  const [trashSessions, setTrashSessions] = useState<DemoTrashSummary[]>([])
  const [isLoadingTrash, setIsLoadingTrash] = useState(false)
  const [pastSessionsView, setPastSessionsView] = useState<PastSessionsView>('active')
  const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(() => new Set())
  const [confirmState, setConfirmState] = useState<{
    open: boolean
    tone: ConfirmDialogTone
    title: string
    description: React.ReactNode
    confirmLabel: string
    busy: boolean
    onConfirm: () => Promise<void>
  } | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  const updateFormField = useCallback(
    <K extends keyof DemoForm>(field: K, value: DemoForm[K]) => {
      setForm((current) => {
        const nextForm = { ...current, [field]: value }
        persistFormDraft(nextForm)
        return nextForm
      })
    },
    []
  )

  useEffect(() => {
    answerRef.current = answer
  }, [answer])

  useEffect(() => {
    formRef.current = form
  }, [form])

  useEffect(() => {
    checkStateRef.current = checkState
  }, [checkState])

  useEffect(() => {
    nextAllowedCheckAtRef.current = nextAllowedCheckAt
  }, [nextAllowedCheckAt])

  // Clear the auto-dismiss timer if the user reloads or navigates away.
  useEffect(() => {
    return () => {
      if (resultDismissTimerRef.current) {
        window.clearTimeout(resultDismissTimerRef.current)
        resultDismissTimerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const savedForm = window.localStorage.getItem(FORM_DRAFT_KEY)
      if (!savedForm) return

      const parsed = JSON.parse(savedForm) as Partial<DemoForm>
      setForm((current) => ({
        firstName: parsed.firstName ?? current.firstName,
        lastName: parsed.lastName ?? current.lastName,
        assignmentName: parsed.assignmentName ?? current.assignmentName,
        unitName: parsed.unitName ?? current.unitName,
      }))
    } catch (error) {
      console.error('Failed to restore demo form draft', error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || step !== 'intake') return

    const persistDraftOnPageHide = () => {
      persistFormDraft(form)
    }

    window.addEventListener('pagehide', persistDraftOnPageHide)
    return () => window.removeEventListener('pagehide', persistDraftOnPageHide)
  }, [form, step])

  useEffect(() => {
    if (step !== 'workspace') return
    const tick = window.setInterval(() => setNowTick(Date.now()), 15000)
    return () => window.clearInterval(tick)
  }, [step])

  useEffect(() => {
    if (step !== 'workspace') return
    let visible = typeof document === 'undefined' || document.visibilityState === 'visible'
    const timer = window.setInterval(() => {
      if (visible) {
        setSessionSeconds((value) => {
          const next = value + 1
          sessionSecondsRef.current = next
          return next
        })
      }
    }, 1000)
    const onVisibility = () => {
      const nextVisible = document.visibilityState === 'visible'
      if (visible && !nextVisible) {
        setTabSwitches((n) => n + 1)
      }
      visible = nextVisible
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [step])

  useEffect(() => {
    return () => {
      if (warningTimerRef.current) window.clearInterval(warningTimerRef.current)
      if (activeTimerRef.current) window.clearInterval(activeTimerRef.current)
    }
  }, [])

  const persistEventFor = useCallback(async (targetSessionId: string, event: DemoEventPayload) => {
    await requestJson<{ ok: true }>(`/api/demo/sessions/${targetSessionId}/events`, {
      method: 'POST',
      body: JSON.stringify(event),
    })
  }, [])

  const patchCheckRecord = useCallback(
    async (targetSessionId: string, targetCheckId: string, payload: DemoCheckPatchPayload) => {
      await requestJson<{ ok: true }>(
        `/api/demo/sessions/${targetSessionId}/checks/${targetCheckId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }
      )
    },
    []
  )

  const appendEvent = useCallback(
    (kind: DemoEventKind, message: string, payload: Record<string, unknown> = {}, targetSessionId = sessionId) => {
      setEventLog((current) => [{ message, at: Date.now() }, ...current].slice(0, 8))

      if (!targetSessionId) return

      void persistEventFor(targetSessionId, {
        kind,
        message,
        payload,
      }).catch((error) => {
        console.error('Failed to persist demo event', error)
        setPersistenceState('error')
        setPersistenceMessage('Event sync failed')
      })
    },
    [persistEventFor, sessionId]
  )

  const buildSessionSnapshot = useCallback(
    (overrides: DemoSessionPatch = {}): DemoSessionPatch => ({
      contentHtml: content,
      wordCount,
      typedWords,
      pastedWords,
      pastedChars,
      pasteEvents,
      checksTriggered,
      checksCompleted,
      currentCheckState: checkState,
      lastPromptQuote: prompt.quote,
      lastPromptQuestion: prompt.question,
      lastPastedText: lastPastedText || null,
      lastOutcomeScore: outcome?.score ?? null,
      lastOutcomeConfidence: outcome?.confidence ?? null,
      lastOutcomeFeedback: outcome?.feedback ?? null,
      minutesActive: Math.floor(sessionSecondsRef.current / 60),
      metadata: {
        ...sessionMetadataRef.current,
        seconds_active: sessionSecondsRef.current,
        paste_history: pastedTextsHistoryRef.current,
      },
      ...overrides,
    }),
    [
      checkState,
      checksCompleted,
      checksTriggered,
      content,
      lastPastedText,
      outcome,
      pasteEvents,
      pastedChars,
      pastedWords,
      prompt.question,
      prompt.quote,
      typedWords,
      wordCount,
    ]
  )

  const persistSessionPatch = useCallback(
    async (patch: DemoSessionPatch, options?: { silent?: boolean }) => {
      if (!sessionId) return

      if (!options?.silent) {
        setPersistenceState('saving')
        setPersistenceMessage('Saving...')
      }

      try {
        await requestJson<{ ok: true }>(`/api/demo/sessions/${sessionId}`, {
          method: 'PATCH',
          body: JSON.stringify(patch),
        })
        setLastSavedAt(new Date())
        setPersistenceState('saved')
        setPersistenceMessage('Saved securely')
      } catch (error) {
        console.error('Failed to persist session patch', error)
        setPersistenceState('error')
        setPersistenceMessage('Autosave failed — retrying')
        throw error
      }
    },
    [sessionId]
  )

  const loadPastSessions = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) setIsLoadingPast(true)
    try {
      const data = await requestJson<{ sessions: DemoSessionSummary[] }>('/api/demo/sessions?limit=100', {
        method: 'GET',
      })
      setPastSessions(data.sessions ?? [])
    } catch (error) {
      console.error('Failed to load past sessions', error)
    } finally {
      if (!silent) setIsLoadingPast(false)
    }
  }, [])

  const loadTrashSessions = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) setIsLoadingTrash(true)
    try {
      const data = await requestJson<{ sessions: DemoTrashSummary[] }>('/api/demo/sessions/trash?limit=200', {
        method: 'GET',
      })
      setTrashSessions(data.sessions ?? [])
    } catch (error) {
      console.error('Failed to load trashed sessions', error)
    } finally {
      if (!silent) setIsLoadingTrash(false)
    }
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedSessionIds(new Set())
  }, [])

  const toggleSessionSelection = useCallback((id: string) => {
    setSelectedSessionIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleViewChange = useCallback(
    (next: PastSessionsView) => {
      setPastSessionsView(next)
      clearSelection()
      if (next === 'trash') {
        void loadTrashSessions()
      } else {
        void loadPastSessions({ silent: true })
      }
    },
    [clearSelection, loadPastSessions, loadTrashSessions]
  )

  const selectAllVisible = useCallback(() => {
    setSelectedSessionIds(() => {
      const next = new Set<string>()
      if (pastSessionsView === 'active') {
        pastSessions.forEach((session) => next.add(session.id))
      } else {
        trashSessions.forEach((session) => next.add(session.id))
      }
      return next
    })
  }, [pastSessions, pastSessionsView, trashSessions])

  const closeConfirm = useCallback(() => {
    setConfirmState((current) => (current ? { ...current, open: false } : current))
    window.setTimeout(() => setConfirmState(null), 150)
  }, [])

  const runConfirm = useCallback(
    (config: {
      tone: ConfirmDialogTone
      title: string
      description: React.ReactNode
      confirmLabel: string
      action: () => Promise<void>
    }) => {
      setConfirmState({
        open: true,
        tone: config.tone,
        title: config.title,
        description: config.description,
        confirmLabel: config.confirmLabel,
        busy: false,
        onConfirm: async () => {
          setConfirmState((current) => (current ? { ...current, busy: true } : current))
          try {
            await config.action()
            closeConfirm()
          } catch (error) {
            console.error('Confirm action failed', error)
            const message = error instanceof Error ? error.message : 'Action failed. Please try again.'
            setPersistenceState('error')
            setPersistenceMessage(message)
            setConfirmState((current) => (current ? { ...current, busy: false } : current))
          }
        },
      })
    },
    [closeConfirm]
  )

  const refreshLists = useCallback(
    async ({ silent = true }: { silent?: boolean } = {}) => {
      await Promise.all([loadPastSessions({ silent }), loadTrashSessions({ silent })])
    },
    [loadPastSessions, loadTrashSessions]
  )

  const requestDeleteSingle = useCallback(
    (session: DemoSessionSummary) => {
      runConfirm({
        tone: 'warning',
        title: 'Move session to the recycle bin?',
        description: (
          <>
            <span className="font-medium text-[var(--ink)]">
              {session.firstName} {session.lastName}
            </span>{' '}
            — {session.assignmentName || 'Untitled assignment'} ({session.unitName || 'Unit —'}). The session will stay
            in the recycle bin for {DEMO_TRASH_RETENTION_DAYS} days, then it is permanently deleted.
          </>
        ),
        confirmLabel: 'Move to recycle bin',
        action: async () => {
          await requestJson<{ ok: true }>(`/api/demo/sessions/${session.id}`, { method: 'DELETE' })
          setSelectedSessionIds((current) => {
            const next = new Set(current)
            next.delete(session.id)
            return next
          })
          setPersistenceState('saved')
          setPersistenceMessage('Session moved to recycle bin')
          await refreshLists()
        },
      })
    },
    [refreshLists, runConfirm]
  )

  const requestBulkDelete = useCallback(() => {
    const ids = Array.from(selectedSessionIds)
    if (ids.length === 0) return
    runConfirm({
      tone: 'warning',
      title: `Move ${ids.length} session${ids.length === 1 ? '' : 's'} to the recycle bin?`,
      description: (
        <>
          Selected sessions will stay in the recycle bin for {DEMO_TRASH_RETENTION_DAYS} days before being permanently
          deleted. You can restore them at any time before then.
        </>
      ),
      confirmLabel: `Move ${ids.length} to recycle bin`,
      action: async () => {
        await requestJson<{ ok: true }>(`/api/demo/sessions/bulk`, {
          method: 'POST',
          body: JSON.stringify({ action: 'delete', ids }),
        })
        clearSelection()
        setPersistenceState('saved')
        setPersistenceMessage(`${ids.length} session${ids.length === 1 ? '' : 's'} moved to recycle bin`)
        await refreshLists()
      },
    })
  }, [clearSelection, refreshLists, runConfirm, selectedSessionIds])

  const requestDeleteAll = useCallback(() => {
    const ids = pastSessions.map((session) => session.id)
    if (ids.length === 0) return
    runConfirm({
      tone: 'danger',
      title: `Move all ${ids.length} session${ids.length === 1 ? '' : 's'} to the recycle bin?`,
      description: (
        <>
          This will move every visible active session to the recycle bin. They will stay there for{' '}
          {DEMO_TRASH_RETENTION_DAYS} days and can be restored from the bin until then.
        </>
      ),
      confirmLabel: 'Move all to recycle bin',
      action: async () => {
        await requestJson<{ ok: true }>(`/api/demo/sessions/bulk`, {
          method: 'POST',
          body: JSON.stringify({ action: 'delete', ids }),
        })
        clearSelection()
        setPersistenceState('saved')
        setPersistenceMessage(`${ids.length} session${ids.length === 1 ? '' : 's'} moved to recycle bin`)
        await refreshLists()
      },
    })
  }, [clearSelection, pastSessions, refreshLists, runConfirm])

  const requestRestoreSingle = useCallback(
    (session: DemoTrashSummary) => {
      runConfirm({
        tone: 'default',
        title: 'Restore this session?',
        description: (
          <>
            <span className="font-medium text-[var(--ink)]">
              {session.firstName} {session.lastName}
            </span>{' '}
            — {session.assignmentName || 'Untitled assignment'} will be restored to the active list.
          </>
        ),
        confirmLabel: 'Restore session',
        action: async () => {
          await requestJson<{ ok: true }>(`/api/demo/sessions/${session.id}/restore`, { method: 'POST' })
          setSelectedSessionIds((current) => {
            const next = new Set(current)
            next.delete(session.id)
            return next
          })
          setPersistenceState('saved')
          setPersistenceMessage('Session restored')
          await refreshLists()
        },
      })
    },
    [refreshLists, runConfirm]
  )

  const requestBulkRestore = useCallback(() => {
    const ids = Array.from(selectedSessionIds)
    if (ids.length === 0) return
    runConfirm({
      tone: 'default',
      title: `Restore ${ids.length} session${ids.length === 1 ? '' : 's'}?`,
      description: <>Selected sessions will return to the active list.</>,
      confirmLabel: `Restore ${ids.length}`,
      action: async () => {
        await requestJson<{ ok: true }>(`/api/demo/sessions/bulk`, {
          method: 'POST',
          body: JSON.stringify({ action: 'restore', ids }),
        })
        clearSelection()
        setPersistenceState('saved')
        setPersistenceMessage(`${ids.length} session${ids.length === 1 ? '' : 's'} restored`)
        await refreshLists()
      },
    })
  }, [clearSelection, refreshLists, runConfirm, selectedSessionIds])

  const requestPurgeSingle = useCallback(
    (session: DemoTrashSummary) => {
      runConfirm({
        tone: 'danger',
        title: 'Permanently delete this session?',
        description: (
          <>
            <span className="font-medium text-[var(--ink)]">
              {session.firstName} {session.lastName}
            </span>{' '}
            — {session.assignmentName || 'Untitled assignment'}. This cannot be undone. All stored writing, events and
            check records for this session will be erased.
          </>
        ),
        confirmLabel: 'Delete forever',
        action: async () => {
          await requestJson<{ ok: true }>(`/api/demo/sessions/${session.id}/purge`, { method: 'DELETE' })
          setSelectedSessionIds((current) => {
            const next = new Set(current)
            next.delete(session.id)
            return next
          })
          setPersistenceState('saved')
          setPersistenceMessage('Session permanently deleted')
          await refreshLists()
        },
      })
    },
    [refreshLists, runConfirm]
  )

  const requestBulkPurge = useCallback(() => {
    const ids = Array.from(selectedSessionIds)
    if (ids.length === 0) return
    runConfirm({
      tone: 'danger',
      title: `Permanently delete ${ids.length} session${ids.length === 1 ? '' : 's'}?`,
      description: (
        <>
          This cannot be undone. All stored writing, events and check records for the selected sessions will be erased.
        </>
      ),
      confirmLabel: `Delete ${ids.length} forever`,
      action: async () => {
        await requestJson<{ ok: true }>(`/api/demo/sessions/bulk`, {
          method: 'POST',
          body: JSON.stringify({ action: 'purge', ids }),
        })
        clearSelection()
        setPersistenceState('saved')
        setPersistenceMessage(`${ids.length} session${ids.length === 1 ? '' : 's'} permanently deleted`)
        await refreshLists()
      },
    })
  }, [clearSelection, refreshLists, runConfirm, selectedSessionIds])

  const requestEmptyTrash = useCallback(() => {
    const count = trashSessions.length
    if (count === 0) return
    runConfirm({
      tone: 'danger',
      title: `Empty the recycle bin?`,
      description: (
        <>
          This permanently deletes all {count} session{count === 1 ? '' : 's'} currently in the recycle bin. It cannot
          be undone.
        </>
      ),
      confirmLabel: 'Empty recycle bin',
      action: async () => {
        await requestJson<{ ok: true }>(`/api/demo/sessions/trash`, { method: 'DELETE' })
        clearSelection()
        setPersistenceState('saved')
        setPersistenceMessage('Recycle bin emptied')
        await refreshLists()
      },
    })
  }, [clearSelection, refreshLists, runConfirm, trashSessions.length])

  useEffect(() => {
    if (step !== 'intake') return

    void loadPastSessions()
    void loadTrashSessions({ silent: true })

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void loadPastSessions({ silent: true })
        void loadTrashSessions({ silent: true })
      }
    }, 15000)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void loadPastSessions({ silent: true })
        void loadTrashSessions({ silent: true })
      }
    }
    const handleFocus = () => {
      void loadPastSessions({ silent: true })
      void loadTrashSessions({ silent: true })
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleFocus)
    }
  }, [loadPastSessions, loadTrashSessions, step])

  const handleSaveAndExit = useCallback(async () => {
    if (!sessionId || isExiting) return
    setIsExiting(true)
    try {
      await persistSessionPatch(buildSessionSnapshot({ sessionStatus: 'active' }))
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(ACTIVE_SESSION_KEY)
        window.localStorage.removeItem(FORM_DRAFT_KEY)
      }
      router.push('/')
    } catch {
      setIsExiting(false)
    }
  }, [buildSessionSnapshot, isExiting, persistSessionPatch, router, sessionId])

  const restoreSession = useCallback(async (targetSessionId: string) => {
    setPersistenceState('saving')
    setPersistenceMessage('Restoring session...')

    try {
      const data = await requestJson<{ session: DemoSessionRecord; storageMode?: string }>(
        `/api/demo/sessions/${targetSessionId}`,
        {
          method: 'GET',
        }
      )

      const session = data.session
      const restoredPrompt = promptFromStoredValues(session.lastPromptQuote, session.lastPromptQuestion)
      const restoredOutcome =
        session.lastOutcomeScore !== null &&
        session.lastOutcomeScore !== undefined &&
        session.lastOutcomeConfidence &&
        session.lastOutcomeFeedback
          ? {
              score: session.lastOutcomeScore,
              confidence: session.lastOutcomeConfidence as 'Low' | 'Medium' | 'High',
              feedback: session.lastOutcomeFeedback,
              followUp: session.lastOutcomeScore < 7,
            }
          : null

      setForm({
        firstName: session.firstName ?? '',
        lastName: session.lastName ?? '',
        assignmentName: session.assignmentName ?? '',
        unitName: session.unitName ?? '',
      })
      setSessionId(session.id)
      setStartedAt(session.startedAt ? new Date(session.startedAt) : new Date())
      {
        sessionMetadataRef.current = session.metadata ?? {}
        const persistedSeconds = Number(sessionMetadataRef.current.seconds_active)
        const restoredSeconds = Number.isFinite(persistedSeconds) && persistedSeconds > 0
          ? Math.floor(persistedSeconds)
          : Math.max(0, (session.minutesActive ?? 0) * 60)
        setSessionSeconds(restoredSeconds)
        sessionSecondsRef.current = restoredSeconds
      }
      setContent(session.contentHtml ?? '')
      setWordCount(session.wordCount ?? 0)
      setTypedWords(session.typedWords ?? 0)
      setPastedWords(session.pastedWords ?? 0)
      setPastedChars(session.pastedChars ?? 0)
      setPasteEvents(session.pasteEvents ?? 0)
      setChecksTriggered(session.checksTriggered ?? 0)
      setChecksCompleted(session.checksCompleted ?? 0)
      setLastPastedText(session.lastPastedText ?? '')
      {
        // Restore paste history from metadata if present. Defensive — ignore non-arrays, coerce to strings.
        const rawHistory = sessionMetadataRef.current.paste_history
        const restoredHistory = Array.isArray(rawHistory)
          ? rawHistory.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0).slice(-10)
          : []
        pastedTextsHistoryRef.current = restoredHistory
        setPastedTextsHistory(restoredHistory)
      }
      setPrompt(restoredPrompt)
      setOutcome(restoredOutcome)
      setAnswer('')
      setCurrentCheckId(null)
      setWarningSeconds(10)
      setCheckSeconds(60)
      setCheckState(restoredOutcome ? 'result' : 'idle')
      {
        const restoredAt = Date.now()
        const startedAtMs = session.startedAt ? new Date(session.startedAt).getTime() : restoredAt
        setEventLog([
          { message: `Resumed earlier session · started ${formatRelativeDate(session.startedAt ?? new Date(startedAtMs).toISOString())}`, at: restoredAt },
          { message: 'Draft content and evidence reloaded from the previous session', at: restoredAt },
        ])
      }
      setStep('workspace')
      setPersistenceState('saved')
      setPersistenceMessage('Session restored')
    } catch (error) {
      console.error('Failed to restore demo session', error)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(ACTIVE_SESSION_KEY)
      }
      setPersistenceState('error')
      setPersistenceMessage('Could not restore prior session')
    } finally {
      setIsRestoring(false)
    }
  }, [])

  const resetWorkspaceState = useCallback((startTime = new Date()) => {
    if (warningTimerRef.current) {
      window.clearInterval(warningTimerRef.current)
      warningTimerRef.current = null
    }
    if (activeTimerRef.current) {
      window.clearInterval(activeTimerRef.current)
      activeTimerRef.current = null
    }
    if (resultDismissTimerRef.current) {
      window.clearTimeout(resultDismissTimerRef.current)
      resultDismissTimerRef.current = null
    }
    // Single-shot guard: prevent any in-flight completeCheck from applying to the
    // fresh session. A new triggerCheckFlow will flip this back to false.
    checkCompletedRef.current = true

    setStartedAt(startTime)
    setSessionSeconds(0)
    sessionSecondsRef.current = 0
    sessionMetadataRef.current = {}
    setContent('')
    setWordCount(0)
    setTypedWords(0)
    setPastedWords(0)
    setPastedChars(0)
    setPasteEvents(0)
    setCheckState('idle')
    setWarningSeconds(10)
    setCheckSeconds(60)
    setAnswer('')
    setPrompt(defaultPrompt)
    setOutcome(null)
    setChecksTriggered(0)
    setChecksCompleted(0)
    setLastPastedText('')
    setPastedTextsHistory([])
    pastedTextsHistoryRef.current = []
    setFinalizeGateOpen(false)
    setIsSubmittingFinalize(false)
    setTabSwitches(0)
    setCurrentCheckId(null)
    {
      const now = Date.now()
      setEventLog([
        { message: 'Session started · evidence capture active', at: now },
        { message: 'No live comprehension checks yet', at: now },
      ])
    }
  }, [])

  const startWorkspaceSession = useCallback(async () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.assignmentName.trim() ||
      !form.unitName.trim()
    ) {
      return
    }

    const startTime = new Date()
    const payload: DemoSessionPayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      assignmentName: form.assignmentName.trim(),
      unitName: form.unitName.trim(),
      startedAt: startTime.toISOString(),
      metadata: {
        surface: 'demo',
      },
    }

    setIsStarting(true)
    setPersistenceState('saving')
    setPersistenceMessage('Creating live session...')

    try {
      const data = await requestJson<{ sessionId: string; startedAt: string }>('/api/demo/sessions', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      resetWorkspaceState(startTime)
      setSessionId(data.sessionId)
      setStep('workspace')
      setPersistenceState('saved')
      setPersistenceMessage('Live session connected')
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ACTIVE_SESSION_KEY, data.sessionId)
        window.localStorage.removeItem(FORM_DRAFT_KEY)
      }

      appendEvent(
        'session_started',
        `Session opened for ${payload.firstName} ${payload.lastName}`,
        {
          assignmentName: payload.assignmentName,
          unitName: payload.unitName,
        },
        data.sessionId
      )
    } catch (error) {
      console.error('Failed to create demo session', error)
      setPersistenceState('error')
      setPersistenceMessage('Could not connect to the secure record')
    } finally {
      setIsStarting(false)
    }
  }, [appendEvent, form, resetWorkspaceState])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const existingSessionId = window.localStorage.getItem(ACTIVE_SESSION_KEY)
    if (!existingSessionId) {
      setIsRestoring(false)
      return
    }

    void restoreSession(existingSessionId)
  }, [restoreSession])

  const closeCurrentSession = useCallback(
    async (status: 'completed' | 'abandoned', reason: string) => {
      if (!sessionId) return

      appendEvent(
        'session_closed',
        reason,
        {
          status,
        },
        sessionId
      )

      await persistSessionPatch(
        buildSessionSnapshot({
          sessionStatus: status,
          endedAt: new Date().toISOString(),
        }),
        { silent: true }
      )
    },
    [appendEvent, buildSessionSnapshot, persistSessionPatch, sessionId]
  )

  const completeCheck = useCallback(
    async ({
      answerText,
      promptConfig,
      pastedText,
      targetCheckId,
      source,
    }: {
      answerText: string
      promptConfig: PromptConfig
      pastedText: string
      targetCheckId: string | null
      source: 'manual' | 'timeout' | 'skipped'
    }) => {
      // Re-entry guard. triggerCheckFlow sets this to false when a new check session starts;
      // the first completeCheck call flips it back to true and proceeds. Any later call
      // (leaked interval, strict-mode replay, double-submit race) is rejected here.
      if (checkCompletedRef.current) return
      checkCompletedRef.current = true

      // Clear any timers still running — they should all be cleared already, but be defensive.
      if (warningTimerRef.current) {
        window.clearInterval(warningTimerRef.current)
        warningTimerRef.current = null
      }
      if (activeTimerRef.current) {
        window.clearInterval(activeTimerRef.current)
        activeTimerRef.current = null
      }

      const nowIso = new Date().toISOString()
      const skipped = source === 'skipped'

      setIsGrading(!skipped)
      setSkippedThisCheck(skipped)

      let finalOutcome: CheckOutcome
      let gradeSource: 'ai' | 'fallback' | 'skipped' = 'fallback'

      if (skipped) {
        finalOutcome = {
          score: 0,
          confidence: 'Low',
          feedback:
            'You skipped this comprehension check. This is recorded as evidence and counts against your authenticity score.',
          followUp: true,
        }
        gradeSource = 'skipped'
      } else {
        try {
          const res = await requestJson<{ ok: boolean; grade?: VerifyGradePayload; fallback?: boolean }>(
            '/api/demo/verify/grade',
            {
              method: 'POST',
              body: JSON.stringify({
                pastedText,
                question: promptConfig.question,
                answer: answerText,
                assignmentName: formRef.current.assignmentName,
                unitName: formRef.current.unitName,
              }),
            }
          )

          if (res.ok && res.grade) {
            finalOutcome = {
              score: res.grade.score,
              confidence: res.grade.confidence,
              feedback: res.grade.feedback,
              followUp: !res.grade.correct,
            }
            gradeSource = 'ai'
          } else {
            finalOutcome = evaluateAnswer(answerText, promptConfig)
            gradeSource = 'fallback'
          }
        } catch (error) {
          console.error('AI grading failed, using fallback scorer', error)
          finalOutcome = evaluateAnswer(answerText, promptConfig)
          gradeSource = 'fallback'
        }
      }

      setIsGrading(false)
      setOutcome(finalOutcome)
      setChecksCompleted((value) => value + 1)
      setCheckState('result')

      // Adaptive cadence: pick cooldown + tier based on the result.
      let cooldownMs: number
      let nextTier: CadenceTier
      if (skipped || finalOutcome.score < 5) {
        cooldownMs = VERIFY_COOLDOWN_FAIL_MS
        nextTier = 'heightened'
      } else if (finalOutcome.score < 7) {
        cooldownMs = VERIFY_COOLDOWN_PARTIAL_MS
        nextTier = 'standard'
      } else {
        cooldownMs = VERIFY_COOLDOWN_PASS_MS
        nextTier = 'relaxed'
      }
      const nextAt = Date.now() + cooldownMs
      setCadenceTier(nextTier)
      setNextAllowedCheckAt(nextAt)
      nextAllowedCheckAtRef.current = nextAt

      // Auto-dismiss the result overlay after 6s so the student can keep writing.
      if (resultDismissTimerRef.current) window.clearTimeout(resultDismissTimerRef.current)
      resultDismissTimerRef.current = window.setTimeout(() => {
        if (checkStateRef.current === 'result') {
          setCheckState('idle')
        }
        resultDismissTimerRef.current = null
      }, 6000)

      if (source === 'manual') {
        appendEvent('check_submitted', `Check submitted · ${finalOutcome.score}/10 · ${gradeSource}`, {
          score: finalOutcome.score,
          confidence: finalOutcome.confidence,
          gradeSource,
        })
      } else if (source === 'skipped') {
        appendEvent('check_submitted', 'Check skipped by student — recorded as unable to answer', {
          skipped: true,
          score: 0,
        })
      } else {
        appendEvent('check_submitted', `Check auto-submitted at timeout · ${finalOutcome.score}/10`, {
          source: 'timeout',
          score: finalOutcome.score,
        })
      }

      appendEvent(
        'check_completed',
        `Check completed · ${finalOutcome.score}/10 · ${finalOutcome.confidence.toLowerCase()} confidence · cadence: ${nextTier}`,
        {
          score: finalOutcome.score,
          confidence: finalOutcome.confidence,
          followUp: finalOutcome.followUp,
          cadenceTier: nextTier,
          gradeSource,
          skipped,
        }
      )

      if (sessionId && targetCheckId) {
        try {
          await patchCheckRecord(sessionId, targetCheckId, {
            status: 'completed',
            submittedAt: nowIso,
            answerText: skipped ? '[SKIPPED]' : answerText,
            score: finalOutcome.score,
            confidence: finalOutcome.confidence,
            feedback: finalOutcome.feedback,
            followUp: finalOutcome.followUp,
            durationSeconds: Math.max(0, VERIFY_ACTIVE_SECONDS - checkSeconds),
          })
        } catch (error) {
          console.error('Failed to persist check result', error)
          setPersistenceState('error')
          setPersistenceMessage('Check result sync failed')
        }
      }
    },
    [appendEvent, checkSeconds, patchCheckRecord, sessionId]
  )

  const triggerCheckFlow = useCallback(
    async (pastedText: string, pastedWordCount: number) => {
      if (warningTimerRef.current) {
        window.clearInterval(warningTimerRef.current)
        warningTimerRef.current = null
      }
      if (activeTimerRef.current) {
        window.clearInterval(activeTimerRef.current)
        activeTimerRef.current = null
      }
      if (resultDismissTimerRef.current) {
        window.clearTimeout(resultDismissTimerRef.current)
        resultDismissTimerRef.current = null
      }

      // Start with the static fallback prompt immediately so the warning shows something meaningful.
      // The AI-generated prompt will replace it asynchronously during the warning window.
      const fallback = derivePrompt(pastedText)
      const warningStartedAt = new Date().toISOString()
      let activePrompt: PromptConfig = fallback
      let promptSource: QuestionSource = 'fallback'

      pastedTextForCheckRef.current = pastedText
      // Arm the single-shot guard for this check session.
      checkCompletedRef.current = false
      setPrompt(fallback)
      setQuestionSource('fallback')
      setLastPastedText(pastedText)
      setCheckState('warning')
      setWarningSeconds(VERIFY_WARNING_SECONDS)
      setCheckSeconds(VERIFY_ACTIVE_SECONDS)
      setAnswer('')
      setOutcome(null)
      setSkippedThisCheck(false)
      setChecksTriggered((value) => value + 1)
      setIsLoadingQuestion(true)

      appendEvent('paste_detected', `Paste detected · ${pastedText.length} chars · ${pastedWordCount} words`, {
        pastedChars: pastedText.length,
        pastedWords: pastedWordCount,
      })
      appendEvent('check_warning', `Comprehension check scheduled in ${VERIFY_WARNING_SECONDS} seconds`, {
        promptQuote: fallback.quote,
      })

      // Kick off AI question generation in parallel with the warning timer.
      void (async () => {
        try {
          const res = await requestJson<{
            ok: boolean
            fallback?: boolean
            question?: VerifyQuestionPayload
          }>('/api/demo/verify/question', {
            method: 'POST',
            body: JSON.stringify({
              pastedText,
              assignmentName: formRef.current.assignmentName,
              unitName: formRef.current.unitName,
            }),
          })

          if (res.ok && res.question) {
            activePrompt = {
              quote: res.question.excerpt,
              question: res.question.question,
              keywords: fallback.keywords, // kept for the offline fallback grader
            }
            promptSource = 'ai'
            setPrompt(activePrompt)
            setQuestionSource('ai')
            appendEvent('check_warning', 'AI-generated question ready', {
              difficulty: res.question.difficulty,
              excerpt: res.question.excerpt,
            })
          } else {
            appendEvent('check_warning', 'Falling back to offline prompt (AI unavailable)', {})
          }
        } catch (error) {
          console.error('Failed to generate AI question', error)
          appendEvent('check_warning', 'AI question fetch failed — using offline prompt', {})
        } finally {
          setIsLoadingQuestion(false)
        }
      })()

      let createdCheckId: string | null = null

      if (sessionId) {
        try {
          const payload: DemoCheckCreatePayload = {
            promptQuote: fallback.quote,
            promptQuestion: fallback.question,
            pastedText,
            warningSeconds: VERIFY_WARNING_SECONDS,
            warningStartedAt,
          }

          const data = await requestJson<{ checkId: string }>(`/api/demo/sessions/${sessionId}/checks`, {
            method: 'POST',
            body: JSON.stringify(payload),
          })
          createdCheckId = data.checkId
          setCurrentCheckId(data.checkId)
        } catch (error) {
          console.error('Failed to create demo check', error)
          setPersistenceState('error')
          setPersistenceMessage('Could not save the live comprehension check')
        }
      }

      // Counters are held in plain closure variables — NOT inside setState updaters.
      // Strict mode double-invokes state updaters, which previously caused us to start
      // two nested setInterval timers per check and leak one of them, so completeCheck
      // fired on every tick forever. The interval callback itself is not replayed.
      let warningRemaining = VERIFY_WARNING_SECONDS
      let activeRemaining = VERIFY_ACTIVE_SECONDS

      warningTimerRef.current = window.setInterval(() => {
        warningRemaining -= 1
        setWarningSeconds(Math.max(0, warningRemaining))
        if (warningRemaining > 0) return

        if (warningTimerRef.current) {
          window.clearInterval(warningTimerRef.current)
          warningTimerRef.current = null
        }

        setCheckState('active')
        setCheckSeconds(activeRemaining)
        appendEvent(
          'check_started',
          `Comprehension check launched · ${VERIFY_ACTIVE_SECONDS} second timer active · ${promptSource}`,
          {
            promptQuote: activePrompt.quote,
            promptSource,
          }
        )

        if (sessionId && createdCheckId) {
          void patchCheckRecord(sessionId, createdCheckId, {
            status: 'active',
            startedAt: new Date().toISOString(),
          }).catch((error) => {
            console.error('Failed to mark check active', error)
            setPersistenceState('error')
            setPersistenceMessage('Could not update the live check state')
          })
        }

        // Defensive: if another active timer already exists, kill it before starting a new one.
        if (activeTimerRef.current) {
          window.clearInterval(activeTimerRef.current)
          activeTimerRef.current = null
        }

        activeTimerRef.current = window.setInterval(() => {
          activeRemaining -= 1
          setCheckSeconds(Math.max(0, activeRemaining))
          if (activeRemaining > 0) return

          if (activeTimerRef.current) {
            window.clearInterval(activeTimerRef.current)
            activeTimerRef.current = null
          }
          void completeCheck({
            answerText: answerRef.current,
            promptConfig: activePrompt,
            pastedText: pastedTextForCheckRef.current,
            targetCheckId: createdCheckId,
            source: 'timeout',
          })
        }, 1000)
      }, 1000)
    },
    [appendEvent, completeCheck, patchCheckRecord, sessionId]
  )

  const handleContentChange = (nextContent: string) => {
    setContent(nextContent)
  }

  const handleWordCountChange = (nextWordCount: number) => {
    setWordCount(nextWordCount)
    setTypedWords(Math.max(0, nextWordCount - pastedWords))
  }

  const handlePasteDetected = (pastedWordCount: number, pastedText: string) => {
    setPastedWords((current) => current + pastedWordCount)
    setPastedChars((current) => current + pastedText.length)
    setPasteEvents((current) => current + 1)
    // Track full paste history for the pre-submit verification gate. Cap at last 10, each truncated
    // to 3000 chars — keeps persisted metadata bounded while preserving enough context for picking
    // the most substantive passages to quiz on.
    const trimmed = typeof pastedText === 'string' ? pastedText.slice(0, 3000) : ''
    if (trimmed) {
      const nextHistory = [...pastedTextsHistoryRef.current, trimmed].slice(-10)
      pastedTextsHistoryRef.current = nextHistory
      setPastedTextsHistory(nextHistory)
    }

    // Only trigger a check for substantive pastes.
    const meetsSize =
      pastedWordCount >= VERIFY_PASTE_MIN_WORDS || pastedText.length >= VERIFY_PASTE_MIN_CHARS
    if (!meetsSize) return

    // Skip if a check is already in flight.
    if (checkStateRef.current !== 'idle' && checkStateRef.current !== 'result') return

    // Respect adaptive cooldown.
    const cooldownUntil = nextAllowedCheckAtRef.current
    if (cooldownUntil && Date.now() < cooldownUntil) return

    window.setTimeout(() => {
      // Re-check state at fire-time — user may have triggered something else in 900 ms.
      if (checkStateRef.current !== 'idle' && checkStateRef.current !== 'result') return
      void triggerCheckFlow(pastedText, pastedWordCount)
    }, VERIFY_PASTE_DELAY_MS)
  }

  const handleSubmitCheck = async () => {
    if (activeTimerRef.current) window.clearInterval(activeTimerRef.current)
    await completeCheck({
      answerText: answer,
      promptConfig: prompt,
      pastedText: pastedTextForCheckRef.current,
      targetCheckId: currentCheckId,
      source: 'manual',
    })
  }

  const requestSkipCheck = () => {
    runConfirm({
      tone: 'danger',
      title: 'Skip this check?',
      description: (
        <>
          Skipping is recorded as <strong>unable to answer</strong> and noted against your authenticity
          signal. You&rsquo;ll keep writing uninterrupted — the same understanding will be revisited at
          submit, not the next paste.
        </>
      ),
      confirmLabel: 'Skip and keep writing',
      action: async () => {
        if (activeTimerRef.current) window.clearInterval(activeTimerRef.current)
        await completeCheck({
          answerText: '',
          promptConfig: prompt,
          pastedText: pastedTextForCheckRef.current,
          targetCheckId: currentCheckId,
          source: 'skipped',
        })
      },
    })
  }

  const dismissResult = () => {
    if (resultDismissTimerRef.current) {
      window.clearTimeout(resultDismissTimerRef.current)
      resultDismissTimerRef.current = null
    }
    setCheckState('idle')
  }

  const executeResetDemo = async () => {
    if (sessionId) {
      await closeCurrentSession('abandoned', 'Session reset from demo workspace')
    }

    setSessionId(null)
    setCurrentCheckId(null)
    await startWorkspaceSession()
  }

  const handleResetDemo = () => {
    // Frictionless path: nothing worth protecting yet, so skip the dialog.
    const hasContentAtRisk = wordCount > 0 || pasteEvents > 0 || checksCompleted > 0
    if (!hasContentAtRisk) {
      void executeResetDemo()
      return
    }

    runConfirm({
      tone: 'danger',
      title: 'Reset this session?',
      description: (
        <>
          Resetting closes the current session as <strong>abandoned</strong> and starts a fresh one.
          You&rsquo;ll lose{' '}
          <strong>
            {wordCount.toLocaleString()} word{wordCount === 1 ? '' : 's'}
          </strong>
          {pasteEvents > 0 ? (
            <>
              {' '}
              (including <strong>{pasteEvents} paste{pasteEvents === 1 ? '' : 's'}</strong>)
            </>
          ) : null}
          {checksCompleted > 0 ? (
            <>
              , and{' '}
              <strong>
                {checksCompleted} completed check{checksCompleted === 1 ? '' : 's'}
              </strong>{' '}
              will no longer count toward a live score
            </>
          ) : null}
          . This cannot be undone.
        </>
      ),
      confirmLabel: 'Reset session',
      action: executeResetDemo,
    })
  }

  // --- Pre-submit verification gate -------------------------------------------------------------
  // Submit is the real "trust moment": we pause writing, generate 1–3 questions pinned to the
  // student's own pasted passages, grade each answer, and attach a final verdict to the session.
  // Save & exit is separate — that's a pause, no verification.

  const handleRequestSubmit = () => {
    if (!sessionId || isSubmittingFinalize || finalizeGateOpen) return
    appendEvent('finalize_opened', 'Student opened the pre-submit verification gate', {
      pasteCount: pastedTextsHistoryRef.current.length,
    })
    setFinalizeGateOpen(true)
  }

  const handleFinalizeClose = () => {
    if (isSubmittingFinalize) return
    setFinalizeGateOpen(false)
  }

  const finalizeAndExit = useCallback(
    async (args: {
      verdict: 'verified' | 'review' | 'flagged' | 'skipped'
      questions: unknown[]
      completedAt: string
      finalizeStatus: 'completed' | 'skipped'
      eventKind: 'session_submitted' | 'finalize_skipped'
      eventMessage: string
    }) => {
      if (!sessionId) return
      setIsSubmittingFinalize(true)
      try {
        // Persist the finalize verdict + mark the session as submitted. The existing PATCH route
        // falls back to bucket storage if the finalize_* columns don't exist yet (migration not run).
        await persistSessionPatch(
          buildSessionSnapshot({
            sessionStatus: 'submitted',
            endedAt: args.completedAt,
            finalizeStatus: args.finalizeStatus,
            finalizeVerdict: args.verdict,
            finalizeQuestions: args.questions,
            finalizeCompletedAt: args.completedAt,
          })
        )
        appendEvent(args.eventKind, args.eventMessage, {
          verdict: args.verdict,
          questionCount: args.questions.length,
        })
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(ACTIVE_SESSION_KEY)
          window.localStorage.removeItem(FORM_DRAFT_KEY)
        }
        setFinalizeGateOpen(false)
        router.push('/')
      } catch (error) {
        console.error('Finalize submit failed', error)
        setPersistenceState('error')
        setPersistenceMessage('Submit failed — please try again.')
        setIsSubmittingFinalize(false)
      }
    },
    [appendEvent, buildSessionSnapshot, persistSessionPatch, router, sessionId]
  )

  const handleFinalizeSubmit = async (payload: FinalizeSubmitPayload) => {
    await finalizeAndExit({
      verdict: payload.verdict,
      questions: payload.questions,
      completedAt: payload.completedAt,
      finalizeStatus: 'completed',
      eventKind: 'session_submitted',
      eventMessage: `Assignment submitted · ${payload.verdict} · ${payload.questions.length} question${payload.questions.length === 1 ? '' : 's'} answered`,
    })
  }

  const handleRequestSkipSubmit = () => {
    runConfirm({
      tone: 'danger',
      title: 'Submit without verifying?',
      description: (
        <>
          You&rsquo;re about to submit <strong>without answering the verification questions</strong>.
          The session will be saved and marked for Dean of Students review with a <strong>Skipped</strong>
          {' '}verdict attached. This is recorded — consider completing the questions first if you can.
        </>
      ),
      confirmLabel: 'Submit without verifying',
      action: async () => {
        await finalizeAndExit({
          verdict: 'skipped',
          questions: [],
          completedAt: new Date().toISOString(),
          finalizeStatus: 'skipped',
          eventKind: 'finalize_skipped',
          eventMessage: 'Student submitted without completing pre-submit verification',
        })
      },
    })
  }

  const copySampleParagraph = async () => {
    // The source template literal uses hard newlines for source-code readability.
    // Flatten them to single spaces so TipTap wraps the pasted text to the editor width
    // instead of preserving the narrow source-code line breaks.
    const flattened = demoParagraph.replace(/\s+/g, ' ').trim()
    await navigator.clipboard.writeText(flattened)
    setCopied(true)
    appendEvent('sample_copied', 'Sample paragraph copied to clipboard')
    window.setTimeout(() => setCopied(false), 1400)
  }

  useEffect(() => {
    if (step !== 'workspace' || !sessionId) return

    const timeout = window.setTimeout(() => {
      void persistSessionPatch(buildSessionSnapshot(), { silent: true })
    }, 600)

    return () => window.clearTimeout(timeout)
  }, [buildSessionSnapshot, persistSessionPatch, sessionId, step])

  useEffect(() => {
    if (step !== 'workspace' || !sessionId) return

    const interval = window.setInterval(() => {
      void persistSessionPatch(buildSessionSnapshot(), { silent: true })
    }, 15000)

    return () => window.clearInterval(interval)
  }, [buildSessionSnapshot, persistSessionPatch, sessionId, step])

  useEffect(() => {
    if (typeof window === 'undefined' || step !== 'workspace' || !sessionId) return

    const persistOnPageHide = () => {
      const payload = buildSessionSnapshot()

      void fetch(`/api/demo/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => undefined)
    }

    window.addEventListener('pagehide', persistOnPageHide)

    return () => {
      window.removeEventListener('pagehide', persistOnPageHide)
    }
  }, [buildSessionSnapshot, sessionId, step])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (step === 'workspace' && sessionId) {
      window.localStorage.setItem(ACTIVE_SESSION_KEY, sessionId)
      return
    }

    if (step === 'intake') {
      window.localStorage.removeItem(ACTIVE_SESSION_KEY)
    }
  }, [sessionId, step])

  const statusTone =
    checkState === 'active'
      ? 'flagged'
      : checkState === 'warning'
        ? 'pending'
        : outcome
          ? outcome.score >= 7
            ? 'verified'
            : 'flagged'
          : 'neutral'

  const persistenceTone =
    persistenceState === 'saved'
      ? 'verified'
      : persistenceState === 'saving'
        ? 'pending'
        : persistenceState === 'error'
          ? 'flagged'
          : 'neutral'

  const autosaveLabel =
    persistenceState === 'saving'
      ? 'Autosaving…'
      : persistenceState === 'error'
        ? 'Autosave failed — retrying'
        : lastSavedAt
          ? `Autosaved · ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : sessionId
            ? 'Autosave ready'
            : persistenceMessage

  const demoShell = 'mx-auto w-full max-w-[1880px] px-5 md:px-8 xl:px-10 2xl:px-16'

  const readyFields =
    (form.firstName.trim() ? 1 : 0) +
    (form.lastName.trim() ? 1 : 0) +
    (form.assignmentName.trim() ? 1 : 0) +
    (form.unitName.trim() ? 1 : 0)
  const canStart = readyFields === 4 && !isStarting
  const resumableSession = pastSessions.find((session) => session.sessionStatus === 'active') ?? null

  if (isRestoring) {
    return (
      <main className="paper-grain min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <section className={`${demoShell} section-space flex min-h-screen items-center justify-center`}>
          <div className="paper-panel rounded-[2rem] px-8 py-10 text-center shadow-[0_28px_90px_rgba(10,10,10,0.08)]">
            <p className="editorial-kicker">Demo environment</p>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.94] tracking-[-0.05em] text-[var(--ink)]">
              Restoring your writing session.
            </h1>
            <p className="mt-4 max-w-[34rem] text-[16px] leading-8 text-[var(--graphite)]">
              UniPortal is loading the latest saved draft and live evidence so a refresh does not interrupt the session.
            </p>
          </div>
        </section>
      </main>
    )
  }

  if (step === 'intake') {
    return (
      <main className="paper-grain min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <section className={`${demoShell} flex min-h-screen flex-col pt-[clamp(72px,9vw,144px)] pb-[clamp(48px,5vw,96px)]`}>
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="button-secondary focus-ring">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <ToneChip label="Demo environment" tone="verified" />
              <ToneChip label={autosaveLabel} tone={persistenceTone} />
            </div>
          </div>

          {resumableSession ? (
            <button
              type="button"
              onClick={() => void restoreSession(resumableSession.id)}
              className="mt-6 flex w-full flex-wrap items-center justify-between gap-4 rounded-[1.4rem] border border-[var(--bone)] bg-[rgba(255,255,255,0.75)] px-5 py-4 text-left transition hover:border-[rgba(10,10,10,0.18)] hover:shadow-[0_14px_40px_rgba(10,10,10,0.08)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)]">
                  <RotateCcw className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                    Resume your last session
                  </p>
                  <p className="mt-1 font-display text-[1.05rem] leading-tight text-[var(--ink)]">
                    {resumableSession.assignmentName}
                    <span className="ml-2 font-body text-sm text-[var(--slate)]">
                      · {resumableSession.unitName} · {formatRelativeDate(resumableSession.startedAt)}
                    </span>
                  </p>
                </div>
              </div>
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                Continue →
              </span>
            </button>
          ) : null}

          <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.7fr)] xl:items-start">
            <div>
              <p className="editorial-kicker">Demo entry</p>
              <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.94] tracking-[-0.05em] text-[var(--ink)]">
                Start a UniPortal writing session.
              </h1>
              <p className="mt-5 max-w-[38rem] text-base leading-7 text-[var(--graphite)] md:text-[1.05rem] md:leading-8">
                Enter the student details, assignment title, and unit name. Once the session begins,
                UniPortal opens the writing workspace with live evidence capture, paste monitoring,
                and the VERIFY interruption flow ready in the background.
              </p>
            </div>

            <aside className="paper-panel rounded-[2rem] p-6 md:p-7">
              <p className="editorial-kicker">What happens next</p>
              <ol className="relative mt-6 space-y-5 before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-px before:bg-[var(--bone)]">
                {[
                  'A full writing editor opens with the assignment context already loaded.',
                  'Session time, typed words, pasted words, and live evidence appear to the right.',
                  'Pasting dense external text triggers a timed comprehension check automatically.',
                ].map((item, index) => (
                  <li key={item} className="relative flex items-start gap-4 pl-0">
                    <span className="relative z-[1] flex h-[27px] w-[27px] flex-none items-center justify-center rounded-full border border-[var(--bone)] bg-[var(--paper)] font-mono-ui text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="pt-0.5 text-[14.5px] leading-7 text-[var(--graphite)]">{item}</p>
                  </li>
                ))}
              </ol>
            </aside>
          </div>

          <div id="demo-intake-form" className="paper-panel mt-12 rounded-[2.2rem] p-6 shadow-[0_28px_90px_rgba(10,10,10,0.08)] md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="editorial-kicker">First name</span>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ash)]" />
                  <input
                    value={form.firstName}
                    onChange={(event) => updateFormField('firstName', event.target.value)}
                    className="w-full rounded-[1.35rem] border border-[var(--bone)] bg-white px-12 py-4 text-[16px] text-[var(--ink)] outline-none transition focus:border-[rgba(10,10,10,0.16)] focus:shadow-[0_0_0_4px_rgba(30,64,175,0.08)]"
                    placeholder="Bernard"
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="editorial-kicker">Last name</span>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ash)]" />
                  <input
                    value={form.lastName}
                    onChange={(event) => updateFormField('lastName', event.target.value)}
                    className="w-full rounded-[1.35rem] border border-[var(--bone)] bg-white px-12 py-4 text-[16px] text-[var(--ink)] outline-none transition focus:border-[rgba(10,10,10,0.16)] focus:shadow-[0_0_0_4px_rgba(30,64,175,0.08)]"
                    placeholder="Adjei-Yeboah"
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="editorial-kicker">Assignment name</span>
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ash)]" />
                  <input
                    value={form.assignmentName}
                    onChange={(event) => updateFormField('assignmentName', event.target.value)}
                    className="w-full rounded-[1.35rem] border border-[var(--bone)] bg-white px-12 py-4 text-[16px] text-[var(--ink)] outline-none transition focus:border-[rgba(10,10,10,0.16)] focus:shadow-[0_0_0_4px_rgba(30,64,175,0.08)]"
                    placeholder="AI and Academic Integrity Reflection"
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="editorial-kicker">Unit name</span>
                <div className="relative">
                  <GraduationCap className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ash)]" />
                  <input
                    value={form.unitName}
                    onChange={(event) => updateFormField('unitName', event.target.value)}
                    className="w-full rounded-[1.35rem] border border-[var(--bone)] bg-white px-12 py-4 text-[16px] text-[var(--ink)] outline-none transition focus:border-[rgba(10,10,10,0.16)] focus:shadow-[0_0_0_4px_rgba(30,64,175,0.08)]"
                    placeholder="ICT6001 Applied Project"
                  />
                </div>
              </label>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--bone)] pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => void startWorkspaceSession()}
                  disabled={!canStart}
                  className={`focus-ring inline-flex items-center gap-2 rounded-full px-6 py-[0.95rem] text-[0.95rem] font-medium tracking-[-0.02em] transition ${
                    canStart
                      ? 'bg-[var(--ink)] text-[var(--paper)] shadow-[0_14px_32px_rgba(10,10,10,0.22)] hover:-translate-y-0.5 hover:bg-[#141414]'
                      : 'cursor-not-allowed border border-[var(--bone)] bg-[rgba(255,255,255,0.6)] text-[var(--ash)]'
                  }`}
                >
                  <PlayCircle className="h-4 w-4" />
                  {isStarting ? 'Connecting…' : 'Begin assignment'}
                </button>
                <p className="max-w-[32rem] text-sm leading-7 text-[var(--slate)]">
                  {canStart
                    ? 'All set. This opens the live writing workspace and starts evidence capture immediately.'
                    : 'Fill in every field to activate the session.'}
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                <span>{readyFields} of 4 ready</span>
                <span className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-6 rounded-full transition ${
                        i < readyFields ? 'bg-[var(--ink)]' : 'bg-[var(--bone)]'
                      }`}
                    />
                  ))}
                </span>
              </div>
            </div>
          </div>

        </section>
        <section className={`${demoShell} pb-[clamp(72px,9vw,144px)]`}>
          <PastSessionsPanel
            sessions={pastSessions}
            trashSessions={trashSessions}
            isLoading={isLoadingPast}
            isLoadingTrash={isLoadingTrash}
            view={pastSessionsView}
            onViewChange={handleViewChange}
            selectedIds={selectedSessionIds}
            onToggleSelect={toggleSessionSelection}
            onClearSelection={clearSelection}
            onSelectAllVisible={selectAllVisible}
            onResume={(id) => void restoreSession(id)}
            onPrefill={(session) => {
              const nextForm = {
                firstName: session.firstName,
                lastName: session.lastName,
                assignmentName: session.assignmentName,
                unitName: session.unitName,
              }
              setForm(nextForm)
              persistFormDraft(nextForm)
              if (typeof window !== 'undefined') {
                window.requestAnimationFrame(() => {
                  document.getElementById('demo-intake-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                })
              }
            }}
            onRequestDelete={requestDeleteSingle}
            onRequestBulkDelete={requestBulkDelete}
            onRequestDeleteAll={requestDeleteAll}
            onRequestRestore={requestRestoreSingle}
            onRequestBulkRestore={requestBulkRestore}
            onRequestPurge={requestPurgeSingle}
            onRequestBulkPurge={requestBulkPurge}
            onRequestEmptyTrash={requestEmptyTrash}
          />
        </section>
        {confirmState ? (
          <ConfirmDialog
            open={confirmState.open}
            onOpenChange={(next) => {
              if (!next) closeConfirm()
            }}
            tone={confirmState.tone}
            title={confirmState.title}
            description={confirmState.description}
            confirmLabel={confirmState.confirmLabel}
            busy={confirmState.busy}
            onConfirm={confirmState.onConfirm}
          />
        ) : null}
      </main>
    )
  }

  return (
    <main className="paper-grain min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <section className={`${demoShell} pt-8 pb-6`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                await closeCurrentSession('abandoned', 'Returned to demo entry')
                setStep('intake')
                setSessionId(null)
                setCurrentCheckId(null)
                setPersistenceState('idle')
                setPersistenceMessage('Ready to start a live session')
                setForm(INITIAL_FORM)
                if (typeof window !== 'undefined') {
                  window.localStorage.removeItem(ACTIVE_SESSION_KEY)
                  window.localStorage.removeItem(FORM_DRAFT_KEY)
                }
              }}
              className="button-secondary focus-ring"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to entry
            </button>
            <ToneChip label={`${form.firstName} ${form.lastName}`} tone="neutral" />
            <ToneChip label={form.unitName} tone="accent" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono-ui text-[11px] uppercase tracking-[0.18em] ${
                persistenceTone === 'verified'
                  ? 'border-[rgba(21,128,61,0.14)] bg-[rgba(21,128,61,0.06)] text-[var(--verified)]'
                  : persistenceTone === 'pending'
                    ? 'border-[rgba(161,98,7,0.14)] bg-[rgba(161,98,7,0.06)] text-[var(--pending)]'
                    : persistenceTone === 'flagged'
                      ? 'border-[rgba(185,28,28,0.14)] bg-[rgba(185,28,28,0.06)] text-[var(--flagged)]'
                      : 'border-[var(--bone)] bg-[rgba(255,255,255,0.75)] text-[var(--graphite)]'
              }`}
              aria-live="polite"
              title="Session autosaves as you type"
            >
              <span
                className={`inline-flex h-1.5 w-1.5 rounded-full ${
                  persistenceTone === 'verified'
                    ? 'bg-[var(--verified)]'
                    : persistenceTone === 'pending'
                      ? 'animate-pulse bg-[var(--pending)]'
                      : persistenceTone === 'flagged'
                        ? 'bg-[var(--flagged)]'
                        : 'bg-[var(--graphite)]'
                }`}
                aria-hidden="true"
              />
              {autosaveLabel}
            </span>
            <button
              type="button"
              onClick={handleRequestSubmit}
              disabled={!sessionId || isSubmittingFinalize || finalizeGateOpen || isExiting}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-[rgba(21,128,61,0.3)] bg-[var(--verified)] px-4 py-2 font-mono-ui text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_30px_-18px_rgba(21,128,61,0.7)] transition hover:bg-[rgba(16,110,53,1)] disabled:cursor-not-allowed disabled:opacity-60"
              title="Submit your assignment — opens the pre-submit verification"
            >
              <ShieldCheck className="h-4 w-4" />
              {isSubmittingFinalize ? 'Submitting…' : 'Submit assignment'}
            </button>
            <button
              type="button"
              onClick={() => void handleSaveAndExit()}
              disabled={!sessionId || isExiting || isSubmittingFinalize}
              className="button-ink focus-ring disabled:cursor-not-allowed disabled:opacity-60"
              title="Pause — save your work and return to the home page without submitting"
            >
              <LogOut className="h-4 w-4" />
              {isExiting ? 'Exiting…' : 'Save & exit'}
            </button>
            <button
              type="button"
              onClick={handleResetDemo}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--flagged)] transition hover:bg-[rgba(185,28,28,0.06)]"
              title="Discard the current session and start over"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset session
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(22rem,0.7fr)] 2xl:grid-cols-[minmax(0,2.15fr)_minmax(24rem,0.68fr)] xl:items-stretch">
          <div className="flex flex-col min-h-[calc(100vh-7rem)] xl:h-[calc(100vh-7rem)] xl:max-h-[calc(100vh-7rem)] xl:min-h-0">
            <section className="paper-panel relative flex flex-1 min-h-0 flex-col overflow-hidden rounded-[2rem] p-5 shadow-[0_30px_90px_rgba(10,10,10,0.1)] md:p-6 xl:p-7">
              <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[var(--bone)] pb-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="editorial-kicker">Live assignment workspace</span>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(21,128,61,0.14)] bg-[rgba(21,128,61,0.06)] px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--verified)]"
                      title="Editor connected and autosaving"
                    >
                      <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--verified)]" />
                      Live
                    </span>
                  </div>
                  <h1 className="mt-3 font-display text-[clamp(1.85rem,3.4vw,2.75rem)] leading-[1.02] tracking-[-0.035em] text-[var(--ink)]">
                    {form.assignmentName}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[var(--slate)]">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span className="font-medium text-[var(--graphite)]">{form.unitName}</span>
                    <span aria-hidden="true">·</span>
                    <UserRound className="h-3.5 w-3.5" />
                    <span>
                      {form.firstName} {form.lastName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <PlayCircle className="h-3.5 w-3.5" />
                    <span>Started {formatClock(startedAt)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ToneChip
                    label={
                      checkState === 'idle'
                        ? 'No active check'
                        : checkState === 'warning'
                          ? `Check incoming · ${warningSeconds}s`
                          : checkState === 'active'
                            ? `Check live · ${formatSeconds(checkSeconds)}`
                            : `Last score ${outcome?.score ?? 0}/10`
                    }
                    tone={statusTone}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">
                    Session time
                  </span>
                  <span className="font-display text-[1.35rem] leading-none tabular-nums tracking-[-0.02em] text-[var(--ink)]">
                    {formatSeconds(sessionSeconds)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[12px] text-[var(--graphite)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-[var(--accent-strong)]" />
                    <strong className="font-semibold text-[var(--ink)]">
                      {sessionSeconds > 0
                        ? Math.round((typedWords / Math.max(sessionSeconds / 60, 0.01)))
                        : 0}
                    </strong>
                    <span className="text-[var(--slate)]">wpm</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <PenLine className="h-3.5 w-3.5 text-[var(--verified)]" />
                    <strong className="font-semibold text-[var(--ink)]">{typedWords}</strong>
                    <span className="text-[var(--slate)]">typed</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clipboard className="h-3.5 w-3.5 text-[var(--accent-strong)]" />
                    <strong className="font-semibold text-[var(--ink)]">{pastedWords}</strong>
                    <span className="text-[var(--slate)]">pasted</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck
                      className={`h-3.5 w-3.5 ${
                        pasteEvents > 0 ? 'text-[var(--flagged)]' : 'text-[var(--verified)]'
                      }`}
                    />
                    <strong className="font-semibold text-[var(--ink)]">{pasteEvents}</strong>
                    <span className="text-[var(--slate)]">paste</span>
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-[var(--bone)] pt-2" />

              <div
                className={`relative mt-4 flex flex-1 min-h-[28rem] flex-col transition duration-300 ${
                  checkState === 'active' || checkState === 'result' ? 'opacity-40' : 'opacity-100'
                }`}
              >
                <WritingEditor
                  content={content}
                  onChange={handleContentChange}
                  onWordCountChange={handleWordCountChange}
                  onPasteDetected={handlePasteDetected}
                  placeholder="Start writing your assignment. For the demo, type naturally first, then paste the prepared sample text to trigger VERIFY."
                />
              </div>

              {checkState === 'warning' ? (
                <div className="pointer-events-none absolute inset-x-6 top-[9.6rem] z-10">
                  <div className="pointer-events-auto overflow-hidden rounded-[1.3rem] border border-[rgba(161,98,7,0.28)] bg-gradient-to-r from-[rgba(250,242,224,0.98)] via-[rgba(253,248,233,0.98)] to-[rgba(250,242,224,0.98)] p-4 shadow-[0_20px_60px_rgba(161,98,7,0.18)] md:p-5">
                    <div className="flex items-start gap-4">
                      <div className="relative mt-1 flex h-2.5 w-2.5 flex-none">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgba(161,98,7,0.35)]" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--pending)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                          <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--pending)]">
                            Comprehension check incoming
                          </p>
                          <p className="font-display text-[1.75rem] leading-none tabular-nums tracking-[-0.02em] text-[var(--ink)]">
                            00:{String(warningSeconds).padStart(2, '0')}
                          </p>
                        </div>
                        <p className="mt-2 text-[14px] leading-6 text-[var(--graphite)]">
                          You just pasted a substantive passage. In{' '}
                          <span className="font-semibold text-[var(--ink)]">{warningSeconds}s</span> you will
                          be asked <span className="font-semibold text-[var(--ink)]">one question</span> about
                          it — answered from memory, without looking back at the passage.
                        </p>
                        <p className="mt-1.5 font-mono-ui text-[10px] uppercase tracking-[0.2em]">
                          {isLoadingQuestion ? (
                            <span className="text-[var(--ash)]">· Generating your question ·</span>
                          ) : questionSource === 'ai' ? (
                            <span className="text-[var(--verified)]">· AI question ready ·</span>
                          ) : (
                            <span className="text-[var(--ash)]">· Using standard prompt ·</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {checkState === 'active' ? (
                <div className="absolute inset-x-6 top-[9.6rem] rounded-[1.7rem] border border-[var(--bone)] bg-[var(--paper-deep)] p-5 shadow-[0_26px_70px_rgba(10,10,10,0.16)] md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(10,10,10,0.08)] pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="editorial-kicker">Comprehension check</p>
                        {questionSource === 'ai' ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(21,128,61,0.2)] bg-[rgba(21,128,61,0.06)] px-2 py-0.5 font-mono-ui text-[9.5px] uppercase tracking-[0.18em] text-[var(--verified)]">
                            <Sparkles className="h-3 w-3" />
                            AI-generated
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[var(--graphite)]">
                        The passage is hidden. Answer from memory.
                      </p>
                    </div>
                    <div
                      className={`font-mono-ui text-[13px] uppercase tracking-[0.16em] ${
                        checkSeconds <= 10
                          ? 'text-[var(--flagged)]'
                          : checkSeconds <= 30
                            ? 'text-[var(--pending)]'
                            : 'text-[var(--ink)]'
                      }`}
                    >
                      ⏱ {formatSeconds(checkSeconds)}
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.25rem] border border-[var(--bone)] bg-white/86 px-4 py-4 text-[16px] leading-7 text-[var(--ink)]">
                    {prompt.question}
                  </div>

                  <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    disabled={isGrading}
                    className="mt-5 min-h-[11rem] w-full resize-none rounded-[1.25rem] border border-[var(--bone)] bg-white/90 px-4 py-4 text-[15px] leading-7 text-[var(--graphite)] outline-none focus:border-[rgba(10,10,10,0.12)] disabled:opacity-60"
                    placeholder="Type your answer here..."
                  />

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={requestSkipCheck}
                      disabled={isGrading}
                      className="focus-ring inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--flagged)] transition hover:bg-[rgba(185,28,28,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
                      title="Skip recording — will flag this submission as unable to answer"
                    >
                      Skip check · flags submission
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSubmitCheck()}
                      disabled={isGrading || answer.trim().length === 0}
                      className="button-ink focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isGrading ? 'Grading…' : 'Submit →'}
                    </button>
                  </div>
                </div>
              ) : null}

              {checkState === 'result' && outcome ? (
                <div className="absolute inset-x-6 top-[9.6rem] rounded-[1.7rem] border border-[var(--bone)] bg-[var(--paper-deep)] p-5 shadow-[0_26px_70px_rgba(10,10,10,0.16)] md:p-6">
                  <div className="border-b border-[rgba(10,10,10,0.08)] pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="editorial-kicker">{skippedThisCheck ? 'Check skipped' : 'Check complete'}</p>
                      {skippedThisCheck ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(185,28,28,0.2)] bg-[rgba(185,28,28,0.06)] px-2 py-0.5 font-mono-ui text-[9.5px] uppercase tracking-[0.18em] text-[var(--flagged)]">
                          Recorded as unable to answer
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <p
                        className={`font-mono-ui text-[13px] uppercase tracking-[0.16em] ${
                          outcome.score >= 7 ? 'text-[var(--verified)]' : 'text-[var(--flagged)]'
                        }`}
                      >
                        Score: {outcome.score} / 10
                      </p>
                      <p
                        className={`font-mono-ui text-[13px] uppercase tracking-[0.16em] ${
                          outcome.confidence === 'High'
                            ? 'text-[var(--verified)]'
                            : outcome.confidence === 'Medium'
                              ? 'text-[var(--pending)]'
                              : 'text-[var(--flagged)]'
                        }`}
                      >
                        Confidence: {outcome.confidence}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-[15px] leading-7 text-[var(--graphite)]">
                    {outcome.feedback}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <ToneChip
                      label={outcome.followUp ? 'Follow-up scheduled' : 'Adaptive frequency reduced'}
                      tone={outcome.followUp ? 'pending' : 'verified'}
                    />
                    <ToneChip label={`Checks completed · ${checksCompleted}`} tone="neutral" />
                  </div>

                  <button
                    type="button"
                    onClick={dismissResult}
                    className="mt-6 button-ink focus-ring"
                  >
                    Return to editor
                  </button>
                </div>
              ) : null}
            </section>
          </div>

          <div className="flex flex-col gap-6 xl:h-[calc(100vh-7rem)] xl:max-h-[calc(100vh-7rem)] xl:min-h-0 xl:overflow-y-auto xl:pr-1">
            {(() => {
              const hasContent = wordCount > 0
              const typedShare = hasContent ? Math.round((typedWords / wordCount) * 100) : 0
              const pastedShare = hasContent ? 100 - typedShare : 0

              let confidence = 100
              const factors: { label: string; delta: number; tone: 'verified' | 'pending' | 'flagged' }[] = []
              if (!hasContent) {
                confidence = 0
              } else {
                factors.push({ label: `${typedShare}% typed in-session`, delta: 0, tone: typedShare >= 90 ? 'verified' : typedShare >= 70 ? 'pending' : 'flagged' })
                if (pasteEvents === 0) {
                  factors.push({ label: 'No paste events', delta: 0, tone: 'verified' })
                } else {
                  const pastePenalty = Math.min(40, 15 + (pasteEvents - 1) * 10)
                  confidence -= pastePenalty
                  factors.push({ label: `${pasteEvents} paste event${pasteEvents === 1 ? '' : 's'}`, delta: -pastePenalty, tone: 'flagged' })
                }
                if (pastedShare > 25) {
                  const sharePenalty = Math.min(25, pastedShare - 25)
                  confidence -= sharePenalty
                  factors.push({ label: `${pastedShare}% pasted content`, delta: -sharePenalty, tone: 'flagged' })
                }
                if (outcome) {
                  if (outcome.score >= 8) {
                    confidence += 5
                    factors.push({ label: `Verify passed · ${outcome.score}/10`, delta: 5, tone: 'verified' })
                  } else if (outcome.score >= 5) {
                    factors.push({ label: `Verify partial · ${outcome.score}/10`, delta: 0, tone: 'pending' })
                  } else if (outcome.confidence === 'Low') {
                    // Grader itself is unsure — treat as inconclusive rather than weak. No score penalty.
                    factors.push({ label: `Verify inconclusive · ${outcome.score}/10`, delta: 0, tone: 'pending' })
                  } else {
                    // Softer deduction than before (-10 instead of -20). Live checks should flag, not grade.
                    // The real authenticity decision lives in the pre-submit verification gate.
                    confidence -= 10
                    factors.push({ label: `Verify weak · ${outcome.score}/10`, delta: -10, tone: 'flagged' })
                  }
                }
                if (tabSwitches >= 3) {
                  const tabPenalty = Math.min(15, (tabSwitches - 2) * 3)
                  confidence -= tabPenalty
                  factors.push({ label: `Tab switched ${tabSwitches}×`, delta: -tabPenalty, tone: 'pending' })
                } else if (tabSwitches > 0) {
                  factors.push({ label: `Tab switched ${tabSwitches}×`, delta: 0, tone: 'pending' })
                }
                confidence = Math.max(0, Math.min(100, confidence))
              }

              const integrityTone: 'verified' | 'pending' | 'flagged' | 'neutral' = !hasContent
                ? 'neutral'
                : confidence >= 85
                  ? 'verified'
                  : confidence >= 60
                    ? 'pending'
                    : 'flagged'
              const integrityLabel = !hasContent
                ? 'Awaiting first signals'
                : integrityTone === 'verified'
                  ? 'Strong integrity signal'
                  : integrityTone === 'pending'
                    ? 'Watching for signals'
                    : 'Elevated risk detected'
              const integrityCopy = !hasContent
                ? 'Start writing to light up the evidence rail. Typed and pasted activity appear here in real time.'
                : integrityTone === 'verified'
                  ? 'All visible text is typed in-session. Paste history is clean.'
                  : integrityTone === 'pending'
                    ? `${typedShare}% typed in-session. Some pasted passages present.`
                    : `Only ${typedShare}% typed. VERIFY checks will run on pasted passages.`
              const barTone: 'verified' | 'pending' | 'flagged' | 'accent' =
                integrityTone === 'neutral' ? 'accent' : integrityTone
              const scoreColor =
                integrityTone === 'verified'
                  ? 'text-[var(--verified)]'
                  : integrityTone === 'pending'
                    ? 'text-[var(--pending)]'
                    : integrityTone === 'flagged'
                      ? 'text-[var(--flagged)]'
                      : 'text-[var(--slate)]'
              return (
                <SidebarCard kicker="Integrity signal" title={integrityLabel}>
                  <div className="space-y-5">
                    <div className="flex items-end justify-between gap-3 rounded-[1.25rem] border border-[var(--bone)] bg-white/75 px-4 py-3">
                      <div>
                        <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--ash)]">
                          Authenticity confidence
                        </p>
                        <p className={`mt-1 font-display text-[2.4rem] leading-none tabular-nums tracking-[-0.03em] ${scoreColor}`}>
                          {hasContent ? confidence : '—'}
                          <span className="ml-1 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">/ 100</span>
                        </p>
                      </div>
                      <p className="max-w-[9rem] text-right text-[11px] leading-snug text-[var(--slate)]">
                        Composite score across typing, paste activity and Verify results.
                      </p>
                    </div>
                    <div className="flex min-h-[28px] flex-wrap gap-1.5">
                      {hasContent && factors.length > 0 ? (
                        factors.map((factor) => (
                          <span
                            key={factor.label}
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-[0.16em] ${
                              factor.tone === 'verified'
                                ? 'border-[rgba(22,101,52,0.2)] bg-[rgba(22,101,52,0.06)] text-[var(--verified)]'
                                : factor.tone === 'pending'
                                  ? 'border-[rgba(161,98,7,0.2)] bg-[rgba(161,98,7,0.06)] text-[var(--pending)]'
                                  : 'border-[rgba(185,28,28,0.2)] bg-[rgba(185,28,28,0.05)] text-[var(--flagged)]'
                            }`}
                          >
                            {factor.label}
                            {factor.delta !== 0 ? (
                              <span className="opacity-70">{factor.delta > 0 ? `+${factor.delta}` : factor.delta}</span>
                            ) : null}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-dashed border-[var(--bone)] px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[var(--ash)]">
                          Signals appear as you write
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] leading-6 text-[var(--graphite)]">{integrityCopy}</p>
                    <div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono-ui uppercase tracking-[0.2em] text-[var(--ash)]">
                          Typed vs pasted
                        </span>
                        <span
                          className={`font-mono-ui uppercase tracking-[0.2em] ${
                            integrityTone === 'verified'
                              ? 'text-[var(--verified)]'
                              : integrityTone === 'pending'
                                ? 'text-[var(--pending)]'
                                : integrityTone === 'flagged'
                                  ? 'text-[var(--flagged)]'
                                  : 'text-[var(--slate)]'
                          }`}
                        >
                          {hasContent ? `${typedShare}% typed` : 'Awaiting writing'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={hasContent ? typedShare : 0} tone={barTone} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <StatTile
                        label="Typed"
                        value={typedWords}
                        hint={`${wordCount > 0 ? typedShare : 0}% of total`}
                        tone="verified"
                        icon={<PenLine className="h-3.5 w-3.5" />}
                      />
                      <StatTile
                        label="Pasted"
                        value={pastedWords}
                        hint={`${pastedChars} chars`}
                        tone={pastedWords > 0 ? 'accent' : 'neutral'}
                        icon={<Clipboard className="h-3.5 w-3.5" />}
                      />
                      <StatTile
                        label="Paste events"
                        value={pasteEvents}
                        hint={pasteEvents === 0 ? 'No incidents' : 'Tracked'}
                        tone={pasteEvents > 0 ? 'flagged' : 'verified'}
                        icon={<Activity className="h-3.5 w-3.5" />}
                      />
                      <StatTile
                        label="Checks"
                        value={`${checksCompleted}/${Math.max(checksTriggered, checksCompleted)}`}
                        hint={checksTriggered === 0 ? 'Ready' : 'Adaptive'}
                        tone={checksTriggered > 0 ? 'pending' : 'neutral'}
                        icon={<ShieldCheck className="h-3.5 w-3.5" />}
                      />
                    </div>
                  </div>
                </SidebarCard>
              )
            })()}

            <SidebarCard
              kicker="Verification state"
              title="Current check status"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <ToneChip
                    label={
                      checkState === 'idle'
                        ? 'Idle'
                        : checkState === 'warning'
                          ? `Warning · ${warningSeconds}s`
                          : checkState === 'active'
                            ? `Check live · ${formatSeconds(checkSeconds)}`
                            : 'Result ready'
                    }
                    tone={statusTone}
                  />
                  <ToneChip
                    label={`Cadence · ${cadenceTier}`}
                    tone={
                      cadenceTier === 'heightened'
                        ? 'flagged'
                        : cadenceTier === 'standard'
                          ? 'pending'
                          : 'verified'
                    }
                  />
                  <ToneChip
                    label={
                      checksCompleted === 0
                        ? 'No completed checks yet'
                        : outcome
                          ? `Last score ${outcome.score}/10`
                          : `${checksCompleted} check${checksCompleted === 1 ? '' : 's'} completed`
                    }
                    tone={outcome ? (outcome.score >= 7 ? 'verified' : 'flagged') : 'neutral'}
                  />
                  {checkState === 'idle' && nextAllowedCheckAt && nextAllowedCheckAt > nowTick ? (
                    <ToneChip
                      label={`Next check in ${Math.max(1, Math.ceil((nextAllowedCheckAt - nowTick) / 1000))}s`}
                      tone="accent"
                    />
                  ) : null}
                </div>

                <div className="rounded-[1.25rem] border border-[var(--bone)] bg-white/80 p-4">
                  {checkState === 'idle' ? (
                    nextAllowedCheckAt && nextAllowedCheckAt > nowTick ? (
                      <>
                        <p className="editorial-kicker">Cooldown active</p>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="font-display text-[2rem] leading-none tabular-nums tracking-[-0.03em] text-[var(--accent-strong)]">
                            {Math.max(1, Math.ceil((nextAllowedCheckAt - nowTick) / 1000))}s
                          </span>
                          <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                            until next check eligible
                          </span>
                        </div>
                        <p className="mt-3 text-[13px] leading-6 text-[var(--graphite)]">
                          {cadenceTier === 'relaxed'
                            ? 'Strong pass recorded. Verify is laying low so you can keep writing.'
                            : cadenceTier === 'heightened'
                              ? 'Last check was weak or skipped — Verify noted it and will revisit the understanding at submit.'
                              : 'Partial understanding noted. Verify is keeping standard cadence so you can keep working.'}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="editorial-kicker">Awaiting activity</p>
                        <p className="mt-2 text-[14px] leading-6 text-[var(--graphite)]">
                          Verify stays quiet until it sees a large paste or an unusual editing pattern, then asks the student a live comprehension question on that passage.
                        </p>
                      </>
                    )
                  ) : checkState === 'warning' ? (
                    <>
                      <p className="editorial-kicker">Incoming check</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-display text-[2.2rem] leading-none tabular-nums tracking-[-0.03em] text-[var(--pending)]">
                          00:{String(warningSeconds).padStart(2, '0')}
                        </span>
                        <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                          until prompt
                        </span>
                      </div>
                      <p className="mt-3 text-[13px] leading-6 text-[var(--graphite)]">
                        Suspicious paste detected. Preparing a comprehension question.
                      </p>
                    </>
                  ) : checkState === 'active' ? (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <p className="editorial-kicker">Check in progress</p>
                        <span
                          className={`font-mono-ui text-[11px] uppercase tracking-[0.18em] ${
                            checkSeconds <= 10
                              ? 'text-[var(--flagged)]'
                              : checkSeconds <= 30
                                ? 'text-[var(--pending)]'
                                : 'text-[var(--ink)]'
                          }`}
                        >
                          ⏱ {formatSeconds(checkSeconds)}
                        </span>
                      </div>
                      <p className="mt-3 text-[13px] leading-6 text-[var(--graphite)]">
                        A question is live in the editor. Answer from memory — the passage is hidden until you submit or skip.
                      </p>
                      {questionSource === 'ai' ? (
                        <p className="mt-2 inline-flex items-center gap-1 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--verified)]">
                          <Sparkles className="h-3 w-3" />
                          AI-generated question
                        </p>
                      ) : null}
                    </>
                  ) : outcome ? (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="editorial-kicker">Last score</p>
                          <p
                            className={`mt-1 font-display text-[2.2rem] leading-none tabular-nums tracking-[-0.03em] ${
                              outcome.score >= 7
                                ? 'text-[var(--verified)]'
                                : outcome.score >= 5
                                  ? 'text-[var(--pending)]'
                                  : 'text-[var(--flagged)]'
                            }`}
                          >
                            {outcome.score}
                            <span className="ml-1 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                              / 10
                            </span>
                          </p>
                        </div>
                        <ToneChip
                          label={outcome.confidence}
                          tone={
                            outcome.confidence === 'High'
                              ? 'verified'
                              : outcome.confidence === 'Medium'
                                ? 'pending'
                                : 'flagged'
                          }
                        />
                      </div>
                      <p className="mt-3 line-clamp-4 text-[13px] leading-6 text-[var(--graphite)]">
                        {outcome.feedback}
                      </p>
                    </>
                  ) : null}
                </div>

              </div>
            </SidebarCard>
          </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <SidebarCard kicker="How it works" title="How Verify protects this session">
              <ol className="space-y-3 text-[13.5px] leading-6 text-[var(--graphite)]">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--ink)] font-mono-ui text-[10px] text-[var(--paper)]">
                    1
                  </span>
                  <span>
                    Watches every keystroke, paste and tab switch in real time.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--ink)] font-mono-ui text-[10px] text-[var(--paper)]">
                    2
                  </span>
                  <span>
                    Issues a short comprehension prompt when a passage looks suspicious.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--ink)] font-mono-ui text-[10px] text-[var(--paper)]">
                    3
                  </span>
                  <span>
                    Scores the answer and attaches the result to the submission for review.
                  </span>
                </li>
              </ol>
            </SidebarCard>

            <SidebarCard kicker="Saved automatically" title="Evidence captured so far">
              <p className="-mt-1 mb-3 text-[12px] leading-relaxed text-[var(--graphite)]">
                Continuous autosave &mdash; every keystroke and paste is preserved for review.
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    label: 'Last saved',
                    value: autosaveLabel,
                    icon: <Database className="h-3.5 w-3.5 text-[var(--accent-strong)]" />,
                  },
                  {
                    label: 'Started',
                    value: formatClock(startedAt),
                    icon: <PlayCircle className="h-3.5 w-3.5 text-[var(--slate)]" />,
                  },
                  {
                    label: 'Time spent',
                    value: `${Math.floor(sessionSeconds / 60)} min`,
                    icon: <Clock3 className="h-3.5 w-3.5 text-[var(--slate)]" />,
                  },
                  {
                    label: 'Words written',
                    value: wordCount,
                    icon: <PenLine className="h-3.5 w-3.5 text-[var(--slate)]" />,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-[1rem] border border-[var(--bone)] bg-white/70 px-3.5 py-2.5"
                  >
                    <span className="inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--ash)]">
                      {row.icon}
                      {row.label}
                    </span>
                    <span className="text-[13px] font-medium text-[var(--ink)]">{row.value}</span>
                  </div>
                ))}
              </div>
            </SidebarCard>

            <SidebarCard kicker="Session log" title="Recent events">
              <ol className="relative space-y-3 before:absolute before:left-[0.45rem] before:top-1 before:bottom-1 before:w-px before:bg-[var(--bone)]">
                {eventLog.map((entry, index) => {
                  const lower = entry.message.toLowerCase()
                  const tone =
                    lower.includes('fail') || lower.includes('flag') || lower.includes('skip')
                      ? 'flagged'
                      : lower.includes('pasted') || lower.includes('paste')
                        ? 'accent'
                        : lower.includes('check') || lower.includes('verif')
                          ? 'pending'
                          : lower.includes('session') || lower.includes('restor') || lower.includes('saved') || lower.includes('resumed')
                            ? 'verified'
                            : 'neutral'
                  const dotClass =
                    tone === 'flagged'
                      ? 'bg-[var(--flagged)]'
                      : tone === 'accent'
                        ? 'bg-[var(--accent-strong)]'
                        : tone === 'pending'
                          ? 'bg-[var(--pending)]'
                          : tone === 'verified'
                            ? 'bg-[var(--verified)]'
                            : 'bg-[var(--slate)]'
                  const clockLabel = formatClock(new Date(entry.at))
                  const ageMs = Math.max(0, nowTick - entry.at)
                  const ageLabel =
                    ageMs < 10000
                      ? 'just now'
                      : ageMs < 60000
                        ? `${Math.floor(ageMs / 1000)}s ago`
                        : ageMs < 3600000
                          ? `${Math.floor(ageMs / 60000)}m ago`
                          : `${Math.floor(ageMs / 3600000)}h ago`
                  return (
                    <li
                      key={`${entry.at}-${index}`}
                      className="relative flex gap-3 pl-6"
                    >
                      <span
                        className={`absolute left-0 top-[0.45rem] h-2.5 w-2.5 rounded-full ring-4 ring-[var(--paper)] ${dotClass}`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] leading-6 text-[var(--graphite)]">{entry.message}</p>
                        <p
                          className="mt-0.5 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]"
                          title={clockLabel}
                        >
                          {ageLabel} · {clockLabel}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </SidebarCard>

            <div className="paper-panel flex items-start gap-3 rounded-[1.6rem] p-4 md:p-5">
              <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[rgba(30,64,175,0.08)] text-[var(--accent-strong)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--ash)]">
                  Demo tip
                </p>
                <p className="mt-1 text-[13.5px] leading-6 text-[var(--graphite)]">
                  Copy the prepared passage and paste it after a few lines of typing to trigger VERIFY.
                </p>
                <button
                  type="button"
                  onClick={copySampleParagraph}
                  className="mt-3 focus-ring inline-flex items-center gap-1.5 rounded-full border border-[var(--bone)] bg-white/80 px-3 py-1.5 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ink)] transition hover:bg-white"
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-[var(--verified)]" /> : <ClipboardCheck className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy sample text'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {confirmState ? (
        <ConfirmDialog
          open={confirmState.open}
          onOpenChange={(next) => {
            if (!next) closeConfirm()
          }}
          tone={confirmState.tone}
          title={confirmState.title}
          description={confirmState.description}
          confirmLabel={confirmState.confirmLabel}
          busy={confirmState.busy}
          onConfirm={confirmState.onConfirm}
        />
      ) : null}
      <FinalizeGate
        open={finalizeGateOpen}
        sessionId={sessionId}
        assignmentName={form.assignmentName}
        unitName={form.unitName}
        pastedTexts={pastedTextsHistory}
        onClose={handleFinalizeClose}
        onRequestSkipSubmit={handleRequestSkipSubmit}
        onSubmit={handleFinalizeSubmit}
      />
    </main>
  )
}
