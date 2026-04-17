import { Reveal } from '@/components/ui/Reveal'
import { Kicker } from '@/components/ui/Kicker'
import { InkRule } from '@/components/ui/InkRule'
import { MonoMeta } from '@/components/ui/MonoMeta'

const frontDoorModules = [
  ['Courses', 'Enrol & track progress'],
  ['Fees', 'Payments & balances'],
  ['Integrity', 'TrueLearn verification'],
  ['Grades', 'Reports & analytics'],
  ['Schedule', 'Timetables & events'],
  ['AI Assistant', 'Smart chatbot support'],
]

const demoAccess = [
  ['Lecturer', 'Dr. Maya Chen', 'MC'],
  ['Student', 'Avery Morgan', 'AM'],
  ['Student', 'Jordan Patel', 'JP'],
  ['Student', 'Sofia Bennett', 'SB'],
]

const navGroups = [
  {
    title: 'Main',
    items: ['Dashboard', 'My Courses', 'Assignments', 'My Submissions', 'Grades', 'Library'],
  },
  {
    title: 'TrueLearn',
    items: ['TrueLearn Write'],
  },
  {
    title: 'Management',
    items: ['Fees & Payments', 'Schedule', 'Academic Integrity'],
  },
  {
    title: 'Academic Support',
    items: ['AI Academic Assistant', 'Notifications'],
  },
]

