'use client'

import { useRef } from 'react'
import { certifications, courses, education } from '@/content/content'
import { gsap, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import styles from './credentials.module.css'

export default function Credentials() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from('[data-cred]', {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <section
      ref={rootRef}
      id="credentials"
      className={styles.credentials}
      data-section-theme="paper"
      aria-labelledby="credentials-title"
    >
      <div className={styles.inner}>
        <h2 id="credentials-title" className={`label ${styles.heading}`}>
          Certifications, courses & education
        </h2>

        <div className={styles.grid}>
          <ul className={styles.list} aria-label="Certifications">
            {certifications.map((c) => (
              <li key={c.name} className={styles.row} data-cred>
                <span className={styles.name}>{c.name}</span>
                <span className={styles.detail}>{[c.issuer, c.level].filter(Boolean).join(' · ')}</span>
                <span className={`label ${styles.year}`}>{c.year}</span>
              </li>
            ))}
          </ul>

          <div>
            <div className={styles.row} data-cred>
              <span className={styles.name}>{education.degree}</span>
              <span className={styles.detail}>
                {education.institution} · CGPA {education.cgpa}
              </span>
              <span className={`label ${styles.year}`}>{education.year}</span>
            </div>
            {courses.map((c) => (
              <div key={c.name} className={styles.row} data-cred>
                <span className={styles.name}>{c.name}</span>
                <span className={styles.detail}>Course · {c.issuer}</span>
                <span className={`label ${styles.year}`}>{c.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
