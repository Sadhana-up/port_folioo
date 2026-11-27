import { useState } from 'react'
import type { ProjectShot } from '../data/projects'

export function PhotoFrame({ photo }: { photo: ProjectShot }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (failed) {
    return (
      <div className="about-photo about-photo--fallback" role="img" aria-label="Photo of Sadhana Uprety coming soon">
        <span aria-hidden="true">SU</span>
        <small>Photo coming soon</small>
      </div>
    )
  }

  return (
    <div className={`about-photo${loaded ? ' is-loaded' : ''}`}>
      {!loaded ? <span className="about-photo-skeleton" aria-hidden="true" /> : null}
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
