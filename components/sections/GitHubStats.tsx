'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// roundRect polyfill — older browsers / some canvas implementations lack it
function ensureRoundRect(ctx: CanvasRenderingContext2D) {
  if (typeof ctx.roundRect === 'function') return
  ctx.roundRect = function (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    this.beginPath()
    this.moveTo(x + r, y)
    this.arcTo(x + w, y, x + w, y + h, r)
    this.arcTo(x + w, y + h, x, y + h, r)
    this.arcTo(x, y + h, x, y, r)
    this.arcTo(x, y, x + w, y, r)
    this.closePath()
    return this
  }
}

const BIG_STATS = [
  { value: 673, suffix: '', label: 'contributions in the last year', subtext: '@SiD-20s' },
  { value: 93, suffix: '%', label: 'pure commit ratio', subtext: 'no filler PRs' },
  { value: 2, suffix: '', label: 'AI products shipped', subtext: 'production-grade' },
] as const

const HEAT_COLOURS = ['#EBEDF2', '#C9F0E2', '#7FDDC0', '#34C796', '#00C896']

const MONTH_LABELS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']

const WEEKS = 52
const DAYS = 7
const GAP = 2
const LABEL_HEIGHT = 18

// deterministic pseudo-random intensity grid so it's stable across renders
function buildIntensityGrid(): number[][] {
  let seed = 42
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const grid: number[][] = []
  for (let w = 0; w < WEEKS; w++) {
    const col: number[] = []
    for (let d = 0; d < DAYS; d++) {
      const r = rand()
      let level = 0
      if (r > 0.85) level = 4
      else if (r > 0.7) level = 3
      else if (r > 0.5) level = 2
      else if (r > 0.3) level = 1
      col.push(level)
    }
    grid.push(col)
  }
  return grid
}

