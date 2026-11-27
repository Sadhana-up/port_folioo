import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type MotionStyle,
} from 'framer-motion'
import { useRef, type CSSProperties } from 'react'
import type { StackCardData } from '../data/content'

type StackedSectionProps = {
  id: string
  kicker: string
  title: string
  accent: string
  accentClass: string
  lede: string
  cards: StackCardData[]
  reduced: boolean
}

function CardBody({
  card,
  index,
  total,
}: {
  card: StackCardData
  index: number
  total: number
}) {
  return (
    <>
      <span className="stack-accent" aria-hidden="true" />
      <div className="stack-card-top">
        <span>{card.eyebrow}</span>
        <span className="stack-card-count">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
      <h3>{card.title}</h3>
      <p className="stack-card-sub">{card.subtitle}</p>
      {card.points?.length ? (
        <ul className="stack-card-points">
          {card.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
      {card.note ? <p className="stack-card-note">{card.note}</p> : null}
    </>
  )
}

function PinnedCard({
  card,
  index,
  total,
  progress,
}: {
  card: StackCardData
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const start = index / total
  const end = (index + 1) / total
  const isLast = index === total - 1

  const y = useTransform(
    progress,
    index === 0 ? [0, 1] : [start, end],
    index === 0 ? ['0%', '0%'] : ['105%', '0%'],
  )
  const scale = useTransform(progress, [end, 1], isLast ? [1, 1] : [1, 0.92])
  const rotate = useTransform(progress, [end, 1], isLast ? [0, 0] : [0, index % 2 === 0 ? -1.2 : 1.2])

  return (
    <div className="stack-slot" style={{ zIndex: index + 1 }}>
      <motion.article
        className="stack-card"
        style={
          {
            '--card-color': card.color,
            y,
            scale,
            rotate,
            transformOrigin: 'center center',
          } as MotionStyle
        }
      >
        <CardBody card={card} index={index} total={total} />
      </motion.article>
    </div>
  )
}

function PinnedStack({ cards, id }: { cards: StackCardData[]; id: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const extra = Math.max(0, cards.length - 1)

  return (
    <div
      className="stack-track"
      ref={trackRef}
      style={
        {
          '--stack-desktop': `${100 + extra * 44}svh`,
          '--stack-mobile': `${100 + extra * 38}svh`,
        } as CSSProperties
      }
      data-stack={id}
    >
      <div className="stack-stage">
        {cards.map((card, index) => (
          <PinnedCard
            key={card.title}
            card={card}
            index={index}
            total={cards.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  )
}

function StaticStack({ cards, id }: { cards: StackCardData[]; id: string }) {
  return (
    <div className="stack-list stack-list--static" data-stack={id}>
      {cards.map((card, index) => (
        <article
          className="stack-card stack-card--static"
          key={card.title}
          style={{ '--card-color': card.color } as CSSProperties}
        >
          <CardBody card={card} index={index} total={cards.length} />
        </article>
      ))}
    </div>
  )
}

export function StackedSection({
  id,
  kicker,
  title,
  accent,
  accentClass,
  lede,
  cards,
  reduced,
}: StackedSectionProps) {
  return (
    <section id={id} className="section stacked-section" aria-labelledby={`${id}-title`}>
      <div className="section-inner">
        <div className="section-head stacked-head">
          <p className="section-kicker">{kicker}</p>
          <h2 className="section-title" id={`${id}-title`}>
            {title} <span className={accentClass}>{accent}</span>
          </h2>
          <p className="section-lede">{lede}</p>
        </div>
        {reduced ? <StaticStack cards={cards} id={id} /> : <PinnedStack cards={cards} id={id} />}
      </div>
    </section>
  )
}
