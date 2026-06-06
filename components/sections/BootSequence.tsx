'use client'

import { useEffect } from 'react'

interface BootSequenceProps {
  onComplete: () => void
}

// Stub — auto-completes immediately.
// The full BootSequence (terminal + bold statements) will be built in a later step.
export default function BootSequence({ onComplete }: BootSequenceProps) {
  useEffect(() => {
    onComplete()
  }, [onComplete])

  return null
}
