# Portfolio Outcome — Complete Expectations, Design, Story & Creativity

## Vision in One Line
A creative, storytelling, self-promotional portfolio experience that sells Sid — not just lists his skills.

## The Core Positioning
> "Engineer who thinks beyond the code. Builder who understands your business model, your users, and your market — then ships the product to serve all three."

---

## Target Audience
1. Startup founders hiring Founding Engineer / AI Engineer
2. Freelance clients needing full-stack + AI + business-aware engineering

---

## Tone & Voice
- **Confident, specific, never vague**
- Self-promotional — this is a personal sales page, not a humble resume
- Every line earns its place — no filler, no "I'm passionate about technology"
- Specific claims backed by proof: "603 commits", "₹34,000 in gains", "3 years of investing"
- Speaks the language of founders: CAC, business models, outcomes, not just features

---

## Design System

### Background
`#F0F1F5` — light grey-white (NOT pure white, NOT cream, NOT dark)
Only exception: Contact section uses `#0D0D0D` dark background for dramatic final statement

### Typography
- **Display / Headlines:** Syne Bold (geometric, distinctive, free Google Fonts)
- **Body:** Satoshi Regular (clean, modern, free Fontshare)
- **Terminal / Code:** JetBrains Mono (free Google Fonts)

### Five Pillar Colour System
Used as accents ONLY — never as full background fills:
- **Tech:** `#00A8FF` Electric Blue
- **Finance:** `#00C896` Emerald Green
- **Design:** `#9B6DFF` Soft Purple
- **Product:** `#FFB830` Warm Amber
- **Business:** `#FF6B6B` Coral Red

Pillar colours appear on: card accents, tag pills, timeline markers, skill badge borders, nav active states, CTA hovers — consistently throughout.

### Design Rules
- Generous whitespace — every element earns its place
- Custom cursor: small filled dot, slight lag (lerp 0.15), expands to ring on hover
- Smooth scroll throughout — no jarring jumps
- Bold typography does heavy lifting — not colour, not decoration
- All animations: transform + opacity only (GPU composited, no layout thrashing)
- `prefers-reduced-motion` respected always

---

## Design References
- **lusion.co** — hero typography scale, light background `#F0F1F5`, flowing scroll document feel, project layout (image → tags → arrow + title), "SCROLL TO EXPLORE" indicator, massive bold type
- **cydstumpel.nl** — stacked card scroll interaction for identity section, card peeling animation
- **Overall aesthetic** — premium, minimal, colourful, editorial, cinematic scroll

---

## Responsiveness
Every section must work perfectly on:
- **Mobile:** `< 768px`
- **Tablet:** `768px – 1023px`
- **Desktop:** `≥ 1024px`

---

## Section-by-Section Breakdown

---

### SECTION 1 — BOOT SEQUENCE (Full screen, nav hidden)

**Purpose:** Hook the visitor immediately. Make them feel this is different from every other portfolio.

**Phase 1 — Terminal (JetBrains Mono, dark text on light background)**
Lines type out one by one, typewriter effect, 120ms per character, 400ms pause between lines:
```
> Initialising Siddharth B...
> Commits: 603  Products: 2  Problems solved: Real ones
> Experience: Engineering × Business × Finance × Design
> Status: Building. Always.
> Story ready. Loading...  ██████████ 100%
```
Progress bar fills over 800ms on last line.

**Phase 2 — Bold statements (after terminal fades)**
Full screen. Each statement auto-advances. Syne Bold, massive typography (clamp 48px → 96px).
Each fades in 300ms → holds 1800ms → fades out 300ms. Each in its pillar colour:
1. "I ship." — `#00A8FF`
2. "I understand your business model." — `#FF6B6B`
3. "I've read the same books your investors have." — `#00C896`
4. "I built a fintech app because I lived the problem." — `#FFB830`
5. "I don't just write code. I understand why it matters." — `#9B6DFF`
6. "Now — what are you building?" — `#0D0D0D`

**Phase 3:** Final statement fades → smooth crossfade into hero → nav slides down.

**Skip button:** "Skip intro →" fixed top right, 12px, visible from start, skips to hero immediately.

---

### SECTION 2 — FLOATING NAV (appears after intro)

Pill-shaped, fixed, horizontally centered, top: 20px.
Frosted glass: `rgba(240,241,245,0.85)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(13,13,13,0.08)`, `border-radius: 100px`

