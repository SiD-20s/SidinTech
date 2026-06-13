# animations.md — Animation Playbook

All animation code patterns for the portfolio. Copy these exactly. Do not invent alternatives.

---

## CORE PRINCIPLES

- Animate `transform` and `opacity` only — never width, height, top, left, margin, padding
- Always add `will-change: transform` on elements that will animate
- Always check `prefers-reduced-motion` before animating
- Easing for entrances: `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, smooth settle
- Easing for exits: `cubic-bezier(0.4, 0, 1, 1)` — smooth start, fast end
- Duration sweet spot: 400–500ms for reveals, 150–200ms for micro-interactions

---

## REDUCED MOTION HOOK

```ts
// hooks/usePrefersReducedMotion.ts
import { useEffect, useState } from 'react'

export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
```

Usage in any component:
```ts
const prefersReduced = usePrefersReducedMotion()
// if prefersReduced: skip animation, show element immediately
```

---

## FRAMER MOTION VARIANTS

### Fade Up (standard entrance)
```ts
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}
```

### Fade Up with Delay
```ts
export const fadeUpDelayed = (delay: number) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      delay
    }
  }
})
```

### Stagger Container
```ts
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
}
```

### Stagger Item
```ts
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}
```

### Hero Headline Lines
```ts
// Each line of the hero headline
export const heroLine = (index: number) => ({
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      delay: index * 0.08
    }
  }
})
```

### Fade In Only (no movement)
```ts
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}
```

### Scale Up (for images on scroll)
```ts
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}
```

### Nav Slide Down
```ts
export const navSlideDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}
```

### Bold Statement (Boot Sequence)
```ts
export const boldStatement = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
  }
}
```

---

## FRAMER MOTION USAGE PATTERNS

### ScrollReveal Component (with Framer Motion)
```tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { fadeUp } from '@/lib/animations'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const prefersReduced = usePrefersReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### Stagger Group (skill badges, quick grid)
```tsx
<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '0px 0px -60px 0px' }}
  className="flex flex-wrap gap-2"
>
  {badges.map((badge) => (
    <motion.div key={badge} variants={staggerItem}>
      <StackBadge label={badge} />
    </motion.div>
  ))}
</motion.div>
```

### Project Image Hover
```tsx
<motion.div
  whileHover={{ scale: 1.03 }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  className="overflow-hidden rounded-2xl"
>
  <img ... />
</motion.div>
```

### Arrow Hover (project titles)
```tsx
<motion.span
  className="inline-block"
  whileHover={{ x: 6 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
>
  →
</motion.span>
```

### Boot Sequence Bold Statements (AnimatePresence)
```tsx
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence mode="wait">
  <motion.p
    key={currentStatement}
    variants={boldStatement}
    initial="hidden"
    animate="visible"
    exit="exit"
    style={{ color: statementColours[currentStatement] }}
    className="font-syne font-bold text-center"
  >
    {statements[currentStatement]}
  </motion.p>
</AnimatePresence>
```

---

## GSAP PATTERNS

### Setup (run once in LenisProvider or a dedicated setup file)
```ts
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
```

### Stacked Cards (IdentityCards.tsx)
```ts
useEffect(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.innerWidth < 768

  if (prefersReduced || isMobile) return

  const cards = gsap.utils.toArray<HTMLElement>('.identity-card')

  cards.forEach((card, index) => {
    if (index === cards.length - 1) return // last card stays

    gsap.to(card, {
      yPercent: -100,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#identity',
        start: `${index * 20}% top`,
        end: `${(index + 1) * 20}% top`,
        scrub: true,
      }
    })
  })

  return () => {
    ScrollTrigger.getAll().forEach(t => t.kill())
  }
}, [])
```

### Timeline Line Draw (Experience.tsx)
```ts
useEffect(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  gsap.fromTo('.timeline-line',
    { scaleY: 0 },
    {
      scaleY: 1,
      transformOrigin: 'top',
      ease: 'none',
      scrollTrigger: {
        trigger: '#experience',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      }
    }
  )

  return () => ScrollTrigger.getAll().forEach(t => t.kill())
}, [])
```

