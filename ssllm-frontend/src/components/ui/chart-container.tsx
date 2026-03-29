"use client"

import { useEffect, useRef, useState } from "react"
import { ResponsiveContainer } from "recharts"

interface ChartContainerProps {
  height: number
  children: React.ReactNode
}

/**
 * Wrapper around Recharts ResponsiveContainer that defers rendering
 * until the container is mounted and has actual dimensions.
 * This prevents the "width(-1) and height(-1)" console warnings.
 */
export function ChartContainer({ height, children }: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Wait for the next animation frame to ensure the container is laid out
    const raf = requestAnimationFrame(() => {
      setReady(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ height, minWidth: 0, overflow: "hidden" }}
    >
      {ready && (
        <ResponsiveContainer width="99%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      )}
    </div>
  )
}
