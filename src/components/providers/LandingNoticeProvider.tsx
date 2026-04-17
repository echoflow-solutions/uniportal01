'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type LandingNoticeContextValue = {
  openNotice: () => void
}

const LandingNoticeContext = createContext<LandingNoticeContextValue | null>(null)

export function LandingNoticeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo(
    () => ({
      openNotice: () => setIsOpen(true),
    }),
    []
  )

  return (
    <LandingNoticeContext.Provider value={value}>
      {children}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-[rgba(232,227,218,0.92)] bg-[var(--paper)] p-0 shadow-[0_36px_120px_rgba(10,10,10,0.18)] sm:max-w-[620px] sm:rounded-[28px]">
          <div className="paper-grain rounded-[28px] p-7 md:p-9">
            <DialogHeader className="text-left">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">
                Development notice
              </p>
              <DialogTitle className="mt-3 font-display text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--ink)]">
                UniPortal is still under development.
              </DialogTitle>
              <DialogDescription className="mt-4 max-w-[46ch] text-[15px] leading-[1.75] text-[var(--graphite)]">
                The login experience and this public entry function are being finalized. This part of the platform will be completed soon.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-7 rounded-[22px] border border-[rgba(10,10,10,0.08)] bg-white/72 p-5">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">
                Developer contact
              </p>
              <div className="mt-4 space-y-3 text-[14px] leading-[1.65] text-[var(--graphite)]">
                <p>
                  <span className="font-medium text-[var(--ink)]">Developer:</span> Bernard Adjei-Yeboah
                </p>
                <p>
                  <span className="font-medium text-[var(--ink)]">Email:</span>{' '}
                  <a
                    href="mailto:hello@uniportal.com.au"
                    className="focus-ring text-[var(--accent-strong)] transition-colors hover:text-[var(--ink)]"
                  >
                    hello@uniportal.com.au
                  </a>
                </p>
              </div>
            </div>

            <DialogFooter className="mt-7 flex-col gap-3 sm:flex-row sm:justify-start sm:space-x-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="button-ink focus-ring w-full justify-center sm:w-auto"
              >
                Close
              </button>
              <a
                href="mailto:hello@uniportal.com.au"
                className="button-secondary focus-ring w-fit justify-center"
              >
                Contact the developer
              </a>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </LandingNoticeContext.Provider>
  )
}

export function useLandingNotice() {
  const context = useContext(LandingNoticeContext)

  if (!context) {
    throw new Error('useLandingNotice must be used within a LandingNoticeProvider')
  }

  return context
}
