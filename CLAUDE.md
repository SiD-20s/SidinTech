# CLAUDE.md — Portfolio Project Instructions

## Project Overview
This is the personal portfolio website for **Siddharth B (Sid)**, a Full-stack & AI Engineer based in Coimbatore, India.

Before writing a single line of code, read these two files completely:
- `about-sid.md` — everything about Sid (skills, projects, experience, identity)
- `portfolio-outcome.md` — complete design system, section specs, interactions, tech stack

---

## Absolute Rules — Never Break These

### Code Quality
- TypeScript everywhere — no `any` except where truly unavoidable
- No inline styles — Tailwind classes only
- No hardcoded colours — use the colour tokens defined in `tailwind.config.ts`
- No hardcoded font sizes — use Tailwind type scale or clamp() for responsive type
- Component per section — one file per section, no monolithic pages
- All animations: `transform` and `opacity` only — never animate width, height, top, left
- Always add `will-change: transform` on animated elements
- Always respect `prefers-reduced-motion` — wrap all animations in a check

### Design Rules
- Background is always `#F0F1F5` (canvas) — never pure white `#FFFFFF`
- Only the Contact section uses dark background `#0D0D0D`
- Pillar colours are accents ONLY — never full background fills
- Typography does the heavy lifting — not colour, not decoration
- Generous whitespace — if it feels tight, add more space
- Custom cursor is desktop only — disable on touch devices

### Responsiveness
- Mobile first — build mobile layout first, then scale up
- Every section must work on mobile (`< 768px`), tablet (`768px–1023px`), desktop (`≥ 1024px`)
- Stacked card scroll interaction → becomes vertical stack on mobile (no sticky animation)
- Horizontal about section → becomes vertical scroll on mobile
- Custom cursor → disabled on mobile/touch

### Performance
- Lazy load all images
- `font-display: swap` on all fonts
- No autoplay video
- Intersection Observer for scroll reveals — not scroll event listeners
- GSAP ScrollTrigger only for complex interactions (stacked cards, horizontal scroll)
- Framer Motion for component-level animations

---

## Project Structure

```
sid-portfolio/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Main page — assembles all sections
│   └── globals.css         # Global styles, CSS variables, cursor styles
├── components/
│   ├── sections/
│   │   ├── BootSequence.tsx     # Terminal + bold statements intro
│   │   ├── FloatingNav.tsx      # Pill-shaped floating nav
│   │   ├── Hero.tsx             # Hero section
│   │   ├── IdentityCards.tsx    # Stacked scroll cards (cydstumpel.nl)
│   │   ├── Projects.tsx         # lusion.co style project layout
│   │   ├── Experience.tsx       # Timeline + GitHub stats
│   │   ├── Skills.tsx           # Skill groups with stagger reveal
│   │   ├── About.tsx            # Horizontal scroll story panels
│   │   └── Contact.tsx          # Dark final section
│   ├── ui/
│   │   ├── CustomCursor.tsx     # Custom cursor component
│   │   ├── ScrollReveal.tsx     # Reusable scroll reveal wrapper
│   │   ├── PillarBadge.tsx      # Pillar colour tag pill
│   │   └── StackBadge.tsx       # Tech stack badge
│   └── providers/
│       └── LenisProvider.tsx    # Lenis smooth scroll provider
├── hooks/
│   ├── useScrollReveal.ts       # IntersectionObserver hook
│   ├── useCustomCursor.ts       # Cursor position + state hook
│   └── usePrefersReducedMotion.ts
├── lib/
│   ├── constants.ts             # Pillar colours, copy, project data
│   └── github.ts                # GitHub API fetch for stats
├── public/
│   └── images/                  # Project images/screenshots
├── about-sid.md                 # Sid's complete profile (reference)
├── portfolio-outcome.md         # Design + section specs (reference)
└── CLAUDE.md                    # This file
```

---

## Colour Tokens (use these names everywhere)

```ts
// tailwind.config.ts
colors: {
  tech:     '#00A8FF',  // Electric Blue
  finance:  '#00C896',  // Emerald Green
  design:   '#9B6DFF',  // Soft Purple
  product:  '#FFB830',  // Warm Amber
  business: '#FF6B6B',  // Coral Red
  ink:      '#0D0D0D',  // Near-black text
  canvas:   '#F0F1F5',  // Light grey-white background
}
```

Usage: `text-tech`, `border-finance`, `bg-product/10`, `text-ink`, `bg-canvas`

---

## Font Tokens

```ts
// tailwind.config.ts
fontFamily: {
  syne:    ['Syne', 'sans-serif'],       // Headlines, display
  satoshi: ['Satoshi', 'sans-serif'],    // Body text
  mono:    ['JetBrains Mono', 'monospace'], // Terminal, code
}
```

Usage: `font-syne`, `font-satoshi`, `font-mono`

---

## Animation Standards

### Easing
```ts
// Use this cubic-bezier for all entrances
const EASE_OUT = [0.16, 1, 0.3, 1]

// Framer Motion variant
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
}
```

### Stagger
```ts
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 }
  }
}
```

### Timing
- Micro-interactions: 150–200ms
- Element reveals: 400–500ms
- Page transitions: 600–800ms
- Stagger delay between children: 60ms
- Bold statement hold time: 1800ms

