'use client'

import { useSignMessage } from 'wagmi'
import { trpc } from '@/server/client'
import { createSiweMessage } from '@/lib/auth'

export function useSiwe() {
  const { signMessageAsync } = useSignMessage()
  const utils = trpc.useUtils()
  const siwe = trpc.auth.verify.useMutation({
    onSuccess: () => {
      utils.session.invalidate()
    }
  })

  const getNonce = trpc.auth.getNonce.useQuery(undefined, {
    enabled: false,
    staleTime: 0,
    gcTime: 0,
  })

  const handleVerify = async (address: string, chainId: number) => {
    try {
      const { data: getNonceData }  = await getNonce.refetch();
      
      const siweMessage = createSiweMessage(address, getNonceData?.nonce as string, chainId);

      const message = siweMessage.prepareMessage()
      const signature = await signMessageAsync({
        message
      })

      await siwe.mutateAsync({
        message,
        signature
      })

    } catch (error) {
      console.error('SIWE failed:', error)
      throw error
    }
  }

  return {
    verify: handleVerify,
    isVerifying: siwe.isPending,
    verifyError: siwe.error,
  }
}