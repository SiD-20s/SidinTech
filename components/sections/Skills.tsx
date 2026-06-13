'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  {
    cat: 'TECH',
    color: '#00A8FF',
    motto: '"Ship Anything"',
    tags: ['Next.js', 'React', 'Node.js', 'FastAPI', 'Python', 'TypeScript', 'Express', 'WebSockets', 'REST APIs', 'System Design'],
    num: '01',
  },
  {
    cat: 'AI / LLM',
    color: '#00C896',
    motto: '"Make it Intelligent"',
    tags: ['LangChain', 'LangGraph', 'RAG Systems', 'Prompt Engineering', 'LLM Optimisation', 'Claude', 'Groq', 'Gemini', 'GPT', 'Chunking Strategies'],
    num: '02',
  },
  {
    cat: 'CLOUD & DEVOPS',
    color: '#9B6DFF',
    motto: '"Make it Scale"',
    tags: ['AWS EC2', 'S3', 'ECS', 'ECR', 'SQS', 'IAM', 'VPC', 'CloudWatch', 'Docker', 'GitHub Actions', 'CI/CD', 'Nginx', 'Redis', 'Elasticsearch'],
    num: '03',
  },
  {
    cat: 'DATA & AUTOMATION',
    color: '#FFB830',
    motto: '"Make it Run"',
    tags: ['Playwright', 'Chromium', 'Browser Automation', 'Pipeline Design', 'Shell Scripting', 'Bash'],
    num: '04',
  },
  {
    cat: 'DESIGN',
    color: '#FF6B6B',
    motto: '"Make it Beautiful"',
    tags: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'User Research', 'Tailwind CSS', 'SCSS', 'Shadcn/UI', 'Storybook', 'Electron'],
    num: '05',
  },
] as const

