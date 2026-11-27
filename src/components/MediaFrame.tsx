import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import type { Project, ProjectShot } from '../data/projects'

type MediaFrameProps = {
  project: Project
  shot: ProjectShot
  reduced: boolean
  onOpen?: () => void
  priority?: boolean
}

export function MediaFrame({ project, shot, reduced, onOpen, priority = false }: MediaFrameProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const inView = useInView(frameRef, { margin: '160px 0px' })
  const initial = project.title.charAt(0)
  const showVideo = Boolean(project.video) && !reduced && !failed

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (inView) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [inView])

  const media = failed ? (
    <div
      className="media-fallback"
      role="img"
      aria-label={`${project.title} — screenshot coming soon`}
    >
      <span className="media-fallback-initial" aria-hidden="true">
        {initial}
      </span>
      <span className="media-fallback-text">Screenshot coming soon</span>
    </div>
  ) : showVideo && project.video ? (
    <video
      ref={videoRef}
      className="media-video"
      src={project.video.src}
      poster={project.video.poster || shot.src}
      muted
      loop
      playsInline
      preload="metadata"
      tabIndex={-1}
      onError={() => setFailed(true)}
    />
  ) : (
    <>
      {!loaded ? <span className="media-skeleton" aria-hidden="true" /> : null}
      <img
        className={`media-image${loaded ? ' is-loaded' : ''}`}
        src={shot.src}
        srcSet={shot.srcSet}
        sizes={shot.srcSet ? '(min-width: 900px) 50vw, 100vw' : undefined}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  )

  return (
    <div className={`media-frame media-frame--${project.accent}`} ref={frameRef}>
      <div className="media-bar" aria-hidden="true">
        <span className="media-dot" />
        <span className="media-dot" />
        <span className="media-dot" />
        <span className="media-bar-label">preview</span>
      </div>
      <div className="media-viewport">
        {media}
        {onOpen ? (
          <button
            className="media-trigger"
            type="button"
            onClick={onOpen}
            aria-label={`Open ${project.title} gallery, ${project.gallery.length + 1} images`}
          >
            <span className="media-trigger-hint">View gallery</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}
