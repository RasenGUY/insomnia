'use client'
import React from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation';
import PortfolioView from '@/components/features/dashboard'
import { trpc } from '@/server/client';
import { LoadingScreen } from '@/components/features/common/LoadingScreen';


export default function AppPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount()
  const { data: profile, isLoading: isCheckingProfile } = trpc.resolver.reverse.useQuery(
    { address: address as string },
    {
      enabled: !!address,
    }
  )
  const {data: tokenAssets, isLoading: isCheckingTokenAssets} = trpc.assets.getTokenAssets.useQuery(
    { address: address as string, walletlabel: profile?.wallets[0]?.label as number },
    {
      enabled: isConnected && !!address && !!profile?.wallets[0]?.label,
      refetchOnWindowFocus: true,
    }
  )
  
  if(isCheckingTokenAssets) { 
    return <LoadingScreen fullScreen/>
  }

  return (
    <section className="w-full flex justify-center items-center min-h-screen">
      <PortfolioView />
    </section>
  )
}