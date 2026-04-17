import { Reveal } from '@/components/ui/Reveal'
import { Kicker } from '@/components/ui/Kicker'
import { MonoMeta } from '@/components/ui/MonoMeta'
import { AuthorshipReport } from '@/components/demos/AuthorshipReport'

export function EvidenceInAction() {
  return (
    <section id="evidence-in-action" className="section-space">
      <div className="editorial-shell">
        <Reveal className="mx-auto max-w-[44rem] text-center">
          <Kicker>The Artifact</Kicker>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-[var(--ink)] text-balance">
            This is what an instructor sees.
          </h2>
          <p className="mx-auto mt-6 max-w-[36ch] text-[16px] leading-[1.75] text-[var(--graphite)]">
            Three submissions. Three different stories.
          </p>
        </Reveal>

        <div className="mt-14">
          <AuthorshipReport />
        </div>

        <div className="mt-6 text-center">
          <MonoMeta>Live sample — data is illustrative, not from a real student</MonoMeta>
        </div>
      </div>
    </section>
  )
}
