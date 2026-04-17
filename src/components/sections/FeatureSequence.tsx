import { Reveal } from '@/components/ui/Reveal'
import { Kicker } from '@/components/ui/Kicker'
import { InkRule } from '@/components/ui/InkRule'
import { MonoMeta } from '@/components/ui/MonoMeta'
import { WritingEditorMini } from '@/components/demos/WritingEditorMini'
import { TeachingTestMini } from '@/components/demos/TeachingTestMini'

function TraceFigure() {
  const sessions = [
    { day: 'Mon', width: '18%', status: 'typed' },
    { day: 'Tue', width: '26%', status: 'typed' },
    { day: 'Thu', width: '14%', status: 'declared' },
    { day: 'Sat', width: '31%', status: 'typed' },
    { day: 'Sun', width: '11%', status: 'flagged' },
  ]

  return (
    <div className="rounded-[28px] border border-[rgba(10,10,10,0.08)] bg-[var(--paper-deep)] p-6 md:p-8">
      <p className="font-mono-ui text-[12px] uppercase tracking-[0.2em] text-[var(--ash)]">
        Trace engine · Sample submission
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {['7 sessions over 10 days', '4h 32min total active time', '1,247 words typed · 104 quoted', '3.4 edit events per paragraph'].map((item) => (
          <div key={item} className="border-b border-[rgba(10,10,10,0.08)] pb-3">
            <MonoMeta>{item}</MonoMeta>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-5">
        {sessions.map((session) => {
          const tone =
            session.status === 'flagged'
              ? 'var(--flagged)'
              : session.status === 'declared'
                ? 'var(--verified)'
                : 'var(--accent-strong)'
          return (
            <div key={session.day} className="grid gap-3 md:grid-cols-[64px_minmax(0,1fr)_120px] md:items-center">
              <span className="font-mono-ui text-sm text-[var(--slate)]">{session.day}</span>
              <div className="h-3 overflow-hidden rounded-full bg-white/80">
                <div className="h-full rounded-full" style={{ width: session.width, backgroundColor: tone }} />
              </div>
              <span className="font-mono-ui text-sm text-[var(--graphite)]">
                {session.status === 'flagged'
                  ? 'paste event'
                  : session.status === 'declared'
                    ? 'declared quote'
                    : 'typed'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StyleComparison() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="border-t border-[rgba(10,10,10,0.12)] pt-5">
        <p className="font-mono-ui text-[12px] uppercase tracking-[0.2em] text-[var(--ash)]">Student baseline</p>
        <p className="mt-5 text-[16px] leading-[1.7] text-[var(--graphite)]">
          Students tend to write with shorter clauses, moderate vocabulary, and a direct argumentative rhythm. Paragraphs average 142 words. First-person references appear sparingly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {['Sentence length 18.4', 'Vocabulary level 11.2', 'Passive voice 12%'].map((item) => (
            <span key={item} className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--slate)]">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-[rgba(10,10,10,0.12)] pt-5">
        <p className="font-mono-ui text-[12px] uppercase tracking-[0.2em] text-[var(--ash)]">Current submission</p>
        <p className="mt-5 text-[16px] leading-[1.7] text-[var(--graphite)]">
          The current draft shows stronger academic vocabulary and denser sentence structure, but paragraph flow and transition choices remain recognisably aligned with the prior baseline.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {['Sentence length 20.1', 'Vocabulary level 12.4', 'Consistency 84 / 100'].map((item) => (
            <span key={item} className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--slate)]">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function InsightFigure() {
  const rows = [
    ['A.B.', '92', 'Low'],
    ['E.A.', '78', 'Review'],
    ['K.N.', '34', 'Flagged'],
    ['L.H.', '88', 'Low'],
    ['S.T.', '64', 'Review'],
    ['P.M.', '95', 'Low'],
  ]

  return (
    <div className="rounded-[28px] border border-[rgba(10,10,10,0.08)] bg-[var(--paper-deep)] p-6">
      <p className="font-mono-ui text-[12px] uppercase tracking-[0.2em] text-[var(--ash)]">Instructor heatmap</p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {rows.map(([student, score, status]) => {
          const tone =
            status === 'Flagged' ? 'var(--flagged)' : status === 'Review' ? 'var(--pending)' : 'var(--verified)'
          return (
            <div
              key={student}
              className="rounded-[20px] border border-[rgba(10,10,10,0.06)] bg-white/70 p-4"
            >
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">{student}</p>
              <p className="mt-3 font-display text-3xl tracking-[-0.04em] text-[var(--ink)]">{score}</p>
              <p className="mt-2 font-mono-ui text-[11px] uppercase tracking-[0.2em]" style={{ color: tone }}>
                {status}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function FeatureSequence() {
  return (
    <section className="section-space">
      <div className="editorial-shell">
        <Reveal className="max-w-[36rem]">
          <Kicker>Inside the Product</Kicker>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-[var(--ink)] text-balance">
            Five product surfaces. One evidence standard.
          </h2>
        </Reveal>

        <div className="mt-20 space-y-28">
          <Reveal className="grid gap-12 xl:grid-cols-12 xl:items-center xl:gap-16">
            <div className="xl:col-span-5">
              <Kicker>Compose</Kicker>
              <h3 className="mt-5 font-display text-[clamp(1.9rem,3vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--ink)] text-balance">
                The writing environment does the evidence-gathering.
              </h3>
              <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.75] text-[var(--graphite)]">
                A TipTap-based editor captures sessions, timing, revision depth, and paste declarations without interrupting the student. Accessibility-first, accommodation-aware, and built to make authorship evidence feel native instead of punitive.
              </p>
            </div>
            <div className="relative xl:col-span-7">
              <WritingEditorMini />
            </div>
          </Reveal>

          <Reveal className="space-y-10">
            <div className="max-w-[44rem]">
              <Kicker>Trace</Kicker>
              <h3 className="mt-5 font-display text-[clamp(1.9rem,3vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--ink)] text-balance">
                TrueLearn captures the shape of work, not guesses at its origin.
              </h3>
            </div>
            <TraceFigure />
          </Reveal>

          <Reveal className="space-y-8">
            <div className="mx-auto max-w-[44rem] text-center">
              <Kicker>Prove</Kicker>
              <h3 className="mt-5 font-display text-[clamp(1.9rem,3vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--ink)] text-balance">
                If you can teach it, you know it.
              </h3>
              <p className="mx-auto mt-6 max-w-[44ch] text-[16px] leading-[1.75] text-[var(--graphite)]">
                Claude-generated questions across simplify, justify, counter, extend, process, and connect probe whether the student can defend their own work.
              </p>
            </div>
            <TeachingTestMini />
          </Reveal>

          <Reveal className="grid gap-12 xl:grid-cols-12 xl:items-center xl:gap-16">
            <div className="xl:col-span-5">
              <Kicker>Match</Kicker>
              <h3 className="mt-5 font-display text-[clamp(1.9rem,3vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--ink)] text-balance">
                Every student has a writing signature.
              </h3>
              <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.75] text-[var(--graphite)]">
                After three submissions, the platform builds a baseline across vocabulary, structure, rhythm, and voice. New work is compared against that history with enough nuance to distinguish growth from anomaly.
              </p>
            </div>
            <div className="xl:col-span-7">
              <StyleComparison />
            </div>
          </Reveal>

          <Reveal className="grid gap-12 xl:grid-cols-12 xl:items-center xl:gap-16">
            <div className="xl:col-span-7">
              <InsightFigure />
            </div>
            <div className="xl:col-span-5">
              <Kicker>Insight</Kicker>
              <h3 className="mt-5 font-display text-[clamp(1.9rem,3vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--ink)] text-balance">
                Instructors get evidence, not suspicion.
              </h3>
              <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.75] text-[var(--graphite)]">
                Heatmaps surface risk at a glance. Detailed evidence reports turn a 30-minute review into a 3-minute decision. Approvals, flags, and resubmissions are logged for institutional defensibility.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-24">
          <InkRule />
        </div>
      </div>
    </section>
  )
}
