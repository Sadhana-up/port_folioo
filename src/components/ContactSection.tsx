import { contactLinks } from '../data/content'
import { ArrowUpRight, GitHubIcon, LinkedInIcon, MailIcon } from './Icons'

const contactIcons = {
  Email: MailIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
}

export function ContactSection() {
  return (
    <section id="contact" className="section contact-section" aria-labelledby="contact-title">
      <div className="section-inner">
        <div className="contact-card">
          <div className="contact-copy">
            <p className="section-kicker contact-kicker">contact</p>
            <h2 className="section-title" id="contact-title">
              Let&apos;s <span className="accent-lilac">talk</span>
            </h2>
            <p className="section-lede contact-lede">
              I&apos;m open to internships, collaborations, and conversations about data, AI, and
              good problems.
            </p>
            <p className="contact-closing">
              Based in Nepal — open to remote work and thoughtful projects.
            </p>
          </div>

          <ul className="contact-list">
            {contactLinks.map((link) => {
              const Icon = contactIcons[link.label as keyof typeof contactIcons] ?? ArrowUpRight
              return (
                <li key={link.label}>
                  <a
                    className="contact-row"
                    href={link.href}
                    {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    <span className="contact-label">{link.label}</span>
                    <span className="contact-value">
                      <Icon className="contact-icon" />
                      {link.value}
                    </span>
                    <ArrowUpRight className="panel-arrow" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
