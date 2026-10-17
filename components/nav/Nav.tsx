'use client'

import { useEffect, useRef, useState } from 'react'
import { meta, nav } from '@/content/content'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import { useLenis } from '@/components/providers/LenisProvider'
import RollText from '@/components/motion/RollText'
import LiveClock from './LiveClock'
import styles from './nav.module.css'

export default function Nav() {
  const barRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const lenis = useLenis()

  // Hide while scrolling down, return on the way up.
  useGSAP(() => {
    const bar = barRef.current
    if (!bar) return
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const hidden = self.direction === 1 && self.scroll() > window.innerHeight * 0.4
        bar.dataset.hidden = String(hidden)
      },
    })
    return () => st.kill()
  })

  // Menu overlay choreography
  useGSAP(() => {
    const menu = menuRef.current
    if (!menu) return
    const items = menu.querySelectorAll('[data-menu-item]')
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      if (open) {
        gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
        gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.25 })
      }
    })
    return () => mm.revert()
  }, { dependencies: [open] })

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    return () => {
      lenis?.start()
      document.removeEventListener('keydown', onKey)
    }
  }, [open, lenis])

  return (
    <>
      <header ref={barRef} className={styles.bar} data-hidden="false" data-open={open}>
        <a href="#top" className={styles.mark} data-intro="nav" aria-label={`${meta.name}, back to top`}>
          <span className={styles.markName}>{meta.name}</span>
          <span className={`label ${styles.markRole}`}>Support × AI × Design</span>
        </a>

        <nav className={styles.links} aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href} data-intro="nav">
                <a href={item.href}>
                  <RollText>{item.label}</RollText>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.status} data-intro="nav">
          <a href={meta.linkedin} target="_blank" rel="noreferrer" className={`label ${styles.social}`}>
            <RollText>LinkedIn ↗</RollText>
          </a>
          {meta.available && (
            <span className={`label ${styles.available}`}>
              <span className={styles.pulse} aria-hidden="true" />
              Open to roles
            </span>
          )}
          <span className={`label ${styles.clock}`}>
            HYD <LiveClock timeZone={meta.timeZone} />
          </span>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={`label ${styles.toggle}`}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
          data-intro="nav"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      <div
        ref={menuRef}
        id="site-menu"
        className={styles.menu}
        data-open={open}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <ul className={styles.menuList}>
          {nav.map((item) => (
            <li key={item.href} className={styles.menuMask}>
              <a href={item.href} data-menu-item onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.menuFoot}>
          <a href={`mailto:${meta.email}`} className={styles.menuMail}>
            {meta.email}
          </a>
          <a href={meta.linkedin} target="_blank" rel="noreferrer" className={styles.menuMail}>
            LinkedIn ↗
          </a>
          <span className="label">{meta.location}</span>
        </div>
      </div>
    </>
  )
}
