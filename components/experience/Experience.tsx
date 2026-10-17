'use client'

import { useRef } from 'react'
import { experience } from '@/content/content'
import { gsap, SplitText, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import SplitReveal from '@/components/motion/SplitReveal'
import styles from './experience.module.css'

export default function Experience() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-job]')
      const splits: SplitText[] = []
      items.forEach((item) => {
        const year = item.querySelector<HTMLElement>('[data-year]')!
        const split = SplitText.create(year, { type: 'chars', mask: 'chars' })
        year.classList.add('is-split')
        splits.push(split)
        gsap
          .timeline({ scrollTrigger: { trigger: item, start: 'top 80%', once: true }, defaults: { ease: 'expo.out' } })
          .from(item.querySelector('[data-rule]'), { scaleX: 0, duration: 1.4, ease: 'expo.inOut' })
          .from(split.chars, { yPercent: 100, duration: 1.1, stagger: 0.06 }, 0.2)
          .from(item.querySelectorAll('[data-job-reveal]'), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.06 }, 0.35)
      })
      return () => splits.forEach((s) => s.revert())
    })
    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <section
      ref={rootRef}
      id="experience"
      className={styles.experience}
      data-section-theme="ink"
      aria-labelledby="experience-title"
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className="label">Experience</span>
          <span className={`label ${styles.muted}`}>2017 — now</span>
        </div>
        <SplitReveal as="h2" id="experience-title" className={styles.title}>
          Nine years across engineering, support and <em className="serif">root causes.</em>
        </SplitReveal>

        <ol className={styles.list}>
          {experience.map((job) => (
            <li key={job.company} className={styles.job} data-job>
              <span className={styles.rule} data-rule aria-hidden="true" />
              <div className={styles.yearCol}>
                <span className={`display ${styles.year}`} data-year data-split="" aria-hidden="true">
                  {job.year}
                </span>
              </div>
              <div className={styles.main}>
                <div className={styles.meta} data-job-reveal>
                  <h3 className={styles.company}>{job.company}</h3>
                  <p className={`label ${styles.period}`}>
                    {job.type} · {job.tenure}
                  </p>
                  <p className={styles.location}>{job.location}</p>
                </div>

                <ol className={styles.roles}>
                  {job.roles.map((r) => (
                    <li key={r.title} className={styles.roleItem} data-job-reveal>
                      <span className={styles.dot} aria-hidden="true" />
                      <p className={styles.role}>{r.title}</p>
                      <p className={styles.dates}>
                        {r.period} <span aria-hidden="true">·</span> {r.duration}
                      </p>
                    </li>
                  ))}
                </ol>

                <ul className={styles.skills} aria-label={`Skills at ${job.company}`} data-job-reveal>
                  {job.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>

                {job.bullets.length > 0 && (
                  <ul className={styles.bullets}>
                    {job.bullets.map((b) => (
                      <li key={b} data-job-reveal>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
