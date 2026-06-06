'use client'

import { useRef, type ReactNode, type ElementType } from 'react'
import { motion, useInView } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { fadeUp } from '@/lib/animations'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  as?: ElementType
}

export function ScrollReveal({ children, delay = 0, className, as: Tag = 'div' }: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const prefersReduced = usePrefersReducedMotion()

  if (prefersReduced) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
