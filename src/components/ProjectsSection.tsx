import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { projects, type Project, type ProjectLink } from '../data/projects'
import { Lightbox } from './Lightbox'
import { MediaFrame } from './MediaFrame'
import { ArrowUpRight, GitHubIcon } from './Icons'

const placeholderLabels = ['Role', 'Result']

function LinkView({ link }: { link: ProjectLink }) {
  if (link.href) {
    const isGitHub = link.label.toLowerCase().includes('github')
    return (
      <a
        className="project-link"
        href={link.href}
        target={link.href.startsWith('http') ? '_blank' : undefined}
        rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {isGitHub ? <GitHubIcon className="project-link-icon" /> : <ArrowUpRight className="project-link-icon" />}
        <span>{link.label}</span>
      </a>
    )
  }

  return (
    <span
      className="project-link project-link--pending"
      title={`Add this URL in src/data/projects.ts: ${link.placeholder}`}
    >
      <span>{link.label}</span>
      <em>{link.placeholder}</em>
    </span>
  )
}

function ProjectCard({
  project,
  index,
  reduced,
  onOpen,
}: {
  project: Project
  index: number
  reduced: boolean
  onOpen: () => void
}) {
  return (
    <motion.article
      id={`project-${project.slug}`}
      className={`project-card project-card--${project.layout} project-card--${project.accent}`}
      aria-labelledby={`${project.slug}-title`}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0.01 : 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="project-media">
        <MediaFrame project={project} shot={project.image} reduced={reduced} onOpen={onOpen} />
        {project.gallery.length > 0 ? (
          <span className="project-media-count">{project.gallery.length + 1} images</span>
        ) : null}
      </div>

      <div className="project-body">
        <div className="project-top">
          <span className="project-kicker">{project.kicker}</span>
          <span className="project-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h3 id={`${project.slug}-title`}>{project.title}</h3>
        <p className="project-problem">{project.problem}</p>

        <ul className="project-chips" aria-label={`${project.title} tech stack`}>
          {project.stack.map((item) => (
            <li className="project-chip" key={item}>
              {item}
            </li>
          ))}
        </ul>

        <ul className="project-outcomes">
          {project.outcomes.map((outcome) => (
            <li key={outcome}>
              <span className="project-bullet" aria-hidden="true">
                ↳
              </span>
              <span>{outcome}</span>
            </li>
          ))}
        </ul>

        {project.features?.length ? (
          <details className="project-features">
            <summary>
              What it does <span aria-hidden="true">+</span>
            </summary>
            <ul>
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </details>
        ) : null}

        {project.notes?.length ? (
          <div className="project-placeholders" role="note" aria-label="Placeholders to fill in">
            {project.notes.map((note, noteIndex) => (
              <span className="project-placeholder" key={note}>
                <span className="project-placeholder-label">{placeholderLabels[noteIndex] ?? 'Note'}</span>
                {note}
              </span>
            ))}
          </div>
        ) : null}

        <div className="project-links">
          {project.links.map((link) => (
            <LinkView key={link.label} link={link} />
          ))}
        </div>
      </div>
    </motion.article>
  )
}

export function ProjectsSection({ reduced }: { reduced: boolean }) {
  const [lightbox, setLightbox] = useState<{ project: Project; index: number } | null>(null)

  const closeLightbox = useCallback(() => setLightbox(null), [])
  const changeIndex = useCallback((index: number) => {
    setLightbox((current) => (current ? { ...current, index } : current))
  }, [])

  return (
    <section id="projects" className="section projects-section" aria-labelledby="projects-title">
      <div className="section-inner">
        <div className="section-head">
          <p className="section-kicker">selected work</p>
          <h2 className="section-title" id="projects-title">
            Things I&apos;ve <span className="accent-blue">built</span>
          </h2>
          <p className="section-lede">
            Three projects across AI products, local-first search, and OOP foundations.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              reduced={reduced}
              onOpen={() => setLightbox({ project, index: 0 })}
            />
          ))}
        </div>
      </div>

      <Lightbox
        project={lightbox?.project ?? null}
        index={lightbox?.index ?? 0}
        reduced={reduced}
        onClose={closeLightbox}
        onIndexChange={changeIndex}
      />
    </section>
  )
}
