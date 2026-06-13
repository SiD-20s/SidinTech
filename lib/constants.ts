export const PILLAR_COLOURS = {
  tech: '#00A8FF',
  finance: '#00C896',
  design: '#9B6DFF',
  product: '#FFB830',
  business: '#FF6B6B',
} as const

export type Pillar = keyof typeof PILLAR_COLOURS

export const NAV_ITEMS = [
  { label: 'Sid', href: '#hero' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const

export const SECTION_PILLAR: Record<string, string> = {
  hero: '#00A8FF',
  identity: '#00A8FF',
  work: '#00C896',
  experience: '#00A8FF',
  skills: '#9B6DFF',
  about: '#FFB830',
  contact: '#FF6B6B',
}

export const IDENTITY_CARDS = [
  {
    pillar: 'tech' as const,
    label: 'TECH · 01',
    title: 'TECH',
    description:
      'I build across the entire stack — from React interfaces to FastAPI backends, AWS infrastructure to AI pipelines. 603 commits, 2 production-grade AI systems, and hands-on depth in system design, networking, DevOps, and cloud. I don\'t just know the tools — I\'ve shipped with them.',
    tags: ['Full-stack', 'AI/LLM', 'DevOps', 'System Design', 'Cloud', 'Networking'],
    zIndex: 50,
  },
  {
    pillar: 'finance' as const,
    label: 'FINANCE · 02',
    title: 'FINANCE',
    description:
      'Three years of personal investing using fundamental and technical analysis — reading Peter Lynch, Phil Fisher, and understanding market behaviour under stress. That knowledge didn\'t stay theoretical. It became FinSight AI — a real product born from a real problem I lived.',
    tags: ['Fundamental Analysis', 'Technical Analysis', 'Investing', 'FinTech'],
    zIndex: 40,
  },
  {
    pillar: 'design' as const,
    label: 'DESIGN · 03',
    title: 'DESIGN',
    description:
      'I\'ve designed interfaces people actually want to use — from wireframes and user research to high-fidelity Figma prototypes. At Kalaiworks I worked directly with creative teams, understanding how design drives business outcomes, not just aesthetics.',
    tags: ['UI/UX', 'Figma', 'Prototyping', 'User Research', 'Design Systems'],
    zIndex: 30,
  },
  {
    pillar: 'product' as const,
    label: 'PRODUCT · 04',
    title: 'PRODUCT',
    description:
      'I identify real problems before writing a single line of code. FinSight AI started with user interviews, surveys, and validated pain points — not assumptions. I think in personas, phases, and business models. Building the right thing matters as much as building it right.',
    tags: ['User Research', 'Problem Identification', 'Personas', 'Roadmapping'],
    zIndex: 20,
  },
  {
    pillar: 'business' as const,
    label: 'BUSINESS · 05',
    title: 'BUSINESS',
    description:
      'I understand how businesses actually make money — B2B, B2C, and DTC models, performance marketing, growth infrastructure, and creative strategy. As Chairperson of the Entrepreneurship Vertical at YI Yuva, I\'ve operated at the intersection of technology and commerce.',
    tags: ['B2B', 'B2C', 'DTC', 'Performance Marketing', 'Growth', 'YI Yuva'],
    zIndex: 10,
  },
] as const

export const PROJECTS = [
  {
    title: 'FinSight AI',
    image: 'https://picsum.photos/seed/finsight-ai/1200/675',
    categoryTags: 'FINTECH • AI • FULL-STACK • PRODUCT',
    headline: 'I panic almost sold ₹34,000 in gains. No app stopped me. So I built one.',
    description:
      'A crash-day intelligence tool for Indian retail investors. When a stock drops 5%+, it delivers a verdict in 2 seconds — emotional or fundamental — using historical patterns, fundamentals analysis, and institutional flow data. Born from 3 years of personal investing and real user research.',
    stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'TimescaleDB', 'Redis', 'WebSockets', 'Supabase', 'Python'],
    pillarTags: ['Finance', 'Product'],
    arrowColour: '#00C896',
    links: [
      { label: 'GitHub →', href: 'https://github.com/SiD-20s' },
      { label: 'Case Study →', href: '#' },
    ],
    clientNote: null,
  },
  {
    title: 'CodeLens AI',
    image: 'https://picsum.photos/seed/codelens-ai/1200/675',
    categoryTags: 'AI • RAG • FULL-STACK • DEVELOPER TOOLS',
    headline: 'Developers waste days understanding unfamiliar codebases. I built the solution.',
    description:
      'A browser-based codebase onboarding copilot. Submit a GitHub URL — get an interactive architecture map, a personalised learning path adapted to your skill level, and a RAG-powered chat where every answer cites exact file paths and line numbers. Built solo to production-grade standards.',
    stack: ['Next.js', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'LangChain', 'Tree-sitter', 'React Flow'],
    pillarTags: ['Tech'],
    arrowColour: '#00A8FF',
    links: [{ label: 'GitHub →', href: 'https://github.com/SiD-20s' }],
    clientNote: null,
  },
  {
    title: 'AI Asset Management System',
    image: 'https://picsum.photos/seed/asset-mgmt-ai/1200/675',
    categoryTags: 'AI • DESKTOP • CREATIVE TOOLS • CLIENT WORK',
    headline: "Built the creative team's entire digital brain.",
    description:
      'An AI-driven asset management and search system for large-scale marketing photoshoots. Structured model inference instead of embeddings. A complete tool covering the entire creative generation lifecycle — from asset ingestion to intelligent retrieval to team collaboration. Delivered as a desktop application via Electron.',
    stack: ['Electron', 'Node.js', 'Python', 'FastAPI', 'AI Inference', 'React'],
    pillarTags: ['Design', 'Business'],
    arrowColour: '#9B6DFF',
    links: [],
    clientNote: 'Client work — no public demo',
  },
  {
    title: 'DevOps Habit Tracker',
    image: 'https://picsum.photos/seed/devops-tracker/1200/675',
    categoryTags: 'DEVOPS • CLOUD • FULL-STACK',
    headline: 'A MERN app wrapped in a full production DevOps pipeline.',
    description:
      'Integrated a Habit Tracker application into a complete CI/CD pipeline — Docker containerisation, GitHub Actions, AWS deployment, shell scripting, and automated delivery from commit to production.',
    stack: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS', 'GitHub Actions', 'Shell Scripting'],
    pillarTags: ['Tech'],
    arrowColour: '#00A8FF',
    links: [{ label: 'GitHub →', href: 'https://github.com/SiD-20s/DevopsInMERN' }],
    clientNote: null,
  },
] as const

export const QUICK_GRID_PROJECTS = [
  {
    title: 'Real-Time Chat App',
    tags: 'MERN • Socket.io • JWT',
    link: 'https://github.com/SiD-20s',
    image: 'https://picsum.photos/seed/realtime-chat/800/450',
  },
  {
    title: 'File-Share',
    tags: 'Next.js • Supabase • Clerk',
    link: 'https://github.com/SiD-20s',
    image: 'https://picsum.photos/seed/file-share-app/800/450',
  },
  {
    title: 'E-commerce',
    tags: 'React • Tailwind • PayPal',
    link: 'https://github.com/SiD-20s',
    image: 'https://picsum.photos/seed/ecommerce-app/800/450',
  },
] as const

export const KALAIWORKS_ENTRY = {
  year: 'Nov 2025\nPresent',
  company: 'Kalaiworks',
  intern: {
    title: 'AI Developer Intern',
    date: 'Nov 2025 — Apr 2026',
    badge: 'Intern · Previously',
    description:
      'First exposure to real-world performance marketing infrastructure and client delivery. Converted to full-time after 6 months.',
    learnedTags: 'Automation pipelines · Performance marketing infra · Client delivery workflows · Cross-team communication',
  },
  current: {
    title: 'Full-stack & AI Engineer',
    date: 'May 2026 — Present',
    badge: 'Full-time · Current',
    description:
      'Building AI systems, automation pipelines, and creative tools at a performance marketing company. Embedded across engineering, marketing, and creative teams — shipping products that serve all three.',
  },
  arrowSub: '6 months',
  bullets: [
    'AI-driven asset management system for photoshoot workflows',
    'Creator discovery automation using Playwright + Meta scraping',
    'Cross-functional tech support bridging marketing and creative teams',
  ],
} as const

export const EXPERIENCE_ENTRIES = [
  {
    year: '2022 — 2023',
    company: 'YIYuva (CII)',
    role: 'Chairperson, Entrepreneurship Vertical',
    type: 'Leadership',
    badgeColour: '#9B6DFF',
    description:
      'Led the entrepreneurship vertical — organizing workshops, startup pitches, and innovation events across Coimbatore chapter.',
    bullets: [],
  },
] as const

export const SKILL_GROUPS = [
  {
    category: 'Tech',
    pillar: 'tech' as const,
    label: 'Ship Anything',
    badges: ['Next.js', 'React', 'Node.js', 'FastAPI', 'Python', 'TypeScript', 'Express', 'WebSockets', 'Socket.io', 'REST APIs', 'System Design', 'Networking'],
  },
  {
    category: 'AI/LLM',
    pillar: 'tech' as const,
    label: 'Make it Intelligent',
    badges: ['LangChain', 'LangGraph', 'RAG Systems', 'Prompt Engineering', 'LLM Optimisation', 'Groq', 'Claude', 'GPT', 'Gemini', 'Chunking Strategies'],
  },
  {
    category: 'Cloud & DevOps',
    pillar: 'tech' as const,
    label: 'Make it Scale',
    badges: ['AWS EC2', 'S3', 'ECS', 'ECR', 'SQS', 'IAM', 'VPC', 'CloudWatch', 'Docker', 'GitHub Actions', 'CI/CD', 'Nginx', 'Redis', 'Elasticsearch'],
  },
  {
    category: 'Data & Automation',
    pillar: 'tech' as const,
    label: 'Make it Run',
    badges: ['Playwright', 'Chromium', 'Browser Automation', 'Pipeline Design', 'Shell Scripting', 'Bash'],
  },
  {
    category: 'Design',
    pillar: 'design' as const,
    label: 'Make it Beautiful',
    badges: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'User Research', 'Tailwind CSS', 'SCSS', 'Storybook', 'Shadcn/UI', 'Electron'],
  },
  {
    category: 'Business & Marketing',
    pillar: 'business' as const,
    label: 'Make it Work Commercially',
    badges: ['Performance Marketing', 'Google Ads', 'Meta Ads', 'B2B', 'B2C', 'DTC', 'Creative Strategy', 'Growth Infrastructure'],
  },
  {
    category: 'Finance',
    pillar: 'finance' as const,
    label: 'Make it Make Sense',
    badges: ['Fundamental Analysis', 'Technical Analysis', 'Financial Product Thinking', '3 Years Personal Investing'],
  },
] as const

