import { Reveal } from '@/components/ui/Reveal'
import { Kicker } from '@/components/ui/Kicker'
import { InkRule } from '@/components/ui/InkRule'
import { MonoMeta } from '@/components/ui/MonoMeta'

const statCards = [
  ['Current GPA', '6.67', 'rgba(251,191,36,0.14)', 'var(--pending)'],
  ['Units Enrolled', '3', 'rgba(30,64,175,0.12)', 'var(--accent-strong)'],
  ['Pending Tasks', '5', 'rgba(168,85,247,0.12)', '#9333ea'],
  ['Integrity Score', '92%', 'rgba(21,128,61,0.14)', 'var(--verified)'],
]

const deadlines = [
  ['Final Report · ICT6001', 'Due 2025-12-18', '10 days left'],
  ['Research Presentation', 'Due 2025-12-22', '14 days left'],
  ['Peer Review Submission', 'Due 2025-12-15', '7 days left'],
]

const schedule = [
  ['09:00 AM', 'Applied Project Lecture', 'Room 301'],
  ['11:30 AM', 'Group Meeting', 'Library Study Room B'],
  ['02:00 PM', 'Supervisor Consultation', 'Office 204'],
  ['04:00 PM', 'AI Workshop', 'Computer Lab 2'],
]

const progress = [
  ['ICT6001 Applied Project', '65%', 'HD'],
  ['ICT6002 Research Methods', '72%', 'HD'],
  ['ICT6003 Advanced Database Systems', '58%', 'D'],
]

const trueLearnBreakdown = [
  ['Authorship Score', '95%'],
  ['Comprehension', '88%'],
  ['Consistency', '93%'],
]

