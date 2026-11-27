import { about } from '../data/content'
import { PhotoFrame } from './PhotoFrame'
import { SlidePanel } from './SlidePanel'
import { ArrowUpRight, GitHubIcon } from './Icons'

export function AboutPanel({
  open,
  reduced,
  onClose,
  onExplore,
}: {
  open: boolean
  reduced: boolean
  onClose: () => void
  onExplore: () => void
}) {
  return (
    <SlidePanel panel="about" open={open} reduced={reduced} onClose={onClose}>
      <p className="panel-kicker">background</p>
      <h2 className="panel-title">
        About <span className="accent-coral">me</span>
      </h2>

      <div className="about-intro">
        <PhotoFrame photo={about.photo} />
        <p>{about.paragraph}</p>
      </div>

      <div className="panel-rule" aria-hidden="true" />

      <dl className="about-details">
        {about.facts.map((fact) => (
          <div className="about-detail" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      <a
        className="about-link"
        href="https://github.com/Sadhana-up"
        target="_blank"
        rel="noreferrer"
      >
        <GitHubIcon className="about-link-icon" />
        <span>github.com/Sadhana-up</span>
        <ArrowUpRight className="about-link-arrow" />
      </a>

      <button className="panel-next" type="button" onClick={onExplore}>
        see projects <span aria-hidden="true">↓</span>
      </button>
    </SlidePanel>
  )
}
