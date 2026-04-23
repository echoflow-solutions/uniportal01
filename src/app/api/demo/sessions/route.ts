import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { DemoSessionPayload } from '@/lib/demo-persistence'
import { createStoredSession } from '@/lib/supabase/demo-storage'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200)

    const supabase = getSupabaseAdmin()
    const columns =
      'id, first_name, last_name, assignment_name, unit_name, session_started_at, session_ended_at, session_status, word_count, typed_words, pasted_words, paste_events, checks_triggered, checks_completed, minutes_active, updated_at'

    let { data, error } = await supabase
      .from('demo_sessions')
      .select(columns)
      .is('deleted_at', null)
      .order('session_started_at', { ascending: false })
      .limit(limit)

    // Graceful degradation: if the `deleted_at` column does not exist yet
    // (migration 20260420 not applied), fall back to an unfiltered query so
    // existing sessions remain visible instead of silently disappearing.
    if (error && typeof error.code === 'string' && error.code === '42703') {
      console.warn('demo_sessions.deleted_at missing — falling back to unfiltered list')
      const fallback = await supabase
        .from('demo_sessions')
        .select(columns)
        .order('session_started_at', { ascending: false })
        .limit(limit)
      data = fallback.data
      error = fallback.error
    }

    if (error) {
      console.error('Failed to list demo sessions', error)
      return NextResponse.json({ sessions: [] })
    }

    const sessions = (data ?? []).map((row) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      assignmentName: row.assignment_name,
      unitName: row.unit_name,
      startedAt: row.session_started_at,
      endedAt: row.session_ended_at,
      sessionStatus: row.session_status,
      wordCount: row.word_count ?? 0,
      typedWords: row.typed_words ?? 0,
      pastedWords: row.pasted_words ?? 0,
      pasteEvents: row.paste_events ?? 0,
      checksTriggered: row.checks_triggered ?? 0,
      checksCompleted: row.checks_completed ?? 0,
      minutesActive: row.minutes_active ?? 0,
      updatedAt: row.updated_at,
    }))

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Failed to list demo sessions', error)
    return NextResponse.json({ sessions: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DemoSessionPayload

    if (!body.firstName?.trim() || !body.lastName?.trim() || !body.assignmentName?.trim() || !body.unitName?.trim()) {
      return NextResponse.json({ error: 'Missing required session fields.' }, { status: 400 })
    }

    const trimmedPayload = {
      first_name: body.firstName.trim(),
      last_name: body.lastName.trim(),
      assignment_name: body.assignmentName.trim(),
      unit_name: body.unitName.trim(),
      session_started_at: body.startedAt,
      metadata: body.metadata ?? {},
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('demo_sessions')
      .insert(trimmedPayload)
      .select('id, session_started_at')
      .single()

    if (!error && data) {
      return NextResponse.json({ sessionId: data.id, startedAt: data.session_started_at, storageMode: 'table' })
    }

    console.warn('Falling back to Supabase storage for demo session creation', error)

    const sessionId = await createStoredSession(trimmedPayload)
    return NextResponse.json({ sessionId, startedAt: body.startedAt, storageMode: 'bucket' })
  } catch (error) {
    console.error('Failed to create demo session', error)
    return NextResponse.json({ error: 'Failed to create demo session.' }, { status: 500 })
  }
}