function FrontDoorFigure() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.82fr]">
      <div className="paper-panel rounded-[30px] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <MonoMeta>Campus front door</MonoMeta>
            <h3 className="mt-4 max-w-[12ch] font-display text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--ink)]">
              Your complete university portal.
            </h3>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.7] text-[var(--graphite)]">
              A single entry point for coursework, fees, schedules, integrity workflows, academic support, and progress tracking.
            </p>
          </div>
          <span className="rounded-full bg-[rgba(21,128,61,0.1)] px-3 py-1 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--verified)]">
            Online
          </span>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {frontDoorModules.map(([title, text], index) => (
            <div
              key={title}
              className="rounded-[20px] border border-[rgba(10,10,10,0.08)] bg-white/80 px-4 py-4 shadow-[0_12px_32px_rgba(10,10,10,0.04)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium tracking-[-0.02em] text-[var(--ink)]">{title}</p>
                  <p className="mt-1 text-[13px] leading-[1.5] text-[var(--slate)]">{text}</p>
                </div>
                <span
                  className="h-9 w-9 rounded-[14px]"
                  style={{
                    background:
                      index === 0
                        ? 'rgba(30,64,175,0.12)'
                        : index === 1
                          ? 'rgba(161,98,7,0.12)'
                          : index === 2
                            ? 'rgba(21,128,61,0.12)'
                            : index === 3
                              ? 'rgba(124,58,237,0.12)'
                              : index === 4
                                ? 'rgba(59,130,246,0.12)'
                                : 'rgba(139,92,246,0.12)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {['AI-powered', 'Real-time analytics', 'Secure platform'].map((item) => (
            <span
              key={item}
              className="rounded-full border border-[rgba(10,10,10,0.08)] bg-white/70 px-4 py-2 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--slate)]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="paper-panel rounded-[30px] p-6 md:p-8">
        <div className="rounded-[18px] bg-[var(--paper-deep)] p-1.5">
          <div className="grid grid-cols-2 gap-1">
            {['Sign in', 'Demo access'].map((item, index) => (
              <div
                key={item}
                className={`rounded-[14px] px-4 py-2 text-center text-[13px] font-medium tracking-[-0.02em] ${
                  index === 1 ? 'bg-[var(--accent-strong)] text-[var(--paper)]' : 'text-[var(--slate)]'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <MonoMeta>Role-aware entry</MonoMeta>
          <h3 className="mt-4 font-display text-[clamp(1.75rem,2.6vw,2.6rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-[var(--ink)]">
            Quick demo access by role and identity.
          </h3>
          <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.65] text-[var(--graphite)]">
            Lecturer and student pathways are explicit from the first interaction, so each person enters the product with the right permissions, context, and evidence model.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          {demoAccess.map(([role, name, initials], index) => (
            <div
              key={name}
              className={`rounded-[18px] border px-4 py-3 ${
                index === 0
                  ? 'border-[rgba(30,64,175,0.14)] bg-[rgba(30,64,175,0.06)]'
                  : 'border-[rgba(10,10,10,0.08)] bg-white/72'
              }`}
            >
              <p className="font-mono-ui text-[10.5px] uppercase tracking-[0.22em] text-[var(--ash)]">{role}</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] font-mono-ui text-[12px] text-[var(--accent-strong)]">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium tracking-[-0.02em] text-[var(--ink)]">{name}</p>
                  {index === 0 ? (
                    <p className="mt-1 font-mono-ui text-[10.5px] uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                      Lecturer account
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function NavigationDirectory() {
  return (
    <div className="paper-panel rounded-[28px] p-6">
      <div className="flex items-center gap-3 border-b border-[rgba(10,10,10,0.08)] pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-soft)] font-mono-ui text-[12px] text-[var(--accent-strong)]">
          BA
        </div>
        <div>
          <p className="text-[14px] font-medium tracking-[-0.02em] text-[var(--ink)]">Bernard Adjei-Yeboah</p>
          <p className="mt-1 font-mono-ui text-[10.5px] uppercase tracking-[0.18em] text-[var(--verified)]">
            Online
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="font-mono-ui text-[10.5px] uppercase tracking-[0.22em] text-[var(--ash)]">{group.title}</p>
            <div className="mt-3 space-y-1.5">
              {group.items.map((item, index) => (
                <div
                  key={item}
                  className={`rounded-[14px] px-3 py-2.5 text-[14px] tracking-[-0.02em] ${
                    group.title === 'Main' && index === 0
                      ? 'bg-[var(--accent-strong)] text-[var(--paper)] shadow-[0_10px_24px_rgba(30,64,175,0.25)]'
                      : 'text-[var(--graphite)]'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PlatformCoverage() {
  return (
    <section id="platform-coverage" className="section-space">
      <div className="editorial-shell">
        <Reveal className="grid gap-10 xl:grid-cols-12 xl:gap-16">
          <div className="xl:col-span-4">
            <Kicker>Platform Coverage</Kicker>
            <h2 className="mt-6 font-display text-[clamp(2.25rem,4vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--ink)] text-balance">
              The product is broader than integrity alone.
            </h2>
          </div>
          <div className="xl:col-span-8">
            <p className="max-w-[62ch] text-[17px] leading-[1.8] text-[var(--graphite)]">
              The live platform already behaves like a university operating layer: a front door for coursework and balances, a role-aware demo and login flow, a persistent student workspace, and adjacent support surfaces that make TrueLearn feel embedded in campus operations instead of bolted on.
            </p>
          </div>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <FrontDoorFigure />
          </Reveal>
        </div>

        <Reveal className="mt-16 grid gap-12 xl:grid-cols-12 xl:items-start xl:gap-16">
          <div className="xl:col-span-5">
            <Kicker>Navigation Model</Kicker>
            <h3 className="mt-5 font-display text-[clamp(1.95rem,3vw,3.05rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--ink)] text-balance">
              A role-based operating system for students, staff, and integrity workflows.
            </h3>
            <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.75] text-[var(--graphite)]">
              The left-hand information architecture is already doing real product work. Main academic navigation, the dedicated TrueLearn writing surface, management tasks like fees and schedules, and academic support tools all sit in a single persistent shell.
            </p>
            <div className="mt-8 space-y-3">
              {[
                'Main surfaces cover dashboard, courses, assignments, submissions, grades, and library access.',
                'TrueLearn Write is treated as its own product layer rather than a buried assignment utility.',
                'Management surfaces keep fees, schedules, and integrity operations within the same session.',
                'Support surfaces include the AI academic assistant and notifications, not just back-office admin links.',
              ].map((item) => (
                <p key={item} className="text-[15px] leading-[1.7] text-[var(--graphite)]">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="xl:col-span-7">
            <NavigationDirectory />
          </div>
        </Reveal>

        <div className="mt-24">
          <InkRule />
        </div>
      </div>
    </section>
  )
}