export default function Skills() {
  const prefersReduced = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const lettersWrapRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<HTMLDivElement[]>([])
  const faintRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<HTMLDivElement[]>([])

  const activeTl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current
    if (!section || !grid || prefersReduced) return

    const letters = letterRefs.current
    const faint = faintRef.current
    const label = labelRef.current

    const buildLetterTimeline = () => {
      const tl = gsap.timeline({ paused: true })

      // Letters drop in one by one
      tl.to(letters, { y: '0%', duration: 0.6, stagger: 0.07, ease: 'power3.out' }, 0)

      // Hold bright
      tl.to({}, { duration: 0.9 })

      // Burn out — letters drop down and out, reverse stagger
      tl.to(letters, {
        y: '110%',
        opacity: 0,
        duration: 0.5,
        stagger: { each: 0.05, from: 'end' },
        ease: 'power2.in',
      })

      // Faint settled version fades in and drifts down into position as letters burn out
      tl.fromTo(
        faint,
        { opacity: 0, y: -10 },
        { opacity: 0.065, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.3'
      )

      return tl
    }

    const ctx = gsap.context(() => {
      // Letters start hidden above
      gsap.set(letters, { y: '-110%', opacity: 1 })
      gsap.set(faint, { opacity: 0, y: -10 })
      gsap.set(label, { opacity: 0 })

      // Grid starts hidden but triggers independently
      gsap.set(grid, { opacity: 0 })
      gsap.set(cellRefs.current, { opacity: 0, y: 12 })
      cellRefs.current.forEach((cell) => {
        if (!cell) return
        gsap.set(cell.querySelector('.cell-cat'), { opacity: 0, x: -10 })
        gsap.set(cell.querySelector('.cell-motto'), { opacity: 0, clipPath: 'inset(0 100% 0 0)' })
        gsap.set(cell.querySelectorAll('.cell-tag'), { opacity: 0, y: 6 })
        gsap.set(cell.querySelector('.cell-num'), { opacity: 0 })
      })

      // ST1 — letter animation only, cosmetic, independent of grid
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          if (activeTl.current) activeTl.current.kill()
          activeTl.current = buildLetterTimeline()
          activeTl.current.play()
        },
        onLeave: () => {
          // Fast scroll — snap letters out, show faint
          if (activeTl.current) activeTl.current.kill()
          gsap.set(letters, { y: '110%', opacity: 0 })
          gsap.set(faint, { opacity: 0.065, y: 0 })
        },
        onLeaveBack: () => {
          // Scrolled back up — reset letters only
          if (activeTl.current) activeTl.current.kill()
          gsap.set(letters, { y: '-110%', opacity: 1 })
          gsap.set(faint, { opacity: 0, y: -10 })
        },
      })

      // Section label fades in alongside the grid — independent of letters
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(label, { opacity: 1, duration: 0.4, ease: 'power2.out' })
        },
      })

      // ST2 — grid entrance, completely independent of letter animation
      ScrollTrigger.create({
        trigger: grid,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(grid, { opacity: 1, duration: 0.5, ease: 'power2.out' })
          gsap.to(cellRefs.current, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: 'power2.out',
          })

          cellRefs.current.forEach((cell, i) => {
            if (!cell) return
            const delay = i * 0.09

            gsap.to(cell.querySelector('.cell-num'), {
              opacity: 0.055, duration: 0.5, delay, ease: 'power2.out',
            })
            gsap.to(cell.querySelector('.cell-cat'), {
              opacity: 1, x: 0, duration: 0.4, delay: delay + 0.05, ease: 'power2.out',
            })
            gsap.to(cell.querySelector('.cell-motto'), {
              opacity: 1, clipPath: 'inset(0 0% 0 0)',
              duration: 0.6, delay: delay + 0.1, ease: 'power3.out',
            })
            gsap.to(cell.querySelectorAll('.cell-tag'), {
              opacity: 1, y: 0,
              duration: 0.3, delay: delay + 0.22,
              stagger: 0.03, ease: 'power2.out',
            })
          })
        },
      })
    }, section)

    return () => {
      if (activeTl.current) activeTl.current.kill()
      ctx.revert()
    }
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative px-6 md:px-16 lg:px-24 py-24 md:py-32"
      style={{ background: '#F0F1F5', overflow: 'visible', position: 'relative' }}
    >
      {/* Zone A — section label + watermark */}
      <div className="relative" style={{ height: '200px' }}>
        {/* Letter wrapper — each letter drops in/out individually */}
        <div
          ref={lettersWrapRef}
          aria-hidden="true"
          className="hidden md:flex font-syne font-extrabold"
          style={{
            alignItems: 'flex-end',
            position: 'absolute',
            left: '-6px',
            top: '36px',
            zIndex: 1,
            overflow: 'visible',
          }}
        >
          {'SKILLS'.split('').map((letter, i) => (
            <div key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
              <div
                ref={(el) => {
                  if (el) letterRefs.current[i] = el
                }}
                style={{
                  fontSize: 'clamp(100px, 16vw, 180px)',
                  fontWeight: 800,
                  color: '#1A1A2E',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  display: 'inline-block',
                  transform: prefersReduced ? 'translateY(0)' : 'translateY(-110%)',
                  opacity: prefersReduced ? 0 : 1,
                  willChange: 'transform, opacity',
                }}
              >
                {letter}
              </div>
            </div>
          ))}
        </div>

        {/* Faint settled version — always present, opacity controlled by GSAP */}
        <div
          ref={faintRef}
          aria-hidden="true"
          className="hidden md:block font-syne font-extrabold"
          style={{
            position: 'absolute',
            left: '-6px',
            top: 'auto',
            bottom: '-16px',
            fontSize: 'clamp(100px, 16vw, 180px)',
            fontWeight: 800,
            color: 'rgba(26,26,46,1)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            opacity: prefersReduced ? 0.065 : 0,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            willChange: 'opacity',
          }}
        >
          SKILLS
        </div>

        {/* Section label */}
        <div
          ref={labelRef}
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/35 relative z-[1]"
          style={{ marginBottom: '28px', willChange: 'opacity', opacity: prefersReduced ? 1 : 0 }}
        >
          06 — Skills
        </div>
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 relative rounded-[14px] overflow-hidden"
        style={{ zIndex: 2, gap: '1px', background: 'rgba(13,13,13,0.1)', border: '1px solid rgba(13,13,13,0.1)', willChange: 'opacity', opacity: prefersReduced ? 1 : 0 }}
      >
        {SKILLS.map((s, i) => {
          const isWide = i === 4
          return (
            <div
              key={s.cat}
              ref={(el) => {
                if (el) cellRefs.current[i] = el
              }}
              className={`relative overflow-hidden transition-colors duration-[350ms] ${
                isWide
                  ? 'col-span-full grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-10 items-start'
                  : ''
              }`}
              style={{
                background: 'rgba(240,241,245,0.97)',
                padding: isWide ? '28px 32px' : '24px 22px 20px',
                minHeight: isWide ? '100px' : '200px',
              }}
              onMouseEnter={(e) => {
                if (prefersReduced) return
                ;(e.currentTarget as HTMLElement).style.background = `${s.color}15`
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(240,241,245,0.97)'
              }}
            >
              {/* Background number */}
              <div
                className="cell-num font-syne font-extrabold absolute pointer-events-none select-none leading-none"
                style={{
                  bottom: isWide ? '-12px' : '-8px',
                  right: '12px',
                  fontSize: isWide ? '96px' : '72px',
                  color: s.color,
                  opacity: prefersReduced ? 0.055 : 0,
                  willChange: 'opacity',
                }}
              >
                {s.num}
              </div>

              {/* Left content block */}
              <div>
                {/* Category */}
                <div
                  className="cell-cat flex items-center gap-1.5"
                  style={{
                    marginBottom: '8px',
                    opacity: prefersReduced ? 1 : 0,
                    transform: prefersReduced ? 'none' : 'translateX(-10px)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <div
                    className="w-[6px] h-[6px] rounded-full shrink-0"
                    style={{ background: s.color }}
                  />
                  <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: s.color }}>
                    {s.cat}
                  </span>
                </div>

                {/* Motto */}
                <div
                  className="cell-motto font-syne font-extrabold text-ink"
                  style={{
                    fontSize: isWide ? '22px' : '16px',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    marginBottom: isWide ? 0 : '14px',
                    opacity: prefersReduced ? 1 : 0,
                    clipPath: prefersReduced ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                    willChange: 'opacity, clip-path',
                  }}
                >
                  {s.motto}
                </div>
              </div>

              {/* Tags */}
              <div className="cell-tags">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="cell-tag inline-block text-[10px] rounded-full mr-[3px] mt-[3px] cursor-default transition-[background,transform] duration-150"
                    style={{
                      padding: '4px 11px',
                      border: `1px solid ${s.color}44`,
                      color: s.color,
                      background: `${s.color}0d`,
                      opacity: prefersReduced ? 1 : 0,
                      transform: prefersReduced ? 'none' : 'translateY(6px)',
                      willChange: 'transform, opacity',
                    }}
                    onMouseEnter={(e) => {
                      if (prefersReduced) return
                      const el = e.target as HTMLElement
                      el.style.background = `${s.color}28`
                      el.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.target as HTMLElement
                      el.style.background = `${s.color}0d`
                      el.style.transform = 'scale(1)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
