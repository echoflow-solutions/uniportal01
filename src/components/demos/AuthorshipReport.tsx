'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { submissionScenarios, type SubmissionScenario } from '@/lib/sample-data'
import { cn } from '@/lib/utils'

const riskTone = {
  low: 'var(--verified)',
  medium: 'var(--pending)',
  high: 'var(--flagged)',
}

export function AuthorshipReport() {
  const [selected, setSelected] = useState<SubmissionScenario['id']>('verified')
  const scenario = useMemo(
    () => submissionScenarios.find((item) => item.id === selected) ?? submissionScenarios[0],
    [selected]
  )

  return (
    <div className="mx-auto max-w-6xl rounded-[36px] border border-[rgba(10,10,10,0.08)] bg-[rgba(250,247,242,0.86)] p-5 shadow-[0_28px_90px_rgba(10,10,10,0.09)] backdrop-blur transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_40px_120px_rgba(10,10,10,0.14)] md:p-8">
      <div className="flex flex-wrap gap-3">
        {submissionScenarios.map((item) => {
          const active = item.id === selected
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              className={cn(
                'focus-ring rounded-full border px-4 py-2 text-left transition-all duration-300',
                active
                  ? 'border-[rgba(10,10,10,0.18)] bg-[var(--ink)] text-[var(--paper)]'
                  : 'border-[rgba(10,10,10,0.1)] bg-white/70 text-[var(--graphite)] hover:border-[rgba(10,10,10,0.18)]'
              )}
            >
              <span className="block font-mono-ui text-[11px] uppercase tracking-[0.18em]">
                {item.risk} risk
              </span>
              <span className="mt-1 block text-sm">{item.label}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[rgba(10,10,10,0.08)] pb-5">
              <div>
                <p className="editorial-kicker">Instructor Report</p>
                <h4 className="mt-3 font-display text-[clamp(30px,3vw,50px)] leading-[0.94] tracking-[-0.04em] text-[var(--ink)]">
                  {scenario.label}
                </h4>
              </div>
              <div>
                <p
                  className="font-mono-ui text-[12px] uppercase tracking-[0.18em]"
                  style={{ color: riskTone[scenario.risk] }}
                >
                  {scenario.risk} risk
                </p>
                <p className="mt-2 font-mono-ui text-[42px] leading-none text-[var(--ink)]">
                  {scenario.score}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {[
                ['Typed', scenario.metrics.typed],
                ['Quoted', scenario.metrics.quoted],
                ['Undeclared', scenario.metrics.undeclared],
                ['Recommendation', scenario.metrics.review],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-[rgba(10,10,10,0.08)] pb-4">
                  <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                    {label}
                  </p>
                  <p className="mt-3 text-xl tracking-[-0.03em] text-[var(--ink)]">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="font-mono-ui text-[12px] uppercase tracking-[0.18em] text-[var(--ash)]">
                Session Timeline
              </p>
              <div className="mt-4 space-y-3">
                {scenario.sessions.map((session, index) => {
                  const width = `${Math.max(24, session.words / 18)}%`
                  const tone =
                    session.status === 'flagged'
                      ? 'var(--flagged)'
                      : session.status === 'declared'
                        ? 'var(--verified)'
                        : 'var(--accent-strong)'

                  return (
                    <div key={session.label} className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)_150px] md:items-center">
                      <span className="font-mono-ui text-sm text-[var(--slate)]">
                        {String(index + 1).padStart(2, '0')} · {session.label}
                      </span>
                      <div className="h-3 overflow-hidden rounded-full bg-[var(--paper-deep)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: tone }}
                        />
                      </div>
                      <span className="font-mono-ui text-sm text-[var(--graphite)]">
                        {session.minutes} min · {session.words} words
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-[30px] bg-[var(--paper-deep)] p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                  Teaching Test
                </p>
                <p className="mt-2 text-[15px] leading-7 text-[var(--graphite)]">
                  Comprehension score, review notes, and flag context change with each scenario.
                </p>
              </div>
              <p
                className="font-mono-ui text-[32px] leading-none"
                style={{ color: riskTone[scenario.risk] }}
              >
                {scenario.comprehension}
              </p>
            </div>

            <p className="max-w-md text-[16px] leading-8 text-[var(--graphite)]">{scenario.summary}</p>

            <div>
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                Flags
              </p>
              <ul className="mt-3 space-y-3">
                {scenario.flags.map((flag) => (
                  <li key={flag} className="flex gap-3 text-[15px] leading-7 text-[var(--graphite)]">
                    <span
                      className="mt-2 inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: riskTone[scenario.risk] }}
                    />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[22px] border border-[rgba(10,10,10,0.08)] bg-white/70 p-5">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                Action
              </p>
              <p className="mt-3 font-display text-[28px] leading-[1] tracking-[-0.04em] text-[var(--ink)]">
                {scenario.metrics.review}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--slate)]">
                Logged actions, notes, and follow-up requests become part of the institutional record.
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
