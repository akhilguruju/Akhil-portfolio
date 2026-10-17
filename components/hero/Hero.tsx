'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { meta } from '@/content/content'
import { gsap, SplitText, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import { createPortrait, type Portrait } from './portraitRenderer'
import styles from './hero.module.css'

const SOURCE = { w: 1640, h: 1888 }

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const root = rootRef.current!
    const img = imgRef.current!
    const canvas = canvasRef.current!
    const motionOK = window.matchMedia(MOTION_OK).matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    // intro and scroll each hold their own resolution; the lower one wins
    const intro = { res: motionOK ? 0 : 1, tint: motionOK ? 1 : 0 }
    const scroll = { p: 0 }
    let portrait: Portrait | null = null
    let disposed = false
    const cleanups: Array<() => void> = []

    const writeReadout = () => {
      if (!portrait || !readoutRef.current || !statusRef.current) return
      const cols = portrait.columns()
      if (cols === null) {
        readoutRef.current.textContent = `${SOURCE.w} × ${SOURCE.h}`
        statusRef.current.textContent = 'Resolved'
      } else {
        const c = Math.round(cols)
        readoutRef.current.textContent = `${c} × ${Math.round((c * SOURCE.h) / SOURCE.w)}`
        statusRef.current.textContent = scroll.p > 0.02 ? 'Downsampling' : 'Resolving'
      }
    }

    const sync = () => {
      if (!portrait) return
      const s = portrait.state
      s.res = Math.min(intro.res, 1 - scroll.p * 0.9)
      s.tint = Math.max(intro.tint, scroll.p * 0.75)
      portrait.render()
      writeReadout()
    }

    // ── Portrait: WebGL with graceful fallback to the plain image ───────
    img
      .decode()
      .catch(() => undefined)
      .then(() => {
        if (disposed) return
        portrait = createPortrait(canvas, img)
        if (!portrait) {
          root.dataset.gl = 'off'
          return
        }
        root.dataset.gl = 'on'
        portrait.resize()

        const ro = new ResizeObserver(() => {
          portrait?.resize()
          sync()
        })
        ro.observe(canvas)
        cleanups.push(() => ro.disconnect())

        // Only spend frames while the hero is on screen
        let visible = true
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
        io.observe(root)
        const tick = () => {
          if (visible) sync()
        }
        gsap.ticker.add(tick)
        cleanups.push(() => {
          io.disconnect()
          gsap.ticker.remove(tick)
        })

        if (finePointer) {
          const state = portrait.state
          const toX = gsap.quickTo(state, 'mx', { duration: 0.35, ease: 'power3' })
          const toY = gsap.quickTo(state, 'my', { duration: 0.35, ease: 'power3' })
          const move = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect()
            const x = e.clientX - r.left
            const y = e.clientY - r.top
            if (state.lens < 0.01) {
              state.mx = x
              state.my = y
            }
            toX(x)
            toY(y)
          }
          const enter = () => gsap.to(state, { lens: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
          const leave = () => gsap.to(state, { lens: 0, duration: 0.4, ease: 'power2.in', overwrite: 'auto' })
          canvas.addEventListener('pointermove', move)
          canvas.addEventListener('pointerenter', enter)
          canvas.addEventListener('pointerleave', leave)
          cleanups.push(() => {
            canvas.removeEventListener('pointermove', move)
            canvas.removeEventListener('pointerenter', enter)
            canvas.removeEventListener('pointerleave', leave)
          })
        }

        if (motionOK) {
          // Progressive decode: eight hard steps from blocks to native
          gsap
            .timeline({ delay: 0.15 })
            .to(intro, { res: 1, duration: 1.5, ease: 'steps(8)' })
            .to(intro, { tint: 0, duration: 0.9, ease: 'power2.inOut' }, 0.7)
        }
        sync()
      })

    // ── Type and chrome ─────────────────────────────────────────────────
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      // Solid name + its outline ghost share data-hero-line, so they always move together
      const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-line]'))
      const fades = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-fade]'))
      const navItems = Array.from(document.querySelectorAll<HTMLElement>('[data-intro="nav"]'))
      const splits: SplitText[] = []
      gsap.set([...fades, ...navItems], { autoAlpha: 0 })

      const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))])

      fontsReady.then(() => {
        if (disposed) return
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        lines.forEach((line) => {
          const split = SplitText.create(line, { type: 'chars', mask: 'lines' })
          splits.push(split)
          tl.from(split.chars, { yPercent: 105, duration: 1.3, stagger: 0.04 }, line.dataset.heroLine === 'a' ? 0.1 : 0.28)
        })
        const thesis = SplitText.create(root.querySelector('[data-hero-thesis]'), { type: 'lines', mask: 'lines' })
        splits.push(thesis)
        root.querySelectorAll('[data-split]').forEach((el) => el.classList.add('is-split'))

        tl.from(thesis.lines, { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.65)
          .fromTo(fades, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.8)
          .fromTo(navItems, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.9)
      })

      // Leaving the hero: the name parts, the portrait sinks and de-resolves
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } })
        .to('[data-hero-line="a"]', { xPercent: -14, ease: 'none' }, 0)
        .to('[data-hero-line="b"]', { xPercent: 14, ease: 'none' }, 0)
        .to('[data-portrait]', { yPercent: 10, ease: 'none' }, 0)
        .to('[data-hero-statement]', { y: -60, autoAlpha: 0, ease: 'none' }, 0)
        .to(scroll, { p: 1, ease: 'power1.in' }, 0)

      return () => {
        splits.forEach((s) => s.revert())
        gsap.set(navItems, { clearProps: 'all' })
      }
    })

    return () => {
      disposed = true
      mm.revert()
      cleanups.forEach((fn) => fn())
      portrait?.destroy()
    }
  }, { scope: rootRef })

  return (
    <section ref={rootRef} id="top" className={styles.hero} data-section-theme="ink" data-gl="pending">
      <h1 className={styles.name}>
        <span className="visually-hidden">
          {meta.name} — {meta.role}
        </span>
        <span className={`display ${styles.line} ${styles.lineA}`} data-hero-line="a" data-split="" aria-hidden="true">
          Akhil Sai
        </span>
        <span className={`display ${styles.line} ${styles.lineB}`} data-hero-line="b" data-split="" aria-hidden="true">
          Guruju
        </span>
      </h1>

      {/* Outline copy above the portrait: letters the head hides still read, X-ray style */}
      <div className={`${styles.name} ${styles.ghost}`} aria-hidden="true">
        <span className={`display ${styles.line} ${styles.lineA}`} data-hero-line="a" data-split="">
          Akhil Sai
        </span>
        <span className={`display ${styles.line} ${styles.lineB}`} data-hero-line="b" data-split="">
          Guruju
        </span>
      </div>

      <div className={styles.portrait} data-portrait>
        <Image
          ref={imgRef}
          className={styles.img}
          src="/images/portrait.webp"
          alt={`Portrait of ${meta.name}`}
          width={1200}
          height={1381}
          sizes="(max-width: 899px) 120vw, 56vw"
          preload
        />
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" data-cursor-hide="" />
      </div>

      <div className={styles.statement} data-hero-statement>
        <p className={`label ${styles.kicker}`} data-hero-fade>
          {meta.title}
        </p>
        <p className={styles.thesis} data-hero-thesis data-split="">
          I work in <em className="serif">resolutions.</em>
        </p>
        <p className={styles.sub} data-hero-fade>
          {meta.thesis}
        </p>
      </div>

      <div className={`label ${styles.readout}`} data-hero-fade aria-hidden="true">
        <span className={styles.readoutKey}>Portrait / px</span>
        <span ref={readoutRef} className={styles.readoutValue}>
          {SOURCE.w} × {SOURCE.h}
        </span>
        <span ref={statusRef} className={styles.readoutStatus}>
          Resolved
        </span>
      </div>
    </section>
  )
}
