'use client'

import { ScrollTrigger, useGSAP } from './gsap'

/**
 * Each section declares the panel colour it wants with data-section-theme.
 * Whichever section holds the middle of the viewport sets the theme on <html>;
 * the registered colour properties in tokens.css then interpolate the change.
 *
 * Render this after <main> so its triggers are created after any pinned
 * sections have added their pin spacing.
 */
export default function ThemeObserver() {
  useGSAP(() => {
    const root = document.documentElement
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section-theme]'))

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) root.dataset.theme = section.dataset.sectionTheme
        },
      }),
    )

    // Late-loading fonts and media shift section heights; re-measure once settled.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      triggers.forEach((t) => t.kill())
      window.removeEventListener('load', refresh)
    }
  })

  return null
}