export default function GitHubStats() {
  const prefersReduced = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([])
  const numbersRowRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heatmapWrapRef = useRef<HTMLDivElement>(null)
  const labelRowRef = useRef<HTMLDivElement>(null)
  const intensityGridRef = useRef<number[][]>(buildIntensityGrid())
  const countTimers = useRef<ReturnType<typeof setInterval>[]>([])
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ensureRoundRect(ctx)

    const dpr = window.devicePixelRatio || 1

    const MAX_CELL = 13

    const getCellSize = (width: number) => {
      const rawCellSize = Math.floor((width - 8 - (WEEKS - 1) * GAP) / WEEKS)
      return Math.min(rawCellSize, MAX_CELL)
    }

    const sizeCanvas = () => {
      const width = section.offsetWidth - 96 // 48px padding each side
      const cellSize = getCellSize(width)
      const height = LABEL_HEIGHT + DAYS * cellSize + (DAYS - 1) * GAP
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    sizeCanvas()

    const clearCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const drawMonthLabels = (cellSize: number) => {
      ctx.fillStyle = 'rgba(13,13,13,0.4)'
      ctx.font = '11px var(--font-satoshi-var, Satoshi, sans-serif)'
      ctx.textBaseline = 'top'
      MONTH_LABELS.forEach((label, i) => {
        const weekIndex = Math.round((i / MONTH_LABELS.length) * WEEKS)
        const x = weekIndex * (cellSize + GAP)
        ctx.fillText(label, x, 0)
      })
    }

    const drawColumn = (weekIndex: number, cellSize: number) => {
      const x = weekIndex * (cellSize + GAP)
      const grid = intensityGridRef.current

      for (let d = 0; d < DAYS; d++) {
        const y = LABEL_HEIGHT + d * (cellSize + GAP)
        const level = grid[weekIndex][d]
        ctx.fillStyle = HEAT_COLOURS[level]
        ctx.beginPath()
        ctx.roundRect(x, y, cellSize, cellSize, 2)
        ctx.fill()
      }
    }

    const drawFullGrid = () => {
      const width = canvas.width / dpr
      const cellSize = getCellSize(width)
      drawMonthLabels(cellSize)
      for (let w = 0; w < WEEKS; w++) drawColumn(w, cellSize)
    }

    const animateHeatmap = () => {
      const width = canvas.width / dpr
      const cellSize = getCellSize(width)
      drawMonthLabels(cellSize)
      let week = 0
      const step = () => {
        if (week >= WEEKS) return
        drawColumn(week, cellSize)
        week++
        requestAnimationFrame(step)
      }
      step()
    }

    const resetCanvas = () => {
      clearCanvas()
    }

    if (prefersReduced) {
      drawFullGrid()
      return
    }

    // ─── Count-up animation ──────────────────────────────────────────────
    const runCountUps = () => {
      countTimers.current.forEach((t) => clearInterval(t))
      countTimers.current = []

      BIG_STATS.forEach((stat, i) => {
        const el = numberRefs.current[i]
        if (!el) return

        const duration = 1400
        const stepTime = 16
        const steps = Math.ceil(duration / stepTime)
        let current = 0
        const increment = stat.value / steps

        const timer = setInterval(() => {
          current += increment
          if (current >= stat.value) {
            current = stat.value
            clearInterval(timer)
          }
          el.textContent = `${Math.round(current)}${stat.suffix}`
        }, stepTime)

        countTimers.current.push(timer)
      })
    }

    const resetCountUps = () => {
      countTimers.current.forEach((t) => clearInterval(t))
      countTimers.current = []
      BIG_STATS.forEach((stat, i) => {
        const el = numberRefs.current[i]
        if (el) el.textContent = `0${stat.suffix}`
      })
    }

    // initialise to 0
    resetCountUps()

    const gctx = gsap.context(() => {
      const numbersTl = gsap.timeline({ paused: true })
      numbersTl.fromTo(
        numbersRowRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )

      const heatmapTl = gsap.timeline({ paused: true })
      heatmapTl.fromTo(
        heatmapWrapRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          onComplete: () => animateHeatmap(),
        }
      )

      const labelTl = gsap.timeline({ paused: true })
      labelTl.fromTo(
        labelRowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      )

      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        end: 'bottom 20%',
        onEnter: () => {
          if (hasPlayedRef.current) return
          hasPlayedRef.current = true
          numbersTl.play()
          runCountUps()
          heatmapTl.play()
          labelTl.play()
        },
        onLeaveBack: () => {
          hasPlayedRef.current = false
          numbersTl.reverse()
          heatmapTl.reverse()
          labelTl.reverse()
          resetCountUps()
          resetCanvas()
        },
      })
    }, section)

    const handleResize = () => {
      sizeCanvas()
      if (hasPlayedRef.current) drawFullGrid()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      gctx.revert()
      window.removeEventListener('resize', handleResize)
      countTimers.current.forEach((t) => clearInterval(t))
    }
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="github"
      className="relative"
      style={{ background: '#F0F1F5', padding: '40px 48px 80px' }}
    >
      {/* Section label */}
      <div style={{ marginBottom: '28px' }}>
        <span className="font-satoshi text-[11px] uppercase tracking-[0.1em] text-ink/40">
          05 — Github
        </span>
      </div>

      {/* Big numbers row */}
      <div
        ref={numbersRowRef}
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ willChange: 'transform, opacity', marginBottom: '40px', maxWidth: '780px' }}
      >
        {BIG_STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 py-6 md:py-0"
            style={{
              borderLeft: i > 0 ? '1px solid rgba(26,26,46,0.18)' : 'none',
              minHeight: i > 0 ? '80px' : undefined,
              paddingLeft: i > 0 ? 'clamp(16px, 2.5vw, 32px)' : 0,
              paddingRight: 'clamp(16px, 2.5vw, 32px)',
            }}
          >
            <span
              ref={(el) => {
                numberRefs.current[i] = el
              }}
              className="font-syne text-ink leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              {prefersReduced ? `${stat.value}${stat.suffix}` : `0${stat.suffix}`}
            </span>
            <span className="font-satoshi text-[14px] text-ink/50">{stat.label}</span>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: 'rgba(26,26,46,0.28)',
                marginTop: '4px',
              }}
            >
              {stat.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div ref={heatmapWrapRef} style={{ willChange: 'transform, opacity' }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
        </div>
        <p className="font-satoshi text-[13px] text-ink/40" style={{ marginTop: '32px', marginBottom: '12px' }}>
          activity · Jun 2025 — May 2026
        </p>
      </div>

      {/* Legend + credit */}
      <div ref={labelRowRef} className="flex flex-wrap items-center justify-between gap-4 mt-8" style={{ willChange: 'opacity' }}>
        <div className="flex items-center gap-2">
          <span className="font-satoshi text-[12px] text-ink/40">Less</span>
          <div className="flex gap-1">
            {HEAT_COLOURS.map((colour) => (
              <span
                key={colour}
                className="block"
                style={{ width: 11, height: 11, borderRadius: 2, background: colour }}
              />
            ))}
          </div>
          <span className="font-satoshi text-[12px] text-ink/40">More</span>
        </div>

        <p className="font-satoshi text-[13px] text-ink/40">
          @SiD-20s · Contributing to kalaiworks org + personal projects
        </p>
      </div>
    </section>
  )
}
