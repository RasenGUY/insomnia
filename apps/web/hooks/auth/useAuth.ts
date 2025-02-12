import { useCallback } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
// import { useSessionStore } from 'components/features/session/store'
import { useVerify } from 'hooks/auth/queries'
// import { parseSessionResponseData } from 'utils/session'

export const useAuth = () => {
  const { address, chainId } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const { mutateAsync: verify, isPending: isVerifying } = useVerify()
  // const { setSession, clearSession } = useSessionStore()

  const handleVerify = useCallback(async () => {
    if (!address || !chainId) {
      throw new Error('Wallet not connected')
    }

    try {
      const result = await verify({ address, chainId })
      // setSession(parseSessionResponseData(result))
      return result
    } catch (error) {
      // clearSession()
      throw error
    }
  }, [address, chainId, verify,])

  const logout = useCallback(async () => {
    try {
      await disconnectAsync()
      // clearSession()
    } catch (error) {
      console.error('Logout error:', error)
      // trigger session clear even if disconnect fails
    }
  }, [disconnectAsync, ])

  return {
    verify: handleVerify,
    logout,
    isConnected: !!address,
    isVerifying
  }
}