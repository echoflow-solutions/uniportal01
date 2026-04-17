'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useInView } from 'react-intersection-observer'

const answer =
  'I chose formative verification because the platform needs evidence of process as well as a post-submission explanation.'

export function TeachingTestMini() {
  const reduceMotion = useReducedMotion()
  const [secondsLeft, setSecondsLeft] = useState(180)
  const [typedAnswer, setTypedAnswer] = useState(reduceMotion ? answer : '')
  const { ref, inView } = useInView({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' })

  useEffect(() => {
    if (reduceMotion || !inView) {
      return
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => (value <= 121 ? 180 : value - 1))
    }, 1000)

    let index = 0
    const typer = window.setInterval(() => {
      index += 2
      setTypedAnswer(answer.slice(0, index))
      if (index >= answer.length) {
        index = 0
        window.setTimeout(() => setTypedAnswer(''), 1400)
      }
    }, 55)

    return () => {
      window.clearInterval(timer)
      window.clearInterval(typer)
    }
  }, [reduceMotion, inView])

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')
  const timerColor =
    secondsLeft <= 60 ? 'var(--flagged)' : secondsLeft <= 120 ? 'var(--pending)' : 'var(--verified)'

  return (
    <div ref={ref} className="mx-auto max-w-4xl rounded-[34px] border border-[rgba(10,10,10,0.1)] bg-[rgba(250,247,242,0.88)] p-5 shadow-[0_30px_90px_rgba(10,10,10,0.08)] backdrop-blur transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_40px_110px_rgba(10,10,10,0.14)] md:p-8">
      <div className="flex flex-col gap-4 border-b border-[rgba(10,10,10,0.08)] pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="editorial-kicker">Teaching Test</p>
          <h3 className="mt-3 font-display text-[clamp(28px,3.2vw,46px)] leading-[0.95] tracking-[-0.04em] text-[var(--ink)]">
            Teach One
          </h3>
        </div>
        <div className="font-mono-ui text-[13px] tracking-[0.12em]" style={{ color: timerColor }}>
          {minutes}:{seconds} remaining
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-4">
          <p className="font-mono-ui text-[12px] uppercase tracking-[0.2em] text-[var(--ash)]">
            Question 03 of 05 · Justify
          </p>
          <p className="max-w-2xl text-[20px] leading-8 text-[var(--graphite)]">
            Why does UniPortal prefer comprehension verification over trying to label whether text was written by AI?
          </p>
          <div className="min-h-[170px] rounded-[24px] border border-[rgba(10,10,10,0.08)] bg-white/70 p-5 text-[15px] leading-7 text-[var(--graphite)]">
            {typedAnswer}
            {!reduceMotion ? (
              <motion.span
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="ml-0.5 inline-block h-5 w-[1px] bg-[var(--ink)] align-middle"
              />
            ) : null}
          </div>
        </div>

        <div className="rounded-[24px] bg-[var(--paper-deep)] p-5">
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">
            Scoring Model
          </p>
          <dl className="mt-4 space-y-4">
            {[
              ['Conceptual accuracy', '30%'],
              ['Depth of understanding', '30%'],
              ['Consistency', '25%'],
              ['Clarity', '15%'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-end justify-between gap-6">
                <dt className="text-sm text-[var(--slate)]">{label}</dt>
                <dd className="font-mono-ui text-sm text-[var(--ink)]">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 rounded-[20px] border border-[rgba(21,128,61,0.18)] bg-[rgba(21,128,61,0.06)] px-4 py-3">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--verified)]">
              Simulated Result
            </p>
            <p className="mt-2 font-mono-ui text-2xl text-[var(--verified)]">92 / 100</p>
          </div>
        </div>
      </div>
    </div>
  )
}
