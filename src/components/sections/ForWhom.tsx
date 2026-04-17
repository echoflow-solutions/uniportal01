import { Reveal } from '@/components/ui/Reveal'
import { Kicker } from '@/components/ui/Kicker'
import { InkRule } from '@/components/ui/InkRule'

const roleContent = [
  {
    kicker: 'For Students',
    title: 'A workspace that trusts you, and proves it.',
    copy:
      'UniPortal is not surveillance. It is the opposite — an environment that captures evidence you did the work, so your grade can stand on something real. Accommodations-aware, accessibility-first, designed for the person doing the writing.',
  },
  {
    kicker: 'For Instructors',
    title: 'Less review time. More defensible decisions.',
    copy:
      'Heatmaps show where attention is needed. Evidence reports replace guesswork with data. When you flag a submission, you have something to show.',
  },
  {
    kicker: 'For Institutions',
    title: 'Procurement-grade infrastructure.',
    copy:
      'GDPR, FERPA, and Australian Privacy Act compliance built in. WCAG 2.1 AA accessibility. Audit logs. Role-based governance. Single sign-on when you need it. A platform an academic board can say yes to.',
  },
]

export function ForWhom() {
  return (
    <section className="section-space">
      <div className="editorial-shell">
        <Reveal className="space-y-14">
          {roleContent.map((item, index) => (
            <article key={item.kicker}>
              {index > 0 ? <InkRule className="mb-12" /> : null}
              <div className="grid gap-8 xl:grid-cols-12 xl:items-start xl:gap-16">
                <div className="xl:col-span-4">
                  <Kicker>{item.kicker}</Kicker>
                </div>
                <div className="xl:col-span-8">
                  <h3 className="font-display text-[clamp(2rem,3.4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--ink)] text-balance">
                    {item.title}
                  </h3>
                  <p className="mt-6 max-w-[58ch] text-[16px] leading-[1.75] text-[var(--graphite)]">
                    {item.copy}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
