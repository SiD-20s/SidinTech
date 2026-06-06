'use client'

import { useCustomCursor } from '@/hooks/useCustomCursor'

export default function CustomCursor() {
  const cursorRef = useCustomCursor()

  return (
    <div
      ref={cursorRef}
      data-state="default"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        userSelect: 'none',
        willChange: 'transform',
        opacity: 0,
        // Initial default state — hook overrides these on first interaction
        width: 8,
        height: 8,
        borderRadius: '100px',
        backgroundColor: '#0D0D0D',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition:
          'width 0.3s ease, height 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, border-width 0.3s ease',
      }}
    >
      {/* Visible only when data-state="view" — controlled via globals.css */}
      <span className="cursor-view-label font-satoshi text-[11px] uppercase tracking-widest text-ink hidden">
        VIEW
      </span>
    </div>
  )
}
