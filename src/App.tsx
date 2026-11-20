import { AnimatePresence, motion, useReducedMotion, type MotionStyle, type Variants } from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

type PanelName = 'about' | 'contact'

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
  { kind: 'circle', color: '#FF6B4A', size: 86, top: '13%', left: '7%', duration: 7, delay: 0.2, driftX: 22, driftY: -34, spin: 15 },
  { kind: 'ring', color: '#3D5AFE', size: 66, top: '20%', left: '84%', duration: 8.5, delay: 0.5, driftX: -28, driftY: 26, spin: -18 },
  { kind: 'star', color: '#FFC63F', size: 58, top: '68%', left: '9%', duration: 6.5, delay: 0.8, driftX: 18, driftY: -22, spin: 24 },
  { kind: 'pill', color: '#20C9A6', size: 78, height: 34, top: '76%', left: '78%', duration: 9, delay: 0.35, driftX: -24, driftY: -28, spin: -12 },
  { kind: 'blob', color: '#A774FF', size: 104, top: '7%', left: '61%', duration: 10, delay: 0.1, driftX: 26, driftY: 20, spin: 22 },
  { kind: 'cross', color: '#FF5C9D', size: 46, top: '59%', left: '91%', duration: 7.5, delay: 0.65, driftX: -18, driftY: 30, spin: 20 },
  { kind: 'circle', color: '#FFC63F', size: 26, top: '38%', left: '3%', duration: 6, delay: 0.95, driftX: 12, driftY: -18, spin: 0 },
  { kind: 'ring', color: '#FF6B4A', size: 42, top: '86%', left: '43%', duration: 8, delay: 0.45, driftX: 6, driftY: -24, spin: -16 },
  { kind: 'blob', color: '#20C9A6', size: 38, top: '30%', left: '94%', duration: 7, delay: 1.1, driftX: -10, driftY: 18, spin: 18 },
  { kind: 'circle', color: '#20C9A6', size: 18, top: '48%', left: '16%', duration: 6.8, delay: 1.2, driftX: 16, driftY: 24, spin: 0 },
  { kind: 'ring', color: '#A774FF', size: 30, top: '12%', left: '38%', duration: 9.2, delay: 0.6, driftX: 20, driftY: -20, spin: 14 },
  { kind: 'star', color: '#FF5C9D', size: 34, top: '84%', left: '62%', duration: 7.8, delay: 0.9, driftX: -14, driftY: -18, spin: -22 },
  { kind: 'pill', color: '#3D5AFE', size: 54, height: 22, top: '46%', left: '88%', duration: 10.5, delay: 0.25, driftX: -20, driftY: 22, spin: 10 },
  { kind: 'cross', color: '#FFC63F', size: 28, top: '26%', left: '22%', duration: 8.2, delay: 1.05, driftX: 14, driftY: 26, spin: -18 },
]

const letterColors = ['#FF6B4A', '#3D5AFE', '#FFC63F', '#20C9A6', '#A774FF', '#FF5C9D', '#FF6B4A']

const name = 'Sadhana'

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
  "I’m a data science student who likes poking at messy data until it spills something interesting. I’m into AI, half-baked experiments, and those little ‘wait, that’s actually cool’ moments. Mostly just learning by building things and seeing where my curiosity takes me."

const aboutStory = [
  "I’m Sadhana, a data science student who likes finding the strange, lovely patterns hiding inside messy data. Most of my time goes into learning by building—small experiments, half-baked ideas, and the occasional happy accident.",
  "I care about making technology feel a little more human: things that are useful, understandable, and maybe even a bit playful. When I’m not elbow-deep in a notebook, I’m usually chasing a new curiosity or adding to my collection of unfinished side quests.",
]

const aboutDetails = [
  {
    label: 'Background',
    value: 'Data science student, exploratory coder, and professional over-thinker of tiny details.',
  },
  {
    label: 'Interests',
    value: 'AI agents, data visualisation, interactive things, and the weird magic of niche internet communities.',
  },
  {
    label: 'Skills',
    value: 'Python, pandas, scikit-learn, TensorFlow, FastAPI, and a growing love of agent tooling.',
  },
  {
    label: 'Currently into',
    value: 'Multimodal models, playful interfaces, and learning in public.',
  },
]

