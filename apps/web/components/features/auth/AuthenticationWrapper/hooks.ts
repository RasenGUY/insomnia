'use client'

import { useCallback, useEffect } from 'react'
import { ProviderConnectInfo } from 'viem'
import { Connector, useSignMessage, useDisconnect } from 'wagmi'
import { trpc } from '@/server/client'
import { createSiweMessage } from '@/lib/auth'

export function useSiwe(
  walletConnector: Connector | undefined
) {
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()
  const utils = trpc.useUtils()

  const siwe = trpc.auth.verify.useMutation({
    onSuccess: () => {
      utils.session.invalidate()
    },
  })

  const getNonce = trpc.auth.getNonce.useQuery(undefined, {
    enabled: false, // Don't fetch automatically
    staleTime: 0, // Always get a fresh nonce
    gcTime: 0, // Don't cache nonces
  })

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      // Reset all query cache
      utils.invalidate()
      disconnect()
    },
  })

  const handleVerify = async (address: string, chainId: number) => {
    try {
      // Get nonce
      const nonceResult = await getNonce.refetch();
      
      // Create and sign SIWE message
      const siweMessage = createSiweMessage(address, nonceResult?.data?.nonce, chainId);
      console.log({
        message: siweMessage.prepareMessage(),
      })

      const message = siweMessage.prepareMessage()
      const signature = await signMessageAsync({
        message
      })

      // Verify signature
      await siwe.mutateAsync({
        message,
        signature
      })
    } catch (error) {
      console.error('SIWE failed:', error)
      throw error
    }
  }

  const handleDisconnect = useCallback(() => {
    logout.mutate()
  }, [logout])

  useEffect(() => {
    if (!walletConnector) return

    walletConnector.onAccountsChanged = (accounts: string[]) => {
      console.debug('Accounts changed:', accounts)
      handleDisconnect()
    }

    walletConnector.onChainChanged = (chainId: string) => {
      console.debug('Chain changed:', chainId)
      handleDisconnect()
    }

    walletConnector.onDisconnect = (error?: Error) => {
      console.debug('Disconnect:', error)
      handleDisconnect()
    }

    walletConnector.onConnect = (connectInfo: ProviderConnectInfo) => {
      console.debug('Connected:', connectInfo)
      utils.session.invalidate()
    }

    return () => {
      if (walletConnector) {
        walletConnector.onAccountsChanged = () => {}
        walletConnector.onChainChanged = () => {}
        walletConnector.onDisconnect = () => {}
        walletConnector.onConnect = () => {}
      }
    }
  }, [walletConnector, handleDisconnect, utils])

  return {
    verify: handleVerify,
    isVerifying: siwe.isPending,
    verifyError: siwe.error,
    logout,
    isLoggingOut: logout.isPending
  }
}