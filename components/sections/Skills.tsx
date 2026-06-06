'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PillarBadge } from '@/components/ui/PillarBadge'
import { SKILL_GROUPS, PILLAR_COLOURS } from '@/lib/constants'
import { staggerItem } from '@/lib/animations'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// 40 ms stagger between individual badges (spec requirement)
const badgeStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.08,
    },
  },
} as const

export default function Skills() {
  const prefersReduced = usePrefersReducedMotion()

  return (
    <section id="skills" className="py-24 md:py-32 px-6 md:px-16 lg:px-24">

      {/* Section header — 11px Satoshi uppercase tracking-widest */}
      <div className="mb-16 md:mb-20">
        <span className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40">
          Skills
        </span>
      </div>

      {/* 2-column desktop / 1-column mobile
          gap-8 = 32px (mobile), lg:gap-12 = 48px (desktop) — matches spec */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {SKILL_GROUPS.map((group) => (
          <ScrollReveal key={group.category}>
            <div className="flex flex-col gap-5">

              {/* Pillar colour dot + category name */}
              <div className="flex items-center gap-2">
                <span
                  className="block w-[6px] h-[6px] rounded-full shrink-0"
                  style={{ backgroundColor: PILLAR_COLOURS[group.pillar] }}
                  aria-hidden
                />
                <span
                  className="font-satoshi font-medium text-[13px] uppercase tracking-wider"
                  style={{ color: PILLAR_COLOURS[group.pillar] }}
                >
                  {group.category}
                </span>
              </div>

              {/* Group headline — Syne Bold 24px ink */}
              <h3 className="font-syne font-bold text-[24px] leading-tight text-ink m-0">
                &ldquo;{group.label}&rdquo;
              </h3>

              {/* Badges — PillarBadge sm, stagger 40 ms apart on scroll entry */}
              <motion.div
                className="flex flex-wrap gap-2"
                variants={prefersReduced ? {} : badgeStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              >
                {group.badges.map((badge) => (
                  <motion.div
                    key={badge}
                    variants={prefersReduced ? {} : staggerItem}
                    className="will-change-transform"
                  >
                    <PillarBadge pillar={group.pillar} label={badge} size="sm" />
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
