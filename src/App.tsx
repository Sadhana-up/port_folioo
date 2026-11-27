import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionStyle, type Variants } from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

type PanelName = 'about' | 'contact'

type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

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

const letterColors = ['var(--coral)', 'var(--blue)', 'var(--yellow)', 'var(--mint)', 'var(--lilac)', 'var(--pink)', 'var(--coral)']

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

const bio =
  'Third-year data science student (2024–2028), currently going deeper into mathematics, statistics, and AI. Outside coursework, I read books.'

const aboutStory = [
  'I’m Sadhana. I’m in my third year of a Bachelor’s of Data Science at Kathmandu University, which I started in 2024 and expect to finish in 2028.',
  'Right now I’m diving deeper into mathematics, statistics, and AI. Outside coursework I read books, and I tend to use whatever tools fit the problem in front of me rather than sticking to one setup.',
]

const aboutDetails = [
  {
    label: 'Degree',
    value: 'Bachelor’s of Data Science, Kathmandu University · 2024–2028 (third year).',
  },
  {
    label: 'Focus',
    value: 'Mathematics, statistics, and AI.',
  },
  {
    label: 'Outside class',
    value: 'Reading books.',
  },
  {
    label: 'Tools',
    value: 'I use a range of tools and pick the ones that suit what I’m working on.',
  },
]

const contactLinks = [
  { label: 'Email', value: 'upretysadhana@gmail.com', href: 'mailto:upretysadhana@gmail.com?subject=Hello%20Sadhana' },
  { label: 'GitHub', value: '/Sadhana-up', href: 'https://github.com/Sadhana-up' },
  { label: 'LinkedIn', value: '/in/sadhana-uprety/', href: 'https://www.linkedin.com/in/sadhana-uprety/' },
]

const panelEase = [0.22, 1, 0.36, 1] as const

type StackCardData = {
  eyebrow: string
  title: string
  subtitle: string
  color: string
  items?: string[]
  note?: string
}

const journeyCards: StackCardData[] = [
  {
    eyebrow: 'Now · Education',
    title: 'Data Science',
    subtitle: 'Kathmandu University',
    color: 'var(--coral)',
    note: 'Coursework and independent projects in data science, statistics, and machine learning.',
  },
  {
    eyebrow: 'June — ongoing · Experience',
    title: 'AI Developer',
    subtitle: 'Lucent AI Nepal',
    color: 'var(--blue)',
    note: 'Developing AI-driven tools and iterating on solutions to practical problems.',
  },
]

const skillCards: StackCardData[] = [
  {
    eyebrow: 'Languages',
    title: 'Programming Languages',
    subtitle: 'Core languages used for development and analysis.',
    color: 'var(--mint)',
    items: ['Python', 'R', 'Java'],
  },
  {
    eyebrow: 'Data & analytics',
    title: 'Data & Analytics',
    subtitle: 'Data manipulation, analysis, and visualisation.',
    color: 'var(--blue)',
    items: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Data Visualisation', 'DBMS'],
  },
  {
    eyebrow: 'ML & AI frameworks',
    title: 'Machine Learning & AI',
    subtitle: 'Model development across classical and deep learning.',
    color: 'var(--lilac)',
    items: ['TensorFlow', 'scikit-learn', 'Keras', 'Hugging Face Transformers', 'Weka', 'Orange'],
  },
  {
    eyebrow: 'LLMs & agents',
    title: 'LLMs & Agent Development',
    subtitle: 'Working with language models and agent frameworks.',
    color: 'var(--coral)',
    items: ['Google ADK', 'LangChain', 'LangGraph', 'Google Colab'],
  },
  {
    eyebrow: 'Web, APIs & platforms',
    title: 'Web, APIs & Platforms',
    subtitle: 'API integration, development tooling, and environments.',
    color: 'var(--yellow)',
    items: ['REST APIs', 'Flask', 'FastAPI', 'Git & GitHub', 'VS Code', 'Jupyter', 'Linux CLI'],
  },
]

