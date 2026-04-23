import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { DemoCheckPatchPayload } from '@/lib/demo-persistence'
import { patchStoredCheck } from '@/lib/supabase/demo-storage'

type Params = {
  params: { id: string; checkId: string }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = (await request.json()) as DemoCheckPatchPayload
    const sessionId = params.id
    const checkId = params.checkId

    if (!sessionId || !checkId) {
      return NextResponse.json({ error: 'Missing check id.' }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}

    if (body.status !== undefined) updates.status = body.status
    if (body.startedAt !== undefined) updates.started_at = body.startedAt
    if (body.submittedAt !== undefined) updates.submitted_at = body.submittedAt
    if (body.answerText !== undefined) updates.answer_text = body.answerText
    if (body.score !== undefined) updates.score = body.score
    if (body.confidence !== undefined) updates.confidence = body.confidence
    if (body.feedback !== undefined) updates.feedback = body.feedback
    if (body.followUp !== undefined) updates.follow_up = body.followUp
    if (body.durationSeconds !== undefined) updates.duration_seconds = body.durationSeconds

    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('demo_session_checks')
      .update(updates)
      .eq('id', checkId)
      .eq('session_id', sessionId)

    if (!error) {
      return NextResponse.json({ ok: true, storageMode: 'table' })
    }

    console.warn('Falling back to Supabase storage for demo check update', error)
    await patchStoredCheck(sessionId, checkId, updates)

    return NextResponse.json({ ok: true, storageMode: 'bucket' })
  } catch (error) {
    console.error('Failed to update demo check', error)
    return NextResponse.json({ error: 'Failed to update demo check.' }, { status: 500 })
  }
}
