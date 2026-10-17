'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/components/motion/gsap'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

/** Scrolls to an in-page target, then hands focus to it for keyboard and screen-reader users. */
export function scrollToTarget(lenis: Lenis | null, target: HTMLElement | number) {
  const focus = () => {
    if (typeof target === 'number') return
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, onComplete: focus })
  } else {
    if (typeof target === 'number') window.scrollTo({ top: target })
    else target.scrollIntoView()
    focus()
  }
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Drive Lenis from GSAP's ticker so scrubbed ScrollTriggers stay in lockstep.
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // eslint-disable-next-line react-hooks/set-state-in-effect -- the instance only exists on the client
    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  // Route in-page anchor links through Lenis.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link) return
      const hash = link.getAttribute('href')!
      const target = hash === '#top' ? 0 : document.querySelector<HTMLElement>(hash)
      if (target === null) return
      e.preventDefault()
      history.pushState(null, '', hash)
      scrollToTarget(lenis, target)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
