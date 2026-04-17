import { Reveal } from '@/components/ui/Reveal'
import { Kicker } from '@/components/ui/Kicker'
import { MonoMeta } from '@/components/ui/MonoMeta'

const complianceColumns = [
  {
    title: 'Security & Privacy',
    items: [
      '✓ Encryption at rest and in transit',
      '✓ Secure authentication and rate limiting',
      '✓ Privacy-respecting event aggregation',
      '✓ Consent and data-retention controls',
    ],
  },
  {
    title: 'Compliance',
    items: [
      '✓ GDPR / FERPA / Australian Privacy Act',
      '✓ WCAG 2.1 AA accessibility standards',
      '✓ Audit logs and institution governance',
      '✓ Data deletion and portability support',
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      '✓ Next.js, TypeScript, Supabase, PostgreSQL',
      '✓ Claude-powered verification workflows',
      '✓ SSO and LMS integration pathways',
      '✓ Vercel or AWS deployment readiness',
    ],
  },
]

export function TrustCompliance() {
  return (
    <section id="trust-compliance" className="section-space">
      <Reveal className="editorial-shell grid gap-12 xl:grid-cols-12 xl:gap-16">
        <div className="xl:col-span-5">
          <Kicker>The Technical Position</Kicker>
          <h2 className="mt-6 font-display text-[clamp(2.25rem,4vw,4rem)] font-semibold leading-[1] tracking-[-0.04em] text-[var(--ink)] text-balance">
            Trust has to survive procurement, policy, and audit.
          </h2>
          <p className="mt-7 max-w-[44ch] text-[16px] leading-[1.75] text-[var(--graphite)]">
            UniPortal is designed to meet the practical standards universities actually care about: privacy, accessibility, governance, and a technical foundation that does not collapse the moment scrutiny begins.
          </p>
        </div>

        <div className="xl:col-span-7">
          <div className="grid gap-10 md:grid-cols-3">
            {complianceColumns.map((column) => (
              <div key={column.title}>
                <MonoMeta className="uppercase tracking-[0.2em]">{column.title}</MonoMeta>
                <ul className="mt-5 space-y-3.5">
                  {column.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono-ui text-[12.5px] leading-[1.6] tracking-[0.02em] text-[var(--graphite)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
