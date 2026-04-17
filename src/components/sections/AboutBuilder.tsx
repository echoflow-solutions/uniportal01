'use client'

import Image from 'next/image'
import { track } from '@vercel/analytics'
import { Reveal } from '@/components/ui/Reveal'
import { Kicker } from '@/components/ui/Kicker'
import { InkRule } from '@/components/ui/InkRule'
import { MonoMeta } from '@/components/ui/MonoMeta'

const builderHighlights = [
  {
    title: 'Master of IT',
    text: 'Developed within a Master of Information Technology journey grounded in applied systems thinking.',
  },
  {
    title: 'AI Specialisation',
    text: 'Focused on artificial intelligence as a practical discipline for real institutional products and workflows.',
  },
  {
    title: 'APIC Context',
    text: 'Asia Pacific International College provided the academic setting, challenge, and credibility behind the work.',
  },
  {
    title: 'Built with Intent',
    text: 'UniPortal was shaped as a serious product demonstration for student success, academic integrity, and university operations.',
  },
]

const builderStats = [
  ['Institution', 'Asia Pacific International College'],
  ['Program', 'Master of Information Technology'],
  ['Specialisation', 'Artificial Intelligence'],
  ['Project', 'UniPortal'],
]

export function AboutBuilder() {
  return (
    <section className="section-space">
      <div className="editorial-shell">
        <Reveal className="mx-auto max-w-[70rem]">
          <div className="text-center">
            <Kicker>About the Builder</Kicker>
            <h2 className="mt-6 font-display text-[clamp(2.6rem,5vw,5.2rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-[var(--ink)]">
              Meet Bernard.
            </h2>
          </div>

          <div className="mt-16 grid gap-10 xl:grid-cols-[0.9fr_1.25fr] xl:items-start xl:gap-16">
            <div>
              <div className="paper-panel overflow-hidden rounded-[32px]">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/bernard-portrait.png"
                    alt="Portrait of Bernard Adjei-Yeboah"
                    fill
                    sizes="(min-width: 1280px) 32vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover grayscale"
                  />
                </div>
              </div>
            </div>

            <div className="paper-panel rounded-[32px] p-7 md:p-9">
              <p className="font-display text-[clamp(2rem,3vw,3.1rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--ink)]">
                Bernard Adjei-Yeboah
              </p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[var(--slate)]">
                Builder of UniPortal · Applied AI, product systems, and university workflow design
              </p>

              <div className="mt-8 grid gap-4 border-y border-[rgba(10,10,10,0.08)] py-5 md:grid-cols-2 xl:grid-cols-4">
                {builderStats.map(([label, value]) => (
                  <div key={label}>
                    <MonoMeta>{label}</MonoMeta>
                    <p className="mt-2 text-[13.5px] leading-[1.55] text-[var(--graphite)]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-5 text-[15.5px] leading-[1.82] text-[var(--graphite)]">
                <p>
                  Bernard Adjei-Yeboah is the builder behind UniPortal, a product shaped around a practical question universities now face in the AI era: how to verify genuine understanding without relying on brittle detection theatre.
                </p>
                <p>
                  The platform was developed in the context of Bernard&apos;s Master of Information Technology studies at{' '}
                  <span className="font-medium text-[var(--ink)]">Asia Pacific International College (APIC)</span>, where he specialised in{' '}
                  <span className="font-medium text-[var(--ink)]">Artificial Intelligence</span>. That academic foundation is central to the product itself: UniPortal is designed to show how AI can be applied with rigor, fairness, and institutional responsibility.
                </p>
                <p>
                  APIC&apos;s academic environment provided the setting in which this work could be taken seriously as more than a classroom interface. UniPortal reflects an effort to translate postgraduate research, systems thinking, and product craft into something a university can actually evaluate, discuss, and potentially deploy.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {builderHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-[rgba(10,10,10,0.08)] bg-white/72 p-5"
                  >
                    <p className="font-display text-[1.25rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--ink)]">
                      {item.title}
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.7] text-[var(--graphite)]">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-[auto_auto_auto] xl:items-center">
                <a
                  href="https://www.linkedin.com/in/bernardadjei-yeboah/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track('builder_link_clicked', { link: 'linkedin' })}
                  className="button-ink focus-ring justify-center"
                >
                  LinkedIn
                </a>
                <a
                  href="https://bernardadjei.com"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track('builder_link_clicked', { link: 'website' })}
                  className="button-secondary focus-ring justify-center"
                >
                  bernardadjei.com
                </a>
                <a
                  href="mailto:bernardadjei10@gmail.com"
                  onClick={() => track('builder_link_clicked', { link: 'email' })}
                  className="button-secondary focus-ring justify-center"
                >
                  bernardadjei10@gmail.com
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-6">
                <a
                  href="#trust-compliance"
                  onClick={() => track('builder_link_clicked', { link: 'technical_position' })}
                  className="button-secondary focus-ring"
                >
                  See the technical position
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <InkRule />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
