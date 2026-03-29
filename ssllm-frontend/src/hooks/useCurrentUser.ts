import { useState, useEffect, useCallback } from "react"
import { fetchUsers } from "@/lib/api"

/**
 * Custom hook to manage the current user state.
 * Provides a list of all users and a setter to switch users.
 */
export function useCurrentUser() {
  const [users, setUsers] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await fetchUsers()
      setUsers(data)
      setUser((prev: any) => {
        if (prev) return data.find((u: any) => u.id === prev.id) || data[0] || null
        const vaishnav = data.find((u: any) => u.name?.toLowerCase().includes("vaishnav"))
        return vaishnav || data[0] || null
      })
    } catch (err) {
      console.error("useCurrentUser: failed to load users", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { user, setUser, users, loading, reload: load }
}
