import { motion, type MotionStyle } from 'framer-motion'
import { skillGroups } from '../data/content'

export function SkillsSection({ reduced }: { reduced: boolean }) {
  return (
    <section id="skills" className="section skills-section" aria-labelledby="skills-title">
      <div className="section-inner">
        <div className="section-head">
          <p className="section-kicker">technical skills</p>
          <h2 className="section-title" id="skills-title">
            Skills &amp; <span className="accent-mint">expertise</span>
          </h2>
          <p className="section-lede">
            The languages, models, and tools I reach for when turning an idea into a working system.
          </p>
        </div>

        <div className="skills-groups">
          {skillGroups.map((group, groupIndex) => (
            <motion.div
              className="skill-group"
              key={group.label}
              style={{ '--group-color': group.color } as MotionStyle}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={reduced ? undefined : { y: -3 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: reduced ? 0.01 : 0.55,
                delay: reduced ? 0 : groupIndex * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="skill-group-head">
                <span className="skill-group-dot" aria-hidden="true" />
                <h3>{group.label}</h3>
                <span className="skill-group-count" aria-hidden="true">
                  {String(group.items.length).padStart(2, '0')}
                </span>
              </div>
              <ul className="skill-chips">
                {group.items.map((item, itemIndex) => (
                  <motion.li
                    className="skill-chip"
                    key={item}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={reduced ? undefined : { y: -2 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: reduced ? 0.01 : 0.35,
                      delay: reduced ? 0 : itemIndex * 0.035,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
