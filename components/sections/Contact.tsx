'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const CONTACT_LINKS = [
  { label: 'sid@sidintech.dev', href: 'mailto:sid@sidintech.dev', hoverColour: '#00A8FF' },
  { label: '@SidinTech', href: 'https://linkedin.com/in/SidinTech', hoverColour: '#00C896' },
  { label: '@SiD-20s', href: 'https://github.com/SiD-20s', hoverColour: '#9B6DFF' },
]

export default function Contact() {
  const prefersReduced = usePrefersReducedMotion()

  return (
    <section
      id="contact"
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#0D0D0D' }}
    >
      {/* Headline — Syne Bold, clamp(40px, 7vw, 80px), white, 3 lines */}
      <h2
        className="font-syne font-extrabold text-canvas m-0 leading-tight"
        style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
      >
        If you&apos;re building
        <br />
        something real —
        <br />
        let&apos;s talk.
      </h2>

      {/* Contact links — flex row, gap-8, Satoshi Medium 16px, white */}
      <div className="flex flex-wrap justify-center gap-8 mt-12">
        {CONTACT_LINKS.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="font-satoshi font-medium text-[16px] text-canvas"
            whileHover={prefersReduced ? {} : { color: link.hoverColour }}
            transition={{ duration: 0.2 }}
            data-cursor="link"
          >
            {link.label}
          </motion.a>
        ))}
      </div>

      {/* Footer */}
      <p className="font-satoshi text-[12px] mt-12 m-0" style={{ color: 'rgba(240,241,245,0.3)' }}>
        © 2026 Siddharth B · Designed &amp; Built by Sid · Coimbatore, India
      </p>
    </section>
  )
}
