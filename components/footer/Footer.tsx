'use client'

import { useRef } from 'react'
import { meta } from '@/content/content'
import { gsap, SplitText, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import RollText from '@/components/motion/RollText'
import LiveClock from '@/components/nav/LiveClock'
import styles from './footer.module.css'

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const word = rootRef.current!.querySelector<HTMLElement>('[data-wordmark]')!
      const split = SplitText.create(word, { type: 'chars', mask: 'chars' })
      word.classList.add('is-split')
      gsap.from(split.chars, {
        yPercent: 100,
        ease: 'power2.out',
        stagger: 0.03,
        scrollTrigger: { trigger: rootRef.current, start: 'top 95%', end: 'bottom bottom', scrub: 0.6 },
      })
      return () => split.revert()
    })
    return () => mm.revert()
  }, { scope: rootRef })

  const year = 2026

  return (
    <footer ref={rootRef} className={styles.footer}>
      <div className={styles.row}>
        <span className="label">
          © {year} {meta.name}
        </span>
        <span className={`label ${styles.muted}`}>Designed & built with Next.js, GSAP and Lenis</span>
        <span className={`label ${styles.muted}`}>
          Hyderabad <LiveClock timeZone={meta.timeZone} /> IST
        </span>
        <a href={meta.linkedin} target="_blank" rel="noreferrer" className="label">
          <RollText>LinkedIn ↗</RollText>
        </a>
        <a href="#top" className={`label ${styles.top}`}>
          <RollText>Back to top ↑</RollText>
        </a>
      </div>
      <p className={`display ${styles.wordmark}`} data-wordmark data-split="" aria-hidden="true">
        {meta.name}
      </p>
    </footer>
  )
}
