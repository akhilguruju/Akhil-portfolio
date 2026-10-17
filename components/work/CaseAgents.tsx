'use client'

import { useRef } from 'react'
import { work } from '@/content/content'
import { gsap, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import SplitReveal from '@/components/motion/SplitReveal'
import McpGraph from './McpGraph'
import ResolutionReplay from './ResolutionReplay'
import styles from './agents.module.css'

const p = work.agents

export default function CaseAgents() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from('[data-outcome]', {
        y: 32,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-outcomes]', start: 'top 85%', once: true },
      })
      gsap.from('[data-agents-lead]', {
        y: 24,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-agents-lead]', start: 'top 85%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <section
      ref={rootRef}
      id={p.id}
      className={styles.agents}
      data-section-theme="ink"
      aria-labelledby={`${p.id}-title`}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={`label ${styles.kicker}`}>
            {p.kicker} <span aria-hidden="true">·</span> {p.period}
          </p>
          <SplitReveal as="h3" id={`${p.id}-title`} className={`display ${styles.title}`} by="chars">
            {p.title}
          </SplitReveal>
        </header>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={styles.lead} data-agents-lead>
              {p.summary}
            </p>
            <dl className={styles.outcomes} data-outcomes>
              {p.outcomes.map((o) => (
                <div key={o.value} className={styles.outcome} data-outcome>
                  <dt className={styles.value}>{o.value}</dt>
                  <dd className={styles.outcomeLabel}>{o.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <McpGraph />
        </div>

        <ResolutionReplay />
      </div>
    </section>
  )
}
