'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'
import { sectionReveal } from '@/lib/motion-presets'

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (reduceMotion || !mounted) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? 'visible' : 'hidden'}
      variants={sectionReveal}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
