# components.md — Component Specifications

Every component is defined here. Build exactly what is specified. Do not add props, features, or behaviour not listed.

---

## PROVIDERS

### LenisProvider
**File:** `components/providers/LenisProvider.tsx`
**Purpose:** Wraps entire app with Lenis smooth scroll, synced to GSAP ScrollTrigger
**Props:** `{ children: ReactNode }`
**Behaviour:**
- Initialises Lenis on mount with `duration: 1.2`
- Syncs `lenis.on('scroll', ScrollTrigger.update)`
- Adds to `gsap.ticker`
- Destroys on unmount
- Renders children with no wrapper element (React Fragment)

---

## UI COMPONENTS

### CustomCursor
**File:** `components/ui/CustomCursor.tsx`
**Purpose:** Replaces default browser cursor on desktop
**Props:** none
**Behaviour:**
- Only renders if `window.matchMedia('(hover: hover)').matches` — desktop only
- Default state: 8px filled circle, colour `#0D0D0D`, lerp 0.15 lag behind mouse
- Hover on `[data-cursor="link"]` elements: expands to 32px ring (border 1.5px, no fill)
- Hover on `[data-cursor="view"]` elements: 48px ring + `VIEW` text inside (11px Satoshi uppercase)
- Hover on `[data-cursor="skip"]` elements: 32px ring, colour `#00A8FF`
- Transition: `transform 0.15s linear, width 0.3s ease, height 0.3s ease`
- Add `data-cursor="link"` to: all nav links, CTAs, social links
- Add `data-cursor="view"` to: all project titles and images
- Position: fixed, pointer-events none, z-index 9999, mix-blend-mode: difference (optional)

### ScrollReveal
**File:** `components/ui/ScrollReveal.tsx`
**Purpose:** Reusable wrapper that animates children in on scroll
**Props:**
```ts
{
  children: ReactNode
  delay?: number        // ms delay before animation (default: 0)
  className?: string
  as?: keyof JSX.IntrinsicElements  // default: 'div'
}
```
**Behaviour:**
- Uses IntersectionObserver, threshold 0.1, rootMargin `0px 0px -60px 0px`
- Hidden state: `opacity: 0, transform: translateY(40px)`
- Revealed state: `opacity: 1, transform: translateY(0)`
- Transition: `500ms cubic-bezier(0.16, 1, 0.3, 1)`
- Delay applied via `transition-delay`
- Unobserves after first reveal (animate once only)
- If `prefers-reduced-motion`: skip animation, show immediately

### PillarBadge
**File:** `components/ui/PillarBadge.tsx`
**Purpose:** Coloured pill tag for pillar categories
**Props:**
```ts
{
  pillar: 'tech' | 'finance' | 'design' | 'product' | 'business'
  label: string
  size?: 'sm' | 'md'   // default: 'md'
}
```
**Styles:**
- Border: `1.5px solid {pillarColour}`
- Text: `{pillarColour}`
- Background: `{pillarColour}10` (10% opacity)
- Border-radius: `100px`
- Padding: sm=`4px 10px`, md=`6px 16px`
- Font: Satoshi, sm=`11px`, md=`13px`

### StackBadge
**File:** `components/ui/StackBadge.tsx`
**Purpose:** Tech stack pill tag (neutral styling)
**Props:**
```ts
{
  label: string
  size?: 'sm' | 'md'  // default: 'sm'
}
```
**Styles:**
- Border: `1px solid rgba(13,13,13,0.15)`
- Text: `#0D0D0D` at 60% opacity
- Background: transparent
- Border-radius: `100px`
- Padding: sm=`4px 10px`, md=`6px 14px`
- Font: Satoshi, sm=`11px`, md=`13px`

---

## SECTION COMPONENTS

### BootSequence
**File:** `components/sections/BootSequence.tsx`
**Purpose:** Full-screen intro experience before portfolio loads
**Props:**
```ts
{
  onComplete: () => void  // called when intro finishes or is skipped
}
```
**Internal state:**
- `phase: 'terminal' | 'statements' | 'done'`
- `currentLine: number` — which terminal line is typing
- `currentStatement: number` — which bold statement is showing
- `isSkipped: boolean`

