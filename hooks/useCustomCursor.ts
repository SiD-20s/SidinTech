import { useEffect, useRef } from 'react'

const STATES: Record<string, { w: string; h: string; bg: string; border: string }> = {
  link:    { w: '32px', h: '32px', bg: 'transparent', border: '1.5px solid #0D0D0D' },
  view:    { w: '48px', h: '48px', bg: 'transparent', border: '1.5px solid #0D0D0D' },
  skip:    { w: '32px', h: '32px', bg: 'transparent', border: '1.5px solid #00A8FF' },
  default: { w: '8px',  h: '8px',  bg: '#0D0D0D',     border: 'none' },
}

function applyState(el: HTMLDivElement, state: string) {
  const s = STATES[state] ?? STATES.default
  el.style.width = s.w
  el.style.height = s.h
  el.style.backgroundColor = s.bg
  el.style.border = s.border
  el.setAttribute('data-state', state)
}

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -200, y: -200 })
  const target = useRef({ x: -200, y: -200 })
  const rafRef = useRef<number>(undefined)
  const ready = useRef(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      if (!ready.current) {
        // Snap to first position so there's no slide from (−200, −200)
        pos.current = { x: e.clientX, y: e.clientY }
        cursor.style.opacity = '1'
        ready.current = true
      }
    }

    const onMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor]')
      const state = el?.getAttribute('data-cursor') ?? 'default'
      applyState(cursor, state)
    }

    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15)
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15)
      // Translate to mouse position, then centre the element on that point
      cursor.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return cursorRef
}
