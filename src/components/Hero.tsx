import {
  motion,
  useReducedMotion,
  type MotionStyle,
  type Variants,
} from 'framer-motion'
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import {
  cancelHomeAnimation,
  playBodies,
  resetPlayBodies,
  startPhysics,
  stopPhysics,
  usePlaygroundPhysics,
  type PlayBody,
} from '../lib/playground'
import { ArrowUpRight, DownloadIcon } from './Icons'

type ShapeKind = 'circle' | 'ring' | 'star' | 'pill' | 'blob' | 'cross'

type ShapeSpec = {
  kind: ShapeKind
  color: string
  size: number
  height?: number
  top: string
  left: string
  duration: number
  delay: number
  driftX: number
  driftY: number
  spin: number
}

const shapes: ShapeSpec[] = [
  { kind: 'circle', color: 'var(--coral)', size: 86, top: '13%', left: '7%', duration: 7, delay: 0.2, driftX: 22, driftY: -34, spin: 15 },
  { kind: 'ring', color: 'var(--blue)', size: 66, top: '20%', left: '84%', duration: 8.5, delay: 0.5, driftX: -28, driftY: 26, spin: -18 },
  { kind: 'star', color: 'var(--yellow)', size: 58, top: '68%', left: '9%', duration: 6.5, delay: 0.8, driftX: 18, driftY: -22, spin: 24 },
  { kind: 'pill', color: 'var(--mint)', size: 78, height: 34, top: '76%', left: '78%', duration: 9, delay: 0.35, driftX: -24, driftY: -28, spin: -12 },
  { kind: 'blob', color: 'var(--lilac)', size: 104, top: '7%', left: '61%', duration: 10, delay: 0.1, driftX: 26, driftY: 20, spin: 22 },
  { kind: 'cross', color: 'var(--pink)', size: 46, top: '59%', left: '91%', duration: 7.5, delay: 0.65, driftX: -18, driftY: 30, spin: 20 },
  { kind: 'circle', color: 'var(--yellow)', size: 26, top: '38%', left: '3%', duration: 6, delay: 0.95, driftX: 12, driftY: -18, spin: 0 },
  { kind: 'ring', color: 'var(--coral)', size: 42, top: '86%', left: '43%', duration: 8, delay: 0.45, driftX: 6, driftY: -24, spin: -16 },
  { kind: 'blob', color: 'var(--mint)', size: 38, top: '30%', left: '94%', duration: 7, delay: 1.1, driftX: -10, driftY: 18, spin: 18 },
  { kind: 'circle', color: 'var(--mint)', size: 18, top: '48%', left: '16%', duration: 6.8, delay: 1.2, driftX: 16, driftY: 24, spin: 0 },
  { kind: 'ring', color: 'var(--lilac)', size: 30, top: '12%', left: '38%', duration: 9.2, delay: 0.6, driftX: 20, driftY: -20, spin: 14 },
  { kind: 'star', color: 'var(--pink)', size: 34, top: '84%', left: '62%', duration: 7.8, delay: 0.9, driftX: -14, driftY: -18, spin: -22 },
  { kind: 'pill', color: 'var(--blue)', size: 54, height: 22, top: '46%', left: '88%', duration: 10.5, delay: 0.25, driftX: -20, driftY: 22, spin: 10 },
  { kind: 'cross', color: 'var(--yellow)', size: 28, top: '26%', left: '22%', duration: 8.2, delay: 1.05, driftX: 14, driftY: 26, spin: -18 },
]

const letterColors = [
  'var(--coral)',
  'var(--blue)',
  'var(--yellow)',
  'var(--mint)',
  'var(--lilac)',
  'var(--pink)',
  'var(--coral)',
]

const nameParts = ['Sadhana', 'Uprety']
const name = nameParts.join(' ')

const nameContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}

const nameLetter: Variants = {
  hidden: { opacity: 0, y: 90, rotate: -14, scale: 0.5 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 15 },
  },
}

