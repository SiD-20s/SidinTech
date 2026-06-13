'use client'

import { useEffect, useRef } from 'react'
import {
  Code,
  ChartLine,
  PaintBrush,
  Lightbulb,
  Buildings,
} from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PillarBadge } from '@/components/ui/PillarBadge'
import { IDENTITY_CARDS, PILLAR_COLOURS } from '@/lib/constants'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

// Maps pillar → Phosphor icon component (duotone, 48px)
const PILLAR_ICONS = {
  tech:     (colour: string) => <Code     weight="duotone" size={48} color={colour} />,
  finance:  (colour: string) => <ChartLine weight="duotone" size={48} color={colour} />,
  design:   (colour: string) => <PaintBrush weight="duotone" size={48} color={colour} />,
  product:  (colour: string) => <Lightbulb  weight="duotone" size={48} color={colour} />,
  business: (colour: string) => <Buildings  weight="duotone" size={48} color={colour} />,
} as const

export default function IdentityCards() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return          // mobile: static stack, no GSAP

    const cards = gsap.utils.toArray<HTMLElement>('.identity-card')
    const triggers: ScrollTrigger[] = []

    // z-index: card[0]=z-10 (bottom) … card[4]=z-50 (top).
    // Peel order: card[4] slides away first, then card[3], card[2], card[1].
    // card[0] (TECH) stays and is the final revealed card.
    // animIndex 0 = first peel (card[4]), animIndex 3 = last peel (card[1]).
    const peelOrder = [
      cards[cards.length - 1], // card 4 — BUSINESS (top, peels first)
      cards[cards.length - 2], // card 3 — PRODUCT
      cards[cards.length - 3], // card 2 — DESIGN
      cards[cards.length - 4], // card 1 — FINANCE
      // card 0 — TECH stays (bottom, never animated)
    ]

    peelOrder.forEach((card, animIndex) => {
      const st = ScrollTrigger.create({
        trigger: '#identity',
        start: `${animIndex * 20}% top`,
        end: `${(animIndex + 1) * 20}% top`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate(self) {
          gsap.set(card, {
            yPercent: 100 * self.progress,
            opacity: 1 - self.progress * 0.3,
          })
        },
      })
      triggers.push(st)
    })

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [prefersReduced])

  return (
    <>
      {/* ── Desktop: sticky 500vh scroll container ─────────────────── */}
      <div
        ref={sectionRef}
        id="identity"
        className="hidden md:block relative"
        style={{ height: '500vh' }}
      >
        <div
          className="sticky top-0 h-screen overflow-hidden"
          aria-label="Identity pillars"
        >
          {IDENTITY_CARDS.map((card, index) => {
            const colour = PILLAR_COLOURS[card.pillar]
            // Last card sits on top (z-50), first card at bottom (z-10).
            // Each card peels downward to reveal the one beneath it.
            const zClasses = ['z-10', 'z-20', 'z-30', 'z-40', 'z-50']

            return (
              <div
                key={card.title}
                className={`identity-card absolute inset-0 bg-canvas ${zClasses[index]} flex flex-col justify-center px-12 lg:px-24`}
                style={{ borderLeft: `4px solid ${colour}` }}
              >
                {/* Label — 11px Satoshi uppercase, pillar colour */}
                <span
                  className="font-satoshi text-[11px] uppercase tracking-widest mb-6"
                  style={{ color: colour }}
                >
                  {card.label}
                </span>

                {/* Phosphor icon — 48px duotone */}
                <div className="mb-6">
                  {PILLAR_ICONS[card.pillar](colour)}
                </div>

                {/* Title — Syne Bold clamp(64px, 12vw, 120px) */}
                <h2
                  className="font-syne font-extrabold text-ink m-0 leading-none"
                  style={{ fontSize: 'clamp(64px, 12vw, 120px)' }}
                >
                  {card.title}
                </h2>

                {/* Description — Satoshi Regular 18px, 70% opacity */}
                <p
                  className="font-satoshi text-[18px] text-ink/70 mt-6 mb-8"
                  style={{ maxWidth: 580 }}
                >
                  {card.description}
                </p>

                {/* Tag pills */}
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <PillarBadge key={tag} pillar={card.pillar} label={tag} size="sm" />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Mobile: vertical stack, no sticky, no GSAP ─────────────── */}
      <div className="md:hidden flex flex-col" id="identity-mobile">
        {IDENTITY_CARDS.map((card) => {
          const colour = PILLAR_COLOURS[card.pillar]
          return (
            <div
              key={card.title}
              className="flex flex-col justify-center px-8 py-16 bg-canvas"
              style={{ borderLeft: `4px solid ${colour}` }}
            >
              <span
                className="font-satoshi text-[11px] uppercase tracking-widest mb-4"
                style={{ color: colour }}
              >
                {card.label}
              </span>

              <div className="mb-4">
                {PILLAR_ICONS[card.pillar](colour)}
              </div>

              <h2
                className="font-syne font-extrabold text-ink m-0 leading-none"
                style={{ fontSize: 'clamp(48px, 12vw, 80px)' }}
              >
                {card.title}
              </h2>

              <p className="font-satoshi text-[16px] text-ink/70 mt-5 mb-6 max-w-[520px]">
                {card.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <PillarBadge key={tag} pillar={card.pillar} label={tag} size="sm" />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
