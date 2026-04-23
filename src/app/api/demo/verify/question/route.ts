import { NextResponse } from 'next/server'
import { generateVerifyQuestion, isOpenAIConfigured } from '@/lib/openai/verify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
    }

    const { pastedText, assignmentName, unitName } = (body ?? {}) as {
      pastedText?: unknown
      assignmentName?: unknown
      unitName?: unknown
    }

    const pasted = typeof pastedText === 'string' ? pastedText : ''
    if (!pasted || pasted.trim().length < 10) {
      return NextResponse.json({ error: 'Passage too short.' }, { status: 400 })
    }

    if (!isOpenAIConfigured()) {
      return NextResponse.json({ ok: false, fallback: true })
    }

    const question = await generateVerifyQuestion({
      pastedText: pasted,
      assignmentName: typeof assignmentName === 'string' ? assignmentName : '',
      unitName: typeof unitName === 'string' ? unitName : '',
    })

    if (!question) {
      return NextResponse.json({ ok: false, fallback: true, reason: 'generation-failed' })
    }

    return NextResponse.json({ ok: true, question })
  } catch (err) {
    console.error('[api.verify.question] Unexpected error', err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
