'use client'

import { useRef, useState } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { StackBadge } from '@/components/ui/StackBadge'
import { PROJECTS, QUICK_GRID_PROJECTS } from '@/lib/constants'
import { EASE_OUT } from '@/lib/animations'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const SMOOTH: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

// ── Shared data type ──────────────────────────────────────────────────────────

type GridItemData = {
  title: string
  image: string
  categoryTags: string
  stack: readonly string[]
  arrowColour: string
  links: readonly { label: string; href: string }[]
  clientNote?: string | null
  overlayDesc: string
  overlayTags: string[]
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  prefersReduced,
  delay,
}: {
  project: GridItemData
  prefersReduced: boolean
  delay: number
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: false, margin: '0px 0px -40px 0px' })
  const view = isInView ? 'visible' : 'hidden'
  const [hovered, setHovered] = useState(false)

  const cardVariants: Variants = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 40, transition: { duration: 0 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: SMOOTH } },
  }

  return (
    <motion.article
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={view}
      style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
    >
      {/* ── Image block with hover overlay ─────────────────────────── */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: 12, marginBottom: 16,
          aspectRatio: '16/9', cursor: 'pointer',
          background: '#E8E9ED',
        }}
        data-cursor="view"
      >
        {/* Image with scale on hover */}
        <motion.div
          className="w-full h-full"
          whileHover={prefersReduced ? {} : { scale: 1.04 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Overlay — fades in on hover */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(10,10,15,0.88)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 400ms cubic-bezier(0.16,1,0.3,1)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: 24,
            pointerEvents: 'none',
          }}
        >
          {/* Row 1: arrow + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{
              fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)',
              fontSize: 18, color: project.arrowColour, flexShrink: 0,
            }} aria-hidden>
              →
            </span>
            <span style={{
              fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)',
              fontWeight: 700, fontSize: 22, color: '#fff', lineHeight: 1.1,
            }}>
              {project.title}
            </span>
          </div>

          {/* Row 2: description */}
          {project.overlayDesc && (
            <p style={{
              fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
              fontSize: 13, color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6, margin: '0 0 14px',
            }}>
              {project.overlayDesc}
            </p>
          )}

          {/* Row 3: tag pills */}
          {project.overlayTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.overlayTags.map((tag) => (
                <span key={tag} style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                  fontSize: 10, padding: '3px 10px', borderRadius: 100,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Below image ────────────────────────────────────────────── */}

      {/* Category tags */}
      <p style={{
        fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
        fontSize: 12, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'rgba(13,13,13,0.4)',
        margin: '0 0 8px',
      }}>
        {project.categoryTags}
      </p>

      {/* Arrow + Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
        <span
          style={{
            fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)',
            fontWeight: 700, fontSize: 28, lineHeight: 1,
            color: project.arrowColour, flexShrink: 0, marginTop: '0.05em',
          }}
          aria-hidden
        >
          →
        </span>
        <h3 style={{
          fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)',
          fontWeight: 700, fontSize: 28, color: '#0D0D0D',
          margin: 0, lineHeight: 1.1,
        }}>
          {project.title}
        </h3>
      </div>

      {/* Stack badges */}
      {project.stack.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {project.stack.map((badge) => (
            <StackBadge key={badge} label={badge} />
          ))}
        </div>
      )}

      {/* Links */}
      {project.links.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {project.links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                fontWeight: 500, fontSize: 13,
                color: 'rgba(13,13,13,0.5)', textDecoration: 'none',
              }}
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
        <p style={{
          fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
          fontSize: 11, color: 'rgba(13,13,13,0.4)', marginTop: 6,
        }}>
          {project.clientNote}
        </p>
      )}
    </motion.article>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function Projects() {
  const prefersReduced = usePrefersReducedMotion()

  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: false, margin: '0px 0px -40px 0px' })
  const hView = isHeaderInView ? 'visible' : 'hidden'

  const labelVariants: Variants = {
    hidden: { opacity: prefersReduced ? 1 : 0, transition: { duration: 0 } },
    visible: { opacity: 1, transition: { duration: 0.6, delay: 0, ease: SMOOTH } },
  }

  const line1Variants: Variants = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 60, x: prefersReduced ? 0 : -30, transition: { duration: 0 } },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.9, delay: 0, ease: SMOOTH } },
  }

  const line2Variants: Variants = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 60, x: prefersReduced ? 0 : -30, transition: { duration: 0 } },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.9, delay: 0.12, ease: SMOOTH } },
  }

  const allItems: GridItemData[] = [
    // ── PROJECTS[1] — CodeLens AI
    {
      title: PROJECTS[1].title,
      image: PROJECTS[1].image,
      categoryTags: PROJECTS[1].categoryTags,
      stack: PROJECTS[1].stack,
      arrowColour: PROJECTS[1].arrowColour,
      links: PROJECTS[1].links as readonly { label: string; href: string }[],
      clientNote: PROJECTS[1].clientNote,
      overlayDesc: 'A browser-based codebase onboarding copilot. Submit a GitHub URL — get an interactive architecture map, a personalised learning path adapted to your skill level, and a RAG-powered chat where every answer cites exact file paths and line numbers. Built solo to production-grade standards.',
      overlayTags: ['Next.js', 'FastAPI', 'Celery', 'Redis', 'LangChain', 'Tree-sitter', 'React Flow'],
    },
    // ── PROJECTS[2] — AI Asset Management System
    {
      title: PROJECTS[2].title,
      image: PROJECTS[2].image,
      categoryTags: PROJECTS[2].categoryTags,
      stack: PROJECTS[2].stack,
      arrowColour: PROJECTS[2].arrowColour,
      links: PROJECTS[2].links as readonly { label: string; href: string }[],
      clientNote: PROJECTS[2].clientNote,
      overlayDesc: 'An AI-driven asset management and search system for large-scale marketing photoshoots. Structured model inference instead of embeddings — covering the entire creative generation lifecycle from asset ingestion to intelligent retrieval.',
      overlayTags: ['Electron', 'Node.js', 'Python', 'FastAPI', 'React'],
    },
    // ── PROJECTS[3] — DevOps Habit Tracker
    {
      title: PROJECTS[3].title,
      image: PROJECTS[3].image,
      categoryTags: PROJECTS[3].categoryTags,
      stack: PROJECTS[3].stack,
      arrowColour: PROJECTS[3].arrowColour,
      links: PROJECTS[3].links as readonly { label: string; href: string }[],
      clientNote: PROJECTS[3].clientNote,
      overlayDesc: 'A Habit Tracker application integrated into a complete CI/CD pipeline — Docker containerisation, GitHub Actions, AWS deployment, shell scripting, and automated delivery from commit to production.',
      overlayTags: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS', 'GitHub Actions'],
    },
    // ── Quick grid
    {
      title: QUICK_GRID_PROJECTS[0].title,
      image: QUICK_GRID_PROJECTS[0].image,
      categoryTags: QUICK_GRID_PROJECTS[0].tags,
      stack: [],
      arrowColour: '#00A8FF',
      links: [{ label: 'GitHub →', href: QUICK_GRID_PROJECTS[0].link }],
      clientNote: null,
      overlayDesc: 'Secure real-time chat with Socket.io and JWT authentication.',
      overlayTags: [],
    },
    {
      title: QUICK_GRID_PROJECTS[1].title,
      image: QUICK_GRID_PROJECTS[1].image,
      categoryTags: QUICK_GRID_PROJECTS[1].tags,
      stack: [],
      arrowColour: '#9B6DFF',
      links: [{ label: 'GitHub →', href: QUICK_GRID_PROJECTS[1].link }],
      clientNote: null,
      overlayDesc: 'Upload, encrypt, and send files directly via email.',
      overlayTags: [],
    },
    {
      title: QUICK_GRID_PROJECTS[2].title,
      image: QUICK_GRID_PROJECTS[2].image,
      categoryTags: QUICK_GRID_PROJECTS[2].tags,
      stack: [],
      arrowColour: '#FF6B6B',
      links: [{ label: 'GitHub →', href: QUICK_GRID_PROJECTS[2].link }],
      clientNote: null,
      overlayDesc: 'Fashion store with PayPal, admin dashboard and order tracking.',
      overlayTags: [],
    },
  ]

  return (
    <section id="work">
      <div className="px-6 md:px-16 lg:px-24 pt-24 md:pt-32 pb-24 md:pb-32">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div ref={headerRef} style={{ marginBottom: 64 }}>
          <motion.p
            variants={labelVariants}
            initial="hidden"
            animate={hView}
            style={{
              fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '2px',
              color: 'rgba(13,13,13,0.35)', margin: '0 0 16px',
            }}
          >
            03 — Projects
          </motion.p>

          <div style={{ overflow: 'hidden' }}>
            <motion.div variants={line1Variants} initial="hidden" animate={hView} style={{ willChange: 'transform, opacity' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)', fontWeight: 700, fontSize: 'clamp(64px, 10vw, 120px)', color: '#0D0D0D', lineHeight: 0.92, letterSpacing: '-3px' }}>
                Selected
              </span>
            </motion.div>
            <motion.div variants={line2Variants} initial="hidden" animate={hView} style={{ willChange: 'transform, opacity' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)', fontWeight: 700, fontSize: 'clamp(64px, 10vw, 120px)', color: '#0D0D0D', lineHeight: 0.92, letterSpacing: '-3px' }}>
                Work
              </span>
            </motion.div>
          </div>
        </div>

        {/* ── Unified 2-col grid ──────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 'clamp(24px, 3vw, 40px)' }}
        >
          {allItems.map((project, i) => (
            <ProjectCard
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
