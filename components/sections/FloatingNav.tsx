'use client'

interface FloatingNavProps {
  visible: boolean
  activeSection: string
}

export default function FloatingNav({ visible: _visible, activeSection: _activeSection }: FloatingNavProps) {
  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full border border-ink/8 backdrop-blur-md bg-canvas/85">
      <p className="font-satoshi text-xs text-ink/40">FloatingNav — coming soon</p>
    </nav>
  )
}
