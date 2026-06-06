'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { EXPERIENCE_ENTRIES, GITHUB_STATS } from '@/lib/constants'
import { fadeUp, EASE_OUT } from '@/lib/animations'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

// ─── Single timeline entry ────────────────────────────────────────────────────
function TimelineEntry({
  entry,
  isLast,
}: {
  entry: (typeof EXPERIENCE_ENTRIES)[number]
  isLast: boolean
}) {
  const isIntern = entry.type === 'Intern · Previously'
  const dotOpacity = isIntern ? 0.5 : 1

  return (
    <ScrollReveal>
      <div className={`relative pl-8 md:pl-10 ${isLast ? '' : 'pb-14'}`}>
        {/* Coloured dot on the timeline line */}
        <span
          className="absolute left-[-5px] top-[6px] w-[10px] h-[10px] rounded-full shrink-0"
          style={{
            backgroundColor: entry.pillarColour,
            opacity: dotOpacity,
          }}
          aria-hidden
        />

        {/* Company name — Syne Bold 20px */}
        <h3 className="font-syne font-bold text-[20px] text-ink m-0 leading-tight">
          {entry.company}
        </h3>

        {/* Role — Satoshi Medium 16px, 80% opacity */}
        <p className="font-satoshi font-medium text-[16px] text-ink/80 mt-0.5 mb-0">
          {entry.role}
        </p>

        {/* Badge pill */}
        <span
          className="inline-block mt-2 px-[10px] py-[3px] rounded-full font-satoshi text-[11px] border"
          style={{
            color: entry.pillarColour,
            borderColor: `${entry.pillarColour}40`,
            backgroundColor: `${entry.pillarColour}10`,
          }}
        >
          {entry.type}
        </span>

        {/* Description — Satoshi Regular 15px, 65% opacity */}
        <p className="font-satoshi text-[15px] text-ink/65 mt-3 mb-0 max-w-[560px]">
          {entry.description}
        </p>

        {/* Bullet points */}
        {entry.bullets.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1.5 list-none p-0 m-0">
            {entry.bullets.map((bullet) => (
              <li
                key={bullet}
                className="font-satoshi text-[14px] text-ink/60 flex gap-2"
              >
                <span className="shrink-0 text-ink/30" aria-hidden>—</span>
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </ScrollReveal>
  )
}

// ─── GitHub stats block ───────────────────────────────────────────────────────
function GitHubStats({ prefersReduced }: { prefersReduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  return (
    <motion.div
      ref={ref}
      variants={prefersReduced ? {} : fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="mt-20"
    >
      {/* Three large stat numbers */}
      <div className="flex gap-12 md:gap-20 flex-wrap">
        {GITHUB_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span
              className="font-syne font-bold text-ink leading-none"
              style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}
            >
              {stat.value}
            </span>
            <span className="font-satoshi text-[14px] text-ink/50">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Contribution graph */}
      <div className="mt-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://ghchart.rshah.org/00C896/SiD-20s"
          alt="GitHub contribution graph for SiD-20s"
          loading="lazy"
          className="w-full max-w-[700px] opacity-90"
          style={{ transition: 'opacity 600ms ease' }}
        />
        <p className="font-satoshi text-[13px] text-ink/40 mt-3">
          @SiD-20s · Contributing to kalaiworks org + personal projects
        </p>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  // GSAP ScrollTrigger: timeline line grows scaleY 0→1 as section scrolls
  useEffect(() => {
    if (prefersReduced) return
    const line = lineRef.current
    const section = sectionRef.current
    if (!line || !section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 md:py-32 px-6 md:px-16 lg:px-24"
    >
      {/* Section header */}
      <div className="mb-16 md:mb-20">
        <span className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40">
          Experience
        </span>
      </div>

      {/* Timeline + entries */}
      <div className="relative">
        {/* Vertical line — scaleY animated by GSAP */}
        <div
          ref={lineRef}
          className="timeline-line absolute left-0 top-0 w-[1px] h-full origin-top"
          style={{ backgroundColor: 'rgba(13,13,13,0.12)' }}
          aria-hidden
        />

        {/* Entries */}
        <div className="flex flex-col">
          {EXPERIENCE_ENTRIES.map((entry, i) => (
            <TimelineEntry
              key={`${entry.company}-${entry.role}`}
              entry={entry}
              isLast={i === EXPERIENCE_ENTRIES.length - 1}
            />
          ))}
        </div>
      </div>

      {/* GitHub stats */}
      <GitHubStats prefersReduced={prefersReduced} />
    </section>
  )
}
