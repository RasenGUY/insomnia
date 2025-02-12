import { useSessionStore } from '@/components/features/auth/store'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useRegister } from './queries'

export const useRegistration = () => {
  const { address } = useAccount()
  const { isAuthenticated } = useSessionStore()
  const { mutate: register, isPending: isRegistering } = useRegister()

  const handleRegister = useCallback(async (username: string) => {
    if (!address || !isAuthenticated) {
      throw new Error('Must be connected and authenticated')
    }

    return register({ address, username })
  }, [address, isAuthenticated, register])

  return {
    register: handleRegister,
    isRegistering,
    isReady: !!address && isAuthenticated
  }
}