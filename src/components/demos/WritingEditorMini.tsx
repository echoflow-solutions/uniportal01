'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useInView } from 'react-intersection-observer'

const sampleParagraphs = [
  'Academic integrity is becoming harder to assess from text alone, because fluent language can now be generated on demand.',
  'TrueLearn shifts the question from source detection to comprehension verification by observing how the draft is made over time.',
  'Declared quotations remain part of the record, while the session counter, active time, and revisions establish authorship evidence.',
]

export function WritingEditorMini() {
  const reduceMotion = useReducedMotion()
  const finalText = useMemo(() => sampleParagraphs.join(' '), [])
  const [displayText, setDisplayText] = useState(reduceMotion ? finalText : '')
  const [counter, setCounter] = useState(1)
  const [minutes, setMinutes] = useState(12)
  const [pastePulse, setPastePulse] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' })

  useEffect(() => {
    if (reduceMotion || !inView) {
      return
    }

    let frame = 0
    let index = 0

    const tick = () => {
      index += 3
      setDisplayText(finalText.slice(0, index))
      if (index < finalText.length) {
        frame = window.setTimeout(tick, 45)
      }
    }

    tick()

    const sessionInterval = window.setInterval(() => {
      setCounter((value) => (value >= 5 ? 2 : value + 1))
      setMinutes((value) => (value >= 47 ? 18 : value + 7))
    }, 3200)

    const pasteInterval = window.setInterval(() => {
      setPastePulse(true)
      window.setTimeout(() => setPastePulse(false), 1600)
    }, 5200)

    return () => {
      window.clearTimeout(frame)
      window.clearInterval(sessionInterval)
      window.clearInterval(pasteInterval)
    }
  }, [finalText, reduceMotion, inView])

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[28px] border border-[rgba(10,10,10,0.08)] bg-[rgba(250,247,242,0.92)] p-4 shadow-[0_24px_70px_rgba(10,10,10,0.08)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_32px_88px_rgba(10,10,10,0.14)] md:p-5">
      <div className="flex items-center justify-between border-b border-[rgba(10,10,10,0.08)] pb-3">
        <div>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">
            Compose Workspace
          </p>
          <p className="mt-1 text-sm text-[var(--graphite)]">TrueLearn Draft Environment</p>
        </div>
        <div className="text-right">
          <p className="font-mono-ui text-xs text-[var(--slate)]">Session {counter} of 5</p>
          <p className="font-mono-ui text-xs text-[var(--slate)]">{minutes} min active</p>
        </div>
      </div>

      <div className="grid gap-4 pt-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-h-[240px] rounded-[22px] border border-[rgba(10,10,10,0.06)] bg-white/70 p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {['H1', 'Bold', 'List', 'Link'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[rgba(10,10,10,0.08)] px-3 py-1 font-mono-ui text-[11px] uppercase tracking-[0.14em] text-[var(--slate)]"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="space-y-3 text-[15px] leading-7 text-[var(--graphite)]">
            <p className="font-display text-[28px] leading-[1] tracking-[-0.04em] text-[var(--ink)]">
              Verify understanding, not just sources.
            </p>
            <p>{displayText}</p>
            <motion.div
              animate={reduceMotion ? {} : { opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              className="inline-block h-6 w-[1px] bg-[var(--ink)] align-middle"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-[20px] bg-[var(--paper-deep)] p-4">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">
              Live Evidence
            </p>
            <dl className="mt-4 space-y-3">
              <div className="flex items-end justify-between">
                <dt className="text-sm text-[var(--slate)]">Word count</dt>
                <dd className="font-mono-ui text-lg text-[var(--ink)]">1,247</dd>
              </div>
              <div className="flex items-end justify-between">
                <dt className="text-sm text-[var(--slate)]">Typed</dt>
                <dd className="font-mono-ui text-lg text-[var(--ink)]">1,143</dd>
              </div>
              <div className="flex items-end justify-between">
                <dt className="text-sm text-[var(--slate)]">Declared quote</dt>
                <dd className="font-mono-ui text-lg text-[var(--verified)]">104</dd>
              </div>
            </dl>
          </div>

          <motion.div
            animate={pastePulse && !reduceMotion ? { y: [10, 0, 0], opacity: [0, 1, 1] } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[20px] border border-[rgba(185,28,28,0.18)] bg-[rgba(185,28,28,0.06)] p-4"
          >
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--flagged)]">
              Paste Event
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--graphite)]">
              {pastePulse ? 'Paste detected — 104 chars — declared citation.' : 'Monitoring paste declarations in real time.'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
