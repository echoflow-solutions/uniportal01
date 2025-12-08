import type { WritingSession, AuthorshipAnalytics } from '@/types'

/**
 * Calculate authorship score based on writing sessions
 * Higher score indicates stronger evidence of authentic authorship
 */
export function calculateAuthorshipScore(
  sessions: WritingSession[]
): number {
  if (sessions.length === 0) return 0

  // Factors that contribute to authorship score
  let score = 100

  // Factor 1: Session count (ideal: 4+ sessions for a major assignment)
  const sessionPenalty = Math.max(0, (4 - sessions.length) * 8)
  score -= sessionPenalty

  // Factor 2: Session distribution (spread over multiple days is better)
  const uniqueDays = new Set(
    sessions.map((s) => new Date(s.startedAt).toDateString())
  ).size
  const distributionBonus = Math.min(uniqueDays * 3, 15)
  score += distributionBonus - 15 // Normalize to penalty if low

  // Factor 3: Paste percentage
  const totalWordsTyped = sessions.reduce((acc, s) => acc + s.wordsTyped, 0)
  const totalWordsPasted = sessions.reduce((acc, s) => acc + s.wordsPasted, 0)
  const totalWords = totalWordsTyped + totalWordsPasted
  const pastePercentage = totalWords > 0 ? (totalWordsPasted / totalWords) * 100 : 0

  // Heavy penalty for high paste percentage
  if (pastePercentage > 50) {
    score -= (pastePercentage - 50) * 1.5
  } else if (pastePercentage > 30) {
    score -= (pastePercentage - 30) * 0.5
  }

  // Factor 4: Revision activity (edits relative to content)
  const totalEdits = sessions.reduce((acc, s) => acc + s.editEvents, 0)
  const revisionRatio = totalWords > 0 ? totalEdits / totalWords : 0

  // Low revision is suspicious
  if (revisionRatio < 0.05) {
    score -= 15
  } else if (revisionRatio < 0.1) {
    score -= 8
  }

  // Factor 5: Active time relative to word count
  const totalActiveTime = sessions.reduce((acc, s) => acc + s.activeTimeSeconds, 0)
  const wordsPerMinute = totalActiveTime > 0
    ? (totalWordsTyped / totalActiveTime) * 60
    : 0

  // Suspiciously fast typing (accounting for pasted content)
  if (wordsPerMinute > 60) {
    score -= (wordsPerMinute - 60) * 0.3
  }

  // Factor 6: Single session for large content is suspicious
  if (sessions.length === 1 && totalWords > 2000) {
    score -= 20
  }

  // Normalize score to 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Determine risk level based on combined integrity score
 */
export function calculateRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 70) return 'low'
  if (score >= 50) return 'medium'
  return 'high'
}

/**
 * Format duration in seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${hours}h`
  }

  if (remainingSeconds > 0 && minutes < 10) {
    return `${minutes}m ${remainingSeconds}s`
  }

  return `${minutes}m`
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`
  }

  return `${hours}h`
}

/**
 * Generate session timeline data for charts
 */
export interface SessionTimelineData {
  date: string
  sessions: number
  totalMinutes: number
  wordsWritten: number
}

export function generateSessionTimeline(
  sessions: WritingSession[]
): SessionTimelineData[] {
  const dailyData: Record<string, SessionTimelineData> = {}

  sessions.forEach((session) => {
    const date = new Date(session.startedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        sessions: 0,
        totalMinutes: 0,
        wordsWritten: 0,
      }
    }

    dailyData[date].sessions += 1
    dailyData[date].totalMinutes += Math.round(session.activeTimeSeconds / 60)
    dailyData[date].wordsWritten += session.wordsTyped
  })

  // Sort by date
  return Object.values(dailyData).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
}

/**
 * Generate typing speed data for charts
 */
export interface TypingSpeedData {
  time: string
  wpm: number
  sessionId: string
}

