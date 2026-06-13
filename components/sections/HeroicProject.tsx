'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const E: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]
const INSTANT: Variants['hidden'] = { transition: { duration: 0 } }

// ── Variant factories ──────────────────────────────────────────────────────────

function makeVariants(
  hiddenState: object,
  duration: number,
  delay: number,
): Variants {
  return {
    hidden: { ...hiddenState, ...INSTANT },
    visible: {
      opacity: 1, y: 0, x: 0, scale: 1,
      transition: { duration, delay, ease: E },
    },
  }
}

// Named variants — reused across elements
const V = {
  eyebrow:    (d = 0)   => makeVariants({ opacity: 0, y: -24 }, 0.8, d),
  fadeUp24:   (d = 0)   => makeVariants({ opacity: 0, y: 24  }, 0.8, d),
  fadeUp40:   (d = 0)   => makeVariants({ opacity: 0, y: 40  }, 0.9, d),
  fadeUp20:   (d = 0, dur = 0.7) => makeVariants({ opacity: 0, y: 20 }, dur, d),
  fadeUp10:   (d = 0, dur = 0.6) => makeVariants({ opacity: 0, y: 10 }, dur, d),
  title:      (d = 0)   => makeVariants({ opacity: 0, y: 80, x: -40 }, 1.0, d),
  fadeIn:     (d = 0, dur = 0.8) => makeVariants({ opacity: 0 }, dur, d),
  scaleUp:    (d = 0, dur = 1.1) => makeVariants({ opacity: 0, scale: 0.88 }, dur, d),
  fadeInLeft: (d = 0)   => makeVariants({ opacity: 0, x: -20 }, 0.7, d),
}

// ── Pulse dot ─────────────────────────────────────────────────────────────────

function PulseDot({ colour = '#00C896', size = 6 }: { colour?: string; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size, height: size,
        borderRadius: '50%',
        backgroundColor: colour,
        animation: 'hp-pulse 2s ease-in-out infinite',
        flexShrink: 0,
      }}
    />
  )
}

// ── Verdict card ──────────────────────────────────────────────────────────────

