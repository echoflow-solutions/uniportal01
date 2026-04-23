'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Kicker } from '@/components/ui/Kicker'
import { InkRule } from '@/components/ui/InkRule'
import { MonoMeta } from '@/components/ui/MonoMeta'

gsap.registerPlugin(ScrollTrigger)

const stageWeights = [100, 75, 100, 125, 100, 150]

const stages = [
  {
    id: '01',
    title: 'A student is writing an essay. Nothing unusual.',
  },
  {
    id: '02',
    title: 'They paste a block from an AI chatbot. The system notices immediately.',
  },
  {
    id: '03',
    title: 'Ten seconds warning. No button to dismiss it.',
  },
  {
    id: '04',
    title: 'The system picks a sentence from what they just pasted. Sixty seconds to explain it.',
  },
  {
    id: '05',
    title: "If they can't explain it, the system asks again. And again. Until they can.",
  },
  {
    id: '06',
    title:
      "Cheating becomes pedagogically equivalent to learning.\n\nIf you can explain it, you wrote it. If you can't, the system asks until you can.",
  },
] as const

const essayLead =
  'Stakeholder theory proposes that organizations have obligations to multiple parties beyond shareholders'
const pastedBlock =
  'Stakeholder salience refers to the prioritization of stakeholder claims according to power, legitimacy, and urgency, giving managers a framework for deciding which voices demand immediate attention.'
const weakAnswer =
  'Stakeholder salience is about... how important stakeholders are? Based on their influence maybe?'

const stageBreakpoints = (() => {
  const total = stageWeights.reduce((sum, weight) => sum + weight, 0)
  let cumulative = 0
  return stageWeights.map((weight) => {
    cumulative += weight
    return cumulative / total
  })
})()

function formatSeconds(seconds: number) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${secs}`
}

function VerifyFrame({
  children,
  footer,
  overlay,
  dimmed = false,
}: {
  children: React.ReactNode
  footer?: React.ReactNode
  overlay?: React.ReactNode
  dimmed?: boolean
}) {
  return (
    <div className="relative rounded-[32px] border border-[rgba(250,247,242,0.14)] bg-[rgba(250,247,242,0.05)] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-7">
      <div className="flex items-center justify-between border-b border-[rgba(250,247,242,0.12)] pb-4">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[rgba(250,247,242,0.5)]">
          Verified compose session
        </p>
        <p className="font-mono-ui text-[12px] uppercase tracking-[0.16em] text-[rgba(250,247,242,0.62)]">
          Session 1 · 00:04:32 active
        </p>
      </div>

      <div
        className={`relative mt-5 rounded-[24px] border border-[rgba(250,247,242,0.08)] bg-[rgba(255,255,255,0.92)] p-5 transition duration-500 ${
          dimmed ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {children}
      </div>

      {footer ? <div className="mt-4">{footer}</div> : null}
      {overlay}
    </div>
  )
}

function WritingSurface({
  showPaste = false,
  showPasteTag = false,
  blurPaste = false,
  dimmed = false,
  footer,
}: {
  showPaste?: boolean
  showPasteTag?: boolean
  blurPaste?: boolean
  dimmed?: boolean
  footer?: React.ReactNode
}) {
  return (
    <VerifyFrame dimmed={dimmed} footer={footer}>
      <div className="space-y-4 text-[16px] leading-[1.7] text-[var(--graphite)]">
        <p>{essayLead}...</p>
        {showPaste ? (
          <div
            className={`rounded-[18px] border px-4 py-3 transition-all duration-500 ${
              blurPaste
                ? 'border-[rgba(185,28,28,0.18)] bg-[rgba(219,228,245,0.58)] blur-[8px]'
                : 'border-[rgba(30,64,175,0.12)] bg-[var(--accent-soft)]'
            }`}
          >
            <p>{pastedBlock}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {[
          showPaste ? '247 typed · 847 pasted' : '247 words typed',
          'Session 1 · 00:04:32 active',
        ].map((item) => (
          <span
            key={item}
            className="rounded-full border border-[rgba(10,10,10,0.08)] px-3 py-1.5 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--slate)]"
          >
            {item}
          </span>
        ))}
      </div>

      {showPasteTag ? (
        <div className="mt-4 inline-flex rounded-full border border-[rgba(185,28,28,0.18)] bg-[rgba(185,28,28,0.06)] px-4 py-2 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--flagged)]">
          Paste event · 847 chars · undeclared
        </div>
      ) : null}
    </VerifyFrame>
  )
}

function WarningToast({ countdown }: { countdown: number }) {
  const display = String(Math.max(countdown, 0)).padStart(2, '0')
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-4 top-4 w-[min(19rem,calc(100%-2rem))] rounded-[18px] border border-[rgba(161,98,7,0.18)] bg-[rgba(250,247,242,0.96)] p-4 shadow-[0_18px_42px_rgba(10,10,10,0.18)]"
    >
      <div className="border-l-2 border-[var(--pending)] pl-3">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ink)]">
          Comprehension check
        </p>
        <p className="mt-1 font-mono-ui text-[12px] uppercase tracking-[0.18em] text-[var(--pending)]">
          incoming in 00:{display}
        </p>
      </div>
    </motion.div>
  )
}

