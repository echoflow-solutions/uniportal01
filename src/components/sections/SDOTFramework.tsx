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
    accent: 'var(--accent-strong)',
  },
  {
    index: '02',
    phase: 'Do One',
    description:
      'Students write inside an authenticated workspace. We observe the shape of the work — sessions, revisions, paste patterns, composition velocity — not the content itself.',
    verification: 'SYSTEM VERIFICATION · Sessions · Paste declarations · Authorship evidence',
    accent: 'var(--pending)',
  },
  {
    index: '03',
    phase: 'Teach One',
    description:
      'After submission, the student explains and defends their work. AI-generated questions probe depth, consistency, and genuine comprehension. Understanding cannot be copied.',
    verification: 'SYSTEM VERIFICATION · Conceptual accuracy · Consistency · Clarity of explanation',
    accent: 'var(--verified)',
  },
]

function PhasePanel({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[rgba(10,10,10,0.08)] bg-[var(--paper)] p-7 shadow-[0_28px_72px_rgba(10,10,10,0.08)] md:p-8">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: accent }}
      />
      {children}
    </div>
  )
}

function SeeVisual({ accent }: { accent: string }) {
  return (
    <PhasePanel accent={accent}>
      <div className="space-y-4 pt-2">
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
            className="rounded-[22px] border border-[rgba(10,10,10,0.06)] bg-white/70 p-5 md:p-6"
          >
            <p className="font-mono-ui text-[12px] uppercase tracking-[0.22em] text-[var(--ash)]">
              {label}
            </p>
            <p className="mt-3 text-[16.5px] leading-[1.55] text-[var(--ink)]">{text}</p>
          </motion.div>
        ))}
      </div>
    </PhasePanel>
  )
}

function DoVisual({ accent }: { accent: string }) {
  return (
    <PhasePanel accent={accent}>
      <div className="pt-2">
        <div className="flex items-center justify-between border-b border-[rgba(10,10,10,0.08)] pb-4">
          <p className="font-mono-ui text-[12px] uppercase tracking-[0.22em] text-[var(--ash)]">
            Compose Session
          </p>
          <p className="font-mono-ui text-[13px] text-[var(--graphite)]">Session 3 · 47 min active</p>
        </div>
        <div className="mt-7 space-y-5">
          <div className="space-y-2.5">
            <div className="h-2.5 w-3/4 rounded-full bg-[var(--ink)]" />
            <div className="h-2.5 w-full rounded-full bg-[rgba(10,10,10,0.18)]" />
            <div className="h-2.5 w-[82%] rounded-full bg-[rgba(10,10,10,0.48)]" />
            <div className="h-2.5 w-[66%] rounded-full bg-[rgba(10,10,10,0.18)]" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {['Typed 1,143', 'Declared quote 104', 'Paste 0', 'WPM 29'].map((item, index) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-full border border-[rgba(10,10,10,0.08)] px-4 py-1.5 font-mono-ui text-[12px] uppercase tracking-[0.16em] text-[var(--slate)]"
              >
                {item}
              </motion.span>
            ))}
          </div>
          <div className="rounded-[22px] border border-[rgba(185,28,28,0.18)] bg-[rgba(185,28,28,0.05)] px-5 py-4">
            <p className="font-mono-ui text-[12px] uppercase tracking-[0.18em] text-[var(--flagged)]">
              Paste detected — 104 chars — declared
            </p>
          </div>
        </div>
      </div>
    </PhasePanel>
  )
}

function TeachVisual({ accent }: { accent: string }) {
  return (
    <PhasePanel accent={accent}>
      <div className="pt-2">
        <div className="flex items-center justify-between border-b border-[rgba(10,10,10,0.08)] pb-4">
          <p className="font-mono-ui text-[12px] uppercase tracking-[0.22em] text-[var(--ash)]">
            Teaching Test
          </p>
          <p className="font-mono-ui text-[14px] text-[var(--verified)]">03:00 → 92 / 100</p>
        </div>
        <p className="mt-6 text-[19px] leading-[1.55] text-[var(--ink)]">
          Explain why comprehension verification is more durable than trying to guess whether text was produced with AI.
        </p>
        <div className="mt-6 rounded-[22px] border border-[rgba(10,10,10,0.06)] bg-white/72 p-5 text-[16px] leading-[1.65] text-[var(--graphite)]">
          Because the submission itself can be copied, but the reasoning behind it still has to be defended. If the student can simplify, justify, and extend the argument, the platform has something stronger than detection.
        </div>
      </div>
    </PhasePanel>
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
      <section className="paper-grain bg-[var(--paper-deep)] py-24 text-[var(--ink)]">
        <div className="editorial-shell space-y-12">
          <Kicker>The SDOT Framework</Kicker>
          {phases.map((phase, index) => {
            const Visual = visuals[index]
            return (
              <article key={phase.phase} className="grid gap-8 border-t border-[rgba(10,10,10,0.08)] pt-8 lg:grid-cols-2">
                <div>
                  <p className="font-display text-6xl tracking-[-0.05em]" style={{ color: phase.accent, opacity: 0.32 }}>{phase.index}</p>
                  <h3 className="mt-5 font-display text-4xl tracking-[-0.04em] text-[var(--ink)]">{phase.phase}</h3>
                  <p className="mt-5 max-w-[44ch] text-[17px] leading-8 text-[var(--graphite)]">{phase.description}</p>
                  <p className="mt-6 font-mono-ui text-xs uppercase tracking-[0.18em] text-[var(--ash)]">
                    {phase.verification}
                  </p>
                </div>
                <Visual accent={phase.accent} />
              </article>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="paper-grain relative h-[320vh] bg-[var(--paper-deep)] text-[var(--ink)]">
      <div ref={pinnedRef} className="editorial-shell flex h-screen items-center py-12 [will-change:transform] [contain:layout_paint]">
        <div className="grid w-full gap-10 xl:grid-cols-12 xl:items-center xl:gap-14">
          <div className="relative xl:col-span-6">
            <Kicker>The SDOT Framework</Kicker>

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
                  className="pointer-events-none absolute -left-4 -top-16 select-none font-display text-[clamp(11rem,19vw,20rem)] font-semibold leading-none tracking-[-0.08em] md:-left-6 md:-top-24"
                  style={{ color: activePhase.accent, opacity: 0.1 }}
                >
                  {activePhase.index}
                </p>

                <div className="relative">
                  <p className="editorial-kicker flex items-center gap-2 text-[var(--ash)]">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: activePhase.accent }}
                    />
                    Phase {activePhase.index}
                  </p>
                  <h3 className="mt-5 font-display text-[clamp(3.5rem,7vw,7.25rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-[var(--ink)]">
                    {activePhase.phase}
                  </h3>
                  <p className="mt-8 max-w-[50ch] text-[19px] leading-[1.65] text-[var(--graphite)]">
                    {activePhase.description}
                  </p>
                  <p className="mt-8 max-w-[52ch] font-mono-ui text-[12px] uppercase leading-[1.7] tracking-[0.22em] text-[var(--ash)]">
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
                <ActiveVisual accent={activePhase.accent} />
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center gap-3">
              {phases.map((phase, index) => {
                const isActive = index === activeIndex
                const isCompleted = index < activeIndex
                return (
                  <span
                    key={phase.phase}
                    className="h-1 flex-1 rounded-full transition-all duration-500"
                    style={{
                      background: isActive || isCompleted ? phase.accent : 'rgba(10,10,10,0.12)',
                      opacity: isCompleted ? 0.45 : 1,
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
