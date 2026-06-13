'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ABOUT_PANELS } from '@/lib/constants'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const outerRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return           // mobile: vertical stack

    const panels = panelsRef.current
    const outer = outerRef.current
    if (!panels || !outer) return

    const ctx = gsap.context(() => {
      const panelCount = ABOUT_PANELS.length  // 4
      gsap.to(panels, {
        xPercent: -100 * (panelCount - 1) / panelCount,
        ease: 'none',
        scrollTrigger: {
          trigger: outer,
          pin: outer,
          // pinSpacing: false — we own the scroll height via the outer wrapper's
          // explicit height (100vh + 3*100vw set in JSX). Without this, GSAP adds
          // a pinSpacer that doubles the scroll distance and creates a blank gap.
          pinSpacing: false,
          scrub: 0.5,
          start: 'top top',
          end: () => '+=' + (panelCount - 1) * window.innerWidth,
          invalidateOnRefresh: true,
        },
      })
    })

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <>
      {/* ── Desktop: pinned horizontal scroll ──────────────────────── */}
      <div
        ref={outerRef}
        id="about"
        className="hidden md:block relative"
        data-gsap-about="true"
        aria-label="About Siddharth"
        style={{ height: 'calc(100vh + 300vw)' }}
      >
        {/* Section header — sits above the sticky container */}
        <div className="px-16 lg:px-24 pt-24 pb-8 absolute top-0 left-0 z-10 pointer-events-none">
          <span className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40">
            About
          </span>
        </div>

        {/* Sticky viewport — panels scroll horizontally inside */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Panels container — width 400vw, flex row */}
          <div
            ref={panelsRef}
            className="about-panels flex h-full"
            style={{ width: '400vw' }}
          >
            {ABOUT_PANELS.map((panel) => (
              <div
                key={panel.number}
                className="relative flex flex-col justify-center px-24 h-screen overflow-hidden"
                style={{ width: '100vw' }}
              >
                {/* Decorative number — Syne Bold, clamp(120px, 20vw, 200px), pillar colour at 8% opacity */}
                <span
                  className="absolute top-0 right-12 font-syne font-extrabold leading-none select-none pointer-events-none"
                  style={{
                    fontSize: 'clamp(120px, 20vw, 200px)',
                    color: panel.pillarColour,
                    opacity: 0.08,
                  }}
                  aria-hidden
                >
                  {panel.number}
                </span>

                {/* Panel number + title — Satoshi Medium 13px uppercase, pillar colour */}
                <span
                  className="font-satoshi font-medium text-[13px] uppercase tracking-wider mb-8"
                  style={{ color: panel.pillarColour }}
                >
                  {panel.number} — {panel.title.toUpperCase()}
                </span>

                {/* Body — Syne 24px, ink, max-width 600px, line-height 1.5 */}
                <p
                  className="font-syne font-light text-[24px] text-ink leading-[1.5] max-w-[600px] m-0"
                >
                  {panel.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: vertical stack, no GSAP ───────────────────────── */}
      <div className="md:hidden" id="about-mobile">
        <div className="px-6 pt-20 pb-4">
          <span className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40">
            About
          </span>
        </div>

        {ABOUT_PANELS.map((panel) => (
          <div
            key={panel.number}
            className="relative flex flex-col justify-center px-8 py-16 overflow-hidden"
          >
            {/* Decorative number */}
            <span
              className="absolute top-0 right-4 font-syne font-extrabold leading-none select-none pointer-events-none"
              style={{
                fontSize: 'clamp(80px, 20vw, 140px)',
                color: panel.pillarColour,
                opacity: 0.08,
              }}
              aria-hidden
            >
              {panel.number}
            </span>

            <span
              className="font-satoshi font-medium text-[13px] uppercase tracking-wider mb-6"
              style={{ color: panel.pillarColour }}
            >
              {panel.number} — {panel.title.toUpperCase()}
            </span>

            <p className="font-syne font-light text-[18px] text-ink leading-[1.5] max-w-[560px] m-0">
              {panel.body}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
