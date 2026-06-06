'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { StackBadge } from '@/components/ui/StackBadge'
import { PROJECTS, QUICK_GRID_PROJECTS } from '@/lib/constants'
import { fadeUp, EASE_OUT } from '@/lib/animations'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// Arrow slides 6px right when the title row is hovered
const ARROW_VARIANTS = {
  rest: { x: 0 },
  hover: {
    x: 6,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
}

// ─── Single main project entry ───────────────────────────────────────────────

function ProjectEntry({
  project,
  prefersReduced,
}: {
  project: (typeof PROJECTS)[number]
  prefersReduced: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  // Trigger slightly before the element reaches the bottom of the viewport
  const isInView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  const entryVariants = prefersReduced ? {} : fadeUp
  // Image animates from scale 0.98 → 1 on the same trigger as the entry
  const imageScale = prefersReduced
    ? { scale: 1, opacity: 1 }
    : isInView
    ? { scale: 1, opacity: 1 }
    : { scale: 0.97, opacity: 0 }

  return (
    <motion.article
      ref={ref}
      variants={entryVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="w-full"
    >
      {/* 1. Full-width image placeholder — 16:9, bg-[#E8E9ED], radius 16px */}
      <div className="overflow-hidden rounded-2xl w-full" data-cursor="view">
        <motion.div
          className="aspect-video w-full bg-[#E8E9ED]"
          animate={imageScale}
          whileHover={prefersReduced ? {} : { scale: 1.03 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        />
      </div>

      {/* 2. Category tags — 11px Satoshi uppercase, ink 40 % */}
      <p className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40 mt-5 mb-0">
        {project.categoryTags}
      </p>

      {/* 3. Arrow → in pillar colour + title in Syne Bold
              Hovering the entire row moves the arrow 6px right */}
      <motion.div
        className="flex items-start gap-2 mt-2"
        initial="rest"
        whileHover="hover"
        animate="rest"
        data-cursor="view"
      >
        <motion.span
          variants={ARROW_VARIANTS}
          className="inline-block font-syne font-extrabold leading-none will-change-transform shrink-0 mt-[0.1em]"
          style={{ color: project.arrowColour, fontSize: 'clamp(28px, 3vw, 48px)' }}
          aria-hidden
        >
          →
        </motion.span>
        <h2
          className="font-syne font-extrabold text-ink m-0 leading-tight"
          style={{ fontSize: 'clamp(28px, 3vw, 48px)' }}
        >
          {project.title}
        </h2>
      </motion.div>

      {/* 4. Headline subline — Satoshi 16px, ink 60 % */}
      <p className="font-satoshi text-[16px] text-ink/60 mt-3 mb-0 max-w-[640px]">
        {project.headline}
      </p>

      {/* 5. Description — Satoshi 15px, ink 55 %, max-width 640px */}
      <p className="font-satoshi text-[15px] text-ink/55 mt-3 mb-0 max-w-[640px]">
        {project.description}
      </p>

      {/* 6. Stack badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {project.stack.map((badge) => (
          <StackBadge key={badge} label={badge} />
        ))}
      </div>

      {/* 7. Links — Satoshi Medium 14px, hover → pillar colour */}
      {project.links.length > 0 && (
        <div className="flex flex-wrap gap-6 mt-4">
          {project.links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-satoshi font-medium text-[14px] text-ink"
              whileHover={prefersReduced ? {} : { color: project.arrowColour }}
              transition={{ duration: 0.15 }}
              data-cursor="link"
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      )}

      {/* 8. Client note (only where applicable) */}
      {project.clientNote && (
        <p className="font-satoshi text-[11px] text-ink/40 mt-2 mb-0">
          {project.clientNote}
        </p>
      )}
    </motion.article>
  )
}

// ─── Quick grid item — image + tags + title only ──────────────────────────────

function QuickGridItem({
  item,
  prefersReduced,
}: {
  item: (typeof QUICK_GRID_PROJECTS)[number]
  prefersReduced: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  return (
    <motion.a
      ref={ref}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      variants={prefersReduced ? {} : fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="block"
      data-cursor="view"
    >
      {/* Image — hover scale 1.03 */}
      <div className="overflow-hidden rounded-xl">
        <motion.div
          className="aspect-video w-full bg-[#E8E9ED]"
          whileHover={prefersReduced ? {} : { scale: 1.03 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        />
      </div>

      {/* Tags */}
      <p className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40 mt-3 mb-0">
        {item.tags}
      </p>

      {/* Arrow + title */}
      <p className="font-syne font-bold text-[20px] text-ink mt-1 mb-0 flex items-center gap-2">
        <span className="text-ink/30" aria-hidden>→</span>
        {item.title}
      </p>
    </motion.a>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function Projects() {
  const prefersReduced = usePrefersReducedMotion()

  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-16 lg:px-24">

      {/* Section header */}
      <div className="mb-16 md:mb-20">
        <span className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40">
          Selected Work
        </span>
      </div>

      {/* Main projects — gap 56px mobile / 80px desktop */}
      <div className="flex flex-col gap-14 md:gap-20">
        {PROJECTS.map((project) => (
          <ProjectEntry
            key={project.title}
            project={project}
            prefersReduced={prefersReduced}
          />
        ))}
      </div>

      {/* ── More Work quick grid ───────────────────────────────────────── */}
      {/* 48px gap above, MORE WORK label, 3-col desktop / 1-col mobile   */}
      <div className="mt-12 md:mt-16 mb-8">
        <span className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40">
          More Work
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {QUICK_GRID_PROJECTS.map((item) => (
          <QuickGridItem
            key={item.title}
            item={item}
            prefersReduced={prefersReduced}
          />
        ))}
      </div>
    </section>
  )
}
