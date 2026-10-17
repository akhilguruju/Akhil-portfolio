'use client'

import { useRef } from 'react'
import { mcpNodes } from '@/content/content'
import { gsap, useGSAP, MOTION_OK } from '@/components/motion/gsap'
import styles from './agents.module.css'

const W = 600
const H = 400
const CX = W / 2
const CY = H / 2

const nodes = mcpNodes.map((n) => ({ ...n, px: (n.x / 100) * W, py: (n.y / 100) * H }))

/** Claude in the middle, MCP tools around it; context packets flow inward. */
export default function McpGraph() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
        defaults: { ease: 'expo.out' },
      })
      tl.from('[data-hub]', { scale: 0.6, autoAlpha: 0, duration: 1, transformOrigin: '50% 50%' })
        .from('[data-edge]', { strokeDashoffset: 1, duration: 1.2, stagger: 0.12, ease: 'power3.inOut' }, 0.2)
        .from('[data-node]', { y: 16, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.5)

      // Context packets: each tool feeds the hub on its own rhythm
      const packets = gsap.utils.toArray<SVGCircleElement>('[data-packet]')
      const loops = packets.map((dot, i) =>
        gsap.fromTo(
          dot,
          { attr: { cx: nodes[i].px, cy: nodes[i].py }, opacity: 0 },
          {
            attr: { cx: CX, cy: CY },
            opacity: 1,
            duration: 1.4,
            ease: 'power2.in',
            repeat: -1,
            repeatDelay: 0.5 + i * 0.25,
            delay: 1.4 + i * 0.35,
            paused: true,
          },
        ),
      )
      tl.add(() => loops.forEach((l) => l.play()))

      return () => loops.forEach((l) => l.kill())
    })
    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <div ref={rootRef} className={styles.graph} role="img" aria-label="Claude connected through MCP to Gainsight APIs, REST endpoints, log stores and Slack or CRM">
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {nodes.map((n) => (
          <line
            key={n.id}
            x1={n.px}
            y1={n.py}
            x2={CX}
            y2={CY}
            pathLength={1}
            strokeDasharray="1"
            className={styles.edge}
            data-edge
          />
        ))}
        {nodes.map((n) => (
          <circle key={n.id} r={3.5} cx={n.px} cy={n.py} className={styles.packet} data-packet opacity={0} />
        ))}
        <g data-hub>
          <circle cx={CX} cy={CY} r={58} className={styles.hubRing} />
          <circle cx={CX} cy={CY} r={40} className={styles.hub} />
        </g>
      </svg>

      <span className={styles.hubLabel} style={{ left: '50%', top: '50%' }}>
        Claude
        <small className="label">via MCP</small>
      </span>
      {nodes.map((n) => (
        <span key={n.id} className={`label ${styles.node}`} style={{ left: `${n.x}%`, top: `${n.y}%` }} data-node>
          {n.label}
        </span>
      ))}
    </div>
  )
}
