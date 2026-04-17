'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLandingNotice } from '@/components/providers/LandingNoticeProvider'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { openNotice } = useLandingNotice()

  useEffect(() => {
    let raf = 0
    let ticking = false

    const update = () => {
      setScrolled((prev) => {
        const next = window.scrollY > 24
        return prev === next ? prev : next
      })
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      raf = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="editorial-shell relative z-30 pt-3 md:pt-4">
      <nav
        className={`sticky top-4 transition-all duration-300 ${
          scrolled ? 'paper-panel' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between rounded-full px-4 py-2.5 md:px-5 md:py-3">
          <Link href="/" className="focus-ring flex items-center rounded-full">
            <div className="min-w-0">
              <p className="font-display text-[clamp(1.75rem,2.2vw,2.4rem)] italic leading-none tracking-[-0.05em] text-[var(--ink)]">
                UniPortal
              </p>
              <p className="mt-1 hidden max-w-[32rem] text-sm text-[var(--slate)] sm:block">
                AI-powered student success and academic integrity platform
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={openNotice}
              className="focus-ring text-sm font-medium text-[var(--graphite)] transition-colors hover:text-[var(--ink)]"
            >
              Log in
            </button>
            <Link href="/#platform-coverage" className="button-ink focus-ring hidden sm:inline-flex">
              See the product
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
