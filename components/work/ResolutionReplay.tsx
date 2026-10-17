'use client'

import { useRef } from 'react'
import { resolutionScenarios as tickets } from '@/content/content'
import { gsap, useGSAP, MOTION_OK, DESKTOP } from '@/components/motion/gsap'
import styles from './replay.module.css'

/**
 * Scroll-driven replay of the agent working three tickets. On desktop with
 * motion allowed it pins and scrubs; elsewhere every ticket renders resolved.
 */
export default function ResolutionReplay() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const root = rootRef.current!
    const mm = gsap.matchMedia()

    // Pinning needs room: the whole console must fit on screen
    mm.add(`${MOTION_OK} and ${DESKTOP} and (min-height: 720px)`, () => {
      root.dataset.mode = 'scrub'
      const q = gsap.utils.selector(root)
      const panels = q('[data-panel]')
      const rows = q('[data-row]')

      gsap.set(panels, { autoAlpha: 0, y: 24 })
      gsap.set(q('[data-state-open]'), { y: 0, yPercent: 0 })
      gsap.set(q('[data-state-done]'), { y: 0, yPercent: 100 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out', duration: 0.6 },
        scrollTrigger: {
          trigger: root,
          start: 'center center',
          end: () => `+=${window.innerHeight * 2.6}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      panels.forEach((panel, i) => {
        const steps = panel.querySelectorAll('[data-step]')
        const verdict = panel.querySelector('[data-verdict]')
        const row = rows[i]
        tl.to(row, { '--active': 1, duration: 0.3 })
          .to(panel, { autoAlpha: 1, y: 0 }, '<')
          .from(steps, { autoAlpha: 0, x: -16, stagger: 0.55 })
          .from(verdict, { autoAlpha: 0, y: 10 })
          .to(row.querySelector('[data-state-open]'), { yPercent: -100, duration: 0.4 }, '<')
          .to(row.querySelector('[data-state-done]'), { yPercent: 0, duration: 0.4 }, '<')
          .to({}, { duration: 0.6 })
        if (i < panels.length - 1) {
          tl.to(panel, { autoAlpha: 0, y: -24 }).to(row, { '--active': 0, duration: 0.3 }, '<')
        }
      })

      tl.fromTo(q('[data-progress]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: tl.duration() }, 0)

      return () => {
        root.dataset.mode = 'static'
      }
    })

    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <div ref={rootRef} className={styles.replay} data-mode="static">
      <div className={styles.head}>
        <span className="label">Replay — the agent on three tickets</span>
        <span className={`label ${styles.muted}`}>Illustrative cases</span>
      </div>

      <div className={styles.console}>
        <ol className={styles.queue} aria-label="Ticket queue">
          {tickets.map((t) => (
            <li key={t.ticket} className={styles.row} data-row>
              <span className={`label ${styles.id}`}>{t.ticket}</span>
              <span className={styles.desc}>{t.description}</span>
              <span className={`label ${styles.state}`}>
                <span className={styles.open} data-state-open>
                  Open
                </span>
                <span className={styles.done} data-state-done>
                  Resolved · {t.resolvedAt}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div className={styles.log}>
          {tickets.map((t) => (
            <div key={t.ticket} className={styles.panel} data-panel>
              <p className={`label ${styles.panelHead}`}>
                {t.ticket} <span aria-hidden="true">—</span> {t.description}
              </p>
              <ol className={styles.steps}>
                {t.steps.map((step, j) => (
                  <li key={step} data-step className={step.startsWith('Root cause') ? styles.cause : undefined}>
                    <span className={`label ${styles.stepNo}`}>{String(j + 1).padStart(2, '0')}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className={`label ${styles.verdict}`} data-verdict>
                Resolved in {t.resolvedAt}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span data-progress />
      </div>
    </div>
  )
}
