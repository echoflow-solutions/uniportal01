'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Kicker } from '@/components/ui/Kicker'

gsap.registerPlugin(ScrollTrigger)

const phases = [
  {
    index: '01',
    phase: 'See One',
    description:
      'Students research, read, gather evidence, and build understanding before drafting. The platform captures engagement with sources — not clicks, not time-on-page, but intentional annotation and reference.',
    verification: 'SYSTEM VERIFICATION · Source engagement · Research notes · Evidence of preparation',
  },
  {
    index: '02',
    phase: 'Do One',
    description:
      'Students write inside an authenticated workspace. We observe the shape of the work — sessions, revisions, paste patterns, composition velocity — not the content itself.',
    verification: 'SYSTEM VERIFICATION · Sessions · Paste declarations · Authorship evidence',
  },
  {
    index: '03',
    phase: 'Teach One',
    description:
      'After submission, the student explains and defends their work. AI-generated questions probe depth, consistency, and genuine comprehension. Understanding cannot be copied.',
    verification: 'SYSTEM VERIFICATION · Conceptual accuracy · Consistency · Clarity of explanation',
  },
]

function SeeVisual() {
  return (
    <div className="space-y-4 rounded-[32px] border border-[rgba(250,247,242,0.14)] bg-[rgba(250,247,242,0.05)] p-7 md:p-8">
      {[
        ['Journal article', 'Annotated evidence on assessment validity'],
        ['Lecture notes', 'Student note set · 14 references captured'],
        ['Source map', 'Argument scaffold linked to references'],
      ].map(([label, text], index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[22px] border border-[rgba(250,247,242,0.14)] bg-[rgba(250,247,242,0.04)] p-5 md:p-6"
        >
          <p className="font-mono-ui text-[12px] uppercase tracking-[0.22em] text-[rgba(250,247,242,0.58)]">
            {label}
          </p>
          <p className="mt-3 text-[16.5px] leading-[1.55] text-[rgba(250,247,242,0.92)]">{text}</p>
        </motion.div>
      ))}
    </div>
  )
}

function DoVisual() {
  return (
    <div className="rounded-[32px] border border-[rgba(250,247,242,0.14)] bg-[rgba(250,247,242,0.05)] p-7 md:p-8">
      <div className="flex items-center justify-between border-b border-[rgba(250,247,242,0.12)] pb-4">
        <p className="font-mono-ui text-[12px] uppercase tracking-[0.22em] text-[rgba(250,247,242,0.58)]">
          Compose Session
        </p>
        <p className="font-mono-ui text-[13px] text-[rgba(250,247,242,0.72)]">Session 3 · 47 min active</p>
      </div>
      <div className="mt-7 space-y-5">
        <div className="space-y-2.5">
          <div className="h-2.5 w-3/4 rounded-full bg-[rgba(250,247,242,0.84)]" />
          <div className="h-2.5 w-full rounded-full bg-[rgba(250,247,242,0.3)]" />
          <div className="h-2.5 w-[82%] rounded-full bg-[rgba(250,247,242,0.56)]" />
          <div className="h-2.5 w-[66%] rounded-full bg-[rgba(250,247,242,0.3)]" />
        </div>
        <div className="flex flex-wrap gap-2.5">
          {['Typed 1,143', 'Declared quote 104', 'Paste 0', 'WPM 29'].map((item, index) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-full border border-[rgba(250,247,242,0.14)] px-4 py-1.5 font-mono-ui text-[12px] uppercase tracking-[0.16em] text-[rgba(250,247,242,0.82)]"
            >
              {item}
            </motion.span>
          ))}
        </div>
        <div className="rounded-[22px] border border-[rgba(185,28,28,0.22)] bg-[rgba(185,28,28,0.08)] px-5 py-4">
          <p className="font-mono-ui text-[12px] uppercase tracking-[0.18em] text-[rgba(255,179,179,0.88)]">
            Paste detected — 104 chars — declared
          </p>
        </div>
      </div>
    </div>
  )
}