**Behaviour:**
- Checks `sessionStorage.getItem('introSeen')` on mount — if true, call `onComplete()` immediately
- Phase 1 (terminal): type lines one by one, 120ms/char, 400ms between lines
- Phase 2 (statements): fade each in 300ms → hold 1800ms → fade out 300ms
- Phase 3: call `onComplete()`, set `sessionStorage.setItem('introSeen', 'true')`
- Skip button: fixed top-right, always visible, on click calls `onComplete()` immediately
- Background: `#F0F1F5`, full screen, z-index 100
- Terminal font: JetBrains Mono, 14px mobile / 16px desktop
- Statement font: Syne Bold, clamp(40px, 8vw, 96px)

**Terminal lines data:** (from content.md — Boot Sequence section)
**Statement data:** (from content.md — Bold Statements section)
**Statement colours:** `['#00A8FF', '#FF6B6B', '#00C896', '#FFB830', '#9B6DFF', '#0D0D0D']`

### FloatingNav
**File:** `components/sections/FloatingNav.tsx`
**Purpose:** Persistent floating pill navigation
**Props:**
```ts
{
  visible: boolean  // controlled by parent — false during intro
  activeSection: string  // current section id
}
```
**Behaviour:**
- Pill shape: `border-radius: 100px`, frosted glass background
- Fixed position: `top: 20px`, `left: 50%`, `transform: translateX(-50%)`
- Slides down on `visible` becoming true: `translateY(-100%) → translateY(0)`, 300ms ease-out
- Active nav item: text colour changes to section pillar colour
  - `#hero` → `#00A8FF`
  - `#work` → `#00C896`
  - `#experience` → `#00A8FF`
  - `#skills` → `#9B6DFF`
  - `#about` → `#FFB830`
  - `#contact` → `#FF6B6B`
- Desktop: shows all links inline
- Mobile: shows `Sid` + hamburger icon → click opens full-screen menu overlay
- Full-screen menu: `#0D0D0D` background, links in large Syne Bold, white text
- All nav links: `data-cursor="link"`
- Smooth scroll to section on click (Lenis handles this)

**Nav items:** (from content.md — Floating Nav section)

### Hero
**File:** `components/sections/Hero.tsx`
**Purpose:** First section after intro
**Props:** none
**Behaviour:**
- Full viewport height: `min-height: 100vh`
- Desktop: two-column — text left 60%, right 40% empty
- Mobile: single column, left-aligned
- Headline: Syne Bold, clamp(48px, 8vw, 96px), `#0D0D0D`
- Headline reveals line by line: stagger 80ms, translateY 40px → 0, opacity 0 → 1, 400ms
- Subtext: Satoshi Regular, 18px, `#0D0D0D` at 65% opacity — appears after headline (200ms delay)
- CTAs: appear after subtext (400ms delay)
  - `[See My Work]` → scrolls to `#work`
  - `[Let's Talk]` → scrolls to `#contact`
- CTA pill style: `border-radius: 100px`, `padding: 14px 28px`, Satoshi Medium 15px
- Scroll indicator: bottom of section, `SCROLL TO EXPLORE`, 11px Satoshi uppercase, animated arrow bouncing down, fades out after 20% scroll
- All copy: from content.md — Hero section

### IdentityCards
**File:** `components/sections/IdentityCards.tsx`
**Purpose:** Stacked scroll card experience — cydstumpel.nl inspired
**Props:** none
**Behaviour:**
- Outer wrapper: `id="identity"`, `height: 500vh`, `position: relative`
- Inner sticky container: `position: sticky`, `top: 0`, `height: 100vh`, `overflow: hidden`
- 5 cards: `position: absolute`, `inset: 0`, z-index 50/40/30/20/10
- GSAP ScrollTrigger scrubs each card's `yPercent` and `opacity` as user scrolls
- Card 1 (z:50) peels first, Card 5 (z:10) stays until end
- Each card: full viewport, left border 4px solid pillar colour, padding 48px desktop / 32px mobile
- Card layout (top to bottom):
  - Label: 11px Satoshi uppercase, pillar colour — e.g. "TECH · 01"
  - Phosphor icon: 48px duotone, pillar colour
  - Title: Syne Bold clamp(64px, 12vw, 120px), `#0D0D0D`
  - Description: Satoshi Regular 18px, `#0D0D0D` 70% opacity, max-width 580px
  - Tags: `PillarBadge` components, flex-wrap, gap 8px
- Mobile: no sticky, no GSAP — cards stack vertically, height auto, normal flow
- All card data: from content.md — Identity Cards section
- Icons:
  - Tech → `<Code weight="duotone" size={48} color="#00A8FF" />`
  - Finance → `<ChartLine weight="duotone" size={48} color="#00C896" />`
  - Design → `<PaintBrush weight="duotone" size={48} color="#9B6DFF" />`
  - Product → `<Lightbulb weight="duotone" size={48} color="#FFB830" />`
  - Business → `<Buildings weight="duotone" size={48} color="#FF6B6B" />`

