import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { useVerify } from './useVerify'
import { Address } from 'viem'

export const useAuth = () => {
  const { mutateAsync: verify, isPending, isSuccess, isError } = useVerify()

  const handleVerify = useCallback(async (address: Address | undefined, chainId: number) => {
    if (!address || !chainId) {
      throw new Error('Wallet not connected')
    }
    
    const result = await verify({ address, chainId })
    // here we want to trigger the session store to hydrate the session
    // if the session is valid then we want to redirect to the dashboard
    // if the session is not valid then we want to show the verify account modal
  }, [verify])

  return {
    verify: handleVerify,
    isVerifying: isPending,
    isVerifySuccess: isSuccess,
    isVerifyError: isError,
  }
}