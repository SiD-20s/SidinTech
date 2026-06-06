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

const SECTIONS = ['hero', 'identity', 'work', 'experience', 'skills', 'about', 'contact']

export default function Page() {
  const [introComplete, setIntroComplete] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    if (!introComplete) return

    const observers = SECTIONS.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.3 }
      )
      obs.observe(el)
      return obs
    })

    return () => observers.forEach((obs) => obs?.disconnect())
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