Contents: `Sid` · `Work` · `Experience` · `Skills` · `About` · `Contact`

- `Sid` — Syne Bold, links to top of page
- Active section nav item glows in its pillar colour
- Slides down from top after intro (300ms ease-out)
- Mobile: collapses to `Sid` + hamburger → full screen menu overlay

---

### SECTION 3 — HERO (id="hero")

Full viewport height. Large Syne Bold headline, line-by-line stagger reveal:
```
Siddharth B
Engineer who thinks
beyond the code.
```

Subtext (Satoshi Regular, 18px, 65% opacity):
```
Builder who understands your business model,
your users, and your market —
then ships the product to serve all three.
```

CTAs:
- `[See My Work]` — outlined pill, hover fills dark
- `[Let's Talk]` — filled dark pill, hover turns `#00A8FF`

Bottom: `SCROLL TO EXPLORE` indicator — 11px uppercase, animated down arrow, fades on scroll.

---

### SECTION 4 — IDENTITY CARDS — STACKED SCROLL (id="identity")

**Inspired by cydstumpel.nl — the card peeling interaction.**

**Mechanism:** Sticky scroll container `height: 500vh`. 5 cards stacked (position: absolute, z-index 5 to 1). As user scrolls, top card slides UP and out revealing next card underneath. Each card occupies 100vh of scroll progress.

**Each card:**
- Full viewport height
- Left border: 4px solid pillar colour
- Top-left label: "TECH · 01" — 11px Satoshi uppercase, pillar colour
- Massive title: Syne Bold, clamp(64px, 12vw, 120px)
- Description: Satoshi Regular, 18px, max-width 580px
- Bottom: tag pills in pillar colour outline style

**Five cards:**

Card 1 — **TECH** (`#00A8FF`) z-index 5
> "I build across the entire stack — from React interfaces to FastAPI backends, AWS infrastructure to AI pipelines. 603 commits, 2 production-grade AI systems, and hands-on depth in system design, networking, DevOps, and cloud. I don't just know the tools — I've shipped with them."
Tags: Full-stack · AI/LLM · DevOps · System Design · Cloud · Networking

Card 2 — **FINANCE** (`#00C896`) z-index 4
> "Three years of personal investing using fundamental and technical analysis — reading Peter Lynch, Phil Fisher, and understanding market behaviour under stress. That knowledge didn't stay theoretical. It became FinSight AI — a real product born from a real problem I lived."
Tags: Fundamental Analysis · Technical Analysis · Investing · FinTech

Card 3 — **DESIGN** (`#9B6DFF`) z-index 3
> "I've designed interfaces people actually want to use — from wireframes and user research to high-fidelity Figma prototypes. At Kalaiworks I worked directly with creative teams, understanding how design drives business outcomes, not just aesthetics."
Tags: UI/UX · Figma · Prototyping · User Research · Design Systems

Card 4 — **PRODUCT** (`#FFB830`) z-index 2
> "I identify real problems before writing a single line of code. FinSight AI started with user interviews, surveys, and validated pain points — not assumptions. I think in personas, phases, and business models. Building the right thing matters as much as building it right."
Tags: User Research · Problem Identification · Personas · Roadmapping

Card 5 — **BUSINESS** (`#FF6B6B`) z-index 1
> "I understand how businesses actually make money — B2B, B2C, and DTC models, performance marketing, growth infrastructure, and creative strategy. As Chairperson of the Entrepreneurship Vertical at YI Yuva, I've operated at the intersection of technology and commerce."
Tags: B2B · B2C · DTC · Performance Marketing · Growth · YI Yuva

**Mobile:** Cards stack vertically, no sticky animation, normal document flow.

---

### SECTION 5 — PROJECTS (id="work")

**Inspired by lusion.co — editorial, image-first, NO cards, NO gradients.**

Section header: `SELECTED WORK` — 11px Satoshi uppercase, tracking-widest, 40% opacity.

Each project entry layout (top to bottom):
1. Full-width image/placeholder (16:9, border-radius 16px)
2. Category tags — 11px Satoshi uppercase, tracking-widest, 40% opacity
3. Arrow + Project name — Syne Bold 48px, arrow in pillar colour
4. One-line description — Satoshi Regular 16px, 60% opacity
5. Stack badges — small pills, minimal style
6. Links

