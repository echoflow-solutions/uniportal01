import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { patchStoredSession, purgeStoredSession } from '@/lib/supabase/demo-storage'
import type { DemoBulkAction } from '@/lib/demo-persistence'

type BulkRequestBody = {
  action?: DemoBulkAction
  ids?: string[]
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BulkRequestBody
    const action = body.action
    const ids = Array.isArray(body.ids) ? body.ids.filter((id): id is string => typeof id === 'string' && id.length > 0) : []

    if (!action || !['delete', 'restore', 'purge'].includes(action)) {
      return NextResponse.json({ error: 'Unsupported bulk action.' }, { status: 400 })
    }

    if (ids.length === 0) {
      return NextResponse.json({ ok: true, processed: 0 })
    }

    const supabase = getSupabaseAdmin()

    if (action === 'delete') {
      const deletedAt = new Date().toISOString()
      const { data, error } = await supabase
        .from('demo_sessions')
        .update({ deleted_at: deletedAt })
        .in('id', ids)
        .is('deleted_at', null)
        .select('id')

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
        console.warn('Bulk soft-delete table update failed, falling back to bucket', error)
      }

      const tableIds = new Set((data ?? []).map((row) => row.id as string))
      const leftover = ids.filter((id) => !tableIds.has(id))

      await Promise.all(
        leftover.map((id) =>
          patchStoredSession(id, { deleted_at: deletedAt }).catch((bucketError) => {
            console.warn('Bulk soft-delete bucket fallback failed', id, bucketError)
          })
        )
      )

      return NextResponse.json({ ok: true, processed: ids.length, deletedAt })
    }

    if (action === 'restore') {
      const { data, error } = await supabase
        .from('demo_sessions')
        .update({ deleted_at: null })
        .in('id', ids)
        .not('deleted_at', 'is', null)
        .select('id')

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
        console.warn('Bulk restore table update failed, falling back to bucket', error)
      }

      const tableIds = new Set((data ?? []).map((row) => row.id as string))
      const leftover = ids.filter((id) => !tableIds.has(id))

      await Promise.all(
        leftover.map((id) =>
          patchStoredSession(id, { deleted_at: null }).catch((bucketError) => {
            console.warn('Bulk restore bucket fallback failed', id, bucketError)
          })
        )
      )

      return NextResponse.json({ ok: true, processed: ids.length })
    }

    // purge: permanent delete
    const { error } = await supabase.from('demo_sessions').delete().in('id', ids)

    if (error) {
      console.warn('Bulk purge table delete failed, continuing with bucket cleanup', error)
    }

    await Promise.all(
      ids.map((id) =>
        purgeStoredSession(id).catch((bucketError) => {
          console.warn('Bulk purge bucket cleanup failed', id, bucketError)
        })
      )
    )

    return NextResponse.json({ ok: true, processed: ids.length })
  } catch (error) {
    console.error('Failed to run bulk demo session action', error)
    return NextResponse.json({ error: 'Failed to run bulk demo session action.' }, { status: 500 })
  }
}
