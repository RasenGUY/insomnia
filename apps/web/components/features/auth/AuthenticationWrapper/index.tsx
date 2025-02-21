'use client'

import React from 'react'
import { useAccount, useChainId } from 'wagmi'
import { SiweModal } from './components/SiweModal'
import { ConnectWalletSection } from '../../connect/ConnectWalletSection'
import { useSiwe } from './hooks'
import {LoadingScreen} from '../../common/LoadingScreen'
import { trpc } from '@/server/client'
import { useRouter } from 'next/navigation'

export const AuthenticationWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isConnected, address, isReconnecting, isConnecting } = useAccount()
  const router = useRouter()
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

  const { data: profile, isLoading: isCheckingProfile } = trpc.resolver.reverse.useQuery(
    { address: address as string },
    {
      enabled: !!address && session?.isValid,
      refetchOnWindowFocus: true,
      retry: false,
    }
  )

  const { 
    verify, 
    isVerifying,
    verifyError
  } = useSiwe()

  if (isValidatingSession || isCheckingProfile || isReconnecting || isConnecting) {
    return <LoadingScreen fullScreen/>
  }

  if(isConnected) {
    if(!session?.isValid) {
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
    } else {
      if(!profile) router.push('/auth/register')
    }
  } else {
    if(!isConnecting) return <ConnectWalletSection />
  }
  return <>{children}</>
}