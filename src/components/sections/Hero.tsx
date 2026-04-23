'use client'

import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { Kicker } from '@/components/ui/Kicker'
import { InkRule } from '@/components/ui/InkRule'
import { MonoMeta } from '@/components/ui/MonoMeta'
import { Magnetic } from '@/components/ui/Magnetic'
import { useLandingNotice } from '@/components/providers/LandingNoticeProvider'

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()
  const { openNotice } = useLandingNotice()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const blobAY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const blobBY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4])

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const spotlightX = useTransform(sx, (v) => `${v * 100}%`)
  const spotlightY = useTransform(sy, (v) => `${v * 100}%`)
  const spotlightBackground = useTransform(
    [spotlightX, spotlightY] as never,
    ([x, y]) =>
      `radial-gradient(420px circle at ${x} ${y}, rgba(30,64,175,0.10), rgba(250,247,242,0) 60%)`,
  )

  return (
    <section
      ref={sectionRef}
      className="paper-grain relative flex min-h-[calc(100svh-4.75rem)] flex-col overflow-hidden md:min-h-[calc(100svh-5rem)]"
      onPointerMove={(event) => {
        if (reduceMotion) return
        const rect = event.currentTarget.getBoundingClientRect()
        mx.set((event.clientX - rect.left) / rect.width)
        my.set((event.clientY - rect.top) / rect.height)
      }}
    >
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 mix-blend-plus-lighter"
          style={{ background: spotlightBackground }}
        />
      ) : null}

      <motion.div
        aria-hidden
        style={{ y: blobAY, willChange: 'transform' }}
        className="pointer-events-none absolute right-[-6%] top-[10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(30,64,175,0.14)_0%,rgba(219,228,245,0.08)_34%,rgba(250,247,242,0)_70%)] blur-2xl"
      />
      <motion.div
        aria-hidden
        style={{ y: blobBY, willChange: 'transform' }}
        className="pointer-events-none absolute left-[8%] top-[28%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(21,128,61,0.12)_0%,rgba(250,247,242,0)_68%)] blur-xl"
      />

      <motion.div
        style={{ opacity: heroOpacity }}
        className="editorial-shell flex flex-1 items-center py-12 md:py-16 xl:py-20"
      >
        <div className="grid w-full items-center gap-12 xl:grid-cols-12 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="xl:col-span-7"
          >
            <div className="flex items-center gap-4">
              <Kicker>Academic Integrity · AI Era</Kicker>
              <span className="hidden h-px w-20 bg-[rgba(30,64,175,0.22)] md:block" />
            </div>

            <h1 className="mt-6 font-display text-[clamp(2.75rem,6vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-[var(--ink)] text-balance">
              UniPortal verifies what students{' '}
              <em className="italic [font-variation-settings:&quot;opsz&quot;_144,&quot;wght&quot;_580,&quot;SOFT&quot;_100]">
                actually
              </em>{' '}
              understand — while they write it.
            </h1>

            <p className="mt-6 max-w-[58ch] text-[clamp(0.95rem,1vw,1.05rem)] leading-[1.7] text-[var(--graphite)]">
              Every university is in the same fight: AI has made content-detection a losing game.
              UniPortal takes a different position. We capture how work is actually made, and we
              verify that the student can teach what they submitted. Evidence replaces accusation.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Magnetic>
                <button
                  type="button"
                  onClick={() => openNotice('hero_enter_the_product')}
                  className="button-ink focus-ring group"
                >
                  Enter the product
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </Magnetic>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative xl:col-span-5"
          >
            <div
              aria-hidden
              className="absolute -right-2 -top-6 hidden h-20 w-20 rounded-full border border-[rgba(30,64,175,0.18)] bg-[rgba(219,228,245,0.45)] xl:block"
            />
            <div
              aria-hidden
              className="absolute -left-3 top-12 hidden h-3 w-28 bg-[var(--accent-strong)]/25 xl:block"
            />

            <div className="paper-panel group relative rounded-[28px] p-8 shadow-[0_36px_96px_rgba(10,10,10,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_44px_120px_rgba(10,10,10,0.18)] md:p-10">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">
                Editorial thesis
              </p>
              <h3 className="mt-5 font-display text-[clamp(1.75rem,2.4vw,2.5rem)] font-semibold leading-[1] tracking-[-0.03em] text-[var(--ink)] text-balance">
                Verify understanding, not just sources.
              </h3>
              <p className="mt-5 max-w-[36ch] text-[14.5px] leading-[1.65] text-[var(--graphite)]">
                The platform replaces detector theatre with a reviewable chain of evidence: how work
                was made, how it changed, and whether the student can defend it.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  ['Live', 'Comprehension checks fire during writing, not after', 'var(--verified)'],
                  ['Verified', 'Authorship evidence captured across multiple sessions', 'var(--verified)'],
                  ['Pending', 'Teaching Test scheduled after final submission', 'var(--pending)'],
                  ['Trace', 'Declared quotations and revision depth remain visible', 'var(--accent-strong)'],
                ].map(([label, text, color], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, delay: 0.4 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-4 border-t border-[rgba(10,10,10,0.08)] pt-4"
                  >
                    <span
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <div className="min-w-0">
                      <p className="font-mono-ui text-[10.5px] uppercase tracking-[0.22em] text-[var(--ash)]">
                        {label}
                      </p>
                      <p className="mt-1.5 text-[13.5px] leading-[1.55] text-[var(--graphite)]">
                        {text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="editorial-shell pb-6 md:pb-8">
        <InkRule />
        <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <MonoMeta>Built for institutions · 12 data tables · 3 role systems · live demo</MonoMeta>
          <MonoMeta className="uppercase tracking-[0.22em]">
            <motion.span
              animate={reduceMotion ? {} : { y: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              scroll ↓
            </motion.span>
          </MonoMeta>
        </div>
      </div>
    </section>
  )
}
