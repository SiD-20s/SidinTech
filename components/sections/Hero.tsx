'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from '@phosphor-icons/react'
import { heroLine, fadeUp, EASE_OUT } from '@/lib/animations'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// Each string maps to exactly one visual line of the headline.
// Font size is clamped so the longest line ("Engineer who thinks")
// fits inside the content column at all desktop viewports.
const HEADLINE_LINES = ['Siddharth B', 'Engineer who thinks', 'beyond the code.']

const SUBTEXT =
  'Builder who understands your business model,\nyour users, and your market —\nthen ships the product to serve all three.'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  // Fade scroll indicator out as hero scrolls away (first 20 % of section travel)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-24"
    >
      <div className="w-full flex flex-col gap-10">

        {/* ── Headline ─────────────────────────────────────────────────────── */}
        {/* Each line gets its own motion element (stagger via delay baked into
            heroLine). No overflow-hidden needed — the y:60→0 slide reads as a
            reveal without clipping. */}
        <h1 className="m-0 font-syne font-extrabold leading-[1.05] text-ink">
          {HEADLINE_LINES.map((line, i) => (
            <motion.span
              key={line}
              className="block will-change-transform"
              style={{ fontSize: 'clamp(36px, 4.8vw, 70px)' }}
              variants={prefersReduced ? {} : heroLine(i)}
              initial="hidden"
              animate="visible"
            >
              {line}
            </motion.span>
          ))}
        </h1>

        {/* ── Subtext + CTAs — left 60 % on desktop ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-3 flex flex-col gap-8">

            <motion.p
              className="font-satoshi text-[18px] leading-[1.7] text-ink/65 whitespace-pre-line"
              variants={prefersReduced ? {} : fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: prefersReduced ? 0 : 0.35, duration: 0.5, ease: EASE_OUT }}
            >
              {SUBTEXT}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={prefersReduced ? {} : fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: prefersReduced ? 0 : 0.55, duration: 0.5, ease: EASE_OUT }}
            >
              {/* Outlined pill → fills dark on hover */}
              <a
                href="#work"
                data-cursor="link"
                className="
                  inline-flex items-center justify-center rounded-full
                  border border-ink px-7 py-[14px]
                  font-satoshi font-medium text-[15px] text-ink
                  hover:bg-ink hover:text-canvas transition-colors duration-200
                "
              >
                See My Work
              </a>

              {/* Filled dark pill → turns electric blue on hover */}
              <a
                href="#contact"
                data-cursor="link"
                className="
                  inline-flex items-center justify-center rounded-full
                  bg-ink px-7 py-[14px]
                  font-satoshi font-medium text-[15px] text-canvas
                  hover:bg-tech transition-colors duration-200
                "
              >
                Let&apos;s Talk
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────────── */}
      {/* Outer: delays mount-fade by 1.5 s                                       */}
      {/* Inner: binds scroll progress so it fades as the user scrolls away       */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: prefersReduced ? 0 : 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        aria-hidden
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          style={{ opacity: indicatorOpacity }}
        >
          <span className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40">
            Scroll to Explore
          </span>
          <motion.div
            animate={prefersReduced ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={16} weight="regular" className="text-ink/40" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
