import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[rgba(10,10,10,0.08)] py-6">
      <div className="editorial-shell flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="font-mono-ui text-[12px] uppercase tracking-[0.16em] text-[var(--slate)]">
          UniPortal · APIC Applied Project 2025
        </p>
        <div className="flex items-center gap-5 font-mono-ui text-[12px] uppercase tracking-[0.16em] text-[var(--slate)]">
          <Link href="#trust-compliance" className="focus-ring transition-colors hover:text-[var(--ink)]">
            Privacy
          </Link>
          <Link href="#trust-compliance" className="focus-ring transition-colors hover:text-[var(--ink)]">
            Terms
          </Link>
          <Link href="mailto:bernardadjei10@gmail.com" className="focus-ring transition-colors hover:text-[var(--ink)]">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
