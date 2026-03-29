import { useState, useEffect } from "react"

/**
 * Hook to detect if the current viewport is mobile (<768px).
 * Used by the Sidebar to switch between drawer and inline modes.
 *
 * Usage:
 *   const isMobile = useIsMobile()
 */
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [breakpoint])

  return isMobile
}
