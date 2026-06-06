'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    // Keep ScrollTrigger in sync with Lenis's eased scroll position
    lenis.on('scroll', ScrollTrigger.update)

    // When GSAP pins a section it inserts a pinSpacer div which changes the
    // total page height. Lenis was initialised before that — so it needs to
    // recalculate its scroll limit every time GSAP refreshes its layout.
    // Without this, Lenis stops at the wrong scroll max and the page feels
    // stuck or bounces back on pinned sections.
    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
