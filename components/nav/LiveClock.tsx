'use client'

import { useSyncExternalStore } from 'react'

const subscribe = (onTick: () => void) => {
  const id = setInterval(onTick, 15_000)
  return () => clearInterval(id)
}

/** Local time where Akhil is. Renders a placeholder on the server, then the real time once hydrated. */
export default function LiveClock({ timeZone }: { timeZone: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () =>
      new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(
        new Date(),
      ),
    () => '',
  )

  return <time aria-label={time ? `Local time ${time}` : undefined}>{time || '--:--'}</time>
}
