'use client'

import { useRef } from 'react'
import { about } from '@/content/content'
import { gsap, SplitText, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import styles from './about.module.css'

export default function About() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const statement = rootRef.current!.querySelector<HTMLElement>('[data-statement]')!
      // Words brighten in reading order as the paragraph travels up the screen
      const split = SplitText.create(statement, { type: 'words' })
      statement.classList.add('is-split')
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 },
        },
      )

      gsap.from('[data-fact]', {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-facts]', start: 'top 85%', once: true },
      })

      return () => split.revert()
    })
    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <section ref={rootRef} id="about" className={styles.about} data-section-theme="ink" aria-labelledby="about-title">
      <div className={styles.head}>
        <h2 id="about-title" className="label">About</h2>
        <span className={`label ${styles.muted}`}>Support engineer, agent builder, designer</span>
      </div>

      <p className={styles.statement} data-statement data-split="">
        {about.statement.map((seg, i) =>
          seg.em ? (
            <em key={i} className="serif">
              {seg.text}
            </em>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </p>

      <div className={styles.foot}>
        <dl className={styles.facts} data-facts>
          {about.facts.map((f) => (
            <div key={f.label} className={styles.fact} data-fact>
              <dt className={`label ${styles.muted}`}>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.tools} data-fact>
          <h3 className={`label ${styles.muted}`}>Daily tools</h3>
          <ul>
            {about.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
