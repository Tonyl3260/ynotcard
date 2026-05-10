'use client'

import { useEffect, useReducer, useRef } from 'react'
import { motion, useAnimation, useReducedMotion, AnimatePresence } from 'framer-motion'

// ── State machine ─────────────────────────────────────────────────────────────

type HatState = 'idle' | 'hovered' | 'placing' | 'placed' | 'rising'
type HatEvent = 'ENTER' | 'LEAVE' | 'CLICK' | 'PLACED' | 'RISEN'

function reducer(state: HatState, event: HatEvent): HatState {
  switch (state) {
    case 'idle':
      if (event === 'ENTER') return 'hovered'
      if (event === 'CLICK') return 'rising'
      return state
    case 'hovered':
      if (event === 'LEAVE') return 'placing'
      if (event === 'CLICK') return 'rising'
      return state
    case 'placing':
      if (event === 'PLACED') return 'placed'
      return state
    case 'placed':
      if (event === 'ENTER') return 'hovered'
      if (event === 'CLICK') return 'rising'
      return state
    case 'rising':
      if (event === 'RISEN') return 'idle'
      return state
    default:
      return state
  }
}

// ── Sparkle particle ──────────────────────────────────────────────────────────

function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: 6, height: 6 }}
      initial={{ opacity: 1, scale: 0, rotate: 0 }}
      animate={{ opacity: 0, scale: 1.5, rotate: 180, y: -30 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      <svg viewBox="0 0 6 6" width="6" height="6">
        <path d="M3 0L3.4 2.6L6 3L3.4 3.4L3 6L2.6 3.4L0 3L2.6 2.6Z" fill="#FBBF24" />
      </svg>
    </motion.div>
  )
}

// ── Straw hat SVG ─────────────────────────────────────────────────────────────

function StrawHatSVG() {
  return (
    <svg
      viewBox="0 0 220 160"
      width="220"
      height="160"
      aria-hidden="true"
      className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
    >
      {/* Shadow beneath brim */}
      <ellipse cx="110" cy="148" rx="88" ry="8" fill="rgba(0,0,0,0.25)" />

      {/* Brim */}
      <ellipse cx="110" cy="106" rx="90" ry="18" fill="#D4B05F" />
      {/* Brim inner shadow */}
      <ellipse cx="110" cy="103" rx="68" ry="11" fill="#C49845" opacity="0.5" />
      {/* Brim highlight */}
      <ellipse cx="82" cy="98" rx="28" ry="5" fill="#E8C97C" opacity="0.35" transform="rotate(-8,82,98)" />

      {/* Dome */}
      <ellipse cx="110" cy="96" rx="68" ry="12" fill="#E8C97C" />
      <path
        d="M 42,96 Q 42,38 110,38 Q 178,38 178,96 Z"
        fill="#E8C97C"
      />
      {/* Dome shading */}
      <path
        d="M 60,96 Q 60,52 110,52 Q 160,52 160,96 Z"
        fill="#D4B05F"
        opacity="0.3"
      />
      {/* Dome highlight */}
      <path
        d="M 74,80 Q 78,52 106,50"
        stroke="#F5E0A0"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Ribbon */}
      <path
        d="M 44,97 Q 110,89 176,97"
        stroke="#C4302B"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      {/* Ribbon highlight */}
      <path
        d="M 52,94.5 Q 110,87 168,94.5"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Straw texture lines on dome */}
      {[0, 1, 2, 3].map(i => (
        <path
          key={i}
          d={`M ${88 + i * 12},${65 + i * 3} Q ${94 + i * 10},${90 + i} ${100 + i * 8},${95}`}
          stroke="#C49845"
          strokeWidth="0.75"
          fill="none"
          opacity="0.3"
        />
      ))}
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function StrawHatHero() {
  const prefersReduced = useReducedMotion()
  const [state, dispatch] = useReducer(reducer, 'idle')
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  // Sparkle positions (relative to center)
  const SPARKLES = [
    { x: 60,  y: 10, delay: 0    },
    { x: 145, y: 20, delay: 0.08 },
    { x: 30,  y: 50, delay: 0.12 },
    { x: 165, y: 55, delay: 0.05 },
    { x: 95,  y: 0,  delay: 0.15 },
    { x: 120, y: 5,  delay: 0.1  },
  ]
  const showSparkles = state === 'rising'

  // Float loop — only in idle/placed when motion is ok
  useEffect(() => {
    if (prefersReduced) return
    if (state === 'idle' || state === 'placed') {
      controls.start({
        y: [0, -8, 0],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      })
    }
  }, [state, controls, prefersReduced])

  // State-driven hat animation
  useEffect(() => {
    if (prefersReduced) return

    switch (state) {
      case 'hovered':
        controls.start({
          y: -30,
          rotate: -8,
          scale: 1.05,
          transition: { type: 'spring', stiffness: 220, damping: 18 },
        })
        break
      case 'placing':
        controls.start({
          y: 0,
          rotate: 0,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 180,
            damping: 22,
          },
        }).then(() => dispatch('PLACED'))
        break
      case 'rising':
        controls.start({
          rotate: 360,
          y: -50,
          scale: 1.1,
          transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
        }).then(() => {
          dispatch('RISEN')
        })
        break
    }
  }, [state, controls, prefersReduced])

  return (
    <div className="relative flex items-center justify-center select-none" style={{ minHeight: 260 }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(212,176,95,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Hat wrapper */}
      <div
        ref={containerRef}
        className="relative cursor-pointer"
        role="img"
        aria-label="Straw hat — click to spin"
        onMouseEnter={() => { if (state === 'idle' || state === 'placed') dispatch('ENTER') }}
        onMouseLeave={() => { if (state === 'hovered') dispatch('LEAVE') }}
        onClick={() => { if (state !== 'placing' && state !== 'rising') dispatch('CLICK') }}
      >
        <motion.div animate={controls} initial={{ y: 0, rotate: 0, scale: 1 }}>
          <StrawHatSVG />
        </motion.div>

        {/* Sparkles */}
        <AnimatePresence>
          {showSparkles && SPARKLES.map((s, i) => (
            <Sparkle key={i} x={s.x} y={s.y} delay={s.delay} />
          ))}
        </AnimatePresence>
      </div>

      {/* Hint label */}
      <motion.p
        className="absolute bottom-0 text-[0.65rem] text-slate-600 uppercase tracking-widest pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: state === 'idle' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        click to spin
      </motion.p>
    </div>
  )
}
