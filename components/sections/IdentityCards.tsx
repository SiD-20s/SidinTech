'use client'

import { useEffect, useRef } from 'react'
import { Code, ChartLine, PaintBrush, Lightbulb, Buildings } from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PillarBadge } from '@/components/ui/PillarBadge'
import { IDENTITY_CARDS } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

// ── Constants ─────────────────────────────────────────────────────────────────

const COLOURS = ['#00A8FF', '#00C896', '#9B6DFF', '#FFB830', '#FF6B6B']

const SEG_PATHS = [
  'M 720 30  C 900 30  1150 80  1150 140',
  'M 1150 140 C 1100 230 300 230 200 320',
  'M 200 320  C 300 420 1050 420 1150 500',
  'M 1150 500 C 1050 580 300 580 200 650',
  'M 200 650  C 350 720 650 720 720 480',
]

const CARD_POSITIONS: React.CSSProperties[] = [
  { top: '8vh',  right: '4%' },
  { top: '30vh', left: '4%' },
  { top: '52vh', right: '4%' },
  { top: '54vh', left: '4%' },
  { top: '35vh', left: '50%' },
]

const CARD_TRANSFORMS = [
  '',
  '',
  '',
  '',
  'translateX(-50%)',
]

// Segment windows: [start, end]
const SEG_WINDOWS: [number, number][] = [
  [0.00, 0.08],
  [0.08, 0.30],
  [0.30, 0.52],
  [0.52, 0.74],
  [0.74, 0.96],
]

// Card activates at 92% of its inbound segment
const ACTIVATE_AT = [0.073, 0.282, 0.502, 0.722, 0.942]
const PAST_AT     = [0.10,  0.32,  0.54,  0.76,  Infinity]

