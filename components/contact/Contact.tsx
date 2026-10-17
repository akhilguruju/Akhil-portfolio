'use client'

import { useRef, useState } from 'react'
import { contact, meta } from '@/content/content'
import { gsap, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import SplitReveal from '@/components/motion/SplitReveal'
import Magnetic from '@/components/motion/Magnetic'
import Marquee from './Marquee'
import Footer from '@/components/footer/Footer'
import styles from './contact.module.css'

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from('[data-contact-reveal]', {
        y: 28,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-contact-body]', start: 'top 85%', once: true },
      })
      gsap.fromTo(
        '[data-mail-line]',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '[data-contact-body]', start: 'top 80%', once: true } },
      )
    })
    return () => mm.revert()
  }, { scope: rootRef })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(meta.email)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2400)
    } catch {
      window.location.href = `mailto:${meta.email}`
    }
  }

  return (
    <section ref={rootRef} id="contact" className={styles.contact} data-section-theme="rim" aria-labelledby="contact-title">
      <Marquee items={contact.marquee} />

      <div className={styles.inner}>
        <div className={styles.head}>
          <span className="label">Contact</span>
          {meta.available && <span className={`label ${styles.muted}`}>Available now</span>}
        </div>

        <SplitReveal as="h2" id="contact-title" className={styles.title}>
          {contact.heading[0]}
          <br />
          {contact.heading[1]} <em className="serif">{contact.headingEm}</em>
        </SplitReveal>

        <div className={styles.body} data-contact-body>
          <p className={styles.sub} data-contact-reveal>
            {contact.subtext}
          </p>

          <div className={styles.mailRow}>
            <a href={`mailto:${meta.email}`} className={styles.mail} data-cursor="Write">
              {meta.email}
              <span className={styles.mailLine} data-mail-line aria-hidden="true" />
            </a>
            <Magnetic>
              <button type="button" className={styles.copy} onClick={copy} data-cursor="Copy">
                {copied ? 'Copied' : 'Copy email'}
              </button>
            </Magnetic>
            <span className="visually-hidden" aria-live="polite">
              {copied ? 'Email address copied to clipboard' : ''}
            </span>
          </div>

          <dl className={styles.details}>
            <div data-contact-reveal>
              <dt className="label">Phone</dt>
              <dd>
                <a href={`tel:${meta.phone.replace(/\s/g, '')}`}>{meta.phone}</a>
              </dd>
            </div>
            <div data-contact-reveal>
              <dt className="label">LinkedIn</dt>
              <dd>
                <a href={meta.linkedin} target="_blank" rel="noreferrer" data-cursor="Open">
                  Akhil Sai Guruju ↗
                </a>
              </dd>
            </div>
            <div data-contact-reveal>
              <dt className="label">Based in</dt>
              <dd>{meta.location}</dd>
            </div>
            <div data-contact-reveal>
              <dt className="label">Replies</dt>
              <dd>{contact.reply}</dd>
            </div>
          </dl>
        </div>
      </div>

      <Footer />
    </section>
  )
}
