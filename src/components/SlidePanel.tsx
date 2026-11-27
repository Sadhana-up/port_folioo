import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export type PanelName = 'about' | 'contact'

const panelEase = [0.22, 1, 0.36, 1] as const

export function SlidePanel({
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
            initial={reduced ? { opacity: 0 } : { x: panel === 'about' ? '-100%' : '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { x: panel === 'about' ? '-100%' : '100%', opacity: 0 }}
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