function TeachVisual() {
  return (
    <div className="rounded-[32px] border border-[rgba(250,247,242,0.14)] bg-[rgba(250,247,242,0.05)] p-7 md:p-8">
      <div className="flex items-center justify-between border-b border-[rgba(250,247,242,0.12)] pb-4">
        <p className="font-mono-ui text-[12px] uppercase tracking-[0.22em] text-[rgba(250,247,242,0.58)]">
          Teaching Test
        </p>
        <p className="font-mono-ui text-[14px] text-[rgba(144,233,167,0.92)]">03:00 → 92 / 100</p>
      </div>
      <p className="mt-6 text-[19px] leading-[1.55] text-[rgba(250,247,242,0.92)]">
        Explain why comprehension verification is more durable than trying to guess whether text was produced with AI.
      </p>
      <div className="mt-6 rounded-[22px] border border-[rgba(250,247,242,0.14)] bg-[rgba(250,247,242,0.03)] p-5 text-[16px] leading-[1.65] text-[rgba(250,247,242,0.82)]">
        Because the submission itself can be copied, but the reasoning behind it still has to be defended. If the student can simplify, justify, and extend the argument, the platform has something stronger than detection.
      </div>
    </div>
  )
}

const visuals = [SeeVisual, DoVisual, TeachVisual]

export function SDOTFramework() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const pinnedRef = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion || !sectionRef.current || !pinnedRef.current) {
      return
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinnedRef.current,
        scrub: 0.72,
        anticipatePin: 1,
        fastScrollEnd: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nextIndex = Math.min(phases.length - 1, Math.floor(self.progress * phases.length))
          setActiveIndex(nextIndex)
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduceMotion])

  const activePhase = useMemo(() => phases[activeIndex], [activeIndex])
  const ActiveVisual = visuals[activeIndex]

  if (reduceMotion) {
    return (
      <section className="bg-[var(--ink-soft)] py-24 text-[var(--paper)]">
        <div className="editorial-shell space-y-12">
          <Kicker className="text-[rgba(250,247,242,0.55)]">The SDOT Framework</Kicker>
          {phases.map((phase, index) => {
            const Visual = visuals[index]
            return (
              <article key={phase.phase} className="grid gap-8 border-t border-[rgba(250,247,242,0.12)] pt-8 lg:grid-cols-2">
                <div>
                  <p className="font-display text-6xl tracking-[-0.05em] text-[rgba(250,247,242,0.34)]">{phase.index}</p>
                  <h3 className="mt-5 font-display text-4xl tracking-[-0.04em]">{phase.phase}</h3>
                  <p className="mt-5 max-w-[44ch] text-[17px] leading-8 text-[rgba(250,247,242,0.8)]">{phase.description}</p>
                  <p className="mt-6 font-mono-ui text-xs uppercase tracking-[0.18em] text-[rgba(250,247,242,0.55)]">
                    {phase.verification}
                  </p>
                </div>
                <Visual />
              </article>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative h-[320vh] bg-[var(--ink-soft)] text-[var(--paper)]">
      <div ref={pinnedRef} className="editorial-shell flex h-screen items-center py-12 [will-change:transform] [contain:layout_paint]">
        <div className="grid w-full gap-10 xl:grid-cols-12 xl:items-center xl:gap-14">
          <div className="relative xl:col-span-6">
            <Kicker className="text-[rgba(250,247,242,0.55)]">The SDOT Framework</Kicker>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase.phase}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative mt-10"
              >
                <p
                  aria-hidden
                  className="pointer-events-none absolute -left-4 -top-16 select-none font-display text-[clamp(11rem,19vw,20rem)] font-semibold leading-none tracking-[-0.08em] text-[rgba(250,247,242,0.07)] md:-left-6 md:-top-24"
                >
                  {activePhase.index}
                </p>

                <div className="relative">
                  <p className="editorial-kicker text-[rgba(250,247,242,0.48)]">
                    Phase {activePhase.index}
                  </p>
                  <h3 className="mt-5 font-display text-[clamp(3.5rem,7vw,7.25rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-[var(--paper)]">
                    {activePhase.phase}
                  </h3>
                  <p className="mt-8 max-w-[50ch] text-[19px] leading-[1.65] text-[rgba(250,247,242,0.82)]">
                    {activePhase.description}
                  </p>
                  <p className="mt-8 max-w-[52ch] font-mono-ui text-[12px] uppercase leading-[1.7] tracking-[0.22em] text-[rgba(250,247,242,0.5)]">
                    {activePhase.verification}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="xl:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase.phase + '-visual'}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <ActiveVisual />
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center gap-3">
              {phases.map((phase, index) => (
                <span
                  key={phase.phase}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    index === activeIndex
                      ? 'bg-[rgba(250,247,242,0.85)]'
                      : 'bg-[rgba(250,247,242,0.16)]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
