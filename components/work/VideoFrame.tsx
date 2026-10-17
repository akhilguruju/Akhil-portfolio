'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './case.module.css'

interface VideoFrameProps {
  webm: string
  poster: string
  width: number
  height: number
  label: string
}

/** Looping, muted recording that plays only while on screen and can always be paused. */
export default function VideoFrame({ webm, poster, width, height, label }: VideoFrameProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(true)
  const userPaused = useRef(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduced && !userPaused.current) video.play().catch(() => undefined)
        else video.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [reduced])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      userPaused.current = false
      video.play().catch(() => undefined)
    } else {
      userPaused.current = true
      video.pause()
    }
  }

  return (
    <div className={styles.video}>
      <video
        ref={ref}
        width={width}
        height={height}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      >
        <source src={webm} type="video/webm" />
      </video>
      <button type="button" className={`label ${styles.videoToggle}`} onClick={toggle}>
        {paused ? 'Play' : 'Pause'}
        <span className="visually-hidden"> recording</span>
      </button>
    </div>
  )
}
