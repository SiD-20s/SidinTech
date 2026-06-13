'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { StackBadge } from '@/components/ui/StackBadge'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PROJECTS, QUICK_GRID_PROJECTS } from '@/lib/constants'
import { fadeUp, EASE_OUT } from '@/lib/animations'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// ─── Layout 1: FinSight AI — full-screen hero block ──────────────────────────

function HeroProject({
  project,
  prefersReduced,
}: {
  project: (typeof PROJECTS)[number]
  prefersReduced: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  // Ken Burns: image scales 1.05 → 1.0 as the section scrolls into view
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const imageScale = useTransform(scrollYProgress, [0, 1], prefersReduced ? [1, 1] : [1.05, 1.0])

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
      data-cursor="view"
    >
      {/* Full-bleed background image with Ken Burns scale */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ scale: imageScale }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
      />

      {/* Project info — bottom-left, white text */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-6 md:px-16 lg:px-24 pb-12 md:pb-16"
        variants={prefersReduced ? {} : fadeUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
      >
        {/* Category tags */}
        <p className="font-satoshi text-[11px] uppercase tracking-widest text-white/60 mb-4 m-0">
          {project.categoryTags}
        </p>

        {/* Arrow + Title */}
        <div className="flex items-start gap-3 mb-4">
          <span
            className="font-syne font-extrabold leading-none shrink-0 mt-[0.05em]"
            style={{ fontSize: 'clamp(48px, 7vw, 96px)', color: '#00C896' }}
            aria-hidden
          >
            →
          </span>
          <h2
            className="font-syne font-extrabold text-white m-0 leading-none"
            style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
          >
            {project.title}
          </h2>
        </div>

        {/* Headline */}
        <p
          className="font-satoshi text-[20px] text-white/70 m-0 mb-5"
          style={{ maxWidth: 600 }}
        >
          {project.headline}
        </p>

        {/* Stack badges — white variant */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.stack.map((badge) => (
            <StackBadge key={badge} label={badge} variant="white" />
          ))}
        </div>

        {/* Links */}
        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-6">
            {project.links.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-satoshi font-medium text-[14px] text-white"
                whileHover={prefersReduced ? {} : { color: '#00C896' }}
                transition={{ duration: 0.15 }}
                data-cursor="link"
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ─── Layout 2: grid item — used for both main projects and quick projects ─────

type GridItemData = {
  title: string
  image: string
  categoryTags: string
  headline: string
  stack: readonly string[]
  arrowColour: string
  links: readonly { label: string; href: string }[]
  clientNote?: string | null
}

function GridProject({
  project,
  prefersReduced,
  delay,
}: {
  project: GridItemData
  prefersReduced: boolean
  delay: number
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  return (
    <motion.article
      ref={ref}
      variants={prefersReduced ? {} : fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: prefersReduced ? 0 : delay }}
    >
      {/* Image — 4:3, radius 12px, hover scale */}
      <div
        className="overflow-hidden rounded-xl bg-[#E8E9ED] w-full"
        style={{ aspectRatio: '4/3' }}
        data-cursor="view"
      >
        <motion.div
          className="w-full h-full"
          whileHover={prefersReduced ? {} : { scale: 1.03 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Category tags */}
      <p className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40 mt-5 mb-0">
        {project.categoryTags}
      </p>

      {/* Arrow + Title */}
      <div className="flex items-start gap-2 mt-2">
        <span
          className="font-syne font-extrabold leading-none shrink-0 mt-[0.05em] text-[24px]"
          style={{ color: project.arrowColour }}
          aria-hidden
        >
          →
        </span>
        <h3 className="font-syne font-extrabold text-ink m-0 leading-tight text-[24px]">
          {project.title}
        </h3>
      </div>

      {/* Headline */}
      <p className="font-satoshi text-[14px] text-ink/60 mt-2 mb-0">
        {project.headline}
      </p>

      {/* Stack badges */}
      {project.stack.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {project.stack.map((badge) => (
            <StackBadge key={badge} label={badge} />
          ))}
        </div>
      )}

      {/* Links */}
      {project.links.length > 0 && (
        <div className="flex flex-wrap gap-5 mt-3">
          {project.links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-satoshi font-medium text-[13px] text-ink"
              whileHover={prefersReduced ? {} : { color: project.arrowColour }}
              transition={{ duration: 0.15 }}
              data-cursor="link"
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      )}

      {project.clientNote && (
        <p className="font-satoshi text-[11px] text-ink/40 mt-2 mb-0">
          {project.clientNote}
        </p>
      )}
    </motion.article>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function Projects() {
  const prefersReduced = usePrefersReducedMotion()

  const heroProject = PROJECTS[0]

  // Normalise QUICK_GRID_PROJECTS to the GridItemData shape
  const quickAsGrid: GridItemData[] = QUICK_GRID_PROJECTS.map((q) => ({
    title: q.title,
    image: q.image,
    categoryTags: q.tags,
    headline: '',
    stack: [],
    arrowColour: '#0D0D0D',
    links: [{ label: 'GitHub →', href: q.link }],
    clientNote: null,
  }))

  // All grid items: PROJECTS[1–3] + quick projects
  const gridItems: GridItemData[] = [
    ...PROJECTS.slice(1).map((p) => ({
      title: p.title,
      image: p.image,
      categoryTags: p.categoryTags,
      headline: p.headline,
      stack: p.stack,
      arrowColour: p.arrowColour,
      links: p.links as readonly { label: string; href: string }[],
      clientNote: p.clientNote,
    })),
    ...quickAsGrid,
  ]

  return (
    <section id="work">

      {/* ── Section header — sits above the full-screen FinSight block ── */}
      <div className="px-6 md:px-16 lg:px-24 pt-24 md:pt-32 pb-10">
        <ScrollReveal>
          <span className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40">
            Selected Work
          </span>
        </ScrollReveal>
      </div>

      {/* ── Layout 1: FinSight AI — full-screen hero ─────────────────── */}
      <HeroProject project={heroProject} prefersReduced={prefersReduced} />

      {/* ── Layout 2: unified 2-column grid ──────────────────────────── */}
      {/* 80px gap desktop / 48px mobile between hero block and grid     */}
      <div className="px-6 md:px-16 lg:px-24 mt-12 md:mt-20 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gridItems.map((project, i) => (
            <GridProject
              key={project.title}
              project={project}
              prefersReduced={prefersReduced}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>

    </section>
  )
}