function PlayfulLetter({ char, index, reduced }: { char: string; index: number; reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const bodyRef = useRef<PlayBody>({
    el: null,
    baseX: 0,
    baseY: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    spin: 0,
    radius: 40,
    active: false,
    dragging: false,
    grabX: 0,
    grabY: 0,
    lastX: 0,
    lastY: 0,
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const body = bodyRef.current
      if (!body.active) {
        body.baseX = rect.left + rect.width / 2
        body.baseY = rect.top + rect.height / 2
        body.x = body.baseX
        body.y = body.baseY
      }
      body.radius = Math.max(18, Math.min(rect.width, rect.height) * 0.38)
    }
    measure()
    bodyRef.current.el = el
    playBodies.add(bodyRef.current)
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('resize', measure)
      playBodies.delete(bodyRef.current)
      bodyRef.current.el = null
    }
  }, [])

  const onPointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (reduced) return
    event.preventDefault()
    cancelHomeAnimation()
    startPhysics()
    const body = bodyRef.current
    body.active = true
    body.dragging = true
    body.grabX = body.x - event.clientX
    body.grabY = body.y - event.clientY
    body.lastX = event.clientX
    body.lastY = event.clientY
    body.vx = 0
    body.vy = 0
    body.spin = 0
    body.el?.setPointerCapture(event.pointerId)
    if (body.el) body.el.style.zIndex = '10'
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const body = bodyRef.current
    if (!body.dragging) return
    body.x = event.clientX + body.grabX
    body.y = event.clientY + body.grabY
    body.vx = (event.clientX - body.lastX) * 0.85
    body.vy = (event.clientY - body.lastY) * 0.85
    body.spin = body.vx * 0.008
    body.lastX = event.clientX
    body.lastY = event.clientY
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const body = bodyRef.current
    if (!body.dragging) return
    body.dragging = false
    if (body.el?.hasPointerCapture(event.pointerId)) body.el.releasePointerCapture(event.pointerId)
    if (body.el) body.el.style.zIndex = ''
  }

  return (
    <span
      className="letter-drag"
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
    >
      <motion.span
        className="letter-float"
        animate={reduced ? undefined : { x: [0, 2, -2, 0], y: [0, -6, 2, 0], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 3.4 + index * 0.18, repeat: Infinity, delay: index * 0.12, ease: 'easeInOut' }}
      >
        <motion.span
          className="letter"
          variants={nameLetter}
          tabIndex={-1}
          style={{ '--letter-color': letterColors[index % letterColors.length] } as MotionStyle}
          whileHover={reduced ? undefined : { y: -18, rotate: index % 2 === 0 ? -9 : 9, scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
        >
          <span className="letter-inner" style={{ animationDelay: `${index * 0.13}s` }}>
            {char}
          </span>
        </motion.span>
      </motion.span>
    </span>
  )
}

function Shape({ spec, reduced }: { spec: ShapeSpec; reduced: boolean }) {
  const { kind, color, size, height, top, left, duration, delay, driftX, driftY, spin } = spec
  const positionStyle: MotionStyle = { top, left, width: size, height: height ?? size }
  const colorStyle: MotionStyle = kind === 'ring' ? { borderColor: color } : { background: color }

  return (
    <motion.div
      className="shape-drag"
      style={positionStyle}
      drag={!reduced}
      dragMomentum={false}
      dragElastic={0.15}
      whileDrag={{ scale: 1.06 }}
    >
      <motion.span
        className={`shape shape--${kind}`}
        style={colorStyle}
        initial={reduced ? false : { opacity: 0, scale: 0 }}
        animate={
          reduced
            ? { opacity: 1, scale: 1 }
            : { opacity: 1, scale: 1, x: [0, driftX, 0], y: [0, driftY, 0], rotate: [0, spin, 0] }
        }
        transition={
          reduced
            ? { duration: 0.3, delay }
            : {
                opacity: { duration: 0.6, delay },
                scale: { type: 'spring', stiffness: 180, damping: 14, delay },
                x: { duration, delay, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: duration * 1.15, delay, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: duration * 1.7, delay, repeat: Infinity, ease: 'easeInOut' },
              }
        }
      />
    </motion.div>
  )
}

export function Hero({ reduced: reducedProp }: { reduced?: boolean }) {
  const prefersReduced = useReducedMotion() ?? false
  const reduced = reducedProp ?? prefersReduced
  usePlaygroundPhysics(reduced)

  const putLettersBack = () => resetPlayBodies(reduced)

  useEffect(() => () => stopPhysics(), [])

  return (
    <section className="hero-section" id="top" aria-label="Introduction">
      <div className="grid-overlay" aria-hidden="true" />

      <div className="shapes" aria-hidden="true">
        {shapes.map((spec, i) => (
          <Shape key={i} spec={spec} reduced={reduced} />
        ))}
      </div>

      <div className="hero">
        <motion.p
          className="eyebrow"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.01 : 0.6, delay: reduced ? 0 : 0.1 }}
        >
          <span className="eyebrow-dot" /> hello, i&apos;m
        </motion.p>

        <motion.h1
          className="name"
          variants={nameContainer}
          initial={reduced ? false : 'hidden'}
          animate="show"
          aria-label={name}
        >
          {nameParts.map((part, line) => (
            <span className="name-line" key={part} aria-hidden="true">
              {part.split('').map((char, i) => (
                <PlayfulLetter key={`${char}-${line}-${i}`} char={char} index={line * 7 + i} reduced={reduced} />
              ))}
            </span>
          ))}
        </motion.h1>

        <svg className="squiggle" viewBox="0 0 600 28" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="squiggle-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" style={{ stopColor: 'var(--coral)' }} />
              <stop offset="30%" style={{ stopColor: 'var(--yellow)' }} />
              <stop offset="60%" style={{ stopColor: 'var(--mint)' }} />
              <stop offset="100%" style={{ stopColor: 'var(--blue)' }} />
            </linearGradient>
          </defs>
          <motion.path
            d="M4 17 C 70 3, 140 25, 210 13 S 350 3, 420 15 S 540 6, 596 14"
            fill="none"
            stroke="url(#squiggle-gradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="640"
            initial={reduced ? false : { strokeDashoffset: 640, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: 1 }}
            transition={{ duration: reduced ? 0.01 : 1.2, delay: reduced ? 0 : 0.85, ease: 'easeInOut' }}
          />
        </svg>

        <motion.p
          className="hero-tagline"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.01 : 0.6, delay: reduced ? 0 : 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          I build ML products, from AI skincare to private semantic search.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.01 : 0.55, delay: reduced ? 0 : 1.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <a className="hero-cta hero-cta--primary" href="#projects">
            View projects <ArrowUpRight className="hero-cta-icon" />
          </a>
          <a
            className="hero-cta"
            href="/resume.pdf"
            download="Sadhana-Uprety-Resume.pdf"
            title="Placeholder resume — replace /public/resume.pdf"
          >
            <DownloadIcon className="hero-cta-icon" />
            Download resume
            <span className="sr-only"> (placeholder PDF)</span>
          </a>
        </motion.div>

        <motion.button
          className="hero-reset"
          type="button"
          onClick={putLettersBack}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.01 : 0.5, delay: reduced ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduced ? undefined : { y: -2 }}
        >
          put letters back <span aria-hidden="true">↺</span>
        </motion.button>
      </div>

      <a className="scroll-hint" href="#journey">
        scroll to explore ↓
      </a>
    </section>
  )
}