### Projects
**File:** `components/sections/Projects.tsx`
**Purpose:** Project showcase — lusion.co editorial style
**Props:** none
**Behaviour:**
- Section header: `SELECTED WORK` — 11px Satoshi uppercase, tracking-widest, `#0D0D0D` 40% opacity
- NO cards, NO gradients, NO coloured backgrounds
- Each project entry (top to bottom):
  1. Image: full-width, aspect-ratio 16/9, border-radius 16px, `bg-[#E8E9ED]` placeholder
  2. Category tags: 11px Satoshi uppercase, tracking-widest, `#0D0D0D` 40% opacity, `• ` separator
  3. Arrow + Title: `→` in pillar colour + Syne Bold 32px mobile / 48px desktop `#0D0D0D`
  4. Headline (subline): Satoshi Regular 16px, `#0D0D0D` 60% opacity
  5. Description: Satoshi Regular 15px, `#0D0D0D` 55% opacity, max-width 640px
  6. Stack badges: `StackBadge` components
  7. Links: Satoshi Medium 14px, `#0D0D0D`, arrow `→`, hover → pillar colour
  8. Client note (if applicable): 11px Satoshi, `#0D0D0D` 40% opacity
- Gap between projects: 80px desktop / 56px mobile
- Scroll-in animation: image scale 0.98→1 + fade up, 400ms ease-out (ScrollReveal wrapper)
- Hover (desktop only): image scale 1.03 over 400ms, arrow moves 6px right
- Image: `data-cursor="view"`, title: `data-cursor="view"`
- Quick grid: 3-column desktop / 1-column mobile, smaller cards (image + tags + title only)
- 48px gap above quick grid, small section label: `MORE WORK`
- All project data: from content.md — Projects section

### Experience
**File:** `components/sections/Experience.tsx`
**Purpose:** Work timeline + GitHub stats
**Props:** none
**Behaviour:**
- Section header: `EXPERIENCE` — 11px Satoshi uppercase, tracking-widest
- Timeline: vertical line left side, grows downward via `scaleY` as user scrolls (GSAP ScrollTrigger)
- Line colour: `#0D0D0D` at 12% opacity
- Each entry: ScrollReveal wrapper, translateY 30px → 0
  - Coloured dot marker (pillar colour) on the timeline line
  - Company/org name: Syne Bold 20px
  - Role: Satoshi Medium 16px, `#0D0D0D` 80% opacity
  - Badge: small pill `[Full-time · Current]` or `[Intern · Previously]`
  - Description: Satoshi Regular 15px, `#0D0D0D` 65% opacity
  - Bullets: Satoshi Regular 14px, `#0D0D0D` 60% opacity, `—` prefix
- Entry colours from content.md — Experience section
- Gap between entries: 56px

**GitHub Stats block** (below timeline, ScrollReveal):
- Three large stat numbers: Syne Bold clamp(48px, 8vw, 80px), `#0D0D0D`
- Stat label: Satoshi Regular 14px, `#0D0D0D` 50% opacity
- Stats layout: 3-column flex, centered
- Contribution graph: embed `https://ghchart.rshah.org/00C896/SiD-20s` as `<img>` with `loading="lazy"`
- Graph animates in with ScrollReveal
- Caption: Satoshi Regular 13px, `#0D0D0D` 40% opacity
- All stats data: from content.md — GitHub Stats section

### Skills
**File:** `components/sections/Skills.tsx`
**Purpose:** Skills grouped by pillar with stagger reveal
**Props:** none
**Behaviour:**
- Section header: `SKILLS` — 11px Satoshi uppercase, tracking-widest
- 7 skill groups, each wrapped in ScrollReveal
- Each group:
  - Pillar colour dot + group label in pillar colour: Satoshi Medium 13px uppercase
  - Group headline (e.g. "Ship Anything"): Syne Bold 24px, `#0D0D0D`
  - Badges: `StackBadge` components, flex-wrap, gap 8px
  - Stagger: badges appear 40ms apart after group enters viewport
- Layout: 2-column desktop / 1-column mobile
- Gap between groups: 48px desktop / 32px mobile
- All skill data: from content.md — Skills section

