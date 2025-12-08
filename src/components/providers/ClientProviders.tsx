'use client'

import { DemoControls } from '@/components/demo/DemoControls'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DemoControls />
    </>
  )
}