function CheckOverlay({ secondsLeft }: { secondsLeft: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-x-5 top-1/2 -translate-y-1/2 rounded-[26px] border border-[rgba(10,10,10,0.08)] bg-[var(--paper-deep)] p-5 shadow-[0_30px_90px_rgba(10,10,10,0.16)] md:inset-x-7 md:p-6"
    >
      <div className="flex items-center justify-between border-b border-[rgba(10,10,10,0.08)] pb-4">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">
          Comprehension check
        </p>
        <motion.p
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="font-mono-ui text-[13px] tracking-[0.12em] text-[var(--ink)]"
        >
          ⏱ {formatSeconds(secondsLeft)}
        </motion.p>
      </div>
      <p className="mt-5 text-[18px] leading-[1.55] text-[var(--ink)]">
        Explain what you meant by: &ldquo;Stakeholder salience refers to the prioritization of
        stakeholder claims...&rdquo;
      </p>
      <div className="mt-5 min-h-[120px] rounded-[20px] border border-[rgba(10,10,10,0.08)] bg-white/76 p-4 text-[15px] leading-[1.7] text-[var(--ash)]">
        Type your answer here
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--flagged)]">
          Skip check — flags submission
        </span>
        <span className="inline-flex rounded-full bg-[var(--ink)] px-4 py-2 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--paper)]">
          Submit
        </span>
      </div>
    </motion.div>
  )
}

function WeakResponseOverlay({ secondsLeft, typedText, showResult }: { secondsLeft: number; typedText: string; showResult: boolean }) {
  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-5 top-1/2 -translate-y-1/2 rounded-[26px] border border-[rgba(10,10,10,0.08)] bg-[var(--paper-deep)] p-5 shadow-[0_30px_90px_rgba(10,10,10,0.16)] md:inset-x-7 md:p-6"
      >
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">Check complete</p>
        <div className="mt-5 grid gap-2 md:grid-cols-2">
          <p className="font-mono-ui text-[14px] text-[var(--flagged)]">Score: 4 / 10</p>
          <p className="font-mono-ui text-[14px] text-[var(--slate)]">Confidence: Low</p>
        </div>
        <p className="mt-5 text-[15px] leading-[1.75] text-[var(--graphite)]">
          The response covers the general concept but lacks specificity on the three dimensions of salience (power, legitimacy, urgency).
        </p>
        <p className="mt-4 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
          A follow-up check is scheduled.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-x-5 top-1/2 -translate-y-1/2 rounded-[26px] border border-[rgba(10,10,10,0.08)] bg-[var(--paper-deep)] p-5 shadow-[0_30px_90px_rgba(10,10,10,0.16)] md:inset-x-7 md:p-6"
    >
      <div className="flex items-center justify-between border-b border-[rgba(10,10,10,0.08)] pb-4">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">
          Comprehension check
        </p>
        <motion.p
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="font-mono-ui text-[13px] tracking-[0.12em] text-[var(--ink)]"
        >
          ⏱ {formatSeconds(secondsLeft)}
        </motion.p>
      </div>
      <p className="mt-5 text-[18px] leading-[1.55] text-[var(--ink)]">
        Explain what you meant by: &ldquo;Stakeholder salience refers to the prioritization of stakeholder claims...&rdquo;
      </p>
      <div className="mt-5 min-h-[120px] rounded-[20px] border border-[rgba(10,10,10,0.08)] bg-white/76 p-4 text-[15px] leading-[1.7] text-[var(--graphite)]">
        {typedText}
        <motion.span
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="ml-0.5 inline-block h-5 w-[1px] bg-[var(--ink)] align-middle"
        />
      </div>
    </motion.div>
  )
}

