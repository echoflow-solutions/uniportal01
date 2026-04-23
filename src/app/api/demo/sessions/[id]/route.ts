import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { DemoSessionPatch } from '@/lib/demo-persistence'
import { patchStoredSession, readStoredSession } from '@/lib/supabase/demo-storage'

type Params = {
  params: { id: string }
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const sessionId = params.id

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session id.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('demo_sessions')
      .select(
        `
          id,
          first_name,
          last_name,
          assignment_name,
          unit_name,
          session_started_at,
          session_ended_at,
          session_status,
          content_html,
          word_count,
          typed_words,
          pasted_words,
          pasted_chars,
          paste_events,
          checks_triggered,
          checks_completed,
          current_check_state,
          last_prompt_quote,
          last_prompt_question,
          last_pasted_text,
          last_outcome_score,
          last_outcome_confidence,
          last_outcome_feedback,
          minutes_active,
          metadata
        `
      )
      .eq('id', sessionId)
      .maybeSingle()

    if (!error && data) {
      return NextResponse.json({
        session: {
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          assignmentName: data.assignment_name,
          unitName: data.unit_name,
          startedAt: data.session_started_at,
          endedAt: data.session_ended_at,
          sessionStatus: data.session_status,
          contentHtml: data.content_html,
          wordCount: data.word_count,
          typedWords: data.typed_words,
          pastedWords: data.pasted_words,
          pastedChars: data.pasted_chars,
          pasteEvents: data.paste_events,
          checksTriggered: data.checks_triggered,
          checksCompleted: data.checks_completed,
          currentCheckState: data.current_check_state,
          lastPromptQuote: data.last_prompt_quote,
          lastPromptQuestion: data.last_prompt_question,
          lastPastedText: data.last_pasted_text,
          lastOutcomeScore: data.last_outcome_score,
          lastOutcomeConfidence: data.last_outcome_confidence,
          lastOutcomeFeedback: data.last_outcome_feedback,
          minutesActive: data.minutes_active,
          metadata: data.metadata ?? {},
        },
        storageMode: 'table',
      })
    }

    const stored = await readStoredSession<Record<string, unknown>>(sessionId)

    if (stored) {
      return NextResponse.json({
        session: {
          id: String(stored.id ?? sessionId),
          firstName: String(stored.first_name ?? stored.firstName ?? ''),
          lastName: String(stored.last_name ?? stored.lastName ?? ''),
          assignmentName: String(stored.assignment_name ?? stored.assignmentName ?? ''),
          unitName: String(stored.unit_name ?? stored.unitName ?? ''),
          startedAt: String(stored.session_started_at ?? stored.startedAt ?? new Date().toISOString()),
          endedAt: (stored.session_ended_at ?? stored.endedAt ?? null) as string | null,
          sessionStatus: String(stored.session_status ?? stored.sessionStatus ?? 'active'),
          contentHtml: String(stored.content_html ?? stored.contentHtml ?? ''),
          wordCount: Number(stored.word_count ?? stored.wordCount ?? 0),
          typedWords: Number(stored.typed_words ?? stored.typedWords ?? 0),
          pastedWords: Number(stored.pasted_words ?? stored.pastedWords ?? 0),
          pastedChars: Number(stored.pasted_chars ?? stored.pastedChars ?? 0),
          pasteEvents: Number(stored.paste_events ?? stored.pasteEvents ?? 0),
          checksTriggered: Number(stored.checks_triggered ?? stored.checksTriggered ?? 0),
          checksCompleted: Number(stored.checks_completed ?? stored.checksCompleted ?? 0),
          currentCheckState: String(stored.current_check_state ?? stored.currentCheckState ?? 'idle'),
          lastPromptQuote: (stored.last_prompt_quote ?? stored.lastPromptQuote ?? null) as string | null,
          lastPromptQuestion: (stored.last_prompt_question ?? stored.lastPromptQuestion ?? null) as string | null,
          lastPastedText: (stored.last_pasted_text ?? stored.lastPastedText ?? null) as string | null,
          lastOutcomeScore:
            stored.last_outcome_score ?? stored.lastOutcomeScore ?? null,
          lastOutcomeConfidence:
            (stored.last_outcome_confidence ?? stored.lastOutcomeConfidence ?? null) as string | null,
          lastOutcomeFeedback:
            (stored.last_outcome_feedback ?? stored.lastOutcomeFeedback ?? null) as string | null,
          minutesActive: Number(stored.minutes_active ?? stored.minutesActive ?? 0),
          metadata: (stored.metadata ?? {}) as Record<string, unknown>,
        },
        storageMode: 'bucket',
      })
    }

    return NextResponse.json({ session: null }, { status: 404 })
  } catch (error) {
    console.error('Failed to fetch demo session', error)
    return NextResponse.json({ error: 'Failed to fetch demo session.' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const sessionId = params.id

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session id.' }, { status: 400 })
    }

    const deletedAt = new Date().toISOString()

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('demo_sessions')
      .update({ deleted_at: deletedAt })
      .eq('id', sessionId)
      .is('deleted_at', null)
      .select('id')
      .maybeSingle()

    if (!error && data) {
      return NextResponse.json({ ok: true, deletedAt, storageMode: 'table' })
    }

    if (error && typeof error.code === 'string' && error.code === '42703') {
      console.error('demo_sessions.deleted_at missing — recycle bin disabled', error)
      return NextResponse.json(
        {
          error:
            'Recycle bin is not ready yet. Run the supabase/migrations/20260420_demo_sessions_soft_delete.sql migration in Supabase to enable deletion.',
        },
        { status: 503 }
      )
    }

    if (error) {
      console.warn('Falling back to Supabase storage for demo session delete', error)
    }

    await patchStoredSession(sessionId, { deleted_at: deletedAt })

    return NextResponse.json({ ok: true, deletedAt, storageMode: 'bucket' })
  } catch (error) {
    console.error('Failed to soft-delete demo session', error)
    return NextResponse.json({ error: 'Failed to delete demo session.' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = (await request.json()) as DemoSessionPatch
    const sessionId = params.id

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session id.' }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}

    if (body.sessionStatus) updates.session_status = body.sessionStatus
    if (body.endedAt !== undefined) updates.session_ended_at = body.endedAt
    if (body.contentHtml !== undefined) updates.content_html = body.contentHtml
    if (body.wordCount !== undefined) updates.word_count = body.wordCount
    if (body.typedWords !== undefined) updates.typed_words = body.typedWords
    if (body.pastedWords !== undefined) updates.pasted_words = body.pastedWords
    if (body.pastedChars !== undefined) updates.pasted_chars = body.pastedChars
    if (body.pasteEvents !== undefined) updates.paste_events = body.pasteEvents
    if (body.checksTriggered !== undefined) updates.checks_triggered = body.checksTriggered
    if (body.checksCompleted !== undefined) updates.checks_completed = body.checksCompleted
    if (body.currentCheckState !== undefined) updates.current_check_state = body.currentCheckState
    if (body.lastPromptQuote !== undefined) updates.last_prompt_quote = body.lastPromptQuote
    if (body.lastPromptQuestion !== undefined) updates.last_prompt_question = body.lastPromptQuestion
    if (body.lastPastedText !== undefined) updates.last_pasted_text = body.lastPastedText
    if (body.lastOutcomeScore !== undefined) updates.last_outcome_score = body.lastOutcomeScore
    if (body.lastOutcomeConfidence !== undefined) updates.last_outcome_confidence = body.lastOutcomeConfidence
    if (body.lastOutcomeFeedback !== undefined) updates.last_outcome_feedback = body.lastOutcomeFeedback
    if (body.minutesActive !== undefined) updates.minutes_active = body.minutesActive
    if (body.metadata !== undefined) updates.metadata = body.metadata
    if (body.finalizeStatus !== undefined) updates.finalize_status = body.finalizeStatus
    if (body.finalizeVerdict !== undefined) updates.finalize_verdict = body.finalizeVerdict
    if (body.finalizeQuestions !== undefined) updates.finalize_questions = body.finalizeQuestions
    if (body.finalizeCompletedAt !== undefined) updates.finalize_completed_at = body.finalizeCompletedAt

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('demo_sessions').update(updates).eq('id', sessionId)

    if (!error) {
      return NextResponse.json({ ok: true, storageMode: 'table' })
    }

    console.warn('Falling back to Supabase storage for demo session update', error)
    await patchStoredSession(sessionId, updates)

    return NextResponse.json({ ok: true, storageMode: 'bucket' })
  } catch (error) {
    console.error('Failed to update demo session', error)
    return NextResponse.json({ error: 'Failed to update demo session.' }, { status: 500 })
  }
}
