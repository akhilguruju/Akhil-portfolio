'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/components/motion/gsap'
import styles from './cursor.module.css'

/**
 * A dot that trails the pointer. Hovering anything with data-cursor="Label"
 * grows it into a labelled disc; plain links and buttons just enlarge it.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const dot = dotRef.current
    const label = labelRef.current
    if (!dot || !label) return
    const mm = gsap.matchMedia()

    mm.add('(hover: hover) and (pointer: fine)', () => {
      const root = document.documentElement
      root.classList.add('has-cursor')
      gsap.set(dot, { xPercent: -50, yPercent: -50 })
      const toX = gsap.quickTo(dot, 'x', { duration: 0.45, ease: 'power3' })
      const toY = gsap.quickTo(dot, 'y', { duration: 0.45, ease: 'power3' })
      let current = ''

      const setMode = (mode: string, text = '') => {
        if (mode === current && text === label.textContent) return
        current = mode
        dot.dataset.mode = mode
        label.textContent = text
      }

      const move = (e: PointerEvent) => {
        toX(e.clientX)
        toY(e.clientY)
        dot.dataset.visible = 'true'
      }
      const over = (e: PointerEvent) => {
        const el = e.target as Element
        if (el.closest('[data-cursor-hide]')) return setMode('hidden')
        const labelled = el.closest<HTMLElement>('[data-cursor]')
        if (labelled) return setMode('label', labelled.dataset.cursor)
        if (el.closest('a, button, [role="button"]')) return setMode('link')
        setMode('default')
      }
      const hide = () => (dot.dataset.visible = 'false')
      const press = () => gsap.to(dot, { scale: 0.85, duration: 0.15 })
      const release = () => gsap.to(dot, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' })

      window.addEventListener('pointermove', move, { passive: true })
      document.addEventListener('pointerover', over)
      document.documentElement.addEventListener('pointerleave', hide)
      window.addEventListener('pointerdown', press)
      window.addEventListener('pointerup', release)

      return () => {
        root.classList.remove('has-cursor')
        window.removeEventListener('pointermove', move)
        document.removeEventListener('pointerover', over)
        document.documentElement.removeEventListener('pointerleave', hide)
        window.removeEventListener('pointerdown', press)
        window.removeEventListener('pointerup', release)
      }
    })

    return () => mm.revert()
  })

  return (
    <div ref={dotRef} className={styles.cursor} data-mode="default" data-visible="false" aria-hidden="true">
      <span ref={labelRef} className={styles.label} />
    </div>
  )
}