function VerdictCard({
  isInView,
  prefersReduced,
}: {
  isInView: boolean
  prefersReduced: boolean
}) {
  const view = isInView ? 'visible' : 'hidden'

  const statItems = [
    { num: '84%', label: 'Recovery rate' },
    { num: '19×', label: 'Historical drops' },
    { num: '2s',  label: 'Verdict time' },
  ]

  if (prefersReduced) {
    return (
      <div style={{
        background: '#111827', borderRadius: 14, padding: 24,
        border: '0.5px solid rgba(255,255,255,0.07)',
      }}>
        <p style={{ fontFamily: 'var(--font-mono-var, JetBrains Mono, monospace)', fontSize: 9, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.25)', margin: '0 0 10px', textTransform: 'uppercase' }}>CRASH ALERT · HDFC BANK · NSE</p>
        <p style={{ fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)', fontWeight: 700, fontSize: 22, color: '#fff', margin: '0 0 2px' }}>HDFC Bank</p>
        <p style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 13, color: '#FF6B6B', fontWeight: 600, margin: '0 0 12px' }}>↓ 6.2% today</p>
        <span style={{ display: 'inline-block', background: 'rgba(0,200,150,0.12)', border: '1px solid #00C896', color: '#00C896', fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100, marginBottom: 12 }}>DROP APPEARS EMOTIONAL</span>
        <p style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>Dropped 5%+ on 19 previous occasions. Recovered within 14 days in 84% of cases. No fundamental change detected this quarter. Nifty also down 3% today.</p>
        <div style={{ display: 'flex', gap: 24, borderTop: '0.5px solid rgba(255,255,255,0.05)', paddingTop: 12, marginTop: 12 }}>
          {statItems.map(({ num, label }) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)', fontWeight: 700, fontSize: 20, color: '#00C896' }}>{num}</div>
              <div style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 9, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.5px', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={V.scaleUp(0.3, 1.1)}
      initial="hidden"
      animate={view}
      style={{
        background: '#111827', borderRadius: 14, padding: 24,
        border: '0.5px solid rgba(255,255,255,0.07)',
        willChange: 'transform, opacity',
      }}
    >
      <motion.p
        variants={V.fadeUp10(0.55, 0.6)}
        initial="hidden" animate={view}
        style={{ fontFamily: 'var(--font-mono-var, JetBrains Mono, monospace)', fontSize: 9, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.25)', margin: '0 0 10px', textTransform: 'uppercase' }}
      >
        CRASH ALERT · HDFC BANK · NSE
      </motion.p>

      <motion.p
        variants={V.fadeUp10(0.65, 0.6)}
        initial="hidden" animate={view}
        style={{ fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)', fontWeight: 700, fontSize: 22, color: '#fff', margin: '0 0 2px' }}
      >
        HDFC Bank
      </motion.p>

      <motion.p
        variants={V.fadeUp10(0.72, 0.6)}
        initial="hidden" animate={view}
        style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 13, color: '#FF6B6B', fontWeight: 600, margin: '0 0 12px' }}
      >
        ↓ 6.2% today
      </motion.p>

      <motion.span
        variants={V.fadeUp10(0.80, 0.6)}
        initial="hidden" animate={view}
        style={{ display: 'inline-block', background: 'rgba(0,200,150,0.12)', border: '1px solid #00C896', color: '#00C896', fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100, marginBottom: 12 }}
      >
        DROP APPEARS EMOTIONAL
      </motion.span>

      <motion.p
        variants={V.fadeUp10(0.88, 0.6)}
        initial="hidden" animate={view}
        style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}
      >
        Dropped 5%+ on 19 previous occasions. Recovered within 14 days in 84% of cases.
        No fundamental change detected this quarter. Nifty also down 3% today.
      </motion.p>

      <div style={{ display: 'flex', gap: 24, borderTop: '0.5px solid rgba(255,255,255,0.05)', paddingTop: 12, marginTop: 12 }}>
        {statItems.map(({ num, label }, i) => (
          <motion.div
            key={label}
            variants={V.fadeUp10(0.95 + i * 0.07, 0.5)}
            initial="hidden" animate={view}
          >
            <div style={{ fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)', fontWeight: 700, fontSize: 20, color: '#00C896' }}>{num}</div>
            <div style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 9, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.5px', marginTop: 3 }}>{label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Roadmap card ──────────────────────────────────────────────────────────────

const PHASE_DELAYS = [0.75, 0.88, 1.01]

function RoadmapCard({
  isInView,
  prefersReduced,
}: {
  isInView: boolean
  prefersReduced: boolean
}) {
  const view = isInView ? 'visible' : 'hidden'

  const phases = [
    {
      name: 'Phase 1 — MVP',
      desc: '5 no-AI features, rule-based logic',
      badge: 'Building',
      badgeStyle: { color: '#00C896', background: 'rgba(0,200,150,0.15)', border: '1px solid rgba(0,200,150,0.3)' },
      dot: '#00C896', rowBg: 'rgba(0,200,150,0.08)', rowBorder: '0.5px solid rgba(0,200,150,0.2)',
    },
    {
      name: 'Phase 2 — AI Enhanced',
      desc: 'Panic Score, Crash Replays, Broker API',
      badge: 'Month 3–4',
      badgeStyle: { color: 'rgba(13,13,13,0.4)', background: 'rgba(13,13,13,0.04)', border: '1px solid rgba(13,13,13,0.1)' },
      dot: 'rgba(13,13,13,0.2)', rowBg: 'rgba(13,13,13,0.02)', rowBorder: 'none',
    },
    {
      name: 'Phase 3 — Full AI',
      desc: 'NLP Noise Filter, Personal Panic Profile',
      badge: 'Month 6+',
      badgeStyle: { color: 'rgba(13,13,13,0.4)', background: 'rgba(13,13,13,0.04)', border: '1px solid rgba(13,13,13,0.1)' },
      dot: 'rgba(13,13,13,0.2)', rowBg: 'rgba(13,13,13,0.02)', rowBorder: 'none',
    },
  ]

  const PhaseRow = ({ ph, delay }: { ph: typeof phases[0]; delay: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: ph.rowBg, border: ph.rowBorder }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ph.dot, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 12, fontWeight: 600, color: '#0D0D0D' }}>{ph.name}</div>
        <div style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 10, color: 'rgba(13,13,13,0.45)' }}>{ph.desc}</div>
      </div>
      <span style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 9, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 100, whiteSpace: 'nowrap', ...ph.badgeStyle }}>{ph.badge}</span>
    </div>
  )

  if (prefersReduced) {
    return (
      <div style={{ background: 'rgba(13,13,13,0.03)', border: '0.5px solid rgba(13,13,13,0.08)', borderRadius: 12, padding: 20 }}>
        <p style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(13,13,13,0.4)', margin: '0 0 12px' }}>PRODUCT ROADMAP</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {phases.map((ph) => <PhaseRow key={ph.name} ph={ph} delay={0} />)}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={V.scaleUp(0.5, 1.0)}
      initial="hidden"
      animate={view}
      style={{ background: 'rgba(13,13,13,0.03)', border: '0.5px solid rgba(13,13,13,0.08)', borderRadius: 12, padding: 20, willChange: 'transform, opacity' }}
    >
      <p style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(13,13,13,0.4)', margin: '0 0 12px' }}>
        PRODUCT ROADMAP
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {phases.map((ph, i) => (
          <motion.div
            key={ph.name}
            variants={V.fadeInLeft(PHASE_DELAYS[i])}
            initial="hidden"
            animate={view}
            style={{ willChange: 'transform, opacity' }}
          >
            <PhaseRow ph={ph} delay={PHASE_DELAYS[i]} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function HeroicProject() {
  const prefersReduced = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const arcRef     = useRef<SVGPathElement>(null)

  const isInView = useInView(sectionRef, { once: false, margin: '0px 0px -20px 0px' })
  const view = isInView ? 'visible' : 'hidden'

  useEffect(() => {
    const path = arcRef.current
    if (!path || prefersReduced) return

    const len = path.getTotalLength()
    path.style.strokeDasharray  = String(len)
    path.style.strokeDashoffset = String(len)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        path.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.25,0.46,0.45,0.94)'
        path.style.strokeDashoffset = '0'
        observer.disconnect()
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [prefersReduced])

  const researchStats = [
    { num: '71%',    label: 'panic sold' },
    { num: '86%',    label: 'willing to pay' },
    { num: '6.6/10', label: 'tool ratings' },
    { num: '₹2L+',   label: 'lost to panic' },
  ]

  if (prefersReduced) {
    return (
      <section id="heroic-project" ref={sectionRef} style={{ background: '#F0F1F5', width: '100%' }}>
        <div style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,5.5vw,80px) clamp(60px,6vw,80px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 52 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(13,13,13,0.1)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0A0A0F', color: '#fff', fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 10, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', padding: '7px 20px', borderRadius: 100 }}>
              <PulseDot colour="#00C896" size={6} />HEROIC PROJECT
            </div>
            <div style={{ flex: 1, height: 1, background: 'rgba(13,13,13,0.1)' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(13,13,13,0.35)', margin: '0 0 12px' }}>Real product · Fintech · AI · Founded from experience</p>
          <h2 style={{ fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)', fontWeight: 700, fontSize: 'clamp(72px, 10vw, 120px)', color: '#0A0A0F', lineHeight: 0.92, letterSpacing: '-3px', margin: '0 0 52px' }}>FinSight<br />AI</h2>
        </div>
        <style>{`@keyframes hp-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      </section>
    )
  }

  return (
    <section
      id="heroic-project"
      ref={sectionRef}
      style={{ background: '#F0F1F5', width: '100%' }}
    >
      <div style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,5.5vw,80px) clamp(60px,6vw,80px)' }}>

        {/* ── 1. Eyebrow ────────────────────────────────────────────── */}
        <motion.div
          variants={V.eyebrow(0)}
          initial="hidden"
          animate={view}
          style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 52, willChange: 'transform, opacity' }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(13,13,13,0.1)' }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#0A0A0F', color: '#fff',
            fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
            fontSize: 10, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase',
            padding: '7px 20px', borderRadius: 100,
          }}>
            <PulseDot colour="#00C896" size={6} />
            HEROIC PROJECT
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(13,13,13,0.1)' }} />
        </motion.div>

        {/* ── 2. Hero text + arc ────────────────────────────────────── */}
        <div style={{ position: 'relative', marginBottom: 52 }}>

          {/* Sub-label */}
          <motion.p
            variants={V.fadeUp24(0.15)}
            initial="hidden"
            animate={view}
            style={{
              fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '2px',
              color: 'rgba(13,13,13,0.35)', margin: '0 0 12px',
              willChange: 'transform, opacity',
            }}
          >
            Real product · Fintech · AI · Founded from experience
          </motion.p>

          {/* Title — two independent lines */}
          <div style={{ overflow: 'hidden', position: 'relative', zIndex: 2 }}>
            <motion.div
              variants={V.title(0.2)}
              initial="hidden"
              animate={view}
              style={{ willChange: 'transform, opacity' }}
            >
              <span style={{ display: 'block', fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)', fontWeight: 700, fontSize: 'clamp(72px, 10vw, 120px)', color: '#0A0A0F', lineHeight: 0.92, letterSpacing: '-3px' }}>
                FinSight
              </span>
            </motion.div>
            <motion.div
              variants={V.title(0.35)}
              initial="hidden"
              animate={view}
              style={{ willChange: 'transform, opacity' }}
            >
              <span style={{ display: 'block', fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)', fontWeight: 700, fontSize: 'clamp(72px, 10vw, 120px)', color: '#0A0A0F', lineHeight: 0.92, letterSpacing: '-3px' }}>
                AI
              </span>
            </motion.div>
          </div>

          {/* Green arc SVG */}
          <svg
            viewBox="0 0 1440 300"
            preserveAspectRatio="none"
            aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}
          >
            <path
              ref={arcRef}
              d="M -20 240 C 200 120 500 260 720 160 C 940 60 1200 180 1460 140"
              stroke="#00C896" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5"
            />
          </svg>
        </div>

        {/* ── 3. Content row ────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 'clamp(32px,5.5vw,80px)', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Left column */}
          <div style={{ flex: '1.2 1 320px', minWidth: 0 }}>

            <motion.blockquote
              variants={V.fadeUp40(0.45)}
              initial="hidden"
              animate={view}
              style={{
                borderLeft: '3px solid #00C896', paddingLeft: 20, margin: '0 0 24px',
                fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                fontStyle: 'italic', fontSize: 18, color: 'rgba(13,13,13,0.55)', lineHeight: 1.6,
                maxWidth: 520, willChange: 'transform, opacity',
              }}
            >
              "I almost panic sold ₹34,000 in gains. No app stopped me. So I built one."
            </motion.blockquote>

            <motion.p
              variants={V.fadeUp40(0.55)}
              initial="hidden"
              animate={view}
              style={{
                fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                fontSize: 15, color: 'rgba(13,13,13,0.5)', lineHeight: 1.8,
                margin: '0 0 28px', maxWidth: 520, willChange: 'transform, opacity',
              }}
            >
              A crash-day intelligence tool for Indian retail investors. When a stock drops 5%+,
              it delivers a verdict in 2 seconds — emotional or fundamental — using historical
              patterns, fundamentals analysis, and institutional flow data. Born from 3 years of
              personal investing, 7 surveys, 4 user interviews, and a genuine gap no existing
              product fills.
            </motion.p>

            <motion.div
              variants={V.fadeIn(0.65, 0.8)}
              initial="hidden"
              animate={view}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)',
                color: '#00C896', fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                padding: '5px 14px', borderRadius: 100, marginBottom: 32,
              }}
            >
              <PulseDot colour="#00C896" size={5} />
              Prototype complete · Production build starting
            </motion.div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <motion.a
                href="#"
                variants={V.fadeUp24(0.7)}
                initial="hidden"
                animate={view}
                style={{
                  display: 'inline-block', background: '#0A0A0F', color: '#fff',
                  fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                  fontSize: 13, fontWeight: 700, padding: '13px 26px', borderRadius: 100,
                  textDecoration: 'none', willChange: 'transform, opacity',
                }}
              >
                View case study →
              </motion.a>
              <motion.a
                href="https://github.com/SiD-20s"
                target="_blank"
                rel="noopener noreferrer"
                variants={V.fadeUp24(0.78)}
                initial="hidden"
                animate={view}
                style={{
                  display: 'inline-block', background: 'transparent',
                  color: 'rgba(13,13,13,0.45)',
                  fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)',
                  fontSize: 13, padding: '13px 22px', borderRadius: 100,
                  border: '1px solid rgba(13,13,13,0.15)', textDecoration: 'none',
                  willChange: 'transform, opacity',
                }}
              >
                GitHub →
              </motion.a>
            </div>

            <div style={{ display: 'flex', gap: 0, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(13,13,13,0.08)' }}>
              {researchStats.map((stat, i, arr) => (
                <motion.div
                  key={stat.num}
                  variants={V.fadeUp20(0.82 + i * 0.08)}
                  initial="hidden"
                  animate={view}
                  style={{
                    paddingRight: i === arr.length - 1 ? 0 : 24,
                    marginRight:  i === arr.length - 1 ? 0 : 24,
                    borderRight:  i === arr.length - 1 ? 'none' : '1px solid rgba(13,13,13,0.1)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-syne-var, DM Sans, sans-serif)', fontWeight: 700, fontSize: 22, color: '#00C896', lineHeight: 1 }}>{stat.num}</div>
                  <div style={{ fontFamily: 'var(--font-satoshi-var, Satoshi, sans-serif)', fontSize: 10, color: 'rgba(13,13,13,0.4)', marginTop: 3, lineHeight: 1.3 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — cards, hidden on mobile */}
          <div
            className="hidden md:flex"
            style={{ flex: '0.8 1 280px', flexDirection: 'column', gap: 16, minWidth: 0 }}
          >
            <VerdictCard isInView={isInView} prefersReduced={prefersReduced} />
            <RoadmapCard isInView={isInView} prefersReduced={prefersReduced} />
          </div>
        </div>

      </div>

      <style>{`
        @keyframes hp-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </section>
  )
}