export const ABOUT_PANELS = [
  {
    number: '01',
    title: 'The Engineer',
    pillarColour: '#00A8FF',
    body: 'I started where most engineers do — building things because I could. Then I got embedded inside a marketing company and realised building things because the business needs them is a completely different skill. I learned both.',
  },
  {
    number: '02',
    title: 'The Investor',
    pillarColour: '#00C896',
    body: 'For 3 years I\'ve been analysing stocks the way Peter Lynch and Phil Fisher taught — understanding businesses, not just charts. When the market crashed and I almost panic sold ₹34,000 in gains, I realised no app was solving the real problem. So I built one.',
  },
  {
    number: '03',
    title: 'The Builder',
    pillarColour: '#9B6DFF',
    body: 'CodeLens AI. FinSight AI. AI asset management systems. Electron desktop apps. Marketing automation pipelines. I build across domains because real problems don\'t respect technical boundaries. 603 commits last year. Still building.',
  },
  {
    number: '04',
    title: 'The Thinker',
    pillarColour: '#FFB830',
    body: 'Outside of code I read about finance, philosophy, geopolitics, history, and economics. Not as hobbies — as lenses. Understanding why markets behave the way they do, why businesses succeed or fail, why people make irrational decisions — that\'s what makes a builder dangerous.',
  },
] as const

export const TERMINAL_LINES = [
  '> Initialising Siddharth B...',
  '> Commits: 603  Products: 2  Problems solved: Real ones',
  '> Experience: Engineering × Business × Finance × Design',
  '> Status: Building. Always.',
  '> Story ready. Loading...',
] as const

export const BOLD_STATEMENTS = [
  { text: 'I ship.', colour: '#00A8FF' },
  { text: 'I understand your business model.', colour: '#FF6B6B' },
  { text: "I've read the same books your investors have.", colour: '#00C896' },
  { text: 'I built a fintech app because I lived the problem.', colour: '#FFB830' },
  { text: "I don't just write code. I understand why it matters.", colour: '#9B6DFF' },
  { text: 'Now — what are you building?', colour: '#0D0D0D' },
] as const
