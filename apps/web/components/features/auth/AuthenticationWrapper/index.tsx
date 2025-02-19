'use client'

import React from 'react'
import { useAccount, useChainId } from 'wagmi'
import { SiweModal } from './components/SiweModal'
import { ConnectWalletSection } from '../../connect/ConnectWalletSection'
import { useSiwe } from './hooks'
import { trpc } from '@/server/client'

export const AuthenticationWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isConnected, address, connector } = useAccount()
  const chainId = useChainId()
  
  const { 
    data: session,
    isLoading: isValidatingSession
  } = trpc.session.validateSession.useQuery(
    { address: address as string, chainId },
    { 
      enabled: isConnected && !!address && !!chainId,
      refetchOnWindowFocus: true
    }
  )
  const { 
    verify, 
    isVerifying,
    verifyError,
    logout 
  } = useSiwe(connector)

  // Loading state
  if (isValidatingSession) {
    return <div>Loading...</div> // Or your loading component
  }

  // Not connected state
  if (!isConnected) {
    return <ConnectWalletSection />
  }

  // Connected but not verified state
  if (!session?.isValid) {
    return (
      <SiweModal
        isOpen={true}
        onVerify={async () => {
          if (address && chainId) {
            await verify(address, chainId)
          }
        }}
        isVerifying={isVerifying}
        error={verifyError?.message}
      />
    )
  }

  // Connected and verified state
  return <>{children}</>
}