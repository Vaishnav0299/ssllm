import { useState, useEffect, useCallback } from "react"

/**
 * Generic data-fetching hook with loading/error states and auto-retry.
 * Wraps any API function, returns { data, loading, error, reload }.
 *
 * Usage:
 *   const { data: skills, loading, error, reload } = useFetch(fetchSkills)
 */
export function useFetch<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (err: any) {
      console.error("useFetch error:", err)
      setError(err.message || "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: load }
}