### Reduced Motion
```ts
// hooks/usePrefersReducedMotion.ts
const prefersReducedMotion = usePrefersReducedMotion()

// Always check before animating
const variants = prefersReducedMotion ? {} : fadeUp
```

---

## Lenis Setup

```ts
// components/providers/LenisProvider.tsx
import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

---

## Stacked Cards Implementation

The identity cards section is the most complex interaction. Use GSAP ScrollTrigger — NOT scroll event listeners.

```ts
// components/sections/IdentityCards.tsx
useEffect(() => {
  const cards = gsap.utils.toArray('.identity-card') as HTMLElement[]

  cards.forEach((card, index) => {
    if (index === cards.length - 1) return // Last card stays

    ScrollTrigger.create({
      trigger: '#identity-section',
      start: `${index * 20}% top`,
      end: `${(index + 1) * 20}% top`,
      scrub: true,
      onUpdate: (self) => {
        gsap.set(card, {
          yPercent: -100 * self.progress,
          opacity: 1 - self.progress,
        })
      },
    })
  })

  return () => ScrollTrigger.getAll().forEach(t => t.kill())
}, [])
```

Outer wrapper: `height: 500vh`
Inner sticky: `position: sticky, top: 0, height: 100vh, overflow: hidden`
Cards: `position: absolute, inset: 0`
Z-index: Card 1 = 50, Card 2 = 40, Card 3 = 30, Card 4 = 20, Card 5 = 10

---

## Horizontal About Section

```ts
// components/sections/About.tsx
useEffect(() => {
  const panels = gsap.utils.toArray('.about-panel') as HTMLElement[]

  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: '#about-section',
      pin: true,
      scrub: 1,
      end: () => `+=${panels.length * window.innerWidth}`,
    },
  })

  return () => ScrollTrigger.getAll().forEach(t => t.kill())
}, [])
```

---

## Scroll Reveal Hook

```ts
// hooks/useScrollReveal.ts
import { useEffect, useRef } from 'react'

export function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
```

---

## Custom Cursor

```ts
// components/ui/CustomCursor.tsx
// Only render on non-touch devices
// Default: 8px filled circle, lerp 0.15
// On link hover: 32px ring (border only, no fill)
// On project title hover: 32px ring + "VIEW" text inside
// Disable entirely if touch device: window.matchMedia('(hover: none)')
```

---

## Boot Sequence Logic

```
Phase 1: Terminal lines (JetBrains Mono)
  → Each line types out character by character (120ms/char)
  → 400ms pause between lines
  → Progress bar fills on last line (800ms)
  → 500ms pause after complete

Phase 2: Bold statements (Syne Bold, centered)
  → Terminal fades out (300ms)
  → Each statement: fade in 300ms → hold 1800ms → fade out 300ms
  → 6 statements total, each in its pillar colour
  → After last statement: 300ms pause

Phase 3: Transition
  → Crossfade to hero (400ms)
  → Nav slides down from top (300ms ease-out)

Skip button:
  → Always visible top-right during entire intro
  → Click: immediately cancel all timers, transition to hero
  → Store in sessionStorage: if visited before, skip automatically
```

---

## GitHub API Integration

```ts
// lib/github.ts
export async function getGitHubStats() {
  const res = await fetch('https://api.github.com/users/SiD-20s', {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  return res.json()
}

// Contribution graph: use GitHub contributions API or
// ghchart.rshah.org/SiD-20s as SVG embed fallback
```

---

## Section Order
1. BootSequence — full screen intro, no nav
2. FloatingNav — appears after intro, stays for rest of site
3. Hero — `id="hero"`
4. IdentityCards — `id="identity"` — 500vh sticky scroll
5. Projects — `id="work"`
6. Experience — `id="experience"` — timeline + GitHub stats
7. Skills — `id="skills"`
8. About — `id="about"` — horizontal scroll panels
9. Contact — `id="contact"` — dark section

---

## Build Order (Recommended)
1. Setup: Next.js + Tailwind + install dependencies + font config + colour tokens
2. Layout: root layout, LenisProvider, CustomCursor, FloatingNav
3. Hero section (simplest, establishes design language)
4. Skills section (tests stagger animations)
5. Projects section (tests scroll reveals + lusion.co layout)
6. Identity cards (most complex — GSAP stacked scroll)
7. Experience + GitHub stats
8. About horizontal scroll
9. Contact
10. Boot sequence (build last — depends on everything else being ready)
11. Polish: timing, spacing, mobile, reduced motion, performance

---

## Commands

```bash
# Install
npx create-next-app@latest sid-portfolio --typescript --tailwind --app
cd sid-portfolio
npm install framer-motion gsap @studio-freight/lenis @phosphor-icons/react

# Dev
npm run dev

# Build
npm run build

# Deploy
vercel --prod
```

---

## Do Not
- Do not use `create-react-app` — use Next.js only
- Do not use styled-components or CSS modules — Tailwind only
- Do not use any UI component library (no MUI, no Chakra, no Ant)
- Do not use localStorage for anything
- Do not add Google Analytics or any tracking without being asked
- Do not use placeholder Lorem Ipsum text — all copy is in `portfolio-outcome.md`
- Do not invent new sections — build exactly what is in `portfolio-outcome.md`
- Do not use pure black `#000000` or pure white `#FFFFFF` anywhere
- Do not animate on mobile what should be static
- Do not forget `prefers-reduced-motion` checks

