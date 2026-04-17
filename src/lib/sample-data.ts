export type SubmissionScenario = {
  id: 'verified' | 'ambiguous' | 'flagged'
  label: string
  score: number
  risk: 'low' | 'medium' | 'high'
  comprehension: number
  sessions: { label: string; minutes: number; words: number; status: 'typed' | 'declared' | 'flagged' }[]
  summary: string
  flags: string[]
  metrics: {
    typed: string
    quoted: string
    undeclared: string
    review: string
  }
}

export const submissionScenarios: SubmissionScenario[] = [
  {
    id: 'verified',
    label: 'Verified submission',
    score: 92,
    risk: 'low',
    comprehension: 92,
    sessions: [
      { label: 'Session 1', minutes: 41, words: 312, status: 'typed' },
      { label: 'Session 2', minutes: 53, words: 508, status: 'typed' },
      { label: 'Session 3', minutes: 47, words: 427, status: 'declared' },
      { label: 'Session 4', minutes: 36, words: 218, status: 'typed' },
      { label: 'Session 5', minutes: 59, words: 331, status: 'typed' },
      { label: 'Session 6', minutes: 28, words: 164, status: 'typed' },
      { label: 'Session 7', minutes: 18, words: 92, status: 'typed' },
    ],
    summary: 'Seven distributed sessions, declared quotations, and a strong Teaching Test result support approval.',
    flags: ['No undeclared paste detected', 'Consistency score remained within baseline bounds'],
    metrics: {
      typed: '1,247',
      quoted: '104',
      undeclared: '0',
      review: 'Approve',
    },
  },
  {
    id: 'ambiguous',
    label: 'Ambiguous submission',
    score: 68,
    risk: 'medium',
    comprehension: 68,
    sessions: [
      { label: 'Session 1', minutes: 76, words: 834, status: 'typed' },
      { label: 'Session 2', minutes: 24, words: 181, status: 'declared' },
      { label: 'Session 3', minutes: 17, words: 96, status: 'flagged' },
    ],
    summary: 'The work shows real drafting, but the last-minute insert burst and partial comprehension leave enough uncertainty to warrant review.',
    flags: ['One undeclared paste event — 287 chars', 'Teaching Test responses were uneven in depth'],
    metrics: {
      typed: '1,009',
      quoted: '58',
      undeclared: '287',
      review: 'Review',
    },
  },
  {
    id: 'flagged',
    label: 'Flagged submission',
    score: 34,
    risk: 'high',
    comprehension: 34,
    sessions: [
      { label: 'Session 1', minutes: 118, words: 1764, status: 'flagged' },
    ],
    summary: 'A single-session submission, large undeclared paste events, and weak explanations point to investigation rather than approval.',
    flags: ['Single session submission', '847-character undeclared paste detected', 'Teaching Test below threshold'],
    metrics: {
      typed: '384',
      quoted: '0',
      undeclared: '1,380',
      review: 'Investigate',
    },
  },
]
