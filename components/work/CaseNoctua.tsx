'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { work } from '@/content/content'
import { gsap, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import SplitReveal from '@/components/motion/SplitReveal'
import Magnetic from '@/components/motion/Magnetic'
import VideoFrame from './VideoFrame'
import styles from './case.module.css'

const p = work.noctua

export default function CaseNoctua() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      // The plate opens out of a smaller window; the recording drifts against it
      gsap.fromTo(
        '[data-plate]',
        { clipPath: 'inset(14% 10% 14% 10%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: '[data-plate]', start: 'top 95%', end: 'top 25%', scrub: true },
        },
      )
      gsap.fromTo(
        '[data-window]',
        { yPercent: 14, rotate: -2.5 },
        {
          yPercent: -8,
          rotate: 0,
          ease: 'none',
          scrollTrigger: { trigger: '[data-plate]', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.from('[data-case-reveal]', {
        y: 28,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: '[data-case-body]', start: 'top 80%', once: true },
      })
      gsap.from('[data-chip]', {
        y: 14,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.03,
        scrollTrigger: { trigger: '[data-chips]', start: 'top 88%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <article ref={rootRef} id={p.id} className={styles.case} aria-labelledby={`${p.id}-title`}>
      <header className={styles.head}>
        <p className={`label ${styles.kicker}`}>
          {p.kicker} <span aria-hidden="true">·</span> {p.period}
        </p>
        <SplitReveal as="h3" id={`${p.id}-title`} className={`display ${styles.title}`} by="chars">
          {p.title}
        </SplitReveal>
      </header>

      <div className={styles.plate} data-plate>
        <span className={`label ${styles.corner} ${styles.tl}`}>Case — {p.title}</span>
        <a
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className={`label ${styles.corner} ${styles.tr}`}
          data-cursor="Visit"
        >
          {p.urlLabel} ↗
        </a>
        <span className={`label ${styles.corner} ${styles.bl}`}>{p.period}</span>
        <span className={`label ${styles.corner} ${styles.br}`}>{p.skills.length} skills listed</span>

        <div className={styles.window} data-window>
          <div className={styles.chrome} aria-hidden="true">
            <span />
            <span />
            <span />
            <span className={styles.address}>linkedin.com — Projects</span>
          </div>
          {p.cover ? (
            <Image src={p.cover} alt={`${p.title} website`} width={1600} height={1000} sizes="(max-width: 899px) 92vw, 60vw" />
          ) : (
            <VideoFrame
              webm={p.recording.webm}
              poster={p.recording.poster}
              width={p.recording.width}
              height={p.recording.height}
              label={`Screen recording of the ${p.title} project entry on LinkedIn`}
            />
          )}
        </div>
      </div>
      <p className={`label ${styles.caption}`}>{p.recording.caption}</p>

      <div className={styles.body} data-case-body>
        <aside className={styles.aside}>
          <dl className={styles.facts}>
            {p.facts.map((f) => (
              <div key={f.label} data-case-reveal>
                <dt className="label">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <div data-case-reveal>
            <Magnetic>
              <a href={p.url} target="_blank" rel="noreferrer" className={styles.visit} data-cursor="Open">
                Visit the live site <span aria-hidden="true">↗</span>
              </a>
            </Magnetic>
          </div>
        </aside>

        <div className={styles.copy}>
          <p className={styles.lead} data-case-reveal>
            {p.summary}
          </p>
          <p data-case-reveal>{p.ownership}</p>

          <div className={styles.lists}>
            <div data-case-reveal>
              <h4 className="label">What I built</h4>
              <ul className={styles.list}>
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
            <div data-case-reveal>
              <h4 className="label">How AI fit in</h4>
              <ul className={styles.list}>
                {p.workflow.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className={styles.closing} data-case-reveal>
            <em className="serif">{p.closing}</em>
          </p>
        </div>
      </div>

      <div className={styles.skills} data-chips>
        <h4 className="label">Skills on this project ({p.skills.length})</h4>
        <ul>
          {p.skills.map((s) => (
            <li key={s} className={styles.chip} data-chip>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
