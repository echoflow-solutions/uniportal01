import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { patchStoredSession } from '@/lib/supabase/demo-storage'

type Params = {
  params: { id: string }
}

export async function POST(_request: Request, { params }: Params) {
  try {
    const sessionId = params.id

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session id.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('demo_sessions')
      .update({ deleted_at: null })
      .eq('id', sessionId)
      .not('deleted_at', 'is', null)
      .select('id')
      .maybeSingle()

    if (!error && data) {
      return NextResponse.json({ ok: true, storageMode: 'table' })
    }

    if (error && typeof error.code === 'string' && error.code === '42703') {
      console.error('demo_sessions.deleted_at missing — recycle bin disabled', error)
      return NextResponse.json(
        {
          error:
            'Recycle bin is not ready yet. Run the supabase/migrations/20260420_demo_sessions_soft_delete.sql migration in Supabase to enable restore.',
        },
        { status: 503 }
      )
    }

    if (error) {
      console.warn('Falling back to Supabase storage for demo session restore', error)
    }

    await patchStoredSession(sessionId, { deleted_at: null })

    return NextResponse.json({ ok: true, storageMode: 'bucket' })
  } catch (error) {
    console.error('Failed to restore demo session', error)
    return NextResponse.json({ error: 'Failed to restore demo session.' }, { status: 500 })
  }
}