export function generateTypingSpeedData(
  sessions: WritingSession[]
): TypingSpeedData[] {
  return sessions.map((session) => ({
    time: new Date(session.startedAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    wpm:
      session.activeTimeSeconds > 0
        ? Math.round((session.wordsTyped / session.activeTimeSeconds) * 60)
        : 0,
    sessionId: session.id,
  }))
}

/**
 * Generate paste analysis data
 */
export interface PasteAnalysisData {
  typed: number
  pasted: number
  pastePercentage: number
  pasteEvents: number
  avgPasteSize: number
}

export function generatePasteAnalysis(
  sessions: WritingSession[]
): PasteAnalysisData {
  const totalTyped = sessions.reduce((acc, s) => acc + s.wordsTyped, 0)
  const totalPasted = sessions.reduce((acc, s) => acc + s.wordsPasted, 0)
  const totalPasteEvents = sessions.reduce((acc, s) => acc + s.pasteEvents, 0)
  const total = totalTyped + totalPasted

  return {
    typed: totalTyped,
    pasted: totalPasted,
    pastePercentage: total > 0 ? Math.round((totalPasted / total) * 100) : 0,
    pasteEvents: totalPasteEvents,
    avgPasteSize:
      totalPasteEvents > 0 ? Math.round(totalPasted / totalPasteEvents) : 0,
  }
}

/**
 * Calculate comprehension metrics from verification test
 */
export interface ComprehensionMetrics {
  overallScore: number
  byQuestionType: Record<string, { score: number; count: number }>
  strengths: string[]
  weaknesses: string[]
}

export function analyzeComprehension(
  responses: Array<{ type: string; score: number }>
): ComprehensionMetrics {
  if (responses.length === 0) {
    return {
      overallScore: 0,
      byQuestionType: {},
      strengths: [],
      weaknesses: [],
    }
  }

  const byType: Record<string, { total: number; count: number }> = {}
  let totalScore = 0

  responses.forEach((response) => {
    totalScore += response.score

    if (!byType[response.type]) {
      byType[response.type] = { total: 0, count: 0 }
    }
    byType[response.type].total += response.score
    byType[response.type].count += 1
  })

  const byQuestionType: Record<string, { score: number; count: number }> = {}
  const typeScores: Array<{ type: string; score: number }> = []

  Object.entries(byType).forEach(([type, data]) => {
    const avgScore = Math.round(data.total / data.count)
    byQuestionType[type] = { score: avgScore, count: data.count }
    typeScores.push({ type, score: avgScore })
  })

  // Sort to find strengths and weaknesses
  typeScores.sort((a, b) => b.score - a.score)

  const questionTypeLabels: Record<string, string> = {
    simplify: 'Explaining concepts simply',
    justify: 'Justifying decisions',
    counter: 'Addressing counterarguments',
    extend: 'Extending ideas',
    process: 'Describing processes',
  }

  const strengths = typeScores
    .filter((t) => t.score >= 75)
    .slice(0, 2)
    .map((t) => questionTypeLabels[t.type] || t.type)

  const weaknesses = typeScores
    .filter((t) => t.score < 60)
    .slice(-2)
    .map((t) => questionTypeLabels[t.type] || t.type)

  return {
    overallScore: Math.round(totalScore / responses.length),
    byQuestionType,
    strengths,
    weaknesses,
  }
}

/**
 * Calculate style consistency score
 * In a real system, this would use NLP to compare writing styles
 */
export function calculateStyleConsistency(
  currentSubmission: string,
  previousSubmissions: string[]
): number {
  // Simplified mock calculation
  // In production, this would use actual NLP/ML models

  if (previousSubmissions.length === 0) {
    return 70 // Neutral score for new students
  }

  // Mock: Return a score based on content length similarity
  const currentLength = currentSubmission.length
  const avgPreviousLength =
    previousSubmissions.reduce((acc, s) => acc + s.length, 0) /
    previousSubmissions.length

  const lengthRatio = Math.min(currentLength, avgPreviousLength) /
    Math.max(currentLength, avgPreviousLength)

  // Scale to 60-95 range
  return Math.round(60 + lengthRatio * 35)
}

/**
 * Generate integrity flags based on analytics
 */
export function generateIntegrityFlags(
  analytics: AuthorshipAnalytics,
  comprehensionScore: number,
  styleScore: number
): string[] {
  const flags: string[] = []

  // Single session flag
  if (analytics.totalSessions === 1 && analytics.totalActiveTime > 3600) {
    flags.push('Single session submission')
  }

  // Low session count
  if (analytics.totalSessions < 3) {
    flags.push(`Session count below recommended minimum (${analytics.totalSessions} sessions)`)
  }

  // High paste percentage
  if (analytics.pastePercentage > 50) {
    flags.push(`Critical: High undeclared paste ratio (${analytics.pastePercentage.toFixed(0)}%)`)
  } else if (analytics.pastePercentage > 30) {
    flags.push(`Elevated paste ratio (${analytics.pastePercentage.toFixed(0)}%) - some paste events require review`)
  }

  // Low comprehension
  if (comprehensionScore < 40) {
    flags.push(`Comprehension score significantly below threshold (${comprehensionScore}/100)`)
  } else if (comprehensionScore < 55) {
    flags.push(`Comprehension score below expected level (${comprehensionScore}/100)`)
  }

  // Style inconsistency
  if (styleScore < 50) {
    flags.push('Significant writing style deviation from baseline')
  } else if (styleScore < 65) {
    flags.push('Notable writing style variation detected')
  }

  // Low revision activity
  if (analytics.revisionDepth < 0.05) {
    flags.push('Minimal revision activity inconsistent with claimed authorship')
  }

  // Suspiciously fast typing
  if (analytics.avgWordsPerMinute > 70) {
    flags.push('Unusually high typing speed detected')
  }

  return flags
}

/**
 * Generate recommendation based on scores and flags
 */
export function generateRecommendation(
  combinedScore: number,
  flags: string[],
  studentName: string
): string {
  if (combinedScore >= 85) {
    return `Approve - Excellent demonstration of understanding. ${studentName} shows strong authorship indicators and comprehensive knowledge of the subject matter.`
  }

  if (combinedScore >= 70) {
    if (flags.length === 0) {
      return `Approve - Normal patterns observed. ${studentName}'s submission demonstrates adequate engagement and understanding.`
    }
    return `Approve with note - Minor areas for attention: ${flags.join(', ')}. Overall submission quality is acceptable.`
  }

  if (combinedScore >= 50) {
    return `Review recommended - ${studentName}'s submission shows some concerning patterns: ${flags.slice(0, 2).join(', ')}. Consider a brief discussion to verify understanding.`
  }

  return `Further investigation required - Multiple significant integrity concerns detected for ${studentName}: ${flags.slice(0, 3).join(', ')}. Recommend scheduling an in-person discussion and potentially requiring a supervised revision session.`
}

/**
 * Format a percentage value for display
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Get color class based on score
 */
export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-600'
}

/**
 * Get background color class based on score
 */
export function getScoreBgClass(score: number): string {
  if (score >= 80) return 'bg-green-100'
  if (score >= 60) return 'bg-amber-100'
  return 'bg-red-100'
}

/**
 * Calculate combined integrity score
 */
export function calculateCombinedScore(
  authorshipScore: number,
  comprehensionScore: number,
  styleScore: number
): number {
  // Weighted average: authorship 40%, comprehension 40%, style 20%
  return Math.round(
    authorshipScore * 0.4 + comprehensionScore * 0.4 + styleScore * 0.2
  )
}
