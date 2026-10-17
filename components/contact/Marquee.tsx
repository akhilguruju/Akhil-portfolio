'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import styles from './contact.module.css'

/** Endless band whose speed and direction follow the scroll. */
export default function Marquee({ items }: { items: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const loop = gsap.to('[data-track]', { xPercent: -50, ease: 'none', duration: 38, repeat: -1 })
      let direction = 1
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          direction = self.direction
          const boost = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 250)
          gsap.to(loop, { timeScale: boost * direction, duration: 0.25, overwrite: true })
          gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.25 })
        },
      })
      return () => {
        st.kill()
        loop.kill()
      }
    })
    return () => mm.revert()
  }, { scope: rootRef })

  const run = (
    <span className={styles.run}>
      {items.map((item) => (
        <span key={item} className={styles.runItem}>
          <span className="serif">{item}</span>
          <span className={styles.star} aria-hidden="true">
            ✳
          </span>
        </span>
      ))}
    </span>
  )

  return (
    <div ref={rootRef} className={styles.marquee} aria-hidden="true">
      <div className={styles.track} data-track>
        {run}
        {run}
      </div>
    </div>
  )
}
