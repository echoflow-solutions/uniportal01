'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import { useInView } from 'react-intersection-observer'

export function CountUp({
  end,
  duration = 1.6,
  suffix = '',
  prefix = '',
}: {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}) {
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(reduceMotion ? end : 0)
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })
  const startedRef = useRef(false)

  useEffect(() => {
    if (reduceMotion || !inView || startedRef.current) return
    startedRef.current = true
    const controls = animate(0, end, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, end, duration, reduceMotion])

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}
