'use client'

import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { InkRule } from '@/components/ui/InkRule'
import { MonoMeta } from '@/components/ui/MonoMeta'
import { useLandingNotice } from '@/components/providers/LandingNoticeProvider'

export function Closing() {
  const { openNotice } = useLandingNotice()

  return (
    <section className="section-space flex min-h-[90svh] items-center">
      <div className="editorial-shell w-full">
        <Reveal className="mx-auto max-w-[60rem] text-center">
          <h2 className="font-display text-[clamp(2.75rem,6vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--ink)] text-balance">
            Detection was the old war.{' '}
            <span className="italic [font-variation-settings:&quot;opsz&quot;_144,&quot;wght&quot;_580,&quot;SOFT&quot;_100]">
              Understanding
            </span>{' '}
            is the new standard.
          </h2>
          <p className="mx-auto mt-8 max-w-[48ch] text-[16.5px] leading-[1.75] text-[var(--graphite)]">
            UniPortal is built for institutions that want to verify learning, not prove its absence. The platform is live. Come see how it works.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <button type="button" onClick={openNotice} className="button-ink focus-ring">
              Enter the product
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#trust-compliance" className="button-secondary focus-ring">
              Read the technical brief
            </a>
          </div>

          <div className="mt-16">
            <InkRule />
            <div className="mt-5 flex justify-center">
              <MonoMeta>Verify understanding, not just sources.</MonoMeta>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
