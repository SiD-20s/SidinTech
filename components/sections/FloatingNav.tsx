'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import { NAV_ITEMS, SECTION_PILLAR } from '@/lib/constants'
import { navSlideDown } from '@/lib/animations'

interface FloatingNavProps {
  visible: boolean
  activeSection: string
}

// Section id → anchor href mapping for nav items
const SECTION_FOR_NAV: Record<string, string> = {
  Sid:        'hero',
  Work:       'work',
  Experience: 'experience',
  Skills:     'skills',
  About:      'about',
  Contact:    'contact',
}

export default function FloatingNav({ visible, activeSection }: FloatingNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    // Use 'instant' — Lenis intercepts this and applies its own smooth easing.
    // 'smooth' here would stack CSS native smoothing on top of Lenis → lag.
    const target = document.querySelector(href)
    target?.scrollIntoView({ behavior: 'instant' })
  }

  const activePillarColour = SECTION_PILLAR[activeSection] ?? '#0D0D0D'

  return (
    <>
      {/* ── Pill nav — desktop ──────────────────────────────────────── */}
      <motion.nav
        variants={navSlideDown}
        initial="hidden"
        animate={visible ? 'visible' : 'hidden'}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-6 py-2.5 rounded-full"
        style={{
          background: 'rgba(240,241,245,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(13,13,13,0.08)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const sectionId = SECTION_FOR_NAV[item.label] ?? 'hero'
          const isActive = activeSection === sectionId
          const colour = isActive ? (SECTION_PILLAR[sectionId] ?? '#0D0D0D') : undefined

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.href) }}
              data-cursor="link"
              className="font-satoshi text-[14px] px-3 py-1 rounded-full transition-colors duration-200"
              style={{
                color: colour ?? 'rgba(13,13,13,0.55)',
                fontWeight: item.label === 'Sid' ? 700 : 400,
                fontFamily: item.label === 'Sid' ? 'var(--font-syne-var), Syne, sans-serif' : undefined,
              }}
            >
              {item.label}
            </a>
          )
        })}
      </motion.nav>

      {/* ── Mobile nav — Sid logo + hamburger ──────────────────────── */}
      <motion.div
        variants={navSlideDown}
        initial="hidden"
        animate={visible ? 'visible' : 'hidden'}
        className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(240,241,245,0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(13,13,13,0.06)',
        }}
      >
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNavClick('#hero') }}
          className="font-syne font-bold text-[18px] text-ink"
          data-cursor="link"
        >
          Sid
        </a>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-ink p-1"
          aria-label="Open menu"
        >
          <List size={24} weight="regular" />
        </button>
      </motion.div>

      {/* ── Mobile full-screen overlay ──────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col px-8 py-8"
            style={{ backgroundColor: '#0D0D0D' }}
          >
            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-canvas/60 p-1"
                aria-label="Close menu"
              >
                <X size={28} weight="regular" />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col justify-center flex-1 gap-6">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href) }}
                  data-cursor="link"
                  className="font-syne font-bold text-canvas"
                  style={{ fontSize: 'clamp(32px, 8vw, 56px)' }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* Active colour accent at bottom */}
            <div className="pb-4">
              <span
                className="block w-8 h-[3px] rounded-full"
                style={{ backgroundColor: activePillarColour }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