### Horizontal About Panels (About.tsx)
```ts
useEffect(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.innerWidth < 768

  if (prefersReduced || isMobile) return

  const panels = document.querySelector('.about-panels') as HTMLElement
  if (!panels) return

  gsap.to(panels, {
    xPercent: -75,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about-section',
      pin: true,
      scrub: 1,
      end: () => '+=' + panels.offsetWidth,
      invalidateOnRefresh: true,
    }
  })

  return () => ScrollTrigger.getAll().forEach(t => t.kill())
}, [])
```

### GitHub Contribution Graph Fill (Experience.tsx)
```ts
// Using CSS animation triggered by IntersectionObserver
// Add class 'graph-visible' when graph enters viewport
// CSS handles the fill animation

// In CSS / Tailwind arbitrary:
// .github-graph { opacity: 0; transition: opacity 800ms ease; }
// .github-graph.graph-visible { opacity: 1; }
```

---

## TYPEWRITER EFFECT (Boot Sequence Terminal)

```ts
// Pure JS/TS — no library needed
async function typeText(
  element: HTMLElement,
  text: string,
  charDelay = 120
): Promise<void> {
  return new Promise((resolve) => {
    let i = 0
    const interval = setInterval(() => {
      element.textContent += text[i]
      i++
      if (i >= text.length) {
        clearInterval(interval)
        resolve()
      }
    }, charDelay)
  })
}

async function runTerminalSequence(
  lines: string[],
  setLines: (lines: string[]) => void,
  onComplete: () => void
) {
  for (const line of lines) {
    await typeText(lineElement, line, 80)
    await sleep(400) // pause between lines
  }
  await sleep(500) // pause before transition
  onComplete()
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

---

## CUSTOM CURSOR

```ts
// hooks/useCustomCursor.ts
import { useEffect, useRef } from 'react'

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>()

  useEffect(() => {
    // Only on hover-capable devices
    if (!window.matchMedia('(hover: hover)').matches) return

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15)
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15)

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    // Cursor state changes based on data-cursor attribute
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]')
      const state = target?.getAttribute('data-cursor') || 'default'
      cursorRef.current?.setAttribute('data-state', state)
    }

    document.addEventListener('mouseover', onMouseOver)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return cursorRef
}
```

```tsx
// components/ui/CustomCursor.tsx
'use client'
import { useCustomCursor } from '@/hooks/useCustomCursor'

export default function CustomCursor() {
  const cursorRef = useCustomCursor()

  return (
    <div
      ref={cursorRef}
      className="
        fixed top-0 left-0 pointer-events-none z-[9999]
        -translate-x-1/2 -translate-y-1/2
        w-2 h-2 rounded-full bg-ink
        transition-[width,height,background,border] duration-200
        data-[state=link]:w-8 data-[state=link]:h-8
        data-[state=link]:bg-transparent data-[state=link]:border
        data-[state=link]:border-ink
        data-[state=view]:w-12 data-[state=view]:h-12
        data-[state=view]:bg-transparent data-[state=view]:border
        data-[state=view]:border-ink
      "
    />
  )
}
```

---

## SCROLL INDICATOR (Hero)

```tsx
// Bouncing arrow at bottom of hero
<motion.div
  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.5, duration: 0.5 }}
>
  <span className="font-satoshi text-[11px] uppercase tracking-widest text-ink/40">
    Scroll to Explore
  </span>
  <motion.div
    animate={{ y: [0, 6, 0] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
  >
    <ArrowDown size={16} className="text-ink/40" />
  </motion.div>
</motion.div>
```

---

## TIMING REFERENCE

| Interaction | Duration | Easing |
|---|---|---|
| Micro (hover, click) | 150–200ms | ease-out |
| Element reveal | 400–500ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Hero headline lines | 600ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Page/section transition | 600–800ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Stagger between children | 60ms | — |
| Bold statement hold | 1800ms | — |
| Bold statement fade | 300ms | ease |
| Typewriter per character | 80–120ms | — |
| Lenis scroll duration | 1200ms | custom exponential |
| GSAP scrub | 1 (smooth) | none (scrubbed) |
| Nav slide down | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Image hover scale | 400ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Arrow hover move | 200ms | cubic-bezier(0.16, 1, 0.3, 1) |

