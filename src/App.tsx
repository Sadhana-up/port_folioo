import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, type MouseEvent } from 'react'
import { AboutPanel } from './components/AboutPanel'
import { ContactSection } from './components/ContactSection'
import { Hero } from './components/Hero'
import { MoonIcon, SunIcon } from './components/Icons'
import { ProjectsSection } from './components/ProjectsSection'
import { SkillsSection } from './components/SkillsSection'
import { StackedSection } from './components/StackedSection'
import { journeyCards } from './data/content'
import { useActiveSection } from './hooks/useActiveSection'

type Theme = 'light' | 'dark'

const navSectionIds = ['journey', 'projects', 'skills', 'contact']

const getInitialTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

export default function App() {
  const reduced = useReducedMotion() ?? false
  const [aboutOpen, setAboutOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const activeSection = useActiveSection(navSectionIds)
  const highlightedSection = aboutOpen ? null : activeSection

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    localStorage.setItem('portfolio-theme', theme)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#17161A' : '#F7F4ED')
  }, [theme])

  useEffect(() => {
    if (!aboutOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAboutOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [aboutOpen])

  const closeAbout = () => setAboutOpen(false)
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  const scrollToId = (id: string) => {
    setAboutOpen(false)
    document.body.style.overflow = ''
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }

  const handleAnchor = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollToId(id)
  }

  return (
    <div className={`app${reduced ? ' reduce-motion' : ''}${aboutOpen ? ' panel-open' : ''}`}>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        <div className="nav-inner">
          <div className="nav-links">
            <motion.button
              className={`nav-link${aboutOpen ? ' is-active' : ''}`}
              type="button"
              onClick={() => setAboutOpen(true)}
              aria-expanded={aboutOpen}
              aria-haspopup="dialog"
              aria-controls={aboutOpen ? 'panel-about' : undefined}
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              About
            </motion.button>
            <a
              className={`nav-link nav-link--experience${highlightedSection === 'journey' ? ' is-active' : ''}`}
              href="#journey"
              aria-current={highlightedSection === 'journey' ? 'location' : undefined}
              onClick={handleAnchor('journey')}
            >
              Experience
            </a>
            <a
              className={`nav-link${highlightedSection === 'projects' ? ' is-active' : ''}`}
              href="#projects"
              aria-current={highlightedSection === 'projects' ? 'location' : undefined}
              onClick={handleAnchor('projects')}
            >
              Projects
            </a>
            <a
              className={`nav-link${highlightedSection === 'skills' ? ' is-active' : ''}`}
              href="#skills"
              aria-current={highlightedSection === 'skills' ? 'location' : undefined}
              onClick={handleAnchor('skills')}
            >
              Skills
            </a>
            <a
              className={`nav-link${highlightedSection === 'contact' ? ' is-active' : ''}`}
              href="#contact"
              aria-current={highlightedSection === 'contact' ? 'location' : undefined}
              onClick={handleAnchor('contact')}
            >
              Contact
            </a>
            <motion.button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </motion.button>
          </div>
        </div>
      </nav>

      <main id="content" tabIndex={-1}>
        <Hero reduced={reduced} />

        <div className="explore" id="explore">
          <StackedSection
            id="journey"
            kicker="experience & education"
            title="Career &"
            accent="education"
            accentClass="accent-coral"
            lede="Where I study and what I build — the short version, with the tools involved."
            cards={journeyCards}
            reduced={reduced}
          />

          <ProjectsSection reduced={reduced} />

          <SkillsSection reduced={reduced} />
        </div>

        <ContactSection />
      </main>

      <AboutPanel
        open={aboutOpen}
        reduced={reduced}
        onClose={closeAbout}
        onExplore={() => scrollToId('journey')}
      />

      <footer className="site-footer">
        <button type="button" onClick={() => scrollToId('contact')}>
          get in touch ↗
        </button>
        <span>© 2026 Sadhana Uprety · Data Science &amp; AI</span>
        <a className="footer-top" href="#top" onClick={handleAnchor('top')}>
          back to top ↑
        </a>
      </footer>
    </div>
  )
}
