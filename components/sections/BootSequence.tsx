'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TERMINAL_LINES, BOLD_STATEMENTS } from '@/lib/constants'
import { boldStatement } from '@/lib/animations'

interface BootSequenceProps {
  onComplete: () => void
}

type Phase = 'terminal' | 'statements' | 'done'

// Stored timer ids so the skip button can cancel all of them
const timers = new Set<ReturnType<typeof setTimeout>>()

function later(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const id = setTimeout(() => { timers.delete(id); resolve() }, ms)
    timers.add(id)
  })
}

function cancelAll() {
  timers.forEach((id) => clearTimeout(id))
  timers.clear()
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<Phase>('terminal')
  const [typedLines, setTypedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState('')
  const [progressWidth, setProgressWidth] = useState(0)
  const [statementIndex, setStatementIndex] = useState(0)
  const [showStatement, setShowStatement] = useState(true)
  const skipped = useRef(false)
  const rafRef = useRef<number>(undefined)

  const finish = useCallback(() => {
    cancelAll()
    skipped.current = true
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    sessionStorage.setItem('introSeen', 'true')
    onComplete()
  }, [onComplete])

  useEffect(() => {
    // If already seen in this session, skip immediately
    if (sessionStorage.getItem('introSeen') === 'true') {
      onComplete()
      return
    }

    // Run the terminal phase
    async function runTerminal() {
      for (let lineIdx = 0; lineIdx < TERMINAL_LINES.length; lineIdx++) {
        if (skipped.current) return
        const line = TERMINAL_LINES[lineIdx]
        const isLast = lineIdx === TERMINAL_LINES.length - 1

        // Type characters
        for (let charIdx = 0; charIdx < line.length; charIdx++) {
          if (skipped.current) return
          await later(80)
          setCurrentLine(line.slice(0, charIdx + 1))
        }

        // Progress bar on last line
        if (isLast) {
          setTypedLines((prev) => [...prev, line])
          setCurrentLine('')
          await animateProgress()
          if (skipped.current) return
          await later(500)
        } else {
          setTypedLines((prev) => [...prev, line])
          setCurrentLine('')
          await later(400)
        }
      }

      if (skipped.current) return
      // Transition to bold statements phase
      setPhase('statements')
      runStatements()
    }

    async function animateProgress() {
      // Fill progress bar over 800ms via rAF
      const start = performance.now()
      const duration = 800

      return new Promise<void>((resolve) => {
        function tick(now: number) {
          if (skipped.current) { resolve(); return }
          const progress = Math.min((now - start) / duration, 1)
          setProgressWidth(progress * 100)
          if (progress < 1) {
            rafRef.current = requestAnimationFrame(tick)
          } else {
            resolve()
          }
        }
        rafRef.current = requestAnimationFrame(tick)
      })
    }

    async function runStatements() {
      for (let i = 0; i < BOLD_STATEMENTS.length; i++) {
        if (skipped.current) return
        setStatementIndex(i)
        setShowStatement(true)
        await later(1800 + 300) // hold 1800ms + fade-in 300ms
        if (skipped.current) return
        setShowStatement(false)
        await later(300) // fade-out 300ms
      }
      if (skipped.current) return
      finish()
    }

    runTerminal()

    return () => {
      cancelAll()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentStatement = BOLD_STATEMENTS[statementIndex]

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#F0F1F5' }}
    >
      {/* Skip button — fixed top-right, always visible */}
      <button
        onClick={finish}
        data-cursor="skip"
        className="fixed top-6 right-6 font-satoshi text-[12px] text-ink/40 hover:text-ink/70 transition-colors duration-200"
      >
        Skip intro →
      </button>

      {/* ── Phase 1: Terminal ─────────────────────────────────────── */}
      {phase === 'terminal' && (
        <motion.div
          key="terminal"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[640px] px-6"
        >
          {/* Completed lines */}
          {typedLines.map((line, i) => (
            <div key={i} className="font-mono text-ink text-[14px] md:text-[16px] leading-relaxed">
              {i === typedLines.length - 1 && line === TERMINAL_LINES[TERMINAL_LINES.length - 1] ? (
                <div>
                  <span>{line}</span>
                  {/* Progress bar on the last terminal line */}
                  <div className="mt-2 h-[3px] w-full rounded-full bg-ink/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-ink/40 transition-none"
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}

          {/* Currently-typing line */}
          {currentLine && (
            <div className="font-mono text-ink text-[14px] md:text-[16px] leading-relaxed">
              {currentLine}
              <span className="animate-pulse">▌</span>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Phase 2: Bold statements ──────────────────────────────── */}
      {phase === 'statements' && (
        <div className="w-full px-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {showStatement && currentStatement && (
              <motion.p
                key={statementIndex}
                variants={boldStatement}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="font-syne font-extrabold text-center m-0 will-change-transform"
                style={{
                  color: currentStatement.colour,
                  fontSize: 'clamp(40px, 8vw, 96px)',
                  lineHeight: 1.1,
                  maxWidth: '900px',
                }}
              >
                {currentStatement.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
