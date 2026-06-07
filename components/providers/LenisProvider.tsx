'use client'

import { useEffect, type ReactNode } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Keeps ScrollTrigger in sync with Lenis scroll position and handles
 * resize events when GSAP adds/removes pinSpacers.
 */
function GSAPSyncPlugin() {
  const lenis = useLenis()

  // Fire ScrollTrigger.update on every Lenis scroll frame
  useLenis(ScrollTrigger.update)

  useEffect(() => {
    if (!lenis) return
    // When GSAP refreshes (e.g. pinSpacer added), Lenis must recalculate scroll height
    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)
    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
    }
  }, [lenis])

  return null
}

export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // autoRaf: true (default) — Lenis drives its own requestAnimationFrame.
        // We do NOT use GSAP ticker to drive Lenis; instead ScrollTrigger.update
        // is called via the useLenis scroll callback above.
      }}
    >
      <GSAPSyncPlugin />
      {children}
    </ReactLenis>
  )
}
