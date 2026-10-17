'use client'

import { useRef } from 'react'
import { skills } from '@/content/content'
import { gsap, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import SplitReveal from '@/components/motion/SplitReveal'
import styles from './skills.module.css'

const total = skills.reduce((n, g) => n + g.items.length, 0)

export default function Skills() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('[data-group]').forEach((group) => {
        gsap
          .timeline({ scrollTrigger: { trigger: group, start: 'top 85%', once: true }, defaults: { ease: 'expo.out' } })
          .from(group.querySelector('[data-group-name]'), { yPercent: 100, duration: 1.1 })
          .from(group.querySelectorAll('[data-skill]'), { y: 12, autoAlpha: 0, duration: 0.7, stagger: 0.025 }, 0.15)
      })
    })
    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <section ref={rootRef} id="skills" className={styles.skills} data-section-theme="paper" aria-labelledby="skills-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className="label">Skills</span>
          <span className={`label ${styles.muted}`}>
            {total} skills across {skills.length} areas
          </span>
        </div>

        <SplitReveal as="h2" id="skills-title" className={`display ${styles.title}`} by="chars">
          Toolkit
        </SplitReveal>

        <ul className={styles.groups}>
          {skills.map((g) => (
            <li key={g.group} className={styles.group} data-group>
              <div className={styles.groupHead}>
                <span className={styles.mask}>
                  <h3 className={styles.groupName} data-group-name>
                    {g.group}
                  </h3>
                </span>
                <span className={`label ${styles.groupMeta}`}>
                  {g.isNew && <span className={styles.new}>New</span>}({String(g.items.length).padStart(2, '0')})
                </span>
              </div>
              <ul className={styles.items}>
                {g.items.map((s) => (
                  <li key={s} className={styles.item} data-skill>
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
