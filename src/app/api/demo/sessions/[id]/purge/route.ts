import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { purgeStoredSession } from '@/lib/supabase/demo-storage'

type Params = {
  params: { id: string }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const sessionId = params.id

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session id.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('demo_sessions').delete().eq('id', sessionId)

    if (error) {
      console.warn('Table purge failed for demo session, trying bucket', error)
    }

    // Always clean bucket artifacts as well, in case the session was bucket-stored or had mixed state.
    try {
      await purgeStoredSession(sessionId)
    } catch (bucketError) {
      console.warn('Bucket purge failed for demo session', bucketError)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to purge demo session', error)
    return NextResponse.json({ error: 'Failed to permanently delete demo session.' }, { status: 500 })
  }
}
