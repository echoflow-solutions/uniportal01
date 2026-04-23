import { NextResponse } from 'next/server'
import {
  buildFallbackFinalizeQuestions,
  generateFinalizeQuestions,
} from '@/lib/openai/finalize'
import { isOpenAIConfigured } from '@/lib/openai/verify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function computeMaxQuestions(pasteCount: number): number {
  if (pasteCount <= 0) return 0
  if (pasteCount === 1) return 1
  if (pasteCount <= 4) return 2
  return 3
}

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
    }

    const { sessionId, assignmentName, unitName, pastedTexts } = (body ?? {}) as {
      sessionId?: unknown
      assignmentName?: unknown
      unitName?: unknown
      pastedTexts?: unknown
    }

    const sessionIdStr = typeof sessionId === 'string' ? sessionId.trim() : ''
    if (!sessionIdStr) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 })
    }

    if (!Array.isArray(pastedTexts)) {
      return NextResponse.json({ error: 'pastedTexts must be an array.' }, { status: 400 })
    }

    const pastedTextsStr: string[] = pastedTexts.map((item) =>
      typeof item === 'string' ? item : '',
    )

    const assignmentNameStr = typeof assignmentName === 'string' ? assignmentName : ''
    const unitNameStr = typeof unitName === 'string' ? unitName : ''

    const maxQuestions = computeMaxQuestions(pastedTextsStr.length)

    if (maxQuestions === 0) {
      return NextResponse.json({ ok: true, questions: [] })
    }

    if (!isOpenAIConfigured()) {
      const questions = buildFallbackFinalizeQuestions({
        pastedTexts: pastedTextsStr,
        maxQuestions,
      })
      return NextResponse.json({ ok: false, fallback: true, questions })
    }

    const questions = await generateFinalizeQuestions({
      pastedTexts: pastedTextsStr,
      assignmentName: assignmentNameStr,
      unitName: unitNameStr,
      maxQuestions,
    })

    return NextResponse.json({ ok: true, questions })
  } catch (err) {
    console.error('[api.verify.finalize.questions] Unexpected error', err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