On scroll-in: image scales 98% → 100% + fade up (400ms ease-out).
On hover desktop: image scales to 1.03, arrow moves 6px right.

**Projects in order:**

1. **FinSight AI** — `#00C896` arrow
   Tags: `FINTECH • AI • FULL-STACK • PRODUCT`
   "I panic almost sold ₹34,000 in gains. No app stopped me. So I built one."

2. **CodeLens AI** — `#00A8FF` arrow
   Tags: `AI • RAG • FULL-STACK • DEVELOPER TOOLS`
   "Developers waste days understanding unfamiliar codebases. I built the solution."

3. **AI Asset Management System** — `#9B6DFF` arrow
   Tags: `AI • DESKTOP • CREATIVE TOOLS • CLIENT WORK`
   "Built the creative team's entire digital brain."
   Badge: `Client work — no public demo`

4. **DevOps Habit Tracker** — `#00A8FF` arrow
   Tags: `DEVOPS • CLOUD • FULL-STACK`
   "A MERN app wrapped in a full production DevOps pipeline."

Quick Grid (3 smaller): Real-Time Chat · File-Share · E-commerce

---

### SECTION 6 — EXPERIENCE + GITHUB (id="experience")

**Timeline draws itself on scroll.** Vertical line grows downward. Each entry fades in (translateY 30px → 0).

**Kalaiworks — Full-stack & AI Engineer** (Full-time · Current) `#00A8FF`
"Building AI systems, automation pipelines, and creative tools at a performance marketing company."
- AI-driven asset management for photoshoot workflows
- Creator discovery automation via Playwright + Meta scraping
- Cross-functional: engineering × marketing × creative

**Kalaiworks — AI Developer Intern** (Previously) `#00A8FF` 50% opacity
"Started as intern, converted to full-time."

**YI Yuva (CII) — Chairperson, Entrepreneurship Vertical** `#FF6B6B`
"Led entrepreneurship vertical at Young Indians — youth wing of CII."

**GitHub Stats (animates in on scroll):**
Large Syne Bold numbers: `603` contributions · `95%` commits · `2` AI products
Contribution graph fills left-to-right on viewport entry (green `#00C896`)
Caption: `@SiD-20s · kalaiworks org + personal projects`

---

### SECTION 7 — SKILLS (id="skills")

Skill groups emerge on scroll — group fades in, then badges stagger 40ms apart.

Groups with pillar colours and headline labels:
- **Tech `#00A8FF`** — "Ship Anything"
- **AI/LLM `#00A8FF`** — "Make it Intelligent"
- **Cloud & DevOps `#00A8FF`** — "Make it Scale"
- **Data & Automation `#00A8FF`** — "Make it Run"
- **Design `#9B6DFF`** — "Make it Beautiful"
- **Business & Marketing `#FF6B6B`** — "Make it Work Commercially"
- **Finance `#00C896`** — "Make it Make Sense"

Badge style: border + text in pillar colour, subtle pillar colour background tint, pill shape.

---

### SECTION 8 — ABOUT (id="about")

**Horizontal scroll inside vertical scroll — 4 story panels.**
Sticky container pinned. Panels translate horizontally as user scrolls vertically.
Mobile: becomes vertical scroll, panels stack.

Panel 1 — **The Engineer** (`#00A8FF` decorative number `01`)
> "I started where most engineers do — building things because I could. Then I got embedded inside a marketing company and realised building things because the business needs them is a completely different skill. I learned both."

Panel 2 — **The Investor** (`#00C896` decorative number `02`)
> "For 3 years I've been analysing stocks the way Peter Lynch and Phil Fisher taught — understanding businesses, not just charts. When the market crashed and I almost panic sold ₹34,000 in gains, I realised no app was solving the real problem. So I built one."

Panel 3 — **The Builder** (`#9B6DFF` decorative number `03`)
> "CodeLens AI. FinSight AI. AI asset management systems. Electron desktop apps. Marketing automation pipelines. I build across domains because real problems don't respect technical boundaries. 603 commits last year. Still building."

Panel 4 — **The Thinker** (`#FFB830` decorative number `04`)
> "Outside of code I read about finance, philosophy, geopolitics, history, and economics. Not as hobbies — as lenses. Understanding why markets behave the way they do, why businesses succeed or fail, why people make irrational decisions — that's what makes a builder dangerous."

---

### SECTION 9 — CONTACT (id="contact")

