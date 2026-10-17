'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from './gsap'

/** Pulls its child toward the pointer while hovered (fine pointers only). */
export default function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()

    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const toX = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' })
      const toY = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' })

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        toX((e.clientX - (r.left + r.width / 2)) * strength)
        toY((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => {
        toX(0)
        toY(0)
      }

      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    })

    return () => mm.revert()
  }, { scope: ref })

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block' }}>
      {children}
    </span>
  )
}