function StudentDashboardFigure() {
  return (
    <div className="paper-panel rounded-[32px] p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="font-display text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--ink)]">
            Good afternoon, Bernard!
          </h3>
          <p className="mt-2 text-[15px] leading-[1.7] text-[var(--graphite)]">
            Here&apos;s what&apos;s happening with your academic journey today.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="rounded-full border border-[rgba(10,10,10,0.08)] bg-white/72 px-4 py-2 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--graphite)]">
            Notifications 3
          </span>
          <span className="rounded-full bg-[var(--accent-strong)] px-4 py-2 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--paper)]">
            AI assistant
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([label, value, bg, tone]) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-[22px] border border-[rgba(10,10,10,0.08)] bg-white/72 p-5 shadow-[0_12px_28px_rgba(10,10,10,0.04)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(10,10,10,0.08)]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-90 blur-[2px]"
              style={{ background: bg }}
            />
            <p className="relative font-mono-ui text-[10.5px] uppercase tracking-[0.22em] text-[var(--ash)]">
              {label}
            </p>
            <p
              className="relative mt-4 font-display text-[clamp(2rem,2.6vw,2.6rem)] leading-none tracking-[-0.04em]"
              style={{ color: tone }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-12">
        <div className="rounded-[24px] border border-[rgba(10,10,10,0.08)] bg-white/72 p-5 xl:col-span-7">
          <div className="flex items-center justify-between gap-4">
            <MonoMeta>Upcoming deadlines</MonoMeta>
            <MonoMeta>View all</MonoMeta>
          </div>
          <div className="mt-5 space-y-3">
            {deadlines.map(([title, due, badge], index) => (
              <div
                key={title}
                className="grid gap-3 rounded-[18px] border border-[rgba(10,10,10,0.06)] bg-[rgba(250,247,242,0.82)] px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div>
                  <p className="text-[14px] font-medium tracking-[-0.02em] text-[var(--ink)]">{title}</p>
                  <p className="mt-1 text-[12px] text-[var(--slate)]">{due}</p>
                </div>
                <span
                  className="inline-flex rounded-full px-3 py-1 font-mono-ui text-[10.5px] uppercase tracking-[0.16em]"
                  style={{
                    backgroundColor: index === 2 ? 'rgba(185,28,28,0.12)' : 'rgba(10,10,10,0.06)',
                    color: index === 2 ? 'var(--flagged)' : 'var(--graphite)',
                  }}
                >
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[rgba(10,10,10,0.08)] bg-white/72 p-5 xl:col-span-5">
          <div className="flex items-center justify-between gap-4">
            <MonoMeta>Today&apos;s schedule</MonoMeta>
            <MonoMeta>4 events</MonoMeta>
          </div>
          <div className="mt-5 space-y-3">
            {schedule.map(([time, title, location]) => (
              <div
                key={time + title}
                className="grid gap-2 rounded-[18px] border border-[rgba(10,10,10,0.06)] bg-[rgba(250,247,242,0.82)] px-4 py-3 md:grid-cols-[88px_minmax(0,1fr)] md:items-center"
              >
                <span className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--accent-strong)]">
                  {time}
                </span>
                <div>
                  <p className="text-[14px] font-medium tracking-[-0.02em] text-[var(--ink)]">{title}</p>
                  <p className="mt-1 text-[12px] text-[var(--slate)]">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[rgba(10,10,10,0.08)] bg-white/72 p-5 xl:col-span-7">
          <div className="flex items-center justify-between gap-4">
            <MonoMeta>Unit progress</MonoMeta>
            <MonoMeta>Trimester 2</MonoMeta>
          </div>
          <div className="mt-6 space-y-5">
            {progress.map(([title, percent, grade]) => (
              <div key={title}>
                <div className="flex items-center justify-between gap-4 text-[14px] tracking-[-0.02em] text-[var(--graphite)]">
                  <span>{title}</span>
                  <span className="font-mono-ui text-[12px] uppercase tracking-[0.16em] text-[var(--slate)]">
                    {grade} · {percent}
                  </span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-[var(--paper-deep)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-strong)]"
                    style={{ width: percent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[rgba(10,10,10,0.08)] bg-white/72 xl:col-span-5">
          <div className="bg-[linear-gradient(135deg,rgba(30,64,175,0.92),rgba(79,70,229,0.9))] px-5 py-5 text-[var(--paper)]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <MonoMeta className="text-[rgba(250,247,242,0.78)]">TrueLearn score</MonoMeta>
                <p className="mt-2 font-display text-[clamp(2rem,2.4vw,2.4rem)] leading-[1] tracking-[-0.04em]">
                  92 <span className="text-[rgba(250,247,242,0.6)]">/ 100</span>
                </p>
              </div>
              <span className="rounded-full bg-[rgba(250,247,242,0.18)] px-3 py-1 font-mono-ui text-[10.5px] uppercase tracking-[0.18em]">
                Good standing
              </span>
            </div>
          </div>
          <div className="space-y-3 p-5">
            {trueLearnBreakdown.map(([label, value]) => {
              const numeric = Number(value.replace('%', ''))
              return (
                <div key={label}>
                  <div className="flex items-center justify-between gap-4 text-[14px] text-[var(--graphite)]">
                    <span>{label}</span>
                    <span className="font-medium text-[var(--ink)]">{value}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-[var(--paper-deep)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent-strong)]"
                      style={{ width: `${numeric}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[rgba(10,10,10,0.08)] bg-white/72 xl:col-span-7">
          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.85fr)]">
            <div className="bg-[linear-gradient(135deg,rgba(21,128,61,0.86),rgba(95,211,184,0.92))] p-6 text-[var(--paper)]">
              <MonoMeta className="text-[rgba(250,247,242,0.78)]">Fee status</MonoMeta>
              <p className="mt-3 font-display text-[clamp(2rem,2.6vw,2.6rem)] leading-[1] tracking-[-0.04em]">
                Paid in Full
              </p>
              <p className="mt-3 max-w-[28ch] text-[13px] leading-[1.65] text-[rgba(250,247,242,0.86)]">
                Trimester invoice cleared. Statement and receipt history are available on demand.
              </p>
              <div className="mt-5 h-2 w-full rounded-full bg-[rgba(250,247,242,0.18)]">
                <div className="h-full w-full rounded-full bg-[rgba(250,247,242,0.95)]" />
              </div>
            </div>
            <div className="space-y-3 p-6 text-[14px] leading-[1.6] text-[var(--graphite)]">
              {[
                ['Total fees', '$12,500.00'],
                ['Paid', '$12,500.00'],
                ['Outstanding', '$0.00'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-[rgba(10,10,10,0.06)] pb-3 last:border-none last:pb-0"
                >
                  <span className="font-mono-ui text-[10.5px] uppercase tracking-[0.18em] text-[var(--ash)]">
                    {label}
                  </span>
                  <span className="font-medium text-[var(--ink)]">{value}</span>
                </div>
              ))}
              <button className="mt-3 w-full rounded-[14px] border border-[rgba(10,10,10,0.08)] px-4 py-3 text-[13px] font-medium tracking-[-0.02em] text-[var(--ink)] transition-colors duration-200 hover:bg-[var(--paper-deep)]">
                View statement
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-[rgba(10,10,10,0.08)] bg-[linear-gradient(135deg,rgba(109,40,217,0.94),rgba(139,92,246,0.96))] p-6 text-[var(--paper)] shadow-[0_22px_56px_rgba(109,40,217,0.2)] xl:col-span-5">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(250,247,242,0.18)_0%,rgba(250,247,242,0)_70%)]"
          />
          <MonoMeta className="text-[rgba(250,247,242,0.78)]">AI study assistant</MonoMeta>
          <p className="mt-3 font-display text-[clamp(1.7rem,2.1vw,2rem)] leading-[1] tracking-[-0.04em]">
            Powered by GPT-5
          </p>
          <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.7] text-[rgba(250,247,242,0.88)]">
            Instant help with assignments, research, and study materials — without leaving the student workflow.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Summarise', 'Cite sources', 'Practise questions'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[rgba(250,247,242,0.22)] bg-[rgba(250,247,242,0.1)] px-3 py-1 font-mono-ui text-[10.5px] uppercase tracking-[0.16em]"
              >
                {item}
              </span>
            ))}
          </div>
          <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-[14px] bg-white px-5 py-3 text-[13px] font-medium tracking-[-0.02em] text-[#6d28d9] transition-transform duration-200 hover:translate-y-[-1px]">
            Start chat →
          </button>
        </div>
      </div>
    </div>
  )
}

export function StudentWorkspace() {
  return (
    <section className="section-space">
      <div className="editorial-shell">
        <Reveal className="grid gap-10 xl:grid-cols-12 xl:gap-16">
          <div className="xl:col-span-4">
            <Kicker>Student Workspace</Kicker>
            <h2 className="mt-6 font-display text-[clamp(2.25rem,4vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--ink)] text-balance">
              The daily student view is already a complete operating surface.
            </h2>
          </div>
          <div className="xl:col-span-8">
            <p className="max-w-[64ch] text-[17px] leading-[1.8] text-[var(--graphite)]">
              The dashboard in the product is not a placeholder. It connects academic performance, unit load, pending work, upcoming deadlines, schedule, fee status, integrity scoring, and AI study support into one session. That breadth matters because it positions UniPortal as a campus workflow layer, not just an assessment tool.
            </p>
          </div>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <StudentDashboardFigure />
          </Reveal>
        </div>

        <Reveal className="mt-16 grid gap-10 xl:grid-cols-12 xl:gap-16">
          <div className="xl:col-span-5">
            <Kicker>What this adds</Kicker>
            <h3 className="mt-5 font-display text-[clamp(1.95rem,3vw,3.05rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--ink)] text-balance">
              A stronger product story than “integrity software.”
            </h3>
          </div>
          <div className="xl:col-span-7 space-y-4">
            {[
              'Performance cards tie academic momentum to operational context: GPA, units, pending tasks, and the integrity score sit in the same top layer.',
              'The deadlines and schedule surfaces show that UniPortal already behaves like a student planning environment, not merely a submission portal.',
              'Fee status and statement access extend the platform into administrative workflows that students actually revisit during the term.',
              'The TrueLearn breakdown makes the scoring model legible by exposing authorship, comprehension, and consistency as separate evidence pillars.',
              'The AI Study Assistant, explicitly presented as GPT-5-powered, gives the platform a visible model layer that supports learning rather than just policing it.',
            ].map((item) => (
              <p key={item} className="text-[15.5px] leading-[1.78] text-[var(--graphite)]">
                {item}
              </p>
            ))}
          </div>
        </Reveal>

        <div className="mt-24">
          <InkRule />
        </div>
      </div>
    </section>
  )
}
