'use client'

import { useRef } from 'react'
import { work } from '@/content/content'
import { gsap, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import SplitReveal from '@/components/motion/SplitReveal'
import shell from './agents.module.css'
import styles from './gainsight.module.css'

const p = work.gainsight

export default function CaseGainsight() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from('[data-gs-reveal]', {
        y: 28,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-gs-body]', start: 'top 80%', once: true },
      })
      // Product areas tick in like a checklist
      gsap.from('[data-area]', {
        x: -20,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: '[data-areas]', start: 'top 80%', once: true },
      })
      gsap.from('[data-area-rule]', {
        scaleX: 0,
        duration: 1.2,
        ease: 'expo.inOut',
        stagger: 0.07,
        scrollTrigger: { trigger: '[data-areas]', start: 'top 80%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <section
      ref={rootRef}
      id={p.id}
      className={`${shell.agents} ${styles.section}`}
      data-section-theme="ink"
      aria-labelledby={`${p.id}-title`}
    >
      <div className={shell.inner}>
        <header className={shell.head}>
          <p className={`label ${shell.kicker}`}>
            {p.kicker} <span aria-hidden="true">·</span> {p.period}
          </p>
          <SplitReveal as="h3" id={`${p.id}-title`} className={`display ${shell.title}`} by="chars">
            {p.title}
          </SplitReveal>
        </header>

        <div className={styles.grid} data-gs-body>
          <div className={styles.left}>
            <p className={shell.lead} data-gs-reveal>
              {p.summary}
            </p>

            <div data-gs-reveal>
              <h4 className={`label ${styles.sub}`}>How I work a ticket</h4>
              <ol className={styles.process}>
                {p.process.map((s, i) => (
                  <li key={s.step} className={styles.step}>
                    <span className={`label ${styles.stepNo}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.stepName}>{s.step}</span>
                    <span className={styles.stepText}>{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className={styles.bridge} data-gs-reveal>
              <em className="serif">{p.bridge}</em>
            </p>
          </div>

          <div className={styles.areas} data-areas>
            <h4 className={`label ${styles.sub}`}>Product areas I support</h4>
            <ul>
              {p.areas.map((a) => (
                <li key={a.name} className={styles.area} data-area>
                  <span className={styles.areaRule} data-area-rule aria-hidden="true" />
                  <span className={styles.areaName}>{a.name}</span>
                  <span className={styles.areaNote}>{a.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
