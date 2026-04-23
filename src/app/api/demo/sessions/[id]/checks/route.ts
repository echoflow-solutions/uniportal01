import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { DemoCheckCreatePayload } from '@/lib/demo-persistence'
import { createStoredCheck } from '@/lib/supabase/demo-storage'

type Params = {
  params: { id: string }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = (await request.json()) as DemoCheckCreatePayload
    const sessionId = params.id

    if (!sessionId || !body.promptQuote || !body.promptQuestion || !body.pastedText) {
      return NextResponse.json({ error: 'Missing check fields.' }, { status: 400 })
    }

    const checkPayload = {
      session_id: sessionId,
      status: 'warning',
      prompt_quote: body.promptQuote,
      prompt_question: body.promptQuestion,
      pasted_text: body.pastedText,
      warning_seconds: body.warningSeconds,
      warning_started_at: body.warningStartedAt,
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('demo_session_checks')
      .insert(checkPayload)
      .select('id')
      .single()

    if (!error && data) {
      return NextResponse.json({ checkId: data.id, storageMode: 'table' })
    }

    console.warn('Falling back to Supabase storage for demo check creation', error)
    const checkId = await createStoredCheck(sessionId, checkPayload)

    return NextResponse.json({ checkId, storageMode: 'bucket' })
  } catch (error) {
    console.error('Failed to create demo check', error)
    return NextResponse.json({ error: 'Failed to create demo check.' }, { status: 500 })
  }
}