function VerifyStageVisual({
  stageIndex,
  warningCountdown,
  checkSeconds,
  stageFiveSeconds,
  weakTypedText,
  showStageFiveResult,
}: {
  stageIndex: number
  warningCountdown: number
  checkSeconds: number
  stageFiveSeconds: number
  weakTypedText: string
  showStageFiveResult: boolean
}) {
  if (stageIndex === 0) {
    return <WritingSurface />
  }

  if (stageIndex === 1) {
    return <WritingSurface showPaste showPasteTag />
  }

  if (stageIndex === 2) {
    return (
      <div className="relative">
        <WritingSurface showPaste showPasteTag dimmed />
        <WarningToast countdown={warningCountdown} />
      </div>
    )
  }

  if (stageIndex === 3) {
    return (
      <div className="relative">
        <WritingSurface showPaste blurPaste dimmed />
        <CheckOverlay secondsLeft={checkSeconds} />
      </div>
    )
  }

  if (stageIndex === 4) {
    return (
      <div className="relative">
        <WritingSurface showPaste blurPaste dimmed />
        <WeakResponseOverlay
          secondsLeft={stageFiveSeconds}
          typedText={weakTypedText}
          showResult={showStageFiveResult}
        />
      </div>
    )
  }

  return (
    <WritingSurface
      showPaste
      footer={
        <div className="rounded-[18px] border border-[rgba(185,28,28,0.12)] bg-[rgba(185,28,28,0.05)] px-4 py-3">
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--graphite)]">
            Comprehension checks: 1 of 12 complete · Avg score: 4 / 10
          </p>
        </div>
      }
    />
  )
}

function StageCopy({ stageIndex }: { stageIndex: number }) {
  const stage = stages[stageIndex]
  return (
    <div className="relative">
      <p
        aria-hidden
        className="pointer-events-none absolute -left-3 -top-16 select-none font-display text-[clamp(10rem,16vw,16rem)] font-semibold leading-none tracking-[-0.08em] text-[rgba(250,247,242,0.07)] md:-left-5 md:-top-24"
      >
        {stage.id}
      </p>
      <p className="relative font-mono-ui text-[12px] uppercase tracking-[0.22em] text-[rgba(250,247,242,0.48)]">
        Stage {stage.id} / 06
      </p>
      <h3
        className={`relative mt-5 font-display font-semibold leading-[0.96] tracking-[-0.04em] text-[var(--paper)] whitespace-pre-line text-balance ${
          stageIndex === 5 ? 'text-[clamp(2.5rem,4.6vw,5rem)]' : 'text-[clamp(2.2rem,4vw,4.4rem)]'
        }`}
      >
        {stage.title}
      </h3>
    </div>
  )
}

function StaticStage({
  stageIndex,
}: {
  stageIndex: number
}) {
  return (
    <article className="space-y-8 rounded-[30px] border border-[rgba(250,247,242,0.12)] bg-[rgba(250,247,242,0.05)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-8">
      <StageCopy stageIndex={stageIndex} />
      <VerifyStageVisual
        stageIndex={stageIndex}
        warningCountdown={9}
        checkSeconds={60}
        stageFiveSeconds={18}
        weakTypedText={weakAnswer}
        showStageFiveResult={stageIndex === 4}
      />
    </article>
  )
}