### About
**File:** `components/sections/About.tsx`
**Purpose:** Horizontal scroll story panels
**Props:** none
**Behaviour:**
- Section header: `ABOUT` — 11px Satoshi uppercase, tracking-widest (above sticky container)
- GSAP ScrollTrigger: pin container, scrub panels horizontally
- Outer: `id="about-section"`, position relative
- Inner sticky: `position: sticky, top: 0, height: 100vh, overflow: hidden`
- Panels container: `display: flex, width: 400vw`
- 4 panels, each `width: 100vw, height: 100vh, padding: 80px desktop / 40px mobile`
- Each panel layout:
  - Decorative number: Syne Bold clamp(120px, 20vw, 200px), pillar colour at 8% opacity, absolute positioned top-right
  - Panel number + title: Satoshi Medium 13px uppercase, pillar colour — e.g. `01 — THE ENGINEER`
  - Body text: Syne (not Satoshi) 24px desktop / 18px mobile, `#0D0D0D`, max-width 600px, line-height 1.5
- Panel colours: Panel 1 `#00A8FF`, Panel 2 `#00C896`, Panel 3 `#9B6DFF`, Panel 4 `#FFB830`
- GSAP setup:
  ```ts
  gsap.to('.about-panels', {
    xPercent: -75,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about-section',
      pin: true,
      scrub: 1,
      end: () => '+=' + (document.querySelector('.about-panels') as HTMLElement).offsetWidth,
    }
  })
  ```
- Mobile: remove GSAP, panels stack vertically, height auto, no sticky
- All panel copy: from content.md — About section

### Contact
**File:** `components/sections/Contact.tsx`
**Purpose:** Final dark section — the close
**Props:** none
**Behaviour:**
- Background: `#0D0D0D` — ONLY dark section on the site
- Full viewport height minimum: `min-height: 100vh`
- Content vertically and horizontally centered
- Headline: Syne Bold clamp(40px, 7vw, 80px), white, centered, 3 lines (from content.md)
- Contact links: flex row, gap 32px, Satoshi Medium 16px, white
  - Hover: colour transitions to pillar colour (email→tech, LinkedIn→finance, GitHub→design)
  - Transition: 200ms ease
  - `data-cursor="link"` on all three
- Footer: below links, 48px margin top, Satoshi Regular 12px, white at 30% opacity
- All copy: from content.md — Contact section

---

## PAGE ASSEMBLY

### app/page.tsx
```tsx
'use client'
import { useState, useEffect } from 'react'
import BootSequence from '@/components/sections/BootSequence'
import FloatingNav from '@/components/sections/FloatingNav'
import Hero from '@/components/sections/Hero'
import IdentityCards from '@/components/sections/IdentityCards'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import CustomCursor from '@/components/ui/CustomCursor'

export default function Page() {
  const [introComplete, setIntroComplete] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  // IntersectionObserver to track active section for nav highlighting
  useEffect(() => {
    if (!introComplete) return
    const sections = ['hero', 'identity', 'work', 'experience', 'skills', 'about', 'contact']
    const observers = sections.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(obs => obs?.disconnect())
  }, [introComplete])

  return (
    <>
      <CustomCursor />
      {!introComplete && <BootSequence onComplete={() => setIntroComplete(true)} />}
      {introComplete && (
        <main>
          <FloatingNav visible={introComplete} activeSection={activeSection} />
          <Hero />
          <IdentityCards />
          <Projects />
          <Experience />
          <Skills />
          <About />
          <Contact />
        </main>
      )}
    </>
  )
}
```

### app/layout.tsx
```tsx
import type { Metadata } from 'next'
import { LenisProvider } from '@/components/providers/LenisProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Siddharth B — Full-stack & AI Engineer',
  description: 'Engineer who thinks beyond the code. Builder who understands your business model, your users, and your market — then ships the product to serve all three.',
  keywords: ['Full-stack Engineer', 'AI Engineer', 'Founding Engineer', 'Coimbatore', 'India'],
  openGraph: {
    title: 'Siddharth B — Full-stack & AI Engineer',
    description: 'Engineer who thinks beyond the code.',
    url: 'https://sidintech.dev',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-canvas text-ink antialiased">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
```

### app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --canvas: #F0F1F5;
  --ink: #0D0D0D;
  --tech: #00A8FF;
  --finance: #00C896;
  --design: #9B6DFF;
  --product: #FFB830;
  --business: #FF6B6B;
}

* {
  cursor: none; /* hide default cursor on desktop */
}

@media (hover: none) {
  * { cursor: auto; } /* restore on touch */
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--canvas);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

