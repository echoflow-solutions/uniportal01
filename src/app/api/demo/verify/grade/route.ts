import { NextResponse } from 'next/server'
import { gradeVerifyAnswer, isOpenAIConfigured, type VerifyGrade } from '@/lib/openai/verify'

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

    const { pastedText, question, answer, assignmentName, unitName } = (body ?? {}) as {
      pastedText?: unknown
      question?: unknown
      answer?: unknown
      assignmentName?: unknown
      unitName?: unknown
    }

    const questionStr = typeof question === 'string' ? question : ''
    const answerStr = typeof answer === 'string' ? answer : ''

    if (!questionStr || !questionStr.trim()) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 })
    }
    if (typeof answer !== 'string') {
      return NextResponse.json({ error: 'Answer is required.' }, { status: 400 })
    }

    if (answerStr.trim().length === 0) {
      const emptyGrade: VerifyGrade = {
        score: 0,
        confidence: 'Low',
        feedback: 'No answer provided.',
        correct: false,
      }
      return NextResponse.json({ ok: true, grade: emptyGrade })
    }

    if (!isOpenAIConfigured()) {
      return NextResponse.json({ ok: false, fallback: true })
    }

    const pasted = typeof pastedText === 'string' ? pastedText : ''

    const grade = await gradeVerifyAnswer({
      pastedText: pasted,
      question: questionStr,
      answer: answerStr,
      assignmentName: typeof assignmentName === 'string' ? assignmentName : '',
      unitName: typeof unitName === 'string' ? unitName : '',
    })

    if (!grade) {
      return NextResponse.json({ ok: false, fallback: true, reason: 'grading-failed' })
    }

    return NextResponse.json({ ok: true, grade })
  } catch (err) {
    console.error('[api.verify.grade] Unexpected error', err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
