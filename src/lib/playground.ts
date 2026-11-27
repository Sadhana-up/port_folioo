import { useEffect } from 'react'

export type PlayBody = {
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

export const playBodies = new Set<PlayBody>()

let homeFrame = 0
let physicsFrame = 0
let physicsLast = 0
let physicsPaused = false

export function cancelHomeAnimation() {
  cancelAnimationFrame(homeFrame)
}

export function resetPlayBodies(reduced: boolean) {
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

export function startPhysics() {
  if (physicsPaused || physicsFrame) return
  physicsLast = performance.now()
  physicsFrame = requestAnimationFrame(runPhysics)
}

export function stopPhysics() {
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
      const impulse = (-(1 + 0.55) * normalVelocity) / 2
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

export function usePlaygroundPhysics(reduced: boolean) {
  useEffect(() => {
    physicsPaused = reduced
    if (reduced) stopPhysics()
    return () => {
      physicsPaused = false
      stopPhysics()
    }
  }, [reduced])
}
