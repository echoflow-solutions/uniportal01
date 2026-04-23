import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { DemoEventPayload } from '@/lib/demo-persistence'
import { appendStoredEvent } from '@/lib/supabase/demo-storage'

type Params = {
  params: { id: string }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = (await request.json()) as DemoEventPayload
    const sessionId = params.id

    if (!sessionId || !body.kind || !body.message) {
      return NextResponse.json({ error: 'Missing event fields.' }, { status: 400 })
    }

    const eventPayload = {
      session_id: sessionId,
      kind: body.kind,
      message: body.message,
      payload: body.payload ?? {},
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('demo_session_events').insert(eventPayload)

    if (!error) {
      return NextResponse.json({ ok: true, storageMode: 'table' })
    }

    console.warn('Falling back to Supabase storage for demo event', error)
    await appendStoredEvent(sessionId, eventPayload)

    return NextResponse.json({ ok: true, storageMode: 'bucket' })
  } catch (error) {
    console.error('Failed to create demo session event', error)
    return NextResponse.json({ error: 'Failed to create demo event.' }, { status: 500 })
  }
}
