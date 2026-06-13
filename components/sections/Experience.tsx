'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EXPERIENCE_ENTRIES, KALAIWORKS_ENTRY } from '@/lib/constants'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

// ─── YIYuva add-on strip — minimal leadership line item ───────────────────────
function YIYuvaAddon({ prefersReduced }: { prefersReduced: boolean }) {
  const yiyuvaRef = useRef<HTMLDivElement>(null)
  const entry = EXPERIENCE_ENTRIES[0]

  useEffect(() => {
    if (prefersReduced) return
    const el = yiyuvaRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: 12 })

      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(el, { opacity: 0, y: 12, duration: 0.4, ease: 'power2.in' }),
      })
    }, el)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <div
      ref={yiyuvaRef}
      className="mt-8 pt-5 border-t border-ink/[0.08]"
      style={prefersReduced ? {} : { opacity: 0, transform: 'translateY(12px)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-x-3.5 gap-y-2 mb-2">
        <div className="font-mono text-[9px] uppercase text-ink/30 whitespace-nowrap" style={{ letterSpacing: '0.08em' }}>
          + Leadership
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-syne font-bold text-[15px] text-ink" style={{ letterSpacing: '-0.01em' }}>
            Yi Yuva (CII)
          </span>
          <span className="text-[12px] text-ink/20">·</span>
          <span className="text-[13px] text-ink/50">
            {entry.role}
          </span>
          <span
            className="font-satoshi text-[11px] border rounded-full inline-block"
            style={{ padding: '3px 12px', color: entry.badgeColour, borderColor: entry.badgeColour, background: 'transparent' }}
          >
            {entry.type}
          </span>
        </div>
        <div className="font-mono text-[10px] text-ink/30 whitespace-nowrap">
          {entry.year}
        </div>
      </div>
      <div className="text-[12px] text-ink/[0.42] max-w-[560px]" style={{ lineHeight: 1.6 }}>
        {entry.description}
      </div>
    </div>
  )
}

