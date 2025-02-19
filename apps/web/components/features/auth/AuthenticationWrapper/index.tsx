'use client'

import React from 'react'
import { useAccount, useChainId } from 'wagmi'
import { SiweModal } from './components/SiweModal'
import { ConnectWalletSection } from '../../connect/ConnectWalletSection'
import { useSiwe } from './hooks'
import { trpc } from '@/server/client'
import {LoadingScreen} from '../../common/LoadingScreen'

export const AuthenticationWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isConnected, address } = useAccount()
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
    verifyError
  } = useSiwe()

  if (isValidatingSession) {
    return <LoadingScreen />
  }

  if (!isConnected) {
    return <ConnectWalletSection />
  }

  if (isConnected && !session?.isValid) {
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

  return <>{children}</>
}