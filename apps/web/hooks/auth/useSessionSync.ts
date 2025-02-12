import { useAccount } from "wagmi"
import { useSessionStore } from "components/features/auth/store"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

// Hook to sync Wagmi account with session
export function useSessionSync() {
  const { address } = useAccount()
  const { loadSession, clearSession } = useSessionStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    // Load session on mount
    loadSession()
  }, [])

  useEffect(() => {
    // Clear session if Wagmi account changes or disconnects
    if (!address) {
      clearSession()
      queryClient.clear() // Clear React Query cache
    }
  }, [address, clearSession, queryClient])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'session-storage') {
        loadSession()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [loadSession])
}