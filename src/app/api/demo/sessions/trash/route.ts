import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { purgeStoredSession } from '@/lib/supabase/demo-storage'
import { DEMO_TRASH_RETENTION_DAYS } from '@/lib/demo-persistence'

const MS_PER_DAY = 24 * 60 * 60 * 1000

function computePurgeAt(deletedAtIso: string): string {
  const deletedAt = new Date(deletedAtIso).getTime()
  return new Date(deletedAt + DEMO_TRASH_RETENTION_DAYS * MS_PER_DAY).toISOString()
}

async function sweepExpired(): Promise<string[]> {
  const cutoff = new Date(Date.now() - DEMO_TRASH_RETENTION_DAYS * MS_PER_DAY).toISOString()
  const supabase = getSupabaseAdmin()

  const { data: expired, error: selectError } = await supabase
    .from('demo_sessions')
    .select('id')
    .not('deleted_at', 'is', null)
    .lte('deleted_at', cutoff)

  if (selectError) {
    console.warn('Trash sweep select failed', selectError)
    return []
  }

  const ids = (expired ?? []).map((row) => row.id as string)
  if (ids.length === 0) return []

  const { error: deleteError } = await supabase.from('demo_sessions').delete().in('id', ids)
  if (deleteError) {
    console.warn('Trash sweep delete failed', deleteError)
  }

  await Promise.all(
    ids.map((id) =>
      purgeStoredSession(id).catch((bucketError) => {
        console.warn('Trash sweep bucket cleanup failed', id, bucketError)
      })
    )
  )

  return ids
}

export async function GET(request: Request) {
  try {
    await sweepExpired()

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') ?? 100), 300)

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('demo_sessions')
      .select(
        'id, first_name, last_name, assignment_name, unit_name, session_started_at, session_status, word_count, deleted_at'
      )
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Failed to list trashed demo sessions', error)
      return NextResponse.json({ sessions: [], retentionDays: DEMO_TRASH_RETENTION_DAYS })
    }

    const sessions = (data ?? []).map((row) => {
      const deletedAt = row.deleted_at as string
      return {
        id: row.id as string,
        firstName: (row.first_name as string) ?? '',
        lastName: (row.last_name as string) ?? '',
        assignmentName: (row.assignment_name as string) ?? '',
        unitName: (row.unit_name as string) ?? '',
        startedAt: (row.session_started_at as string) ?? new Date().toISOString(),
        sessionStatus: (row.session_status as string) ?? undefined,
        wordCount: (row.word_count as number) ?? 0,
        deletedAt,
        purgeAt: computePurgeAt(deletedAt),
      }
    })

    return NextResponse.json({ sessions, retentionDays: DEMO_TRASH_RETENTION_DAYS })
  } catch (error) {
    console.error('Failed to load recycle bin', error)
    return NextResponse.json({ sessions: [], retentionDays: DEMO_TRASH_RETENTION_DAYS })
  }
}

export async function DELETE() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error: selectError } = await supabase
      .from('demo_sessions')
      .select('id')
      .not('deleted_at', 'is', null)

    if (selectError) {
      console.warn('Empty-trash select failed', selectError)
    }

    const ids = (data ?? []).map((row) => row.id as string)

    if (ids.length > 0) {
      const { error: deleteError } = await supabase.from('demo_sessions').delete().in('id', ids)
      if (deleteError) {
        console.warn('Empty-trash delete failed', deleteError)
      }
      await Promise.all(
        ids.map((id) =>
          purgeStoredSession(id).catch((bucketError) => {
            console.warn('Empty-trash bucket cleanup failed', id, bucketError)
          })
        )
      )
    }

    return NextResponse.json({ ok: true, purged: ids.length })
  } catch (error) {
    console.error('Failed to empty recycle bin', error)
    return NextResponse.json({ error: 'Failed to empty recycle bin.' }, { status: 500 })
  }
}
