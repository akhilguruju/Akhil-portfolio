'use client'

import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, SplitText, useGSAP, MOTION_OK } from './gsap'

interface SplitRevealProps {
  as?: ElementType
  children: ReactNode
  className?: string
  id?: string
  /** 'lines' rises whole lines out of a mask; 'chars' rises each letter */
  by?: 'lines' | 'chars'
  delay?: number
  start?: string
}

/** Headline that rises out of line masks when it scrolls into view. */
export default function SplitReveal({
  as: Tag = 'div',
  children,
  className,
  id,
  by = 'lines',
  delay = 0,
  start = 'top 85%',
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      const split = SplitText.create(el, {
        type: by === 'chars' ? 'lines,chars' : 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          el.classList.add('is-split')
          return gsap.from(by === 'chars' ? self.chars : self.lines, {
            yPercent: 110,
            duration: by === 'chars' ? 1 : 1.1,
            ease: 'expo.out',
            stagger: by === 'chars' ? 0.022 : 0.09,
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          })
        },
      })
      return () => split.revert()
    })

    return () => mm.revert()
  }, { scope: ref })

  return (
    <Tag ref={ref} className={className} id={id} data-split="">
      {children}
    </Tag>
  )
}