**Only dark section** `#0D0D0D` — creates dramatic final statement contrast.

Large Syne Bold centered white text:
```
If you're building
something real —
let's talk.
```

Three contact links (white, hover → pillar colour):
`sid@sidintech.dev` · `LinkedIn @SidinTech` · `GitHub @SiD-20s`

Footer: `© 2026 Siddharth B · Designed & Built by Sid · Coimbatore, India` — 12px, 30% opacity white.

---

## Global Interactions

### Custom Cursor (desktop only)
- Default: 8px filled circle `#0D0D0D`, lerp 0.15 lag
- On links/buttons: expands to 32px ring
- On project titles: expands + shows "VIEW" text
- Disabled on touch devices

### Scroll Animations (all elements)
- `translateY(40px) → 0` + `opacity: 0 → 1`
- Duration: 500ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Trigger: element 80px from viewport bottom
- Stagger children: 60ms apart
- Respect `prefers-reduced-motion`

### Active Nav
- Current section item glows in section pillar colour

---

## Tech Stack to Build With (Claude Code)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion + GSAP ScrollTrigger
- **Smooth scroll:** Lenis
- **Fonts:** Syne (Google) + Satoshi (Fontshare) + JetBrains Mono (Google)
- **Icons:** Lucide React (minimal)
- **Deploy:** Vercel

---

## What Makes This Portfolio Different From Every Other Developer Portfolio
1. It's a story — not a resume
2. It sells — every line promotes, nothing is modest
3. It's interactive — scroll drives the narrative
4. It's colourful with intention — 5 pillar colours, each meaningful
5. It proves skill through execution — the portfolio itself is the work
6. It speaks to founders — business models, outcomes, real problems solved
7. It has a founding story — ₹34,000 in gains, panic sell avoided, product built
8. It shows range — Tech × Finance × Design × Product × Business



---

## Tech Stack (Updated — Final)

### Framework
**Next.js 14** (App Router) — React framework, Vercel deployment, SSR/SSG support

### Styling
**Tailwind CSS** — utility-first, fast to build, works perfectly with Next.js

### Animations
**Framer Motion** — component-level animations, page transitions, scroll reveals
**GSAP + ScrollTrigger** — stacked card scroll, horizontal about section, complex scroll-driven interactions

### Smooth Scroll
**Lenis** (`@studio-freight/lenis`) — physics-based smooth scroll, syncs with GSAP ScrollTrigger

### Icons
**Phosphor Icons** (`@phosphor-icons/react`) — recommended
- 6 weights: thin, light, regular, bold, fill, duotone
- Use **duotone** weight with pillar colours on identity cards
- Use **regular** weight everywhere else
- Modern, editorial, fits the colourful pillar system perfectly

Icon mapping to identity cards:
- Tech card → `<Code weight="duotone" color="#00A8FF" />`
- Finance card → `<ChartLine weight="duotone" color="#00C896" />`
- Design card → `<PaintBrush weight="duotone" color="#9B6DFF" />`
- Product card → `<Lightbulb weight="duotone" color="#FFB830" />`
- Business card → `<Buildings weight="duotone" color="#FF6B6B" />`

### Fonts
- **Syne** — Google Fonts (display/headlines)
- **Satoshi** — Fontshare (body text)
- **JetBrains Mono** — Google Fonts (terminal/code)

### GitHub Stats
**GitHub API** — live contribution data for stats section (`@SiD-20s`)

### Deployment
**Vercel** — free tier, auto-deploy from GitHub, perfect for Next.js

---

## Install Commands

```bash
npx create-next-app@latest sid-portfolio --typescript --tailwind --app
cd sid-portfolio
npm install framer-motion gsap @studio-freight/lenis @phosphor-icons/react
```

### Satoshi font — add to `app/layout.tsx`
```html
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
```

### Syne + JetBrains Mono — add to `app/layout.tsx`
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

### Tailwind font config — `tailwind.config.ts`
```js
theme: {
  extend: {
    fontFamily: {
      syne: ['Syne', 'sans-serif'],
      satoshi: ['Satoshi', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    colors: {
      tech: '#00A8FF',
      finance: '#00C896',
      design: '#9B6DFF',
      product: '#FFB830',
      business: '#FF6B6B',
      ink: '#0D0D0D',
      canvas: '#F0F1F5',
    }
  }
}
```
