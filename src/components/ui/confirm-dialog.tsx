'use client'

import { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, Loader2 } from 'lucide-react'

export type ConfirmDialogTone = 'danger' | 'warning' | 'default'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: ConfirmDialogTone
  busy?: boolean
  onConfirm: () => void | Promise<void>
  /** Optional extra content (e.g. the list of items being deleted). */
  children?: ReactNode
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  busy = false,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const confirmClass =
    tone === 'danger'
      ? 'inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(220,38,38,0.25)] transition-transform hover:-translate-y-[1px] hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none'
      : tone === 'warning'
      ? 'inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(217,119,6,0.25)] transition-transform hover:-translate-y-[1px] hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none'
      : 'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] transition-transform hover:-translate-y-[1px] hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none'

  const handleConfirm = async () => {
    if (busy) return
    await onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (busy ? null : onOpenChange(next))}>
      <DialogContent className="max-w-md border border-[var(--bone)] bg-[rgba(250,247,242,0.98)] text-[var(--ink)] shadow-[0_28px_90px_rgba(10,10,10,0.16)] sm:rounded-[1.4rem]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            {tone !== 'default' ? (
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  tone === 'danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                }`}
                aria-hidden
              >
                <AlertTriangle className="h-4 w-4" />
              </div>
            ) : null}
            <div className="min-w-0">
              <DialogTitle className="font-display text-[1.35rem] leading-tight tracking-[-0.03em] text-[var(--ink)]">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="mt-2 text-sm leading-6 text-[var(--slate)]">
                  {description}
                </DialogDescription>
              ) : null}
            </div>
          </div>
        </DialogHeader>

        {children ? <div className="text-sm text-[var(--slate)]">{children}</div> : null}

        <DialogFooter className="mt-2 gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[var(--bone)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[rgba(10,10,10,0.04)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button type="button" className={confirmClass} onClick={handleConfirm} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
