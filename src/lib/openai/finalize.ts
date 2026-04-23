import OpenAI from 'openai'
import { isOpenAIConfigured } from './verify'

export type FinalizeQuestion = {
  passageIndex: number
  passageText: string
  question: string
  excerpt: string
  difficulty: 'low' | 'medium' | 'high'
  source: 'ai' | 'fallback'
}

const MODEL = 'gpt-4o-mini'
const TIMEOUT_MS = 8000
const MAX_PASTED_CHARS = 3000

const QUESTION_SYSTEM_PROMPT = `You are an academic integrity assistant helping verify whether a student understands text they pasted into an assignment. Generate one concise comprehension question that tests understanding of a specific concept, argument, or causal link in the pasted passage. The question must be answerable in 2-4 sentences from memory without re-reading the passage. Avoid trivia and direct recall — test reasoning. Reply in strict JSON only: {"question": "...", "excerpt": "6-12 word anchor phrase from the passage", "difficulty": "low"|"medium"|"high"}.`

function getClient(): OpenAI | null {
  if (!isOpenAIConfigured()) return null
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

function truncate(text: string): string {
  if (!text) return ''
  return text.length > MAX_PASTED_CHARS ? text.slice(0, MAX_PASTED_CHARS) : text
}

function parseJsonContent(content: string | null | undefined): unknown {
  if (!content) return null
  try {
    return JSON.parse(content)
  } catch {
    return null
  }
}

type ParsedQuestion = {
  question: string
  excerpt: string
  difficulty: 'low' | 'medium' | 'high'
}

function validateQuestion(raw: unknown): ParsedQuestion | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const question = typeof obj.question === 'string' ? obj.question.trim() : ''
  const excerpt = typeof obj.excerpt === 'string' ? obj.excerpt.trim() : ''
  const difficultyRaw = typeof obj.difficulty === 'string' ? obj.difficulty.toLowerCase() : ''
  if (!question) return null
  if (!excerpt) return null
  if (difficultyRaw !== 'low' && difficultyRaw !== 'medium' && difficultyRaw !== 'high') {
    return null
  }
  return {
    question,
    excerpt,
    difficulty: difficultyRaw as 'low' | 'medium' | 'high',
  }
}

function firstWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean)
  return words.slice(0, count).join(' ')
}

function buildFallback(passageIndex: number, passageText: string): FinalizeQuestion {
  return {
    passageIndex,
    passageText: truncate(passageText),
    question:
      'In your own words, explain the key idea from the passage you pasted. Why is it important in the context of your assignment?',
    excerpt: firstWords(passageText, 8),
    difficulty: 'medium',
    source: 'fallback',
  }
}

function selectPassages(
  pastedTexts: string[],
  maxQuestions: number,
): Array<{ passageIndex: number; passageText: string }> {
  if (pastedTexts.length === 0 || maxQuestions <= 0) return []
  const indexed = pastedTexts.map((passageText, passageIndex) => ({
    passageIndex,
    passageText: passageText || '',
    length: (passageText || '').length,
  }))
  // Sort by length descending; tie-break by picking later (more recent) passages first (higher index first).
  indexed.sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length
    return b.passageIndex - a.passageIndex
  })
  const selected = indexed.slice(0, maxQuestions)
  // Return in original passage order (ascending passageIndex).
  selected.sort((a, b) => a.passageIndex - b.passageIndex)
  return selected.map(({ passageIndex, passageText }) => ({ passageIndex, passageText }))
}

async function generateOneQuestion(
  client: OpenAI,
  input: {
    passageIndex: number
    passageText: string
    position: number
    total: number
    assignmentName: string
    unitName: string
  },
): Promise<ParsedQuestion | null> {
  const truncated = truncate(input.passageText)
  if (!truncated || truncated.trim().length === 0) return null

  const userMessage = `Unit: ${input.unitName}
Assignment: ${input.assignmentName}

This is a pre-submit verification. Passage ${input.position} of ${input.total} that the student pasted.

Pasted passage:
"""
${truncated}
"""

Generate the comprehension question now, anchored strictly to this passage.`

  try {
    const completion = await client.chat.completions.create(
      {
        model: MODEL,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: QUESTION_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      },
      { signal: AbortSignal.timeout(TIMEOUT_MS) },
    )

    const content = completion.choices?.[0]?.message?.content
    const parsed = parseJsonContent(content)
    return validateQuestion(parsed)
  } catch (err) {
    console.error('[finalize.generateOneQuestion] OpenAI call failed', err)
    return null
  }
}

export async function generateFinalizeQuestions(input: {
  pastedTexts: string[]
  assignmentName: string
  unitName: string
  maxQuestions: number
}): Promise<FinalizeQuestion[]> {
  if (!Array.isArray(input.pastedTexts) || input.pastedTexts.length === 0) return []
  if (!input.maxQuestions || input.maxQuestions <= 0) return []

  const client = getClient()
  if (!client) return []

  const selected = selectPassages(input.pastedTexts, input.maxQuestions)
  if (selected.length === 0) return []

  const total = selected.length

  const results = await Promise.all(
    selected.map(async ({ passageIndex, passageText }, idx) => {
      const parsed = await generateOneQuestion(client, {
        passageIndex,
        passageText,
        position: idx + 1,
        total,
        assignmentName: input.assignmentName || '',
        unitName: input.unitName || '',
      })

      if (!parsed) {
        return buildFallback(passageIndex, passageText)
      }

      const entry: FinalizeQuestion = {
        passageIndex,
        passageText: truncate(passageText),
        question: parsed.question,
        excerpt: parsed.excerpt,
        difficulty: parsed.difficulty,
        source: 'ai',
      }
      return entry
    }),
  )

  results.sort((a, b) => a.passageIndex - b.passageIndex)
  return results
}

export function buildFallbackFinalizeQuestions(input: {
  pastedTexts: string[]
  maxQuestions: number
}): FinalizeQuestion[] {
  if (!Array.isArray(input.pastedTexts) || input.pastedTexts.length === 0) return []
  if (!input.maxQuestions || input.maxQuestions <= 0) return []
  const selected = selectPassages(input.pastedTexts, input.maxQuestions)
  return selected.map(({ passageIndex, passageText }) => buildFallback(passageIndex, passageText))
}
