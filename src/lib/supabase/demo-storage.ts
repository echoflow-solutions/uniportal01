import { getSupabaseAdmin } from '@/lib/supabase/server'

const DEMO_BUCKET = 'demo-sessions'

async function ensureBucket() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage.getBucket(DEMO_BUCKET)

  if (!error && data) {
    return supabase
  }

  await supabase.storage.createBucket(DEMO_BUCKET, {
    public: false,
    fileSizeLimit: 1024 * 1024 * 2,
  })

  return supabase
}

async function readJson<T>(path: string): Promise<T | null> {
  const supabase = await ensureBucket()
  const { data, error } = await supabase.storage.from(DEMO_BUCKET).download(path)

  if (error || !data) {
    return null
  }

  const text = await data.text()

  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

export async function readStoredSession<T extends Record<string, unknown>>(sessionId: string) {
  return readJson<T>(`sessions/${sessionId}/snapshot.json`)
}

async function writeJson(path: string, payload: unknown) {
  const supabase = await ensureBucket()

  const { error } = await supabase.storage.from(DEMO_BUCKET).upload(
    path,
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    {
      upsert: true,
      contentType: 'application/json',
    }
  )

  if (error) {
    throw error
  }
}

export async function createStoredSession(payload: Record<string, unknown>) {
  const sessionId = crypto.randomUUID()
  const snapshot = {
    id: sessionId,
    ...payload,
    storageMode: 'bucket',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await writeJson(`sessions/${sessionId}/snapshot.json`, snapshot)
  return sessionId
}

export async function patchStoredSession(sessionId: string, patch: Record<string, unknown>) {
  const current = (await readJson<Record<string, unknown>>(`sessions/${sessionId}/snapshot.json`)) ?? {
    id: sessionId,
    storageMode: 'bucket',
    createdAt: new Date().toISOString(),
  }

  await writeJson(`sessions/${sessionId}/snapshot.json`, {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  })
}

export async function appendStoredEvent(sessionId: string, event: Record<string, unknown>) {
  const eventId = crypto.randomUUID()
  await writeJson(`sessions/${sessionId}/events/${Date.now()}-${eventId}.json`, {
    id: eventId,
    ...event,
    createdAt: new Date().toISOString(),
  })
}

export async function createStoredCheck(sessionId: string, payload: Record<string, unknown>) {
  const checkId = crypto.randomUUID()
  await writeJson(`sessions/${sessionId}/checks/${checkId}.json`, {
    id: checkId,
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  return checkId
}

export async function patchStoredCheck(sessionId: string, checkId: string, patch: Record<string, unknown>) {
  const current = (await readJson<Record<string, unknown>>(`sessions/${sessionId}/checks/${checkId}.json`)) ?? {
    id: checkId,
    sessionId,
    createdAt: new Date().toISOString(),
  }

  await writeJson(`sessions/${sessionId}/checks/${checkId}.json`, {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  })
}

export async function listStoredSessionObjects(sessionId: string) {
  const supabase = await ensureBucket()
  const collected: string[] = []
  const queue = [`sessions/${sessionId}`]

  while (queue.length > 0) {
    const prefix = queue.shift() as string
    const { data, error } = await supabase.storage.from(DEMO_BUCKET).list(prefix, { limit: 1000 })
    if (error || !data) continue
    for (const entry of data) {
      const fullPath = `${prefix}/${entry.name}`
      if (entry.id === null || entry.metadata === null) {
        queue.push(fullPath)
      } else {
        collected.push(fullPath)
      }
    }
  }

  return collected
}

export async function purgeStoredSession(sessionId: string) {
  const supabase = await ensureBucket()
  const paths = await listStoredSessionObjects(sessionId)
  if (paths.length === 0) return
  await supabase.storage.from(DEMO_BUCKET).remove(paths)
}