const contactLinks = [
  { label: 'Email', value: 'upretysadhana@gmail.com', href: 'mailto:upretysadhana@gmail.com?subject=Hello%20Sadhana' },
  { label: 'GitHub', value: '/Sadhana-up', href: 'https://github.com/Sadhana-up' },
  { label: 'LinkedIn', value: '/in/sadhana-uprety/', href: 'https://www.linkedin.com/in/sadhana-uprety/' },
]

const panelEase = [0.22, 1, 0.36, 1] as const

const projects = [
  {
    name: 'Lucent',
    blurb:
      'An AI skincare advisor that helps you read your skin and build a routine that actually fits—no trendy nonsense.',
    role: 'Developer & AI integrator',
    tech: ['Python', 'Google ADK', 'Node.js', 'DB management'],
    links: [
      { label: 'Live site', href: 'https://www.lucentnepal.com' },
      { label: 'GitHub', href: 'https://github.com/Sadhana-up/Lucent', alt: true },
    ],
    tilt: '-1.2deg',
    accent: '#FF6B4A',
  },
  {
    name: 'CuraNova',
    blurb:
      'A multimodal medical AI assistant that can work with things like X-rays, prescriptions, and reports—pairing medical reasoning with a verification step.',
    tech: ['Python', 'FastAPI', 'Bun', 'MedGemma', 'Google ADK', 'Gemini', 'MCP/A2A'],
    links: [{ label: 'GitHub', href: 'https://github.com/Sadhana-up/CuraNova', alt: true }],
    tilt: '1deg',
    accent: '#3D5AFE',
  },
]

const skillGroups = [
  { title: 'Languages', items: ['Python (proficient)', 'R', 'Java'], color: '#FF6B4A' },
  {
    title: 'ML / AI Frameworks',
    items: ['TensorFlow', 'scikit-learn', 'Keras', 'Hugging Face Transformers'],
    color: '#3D5AFE',
  },
  {
    title: 'Data & Analytics',
    items: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Data Visualisation'],
    color: '#20C9A6',
  },
  {
    title: 'LLM & Agent Tools',
    items: ['Google Agent Development Kit (ADK)', 'Google Colab'],
    color: '#A774FF',
  },
  {
    title: 'Web / APIs',
    items: ['REST API consumption', 'Flask (basic)', 'Git & GitHub'],
    color: '#FFC63F',
  },
  {
    title: 'Tools & Platforms',
    items: ['VS Code', 'Jupyter Notebooks', 'Google Colab', 'Linux CLI'],
    color: '#FF5C9D',
  },
]

const journey = [
  {
    period: 'Now',
    kind: 'Education',
    title: 'Data science student',
    place: 'Add your degree, school, and year here',
    detail: 'Replace this with what you are studying, the questions you are chasing, and the coursework that changed how you think.',
    color: '#FF6B4A',
  },
  {
    period: '2025',
    kind: 'Experience',
    title: 'Building with AI',
    place: 'Independent projects',
    detail: 'From Lucent to CuraNova, I have been turning ideas into working prototypes with Python, FastAPI, and Google ADK.',
    color: '#3D5AFE',
  },
  {
    period: 'Before',
    kind: 'Foundation',
    title: 'Learning in public',
    place: 'Curiosity-driven',
    detail: 'Notebooks, tiny experiments, and a growing habit of sharing the messy middle of learning something new.',
    color: '#20C9A6',
  },
]

const extras = [
  {
    label: 'Certifications',
    title: 'Proof of the rabbit holes',
    items: ['Add a certification or course', 'Add another course or workshop', 'Add a self-directed milestone'],
    color: '#FFC63F',
  },
  {
    label: 'Achievements',
    title: 'Small wins, real momentum',
    items: ['Add a competition, hackathon, or award', 'Add a project milestone', 'Add something you are quietly proud of'],
    color: '#A774FF',
  },
]