export function VerifySection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const pinnedRef = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [warningCountdown, setWarningCountdown] = useState(9)
  const [checkSeconds, setCheckSeconds] = useState(60)
  const [stageFiveSeconds, setStageFiveSeconds] = useState(18)
  const [weakTypedText, setWeakTypedText] = useState('')
  const [showStageFiveResult, setShowStageFiveResult] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(media.matches)

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduceMotion || isMobile || !sectionRef.current || !pinnedRef.current) {
      return
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinnedRef.current,
        scrub: 0.78,
        anticipatePin: 1,
        fastScrollEnd: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress
          const nextIndex = stageBreakpoints.findIndex((point) => progress <= point)
          setActiveIndex(nextIndex === -1 ? stages.length - 1 : nextIndex)
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduceMotion, isMobile])

  useEffect(() => {
    if (activeIndex !== 2) {
      setWarningCountdown(9)
      return
    }

    setWarningCountdown(9)
    const interval = window.setInterval(() => {
      setWarningCountdown((value) => {
        if (value <= 0) return 0
        return value - 1
      })
    }, 650)

    return () => window.clearInterval(interval)
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex !== 3) {
      setCheckSeconds(60)
      return
    }

    setCheckSeconds(60)
    const interval = window.setInterval(() => {
      setCheckSeconds((value) => {
        if (value <= 48) return 48
        return value - 1
      })
    }, 700)

    return () => window.clearInterval(interval)
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex !== 4) {
      setStageFiveSeconds(18)
      setWeakTypedText('')
      setShowStageFiveResult(false)
      return
    }

    setStageFiveSeconds(18)
    setWeakTypedText('')
    setShowStageFiveResult(false)

    let answerIndex = 0
    const timer = window.setInterval(() => {
      setStageFiveSeconds((value) => {
        if (value <= 12) return 12
        return value - 1
      })
    }, 750)

    const typer = window.setInterval(() => {
      answerIndex += 2
      const nextText = weakAnswer.slice(0, answerIndex)
      setWeakTypedText(nextText)

      if (answerIndex >= weakAnswer.length) {
        window.clearInterval(typer)
        window.setTimeout(() => setShowStageFiveResult(true), 600)
      }
    }, 55)

    return () => {
      window.clearInterval(timer)
      window.clearInterval(typer)
    }
  }, [activeIndex])

  const activeStage = useMemo(() => stages[activeIndex], [activeIndex])

  return (
    <section className="relative overflow-hidden bg-[var(--ink-soft)] text-[var(--paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[9%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(30,64,175,0.18)_0%,rgba(10,10,10,0)_72%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-[24%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(21,128,61,0.14)_0%,rgba(10,10,10,0)_72%)] blur-3xl"
      />

      <div className="editorial-shell flex min-h-screen items-center justify-center py-16 text-center">
        <div className="max-w-[54rem]">
          <Kicker className="text-[rgba(250,247,242,0.55)]">The Mechanism</Kicker>
          <h2 className="mt-6 font-display text-[clamp(3.2rem,7vw,7rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--paper)] text-balance">
            Verify understanding. <br className="hidden md:block" />
            At the source.
          </h2>
          <div className="mt-12 flex justify-center">
            <MonoMeta className="uppercase tracking-[0.22em] text-[rgba(250,247,242,0.52)]">Scroll to see it work ↓</MonoMeta>
          </div>
        </div>
      </div>

      {reduceMotion || isMobile ? (
        <div className="editorial-shell space-y-8 py-10">
          {stages.map((_, index) => (
            <StaticStage key={index} stageIndex={index} />
          ))}
        </div>
      ) : (
        <section ref={sectionRef} className="relative h-[600vh]">
          <div ref={pinnedRef} className="editorial-shell flex h-screen items-center py-12 [contain:layout_paint]">
            <div className="grid w-full gap-10 xl:grid-cols-12 xl:items-center xl:gap-16">
              <div className="xl:col-span-5">
                <Kicker className="text-[rgba(250,247,242,0.55)]">The Verify Framework</Kicker>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStage.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <StageCopy stageIndex={activeIndex} />
                    <p className="mt-8 max-w-[48ch] font-mono-ui text-[12px] uppercase leading-[1.7] tracking-[0.22em] text-[rgba(250,247,242,0.5)]">
                      Live comprehension · Timed interruption · Adaptive follow-up · Evidence captured during writing
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="xl:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeStage.id}-visual`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <VerifyStageVisual
                      stageIndex={activeIndex}
                      warningCountdown={warningCountdown}
                      checkSeconds={checkSeconds}
                      stageFiveSeconds={stageFiveSeconds}
                      weakTypedText={weakTypedText}
                      showStageFiveResult={showStageFiveResult}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center gap-3">
                  {stages.map((stage, index) => (
                    <span
                      key={stage.id}
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        index === activeIndex ? 'bg-[rgba(250,247,242,0.88)]' : 'bg-[rgba(250,247,242,0.16)]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="editorial-shell py-20 text-center">
        <p className="mx-auto max-w-[40rem] text-[clamp(1.3rem,2.2vw,2rem)] leading-[1.5] text-[rgba(250,247,242,0.88)] text-balance">
          This is the mechanism. Live at uniportal.com.au.
        </p>
        <div className="mt-10">
          <InkRule className="border-[rgba(250,247,242,0.14)]" />
        </div>
      </div>
    </section>
  )
}