const PILLAR_ICONS: Record<string, (colour: string) => React.ReactNode> = {
  tech:     (c) => <Code       weight="duotone" size={36} color={c} />,
  finance:  (c) => <ChartLine  weight="duotone" size={36} color={c} />,
  design:   (c) => <PaintBrush weight="duotone" size={36} color={c} />,
  product:  (c) => <Lightbulb  weight="duotone" size={36} color={c} />,
  business: (c) => <Buildings  weight="duotone" size={36} color={c} />,
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface SegData {
  path: SVGPathElement
  len: number
  startPt: DOMPoint
  colour: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function IdentityCards() {
  const svgRef  = useRef<SVGSVGElement>(null)
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) {
      // Mobile: make all cards active immediately
      ;[0, 1, 2, 3, 4].forEach(i => {
        const card = document.getElementById('card-' + i)
        if (card) card.dataset.state = 'active'
      })
      return
    }

    // ── Measure segments on mount ──────────────────────────────────────────
    const segments: SegData[] = []
    for (let i = 0; i < 5; i++) {
      const path = document.getElementById('seg-' + i) as SVGPathElement | null
      if (!path) continue
      const len     = path.getTotalLength()
      const startPt = path.getPointAtLength(0)
      segments.push({ path, len, startPt, colour: COLOURS[i] })

      // Start fully hidden
      path.style.opacity = '0'
      const clipRect = document.getElementById('clip-rect-' + i)
      if (clipRect) clipRect.setAttribute('width', '0')
    }

    const svgEl  = svgRef.current
    const dotEl  = dotRef.current
    const ringEl = ringRef.current

    // ── Shared updateCards function ────────────────────────────────────────
    function updateCards(p: number) {
      // Segments
      for (let i = 0; i < 5; i++) {
        const seg      = segments[i]
        const clipRect = document.getElementById('clip-rect-' + i)
        if (!seg || !clipRect) continue

        const [segStart, segEnd] = SEG_WINDOWS[i]
        const segLen = segEnd - segStart

        if (p >= segStart && p <= segEnd) {
          const segP      = (p - segStart) / segLen
          const currentPt = seg.path.getPointAtLength(seg.len * segP)

          const minX = Math.min(seg.startPt.x, currentPt.x) - 5
          const minY = Math.min(seg.startPt.y, currentPt.y) - 20
          const w    = Math.abs(currentPt.x - seg.startPt.x) + 10
          const h    = Math.abs(currentPt.y - seg.startPt.y) + 40
          clipRect.setAttribute('x',      String(minX))
          clipRect.setAttribute('y',      String(minY))
          clipRect.setAttribute('width',  String(w))
          clipRect.setAttribute('height', String(h))

          const opacity = segP > 0.85 ? 1 - (segP - 0.85) / 0.15 : 1
          seg.path.style.opacity = String(opacity)

          if (svgEl && dotEl && ringEl) {
            const svgRect = svgEl.getBoundingClientRect()
            const scaleX  = svgRect.width  / 1440
            const scaleY  = svgRect.height / 900
            const dx = (currentPt.x * scaleX) + 'px'
            const dy = (currentPt.y * scaleY) + 'px'
            dotEl.style.left       = dx
            dotEl.style.top        = dy
            dotEl.style.background = seg.colour
            dotEl.style.opacity    = String(opacity)
            ringEl.style.left        = dx
            ringEl.style.top         = dy
            ringEl.style.borderColor = seg.colour
            ringEl.style.opacity     = String(opacity * 0.3)
          }
        } else {
          seg.path.style.opacity = '0'
          clipRect.setAttribute('width', '0')
        }
      }

      // Cards
      for (let i = 0; i < 5; i++) {
        const card = document.getElementById('card-' + i)
        if (!card) continue
        if (p >= ACTIVATE_AT[i] && p < PAST_AT[i]) {
          card.dataset.state = 'active'
        } else if (p >= PAST_AT[i]) {
          card.dataset.state = 'past'
        } else {
          card.dataset.state = 'hidden'
        }
      }

      // Progress bar
      const currentSeg = Math.max(0, SEG_WINDOWS.reduce((acc, [s], i) => p >= s ? i : acc, 0))
      const fill = document.getElementById('progress-fill')
      if (fill) {
        fill.style.height     = (p * 100) + '%'
        fill.style.background = COLOURS[currentSeg]
      }
      ACTIVATE_AT.forEach((threshold, i) => {
        const dot = document.getElementById('progress-dot-' + i)
        if (!dot) return
        const on = p >= threshold
        dot.style.background = on ? COLOURS[i] : 'rgba(13,13,13,0.2)'
        dot.style.width      = on ? '8px' : '5px'
        dot.style.height     = on ? '8px' : '5px'
      })
    }

    // ── ScrollTrigger ──────────────────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger: '#identity',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        updateCards(self.progress)
      },
    })

    return () => st.kill()
  }, [])

  return (
    <>
      {/* ── Desktop ──────────────────────────────────────────────────── */}
      <div
        id="identity"
        className="hidden md:block relative"
        style={{ height: '500vh' }}
      >
        <div
          className="sticky top-0 overflow-hidden"
          style={{ height: '100vh', width: '100%', background: '#F0F1F5' }}
        >
          {/* Section label */}
          <div style={{
            position: 'absolute', top: 32, left: 40, zIndex: 30,
            fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
            color: 'rgba(13,13,13,0.4)',
          }}>
            Identity
          </div>

          {/* SVG */}
          <svg
            ref={svgRef}
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none', zIndex: 5,
            }}
            aria-hidden
          >
            <defs>
              {[0, 1, 2, 3, 4].map(i => (
                <clipPath key={i} id={`clip-${i}`}>
                  <rect id={`clip-rect-${i}`} x="0" y="0" width="0" height="0" />
                </clipPath>
              ))}
            </defs>
            {SEG_PATHS.map((d, i) => (
              <path
                key={i}
                id={`seg-${i}`}
                d={d}
                fill="none"
                stroke={COLOURS[i]}
                strokeWidth="3"
                strokeDasharray="12 6"
                strokeLinecap="round"
                clipPath={`url(#clip-${i})`}
                style={{ opacity: 0 }}
              />
            ))}
          </svg>

          {/* Moving dot */}
          <div
            ref={dotRef}
            style={{
              position: 'absolute', width: 12, height: 12,
              borderRadius: '50%', background: COLOURS[0],
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none', zIndex: 20,
              left: 0, top: 0, opacity: 0,
            }}
          />
          {/* Pulse ring */}
          <div
            ref={ringRef}
            style={{
              position: 'absolute', width: 22, height: 22,
              borderRadius: '50%',
              border: `1.5px solid ${COLOURS[0]}`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none', zIndex: 19,
              left: 0, top: 0, opacity: 0,
              animation: 'id-pulse 2s ease-in-out infinite',
            }}
          />

          {/* Cards */}
          {IDENTITY_CARDS.map((card, i) => {
            const colour    = COLOURS[i]
            const pos       = CARD_POSITIONS[i]
            const baseXform = CARD_TRANSFORMS[i]

            return (
              <div
                key={card.title}
                id={`card-${i}`}
                className="identity-card"
                data-state="hidden"
                style={{
                  position: 'absolute',
                  ...pos,
                  width: 300,
                  padding: '24px 28px',
                  background: '#F0F1F5',
                  borderLeft: '4px solid rgba(13,13,13,0.12)',
                  borderRadius: 0,
                  boxShadow: '0 2px 24px rgba(13,13,13,0.06)',
                  zIndex: 10,
                  ['--pillar' as string]: colour,
                  ['--base-xform' as string]: baseXform || 'none',
                  transform: baseXform || undefined,
                }}
              >
                {/* Label */}
                <div className="card-label" style={{
                  fontSize: 10, letterSpacing: '1.5px', fontWeight: 700,
                  color: colour, marginBottom: 8,
                  fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                  textTransform: 'uppercase',
                }}>
                  {card.label}
                </div>

                {/* Icon */}
                <div style={{ marginBottom: 4 }}>
                  {PILLAR_ICONS[card.pillar]?.(colour)}
                </div>

                {/* Title */}
                <div style={{
                  fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)',
                  fontSize: 52, fontWeight: 800, color: '#0D0D0D',
                  lineHeight: 1, margin: '8px 0 10px', letterSpacing: '-3px',
                }}>
                  {card.title}
                </div>

                {/* Description — hidden by default, shown in active state */}
                <div className="card-description" style={{
                  fontSize: 13, color: 'rgba(13,13,13,0.65)',
                  lineHeight: 1.5, marginBottom: 12,
                  fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                }}>
                  {card.description}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {card.tags.map(tag => (
                    <PillarBadge key={tag} pillar={card.pillar} label={tag} size="sm" />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Left progress bar */}
          <div style={{
            position: 'absolute', left: 20, top: '50%',
            transform: 'translateY(-50%)',
            height: 200, width: 2, zIndex: 30,
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.08)' }} />
            <div id="progress-fill" style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: '0%', background: COLOURS[0],
              transition: 'background 300ms ease',
            }} />
            {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
              <div
                key={i}
                id={`progress-dot-${i}`}
                style={{
                  position: 'absolute',
                  top: `${frac * 100}%`, left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'rgba(13,13,13,0.2)',
                  transition: 'all 300ms ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile ───────────────────────────────────────────────────── */}
      <div className="md:hidden" id="identity-mobile">
        <div style={{ padding: '64px 24px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {IDENTITY_CARDS.map((card, i) => {
            const colour = COLOURS[i]
            return (
              <div
                key={card.title}
                id={`card-mobile-${i}`}
                style={{
                  borderLeft: `4px solid ${colour}`,
                  background: '#F0F1F5',
                  padding: '24px 28px',
                  boxShadow: '0 2px 24px rgba(13,13,13,0.07)',
                }}
              >
                <div style={{
                  fontSize: 10, letterSpacing: '1.5px', fontWeight: 700,
                  color: colour, marginBottom: 8, textTransform: 'uppercase',
                  fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                }}>
                  {card.label}
                </div>
                <div style={{ marginBottom: 4 }}>
                  {PILLAR_ICONS[card.pillar]?.(colour)}
                </div>
                <div style={{
                  fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)',
                  fontSize: 48, fontWeight: 800, color: '#0D0D0D',
                  lineHeight: 1, margin: '8px 0 10px', letterSpacing: '-2px',
                }}>
                  {card.title}
                </div>
                <div style={{
                  fontSize: 13, color: 'rgba(13,13,13,0.65)', lineHeight: 1.5,
                  marginBottom: 12,
                  fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                }}>
                  {card.description}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {card.tags.map(tag => (
                    <PillarBadge key={tag} pillar={card.pillar} label={tag} size="sm" />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .identity-card {
          transition: opacity 500ms ease, filter 500ms ease, transform 500ms ease, box-shadow 500ms ease, border-left-color 500ms ease;
        }
        .identity-card[data-state="hidden"] {
          opacity: 0;
          visibility: hidden;
          filter: grayscale(1);
        }
        .identity-card[data-state="active"] {
          opacity: 1;
          visibility: visible;
          filter: grayscale(0);
          box-shadow: 0 8px 40px rgba(13,13,13,0.08);
          border-left-color: var(--pillar) !important;
        }
        .identity-card[data-state="past"] {
          opacity: 0.2;
          visibility: visible;
          filter: grayscale(1);
          border-left-color: rgba(13,13,13,0.12) !important;
        }
        .identity-card .card-description {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 400ms ease, opacity 300ms ease;
        }
        .identity-card[data-state="active"] .card-description {
          max-height: 150px;
          opacity: 1;
        }
        .identity-card[data-state="active"] .card-label { color: var(--pillar) !important; }
        .identity-card[data-state="past"] .card-label { color: rgba(13,13,13,0.3) !important; }
        @keyframes id-pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); }
          50%       { transform: translate(-50%,-50%) scale(1.5); }
        }
      `}</style>
    </>
  )
}
