import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Project, ProjectShot } from '../data/projects'
import { ChevronLeft, ChevronRight, CloseIcon } from './Icons'

function LightboxImage({ shot }: { shot: ProjectShot }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (failed) {
    return (
      <div className="lightbox-fallback" role="img" aria-label={`${shot.alt} — image unavailable`}>
        <span>Screenshot coming soon</span>
      </div>
    )
  }

  return (
    <>
      {!loaded ? <span className="lightbox-skeleton" aria-hidden="true" /> : null}
      <img
        className={`lightbox-image${loaded ? ' is-loaded' : ''}`}
        src={shot.src}
        srcSet={shot.srcSet}
        sizes="(min-width: 1100px) 960px, 92vw"
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  )
}

type LightboxProps = {
  project: Project | null
  index: number
  reduced: boolean
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function Lightbox({ project, index, reduced, onClose, onIndexChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStart = useRef<number | null>(null)

  const shots = useMemo<ProjectShot[]>(() => {
    if (!project) return []
    return [project.image, ...project.gallery]
  }, [project])

  const goTo = (next: number) => {
    if (shots.length === 0) return
    onIndexChange((next + shots.length) % shots.length)
  }

  useEffect(() => {
    if (!project) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [project])

  useEffect(() => {
    if (!project) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onIndexChange((index + 1) % shots.length)
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onIndexChange((index - 1 + shots.length) % shots.length)
        return
      }
      if (event.key !== 'Tab') return

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
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

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [project, index, shots.length, onClose, onIndexChange])

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStart.current = event.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStart.current == null) return
    const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current
    touchStart.current = null
    if (Math.abs(delta) < 48) return
    goTo(delta > 0 ? index - 1 : index + 1)
  }

  const shot = shots[index]
  const hasMultiple = shots.length > 1

  return createPortal(
    <AnimatePresence>
      {project && shot ? (
        <div className="lightbox" role="presentation">
          <motion.button
            className="lightbox-backdrop"
            type="button"
            tabIndex={-1}
            aria-label="Close gallery"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.25 }}
          />
          <motion.div
            className="lightbox-panel"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: reduced ? 0.01 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="lightbox-head">
              <div>
                <p className="lightbox-kicker">{project.kicker}</p>
                <h2 id="lightbox-title">{project.title}</h2>
              </div>
              <div className="lightbox-tools">
                <span className="lightbox-count" aria-live="polite">
                  {String(index + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}
                </span>
                <button
                  className="lightbox-close"
                  type="button"
                  onClick={onClose}
                  aria-label="Close gallery"
                  ref={closeRef}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="lightbox-stage">
              {hasMultiple ? (
                <button
                  className="lightbox-arrow lightbox-arrow--prev"
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="Previous image"
                >
                  <ChevronLeft />
                </button>
              ) : null}
              <div className="lightbox-media" key={shot.src}>
                <LightboxImage shot={shot} />
              </div>
              {hasMultiple ? (
                <button
                  className="lightbox-arrow lightbox-arrow--next"
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Next image"
                >
                  <ChevronRight />
                </button>
              ) : null}
            </div>

            {hasMultiple ? (
              <div className="lightbox-thumbs" aria-label="Gallery images">
                {shots.map((thumb, thumbIndex) => (
                  <button
                    key={thumb.src}
                    className={`lightbox-thumb${thumbIndex === index ? ' is-active' : ''}`}
                    type="button"
                    aria-current={thumbIndex === index ? 'true' : undefined}
                    aria-label={`Show image ${thumbIndex + 1}: ${thumb.alt}`}
                    onClick={() => onIndexChange(thumbIndex)}
                  >
                    <img
                      src={thumb.src}
                      alt=""
                      width={thumb.width}
                      height={thumb.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
