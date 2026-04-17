import { Reveal } from '@/components/ui/Reveal'
import { Kicker } from '@/components/ui/Kicker'
import { InkRule } from '@/components/ui/InkRule'
import { MonoMeta } from '@/components/ui/MonoMeta'
import { CountUp } from '@/components/ui/CountUp'

export function ProblemStatement() {
  return (
    <section className="relative section-space overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[14%] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(30,64,175,0.08)_0%,rgba(250,247,242,0)_70%)] blur-2xl"
      />
      <Reveal className="editorial-shell">
        <div className="grid items-start gap-12 xl:grid-cols-12 xl:gap-16">
          <div className="xl:col-span-5">
            <Kicker>The Context</Kicker>
            <div className="mt-8 max-w-[42ch] space-y-5 text-[16.5px] leading-[1.75] text-[var(--graphite)]">
              <p>
                Universities spent a decade building content-detection infrastructure. Then transformer models made authorship unknowable from text alone.
              </p>
              <p>
                Every month, detectors get less reliable. False positives accuse honest students. False negatives pass through work the student cannot defend.
              </p>
            </div>
            <div className="mt-8 inline-flex flex-col gap-2 rounded-[18px] border border-[rgba(30,64,175,0.14)] bg-[rgba(219,228,245,0.5)] px-6 py-5">
              <p className="font-display text-[clamp(2.25rem,3.4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-[var(--accent-strong)]">
                <CountUp end={30} suffix="%+" />
              </p>
              <MonoMeta>false positive rates across leading detectors*</MonoMeta>
            </div>
          </div>

          <div className="xl:col-span-7">
            <blockquote className="font-display text-[clamp(2.5rem,4.6vw,4.75rem)] font-medium italic leading-[1.02] tracking-[-0.04em] text-[var(--ink)] text-balance">
              &ldquo;Detection cannot keep pace with generation.&rdquo;
            </blockquote>
            <div className="mt-8 h-px w-24 bg-[rgba(30,64,175,0.28)]" />
            <p className="mt-8 max-w-[58ch] text-[17px] leading-[1.75] text-[var(--graphite)]">
              This is not a tooling problem. It is a framing problem. The question stopped being{' '}
              <span className="font-display italic">did this student use AI</span> years ago. The useful question is{' '}
              <span className="font-display italic">can this student explain what they submitted.</span> UniPortal is built around that question.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <InkRule />
          <div className="mt-4 flex justify-end">
            <MonoMeta>UniPortal · Observed 2024—2026</MonoMeta>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