// ─── Kalaiworks unified entry — Arrow Bridge promotion treatment ──────────────
function KalaiworksEntry({
  isLast,
  prefersReduced,
}: {
  isLast: boolean
  prefersReduced: boolean
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const yearRef = useRef<HTMLSpanElement>(null)
  const companyRef = useRef<HTMLHeadingElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const bulletsRef = useRef<HTMLUListElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const bridgeLeftRef = useRef<HTMLDivElement>(null)
  const bridgeCenterRef = useRef<HTMLDivElement>(null)
  const bridgeRightRef = useRef<HTMLDivElement>(null)
  const promoPillRef = useRef<HTMLDivElement>(null)
  const arrowLineRef = useRef<SVGLineElement>(null)
  const arrowHeadRef = useRef<SVGPolylineElement>(null)
  const promoDurationRef = useRef<HTMLDivElement>(null)
  const learnedBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReduced) return
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const triggerOpts = {
        trigger: root,
        start: 'top 75%',
        end: 'bottom 20%',
        toggleActions: 'play reverse play reverse',
      }

      if (yearRef.current) {
        gsap.fromTo(
          yearRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out', scrollTrigger: triggerOpts }
        )
      }

      if (companyRef.current) {
        gsap.fromTo(
          companyRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power3.out', scrollTrigger: triggerOpts }
        )
      }

      if (ruleRef.current) {
        gsap.fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: 'power2.out', delay: 0.3, transformOrigin: 'left', scrollTrigger: triggerOpts }
        )
      }

      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'power2.out', transformOrigin: 'left', scrollTrigger: triggerOpts }
        )
      }

      // Arrow Bridge entrance
      gsap.set(bridgeLeftRef.current, { opacity: 0, x: -16 })
      gsap.set(bridgeRightRef.current, { opacity: 0, x: 16 })
      gsap.set(promoPillRef.current, { opacity: 0, scale: 0.7, y: -6 })
      gsap.set(arrowLineRef.current, { attr: { x2: 4 } })
      gsap.set(arrowHeadRef.current, { opacity: 0 })
      gsap.set(promoDurationRef.current, { opacity: 0, y: 4 })
      gsap.set(learnedBoxRef.current, { opacity: 0, y: 8 })
      if (bulletsRef.current) {
        gsap.set(bulletsRef.current.children, { opacity: 0, y: 6 })
      }

      const bridgeTl = gsap.timeline({ paused: true })
      bridgeTl
        // Left slides in
        .to(bridgeLeftRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' })
        // Promo pill pops in
        .to(promoPillRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }, '-=0.1')
        // Arrow line draws left to right
        .to(arrowLineRef.current, { attr: { x2: 48 }, duration: 0.55, ease: 'power2.inOut' }, '+=0.05')
        // Arrowhead appears
        .to(arrowHeadRef.current, { opacity: 1, duration: 0.2, ease: 'power2.out' }, '-=0.1')
        // "6 months" fades up
        .to(promoDurationRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.1')
        // Right column slides in
        .to(bridgeRightRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        // Learned box fades up
        .to(learnedBoxRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')
      if (bulletsRef.current) {
        bridgeTl.to(bulletsRef.current.children, { opacity: 1, y: 0, duration: 0.35, stagger: 0.09, ease: 'power2.out' }, '-=0.2')
      }

      ScrollTrigger.create({
        trigger: root,
        start: 'top 75%',
        end: 'bottom 20%',
        onEnter: () => bridgeTl.play(),
        onLeaveBack: () => bridgeTl.reverse(),
      })
    }, root)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <div ref={rootRef}>
      <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-x-6 gap-y-2">
        {/* Year margin */}
        <span
          ref={yearRef}
          className="font-mono text-[12px] text-ink/50 md:pt-2 whitespace-pre-line"
          style={prefersReduced ? {} : { opacity: 0 }}
        >
          {KALAIWORKS_ENTRY.year}
        </span>

        <div>
          {/* Company name — clip-path wipe */}
          <h3
            ref={companyRef}
            className="font-syne font-bold text-ink m-0 leading-[1.05]"
            style={{
              fontSize: 'clamp(48px, 10vw, 72px)',
              clipPath: prefersReduced ? 'none' : 'inset(0 100% 0 0)',
              willChange: 'clip-path',
            }}
          >
            {KALAIWORKS_ENTRY.company}
          </h3>

          {/* Horizontal rule */}
          <div
            ref={ruleRef}
            className="h-px bg-ink/15 mt-3 mb-5 origin-left"
            style={prefersReduced ? {} : { transform: 'scaleX(0)', willChange: 'transform' }}
            aria-hidden
          />

          {/* Arrow Bridge — Option A balanced 3-col layout */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_1fr] items-start gap-y-8 mb-5">
            {/* Left — Intern (previous) */}
            <div ref={bridgeLeftRef} className="py-1" style={prefersReduced ? {} : { opacity: 0 }}>
              <div className="text-[14px] font-normal text-ink/35 mb-1">
                {KALAIWORKS_ENTRY.intern.title}
              </div>
              <div className="font-mono text-[10px] text-ink/[0.28] mb-2">
                {KALAIWORKS_ENTRY.intern.date}
              </div>
              <span
                className="font-satoshi text-[11px] border rounded-full inline-block"
                style={{ padding: '3px 12px', color: '#0D0D0D', borderColor: '#0D0D0D', background: 'transparent' }}
              >
                {KALAIWORKS_ENTRY.intern.badge}
              </span>
              <div className="text-[12px] text-ink/[0.38] mt-2.5 max-w-[220px]" style={{ lineHeight: 1.65 }}>
                {KALAIWORKS_ENTRY.intern.description}
              </div>

              {/* What I learned */}
              <div ref={learnedBoxRef} className="mt-3.5 p-3 border border-ink/[0.08] rounded-lg max-w-[220px]" style={prefersReduced ? {} : { opacity: 0 }}>
                <div className="font-mono text-[9px] text-ink/30 mb-1.5" style={{ letterSpacing: '0.06em' }}>
                  WHAT I LEARNED
                </div>
                <div className="text-[11px] text-ink/40" style={{ lineHeight: 1.6 }}>
                  {KALAIWORKS_ENTRY.intern.learnedTags}
                </div>
              </div>
            </div>

            {/* Center — promoted arrow highlight */}
            <div ref={bridgeCenterRef} className="flex flex-col items-center justify-center gap-2 pt-1.5 w-full">
              <div
                ref={promoPillRef}
                className="flex items-center gap-1 rounded-full"
                style={{
                  background: 'rgba(0,200,150,0.1)',
                  border: '1px solid rgba(0,200,150,0.35)',
                  padding: '4px 10px',
                  ...(prefersReduced ? {} : { opacity: 0 }),
                }}
              >
                <span className="font-mono text-[8px] whitespace-nowrap" style={{ color: '#00C896', letterSpacing: '0.08em' }}>
                  PROMOTED
                </span>
              </div>
              <div className="flex items-center justify-center w-full">
                <svg width="56" height="20" viewBox="0 0 56 20" fill="none" className="block mx-auto">
                  <line ref={arrowLineRef} x1="4" y1="10" x2={prefersReduced ? 48 : 4} y2="10" stroke="#00C896" strokeWidth="2" strokeLinecap="round" />
                  <polyline
                    ref={arrowHeadRef}
                    points="42,4 52,10 42,16"
                    stroke="#00C896"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={prefersReduced ? 1 : 0}
                  />
                </svg>
              </div>
              <div ref={promoDurationRef} className="font-mono text-[9px] text-ink/[0.28]" style={{ letterSpacing: '0.04em', ...(prefersReduced ? {} : { opacity: 0 }) }}>
                {KALAIWORKS_ENTRY.arrowSub}
              </div>
            </div>

            {/* Right — Full-time (current) */}
            <div ref={bridgeRightRef} className="py-1" style={prefersReduced ? {} : { opacity: 0 }}>
              <div className="font-syne font-extrabold text-[20px] text-ink mb-1" style={{ letterSpacing: '-0.02em' }}>
                {KALAIWORKS_ENTRY.current.title}
              </div>
              <div className="font-mono text-[10px] text-ink/[0.28] mb-2">
                {KALAIWORKS_ENTRY.current.date}
              </div>
              <span
                className="font-satoshi text-[11px] border rounded-full inline-block"
                style={{ padding: '3px 12px', color: '#00A8FF', borderColor: '#00A8FF', background: 'transparent' }}
              >
                {KALAIWORKS_ENTRY.current.badge}
              </span>
              <div className="text-[12px] text-ink/55 mt-2.5 mb-2.5" style={{ lineHeight: 1.65 }}>
                {KALAIWORKS_ENTRY.current.description}
              </div>

              {/* Bullets — only for current role */}
              <ul ref={bulletsRef} className="mt-3 flex flex-col gap-1.5 list-none p-0 m-0">
                {KALAIWORKS_ENTRY.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="font-satoshi text-[14px] text-ink/60 flex gap-2"
                    style={prefersReduced ? {} : { opacity: 0 }}
                  >
                    <span className="shrink-0 text-ink/30" aria-hidden>—</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Divider between entries */}
      {!isLast && (
        <div
          ref={dividerRef}
          className="h-px origin-left"
          style={{
            backgroundColor: 'rgba(26,26,46,0.12)',
            margin: '60px 0',
            transform: prefersReduced ? 'none' : 'scaleX(0)',
            willChange: 'transform',
          }}
          aria-hidden
        />
      )}
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const watermarkRef = useRef<HTMLSpanElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  // Watermark: burst in from small → massive fade-out → settle at resting opacity
  useEffect(() => {
    if (prefersReduced) return
    const watermark = watermarkRef.current
    const section = sectionRef.current
    if (!watermark || !section) return

    const ctx = gsap.context(() => {
      gsap.set(watermark, { xPercent: -50, yPercent: -50, scale: 0.2, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        },
      })

      // Phase 1 — burst in from tiny to full
      tl.to(watermark, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0)

      // Phase 2 — scale up massive + fade completely out
      tl.to(watermark, { scale: 5, opacity: 0, duration: 1.0, ease: 'power2.in' }, 0.45)

      // Phase 3 — invisible snap back to resting size + clear centering transforms
      tl.set(watermark, { scale: 1, xPercent: 0, yPercent: 0 }, 1.4)

      // Phase 4 — fade back in faintly, settled behind content
      tl.to(watermark, { opacity: 0.055, duration: 0.8, ease: 'power2.out' }, 1.45)

      // Separate scrub: slow leftward parallax drift as user scrolls through section
      gsap.to(watermark, {
        xPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative pt-24 md:pt-32 pb-12 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Watermark */}
      <span
        ref={watermarkRef}
        aria-hidden="true"
        className="hidden md:block font-syne font-extrabold absolute pointer-events-none select-none"
        style={{
          right: '-10px',
          top: '40px',
          transform: prefersReduced ? 'none' : undefined,
          zIndex: 0,
          fontSize: 'clamp(80px, 14vw, 150px)',
          fontWeight: 800,
          color: 'rgba(26,26,46,1)',
          letterSpacing: '-0.02em',
          opacity: prefersReduced ? 0.055 : 0,
          willChange: 'transform, opacity',
          whiteSpace: 'nowrap',
        }}
      >
        EXPERIENCE
      </span>

      {/* Section label */}
      <div className="relative z-[1] mb-16 md:mb-20">
        <span className="font-satoshi text-[11px] uppercase tracking-[0.1em] text-ink/40">
          04 — Experience
        </span>
      </div>

      {/* Entries */}
      <div className="relative z-[1] flex flex-col">
        <KalaiworksEntry isLast={true} prefersReduced={prefersReduced} />
        <YIYuvaAddon prefersReduced={prefersReduced} />
      </div>
    </section>
  )
}
