import { motion, useReducedMotion, type MotionStyle, type Variants } from 'framer-motion'

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

export default function App() {
  const reduced = useReducedMotion() ?? false

  return (
    <div className={`app${reduced ? ' reduce-motion' : ''}`}>
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
          <span className="eyebrow-dot" /> hello, i'm
        </motion.p>

        <motion.h1 className="name" variants={nameContainer} initial="hidden" animate="show" aria-label={name}>
          {name.split('').map((char, i) => (
            <motion.span
              className="letter"
              key={`${char}-${i}`}
              variants={nameLetter}
              style={{ '--letter-color': letterColors[i % letterColors.length] } as MotionStyle}
              whileHover={reduced ? undefined : { y: -18, rotate: i % 2 === 0 ? -9 : 9, scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
            >
              <span className="letter-inner" style={{ animationDelay: `${i * 0.13}s` }}>
                {char}
              </span>
            </motion.span>
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
      </main>
    </div>
  )
}
