import OpenAI from 'openai'

export type VerifyQuestion = {
  question: string
  excerpt: string
  difficulty: 'low' | 'medium' | 'high'
}

export type VerifyGrade = {
  score: number // 0-10 integer
  confidence: 'High' | 'Medium' | 'Low'
  feedback: string
  correct: boolean
}

const MODEL = 'gpt-4o-mini'
const TIMEOUT_MS = 8000
const MAX_PASTED_CHARS = 3000

const QUESTION_SYSTEM_PROMPT = `You are an academic integrity assistant helping verify whether a student understands text they pasted into an assignment. Generate one concise comprehension question that tests understanding of a specific concept, argument, or causal link in the pasted passage. The question must be answerable in 2-4 sentences from memory without re-reading the passage. Avoid trivia and direct recall — test reasoning. Reply in strict JSON only: {"question": "...", "excerpt": "6-12 word anchor phrase from the passage", "difficulty": "low"|"medium"|"high"}.`

const GRADING_SYSTEM_PROMPT = `You are grading a student's answer to a comprehension check. They pasted a passage into an assignment and were asked a question about it. Grade 0-10: 9-10 = clear understanding in own words; 7-8 = mostly correct with minor gaps; 5-6 = partial, relies on surface paraphrase; 3-4 = weak, significant misunderstanding; 0-2 = no understanding, empty, or off-topic. "correct" is true only if score >= 7. Feedback must be one sentence, max 25 words, addressing the student directly (use "you"). Reply in strict JSON only: {"score": 0-10, "confidence": "High"|"Medium"|"Low", "feedback": "...", "correct": true|false}.`

export function isOpenAIConfigured(): boolean {
  const key = process.env.OPENAI_API_KEY
  return typeof key === 'string' && key.trim().length > 0
}

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

function validateQuestion(raw: unknown): VerifyQuestion | null {
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

function validateGrade(raw: unknown): VerifyGrade | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const scoreRaw = obj.score
  let score: number
  if (typeof scoreRaw === 'number' && Number.isFinite(scoreRaw)) {
    score = Math.round(scoreRaw)
  } else if (typeof scoreRaw === 'string' && scoreRaw.trim() !== '' && Number.isFinite(Number(scoreRaw))) {
    score = Math.round(Number(scoreRaw))
  } else {
    return null
  }
  if (!Number.isInteger(score)) return null
  // Clamp to 0-10
  score = Math.max(0, Math.min(10, score))

  const confidenceRaw = typeof obj.confidence === 'string' ? obj.confidence : ''
  const confidence =
    confidenceRaw === 'High' || confidenceRaw === 'Medium' || confidenceRaw === 'Low'
      ? (confidenceRaw as 'High' | 'Medium' | 'Low')
      : null
  if (!confidence) return null

  const feedback = typeof obj.feedback === 'string' ? obj.feedback.trim() : ''
  if (!feedback) return null

  const correctRaw = obj.correct
  const correct =
    typeof correctRaw === 'boolean' ? correctRaw : score >= 7

  return { score, confidence, feedback, correct }
}

export async function generateVerifyQuestion(input: {
  pastedText: string
  assignmentName: string
  unitName: string
}): Promise<VerifyQuestion | null> {
  const client = getClient()
  if (!client) return null

  const pastedText = truncate(input.pastedText || '')
  if (!pastedText || pastedText.trim().length === 0) return null

  const userMessage = `Unit: ${input.unitName}
Assignment: ${input.assignmentName}

Pasted passage:
"""
${pastedText}
"""

Generate the comprehension question now.`

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
    console.error('[verify.generateQuestion] OpenAI call failed', err)
    return null
  }
}

export async function gradeVerifyAnswer(input: {
  pastedText: string
  question: string
  answer: string
  assignmentName: string
  unitName: string
}): Promise<VerifyGrade | null> {
  const client = getClient()
  if (!client) return null

  const pastedText = truncate(input.pastedText || '')
  if (!pastedText || pastedText.trim().length === 0) return null
  if (!input.question || !input.question.trim()) return null

  const userMessage = `Unit: ${input.unitName}
Assignment: ${input.assignmentName}

Pasted passage:
"""
${pastedText}
"""

Question asked:
${input.question}

Student's answer:
"""
${input.answer}
"""

Grade now.`

  try {
    const completion = await client.chat.completions.create(
      {
        model: MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: GRADING_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      },
      { signal: AbortSignal.timeout(TIMEOUT_MS) },
    )

    const content = completion.choices?.[0]?.message?.content
    const parsed = parseJsonContent(content)
    return validateGrade(parsed)
  } catch (err) {
    console.error('[verify.gradeAnswer] OpenAI call failed', err)
    return null
  }
}