type PlayBody = {
  el: HTMLSpanElement | null
  baseX: number
  baseY: number
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  spin: number
  radius: number
  active: boolean
  dragging: boolean
  grabX: number
  grabY: number
  lastX: number
  lastY: number
}

const playBodies = new Set<PlayBody>()

let homeFrame = 0
let physicsFrame = 0
let physicsLast = 0
let physicsPaused = false

function resetPlayBodies(reduced: boolean) {
  cancelAnimationFrame(homeFrame)
  stopPhysics()

  const returns: {
    body: PlayBody
    el: HTMLSpanElement
    baseX: number
    baseY: number
    dx: number
    dy: number
    angle: number
  }[] = []

  playBodies.forEach((body) => {
    const el = body.el
    if (!el) return

    const currentTransform = el.style.transform
    el.style.transform = ''
    const rect = el.getBoundingClientRect()
    el.style.transform = currentTransform

    const baseX = rect.left + rect.width / 2
    const baseY = rect.top + rect.height / 2
    body.baseX = baseX
    body.baseY = baseY
    body.vx = 0
    body.vy = 0
    body.spin = 0
    body.active = false
    body.dragging = false

    returns.push({
      body,
      el,
      baseX,
      baseY,
      dx: body.x - baseX,
      dy: body.y - baseY,
      angle: body.angle,
    })
  })

  const finish = () => {
    returns.forEach(({ body, el, baseX, baseY }) => {
      el.style.transform = ''
      body.x = baseX
      body.y = baseY
      body.angle = 0
    })
  }

  if (reduced) {
    finish()
    return
  }

  const started = performance.now()
  const duration = 620

  const step = (now: number) => {
    const progress = Math.min((now - started) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)

    returns.forEach(({ el, dx, dy, angle }) => {
      const x = dx * (1 - eased)
      const y = dy * (1 - eased)
      const rotation = angle * (1 - eased)
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotation.toFixed(3)}rad)`
    })

    if (progress < 1) {
      homeFrame = requestAnimationFrame(step)
    } else {
      finish()
    }
  }

  homeFrame = requestAnimationFrame(step)
}

function startPhysics() {
  if (physicsPaused || physicsFrame) return
  physicsLast = performance.now()
  physicsFrame = requestAnimationFrame(runPhysics)
}

function stopPhysics() {
  if (!physicsFrame) return
  cancelAnimationFrame(physicsFrame)
  physicsFrame = 0
}

function runPhysics(now: number) {
  const dt = Math.min((now - physicsLast) / 16.67, 2)
  physicsLast = now
  const width = window.innerWidth
  const height = window.innerHeight
  let awake = false

  playBodies.forEach((body) => {
    if (!body.active || !body.el) return
    if (body.dragging) {
      awake = true
      return
    }
    body.vy += 0.6 * dt
    body.vx *= Math.pow(0.995, dt)
    body.vy *= Math.pow(0.995, dt)
    body.x += body.vx * dt
    body.y += body.vy * dt
    body.angle += body.spin * dt
    body.spin *= Math.pow(0.99, dt)

    if (body.x - body.radius < 0) {
      body.x = body.radius
      body.vx = Math.abs(body.vx) * 0.62
    } else if (body.x + body.radius > width) {
      body.x = width - body.radius
      body.vx = -Math.abs(body.vx) * 0.62
    }
    if (body.y - body.radius < 0) {
      body.y = body.radius
      body.vy = Math.abs(body.vy) * 0.62
    } else if (body.y + body.radius > height) {
      body.y = height - body.radius
      body.vy = Math.abs(body.vy) < 0.9 ? 0 : -Math.abs(body.vy) * 0.62
      body.vx *= 0.9
      body.spin *= 0.85
    }

    if (Math.abs(body.vx) > 0.08 || Math.abs(body.vy) > 0.08 || Math.abs(body.spin) > 0.02) {
      awake = true
    }
  })

  const active = Array.from(playBodies).filter((body) => body.active && body.el)
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i]
      const b = active[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const distance = Math.hypot(dx, dy)
      const minimum = a.radius + b.radius
      if (distance === 0 || distance >= minimum) continue
      const nx = dx / distance
      const ny = dy / distance
      const overlap = (minimum - distance) / 2
      a.x -= nx * overlap
      a.y -= ny * overlap
      b.x += nx * overlap
      b.y += ny * overlap
      const normalVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
      if (normalVelocity >= 0) continue
      const impulse = -(1 + 0.55) * normalVelocity / 2
      a.vx -= impulse * nx
      a.vy -= impulse * ny
      b.vx += impulse * nx
      b.vy += impulse * ny
      a.spin -= impulse * 0.004
      b.spin += impulse * 0.004
    }
  }

  playBodies.forEach((body) => {
    if (!body.el) return
    body.el.style.transform = `translate3d(${(body.x - body.baseX).toFixed(2)}px, ${(body.y - body.baseY).toFixed(2)}px, 0) rotate(${body.angle.toFixed(3)}rad)`
  })

  physicsFrame = awake ? requestAnimationFrame(runPhysics) : 0
}

function usePlaygroundPhysics(reduced: boolean) {
  useEffect(() => {
    physicsPaused = reduced
    if (reduced) stopPhysics()
    return () => {
      physicsPaused = false
      stopPhysics()
    }
  }, [reduced])
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
    cancelAnimationFrame(homeFrame)
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
    >
      <motion.span
        className="letter-float"
        animate={reduced ? undefined : { x: [0, 2, -2, 0], y: [0, -6, 2, 0], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 3.4 + index * 0.18, repeat: Infinity, delay: index * 0.12, ease: 'easeInOut' }}
      >
        <motion.span
          className="letter"
          variants={nameLetter}
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
  const style: MotionStyle = { top, left, width: size, height: height ?? size }
  if (kind === 'ring') style.borderColor = color

  return (
    <motion.div
      className="shape-drag"
      style={style}
      drag={!reduced}
      dragMomentum={false}
      dragElastic={0.15}
      whileDrag={{ scale: 1.06 }}
    >
      <motion.span
        className={`shape shape--${kind}`}
        initial={{ opacity: 0, scale: 0 }}
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

function ArrowIcon() {
  return (
    <svg className="panel-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" fill="currentColor" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SlidePanel({
  panel,
  open,
  reduced,
  onClose,
  children,
}: {
  panel: PanelName
  open: boolean
  reduced: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => previousFocus?.focus()
  }, [open])

  const trapFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (!focusable || focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.35, ease: panelEase }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            id={`panel-${panel}`}
            className={`slide-panel slide-panel--${panel}`}
            role="dialog"
            aria-modal="true"
            aria-label={panel === 'about' ? 'About Sadhana' : 'Contact Sadhana'}
            onKeyDown={trapFocus}
            initial={
              reduced
                ? { opacity: 0 }
                : { x: panel === 'about' ? '-100%' : '100%', opacity: 0 }
            }
            animate={{ x: 0, opacity: 1 }}
            exit={
              reduced
                ? { opacity: 0 }
                : { x: panel === 'about' ? '-100%' : '100%', opacity: 0 }
            }
            transition={{ duration: reduced ? 0.01 : 0.62, ease: panelEase }}
          >
            <button className="panel-close" type="button" onClick={onClose} aria-label="Close panel" ref={closeRef}>
              <span className="panel-close-mark" aria-hidden="true" />
              <span className="panel-close-label">close</span>
            </button>
            <motion.div
              className="panel-content"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.45, delay: reduced ? 0 : 0.18, ease: panelEase }}
            >
              {children}
            </motion.div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

function StackCardView({
  card,
  index,
  total,
  reduced,
}: {
  card: StackCardData
  index: number
  total: number
  reduced: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end center'] })
  const points = [0, 0.8, 1]

  const y = useTransform(scrollYProgress, points, reduced ? [0, 0, 0] : [64, 0, -14])
  const scale = useTransform(scrollYProgress, points, reduced ? [1, 1, 1] : [0.94, 1, 0.975])
  const rotate = useTransform(
    scrollYProgress,
    points,
    reduced ? [0, 0, 0] : [index % 2 === 0 ? -1.6 : 1.6, 0, index % 2 === 0 ? 0.5 : -0.5],
  )

  return (
    <div className="stack-item" ref={ref} style={{ top: `${92 + index * 12}px`, zIndex: index + 1 }}>
      <motion.article
        className="stack-card"
        style={
          {
            '--card-color': card.color,
            y,
            scale,
            rotate,
            transformOrigin: 'center top',
          } as MotionStyle
        }
      >
        <span className="stack-accent" aria-hidden="true" />
        <div className="stack-card-top">
          <span>{card.eyebrow}</span>
          <span className="stack-card-count">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
        <h3>{card.title}</h3>
        <p className="stack-card-sub">{card.subtitle}</p>
        {card.note ? <p className="stack-card-note">{card.note}</p> : null}
        {card.items ? (
          <ul className="stack-chips">
            {card.items.map((item) => (
              <li className="stack-chip" key={item}>
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </motion.article>
    </div>
  )
}

function StackedSection({
  id,
  kicker,
  title,
  accent,
  accentClass,
  lede,
  cards,
  reduced,
}: {
  id: string
  kicker: string
  title: string
  accent: string
  accentClass: string
  lede: string
  cards: StackCardData[]
  reduced: boolean
}) {
  return (
    <section id={id} className="section stacked-section">
      <div className="section-inner">
        <div className="section-head stacked-head">
          <p className="section-kicker">{kicker}</p>
          <h2 className="section-title">
            {title} <span className={accentClass}>{accent}</span>
          </h2>
          <p className="section-lede">{lede}</p>
        </div>
        <div className="stack-list">
          {cards.map((card, i) => (
            <StackCardView key={card.title} card={card} index={i} total={cards.length} reduced={reduced} />
          ))}
          {!reduced ? <div className="stack-tail" aria-hidden="true" /> : null}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const reduced = useReducedMotion() ?? false
  const [activePanel, setActivePanel] = useState<PanelName | null>(null)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  usePlaygroundPhysics(reduced)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    localStorage.setItem('portfolio-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#17161A' : '#F7F4ED')
  }, [theme])

  useEffect(() => {
    if (!activePanel) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePanel(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activePanel])

  const openPanel = (panel: PanelName) => setActivePanel(panel)
  const closePanel = () => setActivePanel(null)
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  const putLettersBack = () => resetPlayBodies(reduced)

  const scrollToExplore = () => {
    document.body.style.overflow = ''
    closePanel()
    requestAnimationFrame(() => {
      document.getElementById('explore')?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }

  return (
    <div className={`app${reduced ? ' reduce-motion' : ''}${activePanel ? ' panel-open' : ''}`}>
      <a className="skip-link" href="#explore">
        Skip to content
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        <div className="nav-links">
          <motion.button
            className={`nav-link${activePanel === 'about' ? ' is-active' : ''}`}
            type="button"
            onClick={() => openPanel('about')}
            aria-expanded={activePanel === 'about'}
            aria-haspopup="dialog"
            aria-controls={activePanel === 'about' ? 'panel-about' : undefined}
            whileHover={reduced ? undefined : { y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            About
          </motion.button>
          <motion.button
            className={`nav-link${activePanel === 'contact' ? ' is-active' : ''}`}
            type="button"
            onClick={() => openPanel('contact')}
            aria-expanded={activePanel === 'contact'}
            aria-haspopup="dialog"
            aria-controls={activePanel === 'contact' ? 'panel-contact' : undefined}
            whileHover={reduced ? undefined : { y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Contact
          </motion.button>
          <motion.button className="nav-link nav-link--explore" type="button" onClick={scrollToExplore} whileHover={reduced ? undefined : { y: -2 }} whileTap={{ scale: 0.96 }}>
            More <span aria-hidden="true">↓</span>
          </motion.button>
          <motion.button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            whileHover={reduced ? undefined : { y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </motion.button>
        </div>
      </nav>

      <section className="hero-section" id="top">
        <div className="grid-overlay" aria-hidden="true" />

        <div className="shapes" aria-hidden="true">
          {shapes.map((spec, i) => (
            <Shape key={i} spec={spec} reduced={reduced} />
          ))}
        </div>

        <main className="hero">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="eyebrow-dot" /> hello, i&apos;m
          </motion.p>

          <motion.h1 className="name" variants={nameContainer} initial="hidden" animate="show" aria-label={name}>
            {nameParts.map((part, line) => (
              <span className="name-line" key={part}>
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
              initial={{ strokeDashoffset: 640, opacity: 0 }}
              animate={{ strokeDashoffset: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.85, ease: 'easeInOut' }}
            />
          </svg>

          <motion.p
            className="hero-tagline"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.6, delay: reduced ? 0 : 0.95, ease: panelEase }}
          >
            Data science student exploring mathematics, AI &amp; playful experiments.
          </motion.p>

          <motion.button
            className="hero-reset"
            type="button"
            onClick={putLettersBack}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.5, delay: reduced ? 0 : 1.05, ease: panelEase }}
            whileHover={reduced ? undefined : { y: -2 }}
          >
            put letters back <span aria-hidden="true">↺</span>
          </motion.button>
        </main>

        <button className="scroll-hint" type="button" onClick={scrollToExplore}>
          scroll to explore ↓
        </button>
      </section>

      <SlidePanel panel="about" open={activePanel === 'about'} reduced={reduced} onClose={closePanel}>
        <p className="panel-kicker">background</p>
        <h2 className="panel-title">
          About <span className="accent-coral">me</span>
        </h2>
        <div className="panel-story">
          {aboutStory.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="panel-rule" aria-hidden="true" />
        <dl className="about-details">
          {aboutDetails.map((detail) => (
            <div className="about-detail" key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
        <p className="panel-note">{bio}</p>
        <button className="panel-next" type="button" onClick={scrollToExplore}>
          view more <span aria-hidden="true">↓</span>
        </button>
      </SlidePanel>

      <SlidePanel panel="contact" open={activePanel === 'contact'} reduced={reduced} onClose={closePanel}>
        <p className="panel-kicker">contact</p>
        <h2 className="panel-title">
          Let&apos;s <span className="accent-lilac">talk</span>
        </h2>
        <p className="panel-intro">
          For questions, collaboration, or general enquiries, feel free to reach out.
        </p>
        <div className="contact-list">
          {contactLinks.map((link) => (
            <a
              className="contact-row"
              key={link.label}
              href={link.href}
              {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span className="contact-label">{link.label}</span>
              <span className="contact-value">{link.value}</span>
              <ArrowIcon />
            </a>
          ))}
        </div>
        <p className="panel-note">
          I&apos;m open to discussing data, AI, and opportunities to collaborate.
        </p>
      </SlidePanel>

      <div className="explore" id="explore">
        <StackedSection
          id="journey"
          kicker="experience & education"
          title="Career &"
          accent="education"
          accentClass="accent-coral"
          lede="An overview of my academic background and professional experience."
          cards={journeyCards}
          reduced={reduced}
        />

        <StackedSection
          id="skills"
          kicker="technical skills"
          title="Skills &"
          accent="expertise"
          accentClass="accent-mint"
          lede="Technical skills developed through academic study and professional work."
          cards={skillCards}
          reduced={reduced}
        />
      </div>

      <footer className="site-footer">
        <button type="button" onClick={() => openPanel('contact')}>get in touch ↗</button>
        <span>© 2026 Sadhana Uprety · Data Science &amp; AI</span>
      </footer>
    </div>
  )
}