const interests = [
  {
    title: 'Data with feelings',
    text: 'Visualisations and stories that make numbers feel a little more human.',
    color: '#FF6B4A',
  },
  {
    title: 'Agent experiments',
    text: 'Small tools that reason, verify, and occasionally surprise me.',
    color: '#20C9A6',
  },
  {
    title: 'Internet oddities',
    text: 'Niche communities, playful interfaces, and things that make people smile.',
    color: '#FF5C9D',
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

function resetPlayBodies(reduced: boolean) {
  cancelAnimationFrame(homeFrame)

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

function usePlaygroundPhysics(reduced: boolean) {
  useEffect(() => {
    if (reduced) return
    let frame = 0
    let last = performance.now()

    const step = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2)
      last = now
      const width = window.innerWidth
      const height = window.innerHeight

      playBodies.forEach((body) => {
        if (!body.active || body.dragging || !body.el) return
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
          body.vy = -Math.abs(body.vy) * 0.62
          body.vx *= 0.98
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

      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
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

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => previousFocus?.focus()
  }, [open])

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
            className={`slide-panel slide-panel--${panel}`}
            role="dialog"
            aria-modal="true"
            aria-label={panel === 'about' ? 'About Sadhana' : 'Contact Sadhana'}
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

export default function App() {
  const reduced = useReducedMotion() ?? false
  const [activePanel, setActivePanel] = useState<PanelName | null>(null)
  usePlaygroundPhysics(reduced)

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
      <nav className="site-nav" aria-label="Main navigation">
        <a className="nav-brand" href="#top" onClick={closePanel}>
          <span className="nav-brand-name">Sadhana Uprety</span>
        </a>
        <div className="nav-links">
          <motion.button
            className={`nav-link${activePanel === 'about' ? ' is-active' : ''}`}
            type="button"
            onClick={() => openPanel('about')}
            aria-expanded={activePanel === 'about'}
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
            whileHover={reduced ? undefined : { y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Contact
          </motion.button>
          <motion.button className="nav-link nav-link--explore" type="button" onClick={scrollToExplore} whileHover={reduced ? undefined : { y: -2 }} whileTap={{ scale: 0.96 }}>
            More <span aria-hidden="true">↓</span>
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
            {name.split('').map((char, i) => (
              <PlayfulLetter key={`${char}-${i}`} char={char} index={i} reduced={reduced} />
            ))}
          </motion.h1>

          <svg className="squiggle" viewBox="0 0 600 28" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="squiggle-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF6B4A" />
                <stop offset="30%" stopColor="#FFC63F" />
                <stop offset="60%" stopColor="#20C9A6" />
                <stop offset="100%" stopColor="#3D5AFE" />
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
          scroll for the good stuff ↓
        </button>
      </section>

      <SlidePanel panel="about" open={activePanel === 'about'} reduced={reduced} onClose={closePanel}>
        <p className="panel-kicker">a little context</p>
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
          explore the rest <span aria-hidden="true">↓</span>
        </button>
      </SlidePanel>

      <SlidePanel panel="contact" open={activePanel === 'contact'} reduced={reduced} onClose={closePanel}>
        <p className="panel-kicker">say hi</p>
        <h2 className="panel-title">
          Let&apos;s <span className="accent-lilac">talk</span>
        </h2>
        <p className="panel-intro">
          Got a question, a collab idea, or just something cool to share? My inbox is always open.
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
          I&apos;m especially happy to chat about data, AI, creative experiments, or whatever you&apos;re building.
        </p>
      </SlidePanel>

      <div className="explore" id="explore">
      <section className="section explore-intro">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-kicker">the rest of the story</p>
            <h2 className="section-title">
              Keep <span className="accent-blue">exploring</span>
            </h2>
          </div>
          <p className="explore-lede">
            Education, experience, projects, skills, and the little things that make me me—all in one place.
          </p>
          <nav className="explore-index" aria-label="Explore sections">
            <a href="#journey">01 — journey</a>
            <a href="#projects">02 — projects</a>
            <a href="#skills">03 — skills</a>
            <a href="#extras">04 — extras</a>
          </nav>
        </div>
      </section>

      <section className="section" id="journey">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-kicker">the path so far</p>
            <h2 className="section-title">
              A little <span className="accent-coral">journey</span>
            </h2>
          </div>
          <div className="journey-list">
            {journey.map((entry, i) => (
              <motion.article
                key={entry.title}
                className="journey-item"
                style={{ '--journey-color': entry.color } as MotionStyle}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
              >
                <div className="journey-marker" aria-hidden="true"><span /></div>
                <p className="journey-period">{entry.period}</p>
                <div className="journey-body">
                  <p className="journey-kind">{entry.kind}</p>
                  <h3>{entry.title}</h3>
                  <p className="journey-place">{entry.place}</p>
                  <p className="journey-detail">{entry.detail}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-kicker">things i&apos;ve built</p>
            <h2 className="section-title">
              Selected <span className="accent-blue">projects</span>
            </h2>
          </div>
          <div className="projects-grid">
            {projects.map((project, i) => (
              <motion.article
                key={project.name}
                className="project-card"
                style={{ transform: `rotate(${project.tilt})`, borderTop: `6px solid ${project.accent}` }}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <div className="project-top">
                  <span className="project-number">{String(i + 1).padStart(2, '0')}</span>
                  <span className="project-meta">{project.role ?? 'Selected work'}</span>
                </div>
                <h3>{project.name}</h3>
                <p className="project-blurb">{project.blurb}</p>
                <ul className="tag-list" aria-label={`${project.name} tech`}>
                  {project.tech.map((item) => (
                    <li className="tag" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="project-links">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      className={`btn-link${link.alt ? ' alt' : ''}`}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-kicker">tools in the backpack</p>
            <h2 className="section-title">
              Skills &amp; <span className="accent-mint">tools</span>
            </h2>
            <p className="section-lede">
              A working toolkit, not a trophy shelf. These are the things I reach for most often.
            </p>
          </div>
          <div className="skills-grid">
            {skillGroups.map((group, i) => (
              <motion.div
                key={group.title}
                className="skill-card"
                style={{ borderTop: `5px solid ${group.color}` }}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <div className="skill-card-head">
                  <h3>{group.title}</h3>
                  <span>{String(group.items.length).padStart(2, '0')}</span>
                </div>
                <ul className="skill-items">
                  {group.items.map((item) => (
                    <li className="skill-item" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="extras">
        <div className="section-inner">
          <div className="section-head">
            <p className="section-kicker">beyond the résumé</p>
            <h2 className="section-title">
              Little <span className="accent-yellow">extras</span>
            </h2>
            <p className="section-lede">
              The certificates, small wins, and curious detours that do not quite fit anywhere else.
            </p>
          </div>
          <div className="extras-grid">
            {extras.map((group, i) => (
              <motion.div
                key={group.label}
                className="extras-card"
                style={{ borderTop: `5px solid ${group.color}` }}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
              >
                <p className="extras-label">{group.label}</p>
                <h3>{group.title}</h3>
                <ul className="extras-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
            <motion.div
              className="interests-card"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.14 }}
            >
              <p className="extras-label">currently curious about</p>
              <div className="interest-list">
                {interests.map((interest, i) => (
                  <motion.div
                    key={interest.title}
                    className="interest-item"
                    style={{ '--interest-color': interest.color } as MotionStyle}
                    initial={reduced ? false : { opacity: 0, x: 12 }}
                    whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: 0.18 + i * 0.06 }}
                  >
                    <span className="interest-dot" aria-hidden="true" />
                    <div>
                      <h4>{interest.title}</h4>
                      <p>{interest.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          <motion.div
            className="extras-cta"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
          >
            <p>Got something interesting in mind?</p>
            <button className="btn-link" type="button" onClick={() => openPanel('contact')}>
              Let&apos;s talk ↗
            </button>
          </motion.div>
        </div>
      </section>
      </div>

      <footer className="site-footer">
        <button type="button" onClick={() => openPanel('contact')}>say hi ↗</button>
        <span>made with curiosity, chaos, and a lot of data · Sadhana</span>
      </footer>
    </div>
  )
}
