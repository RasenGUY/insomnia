'use client'
import React from 'react'
import { useAccount } from 'wagmi'
import PortfolioView from '@/components/features/dashboard'
import { trpc } from '@/server/client';
import { LoadingScreen } from '@/components/features/common/LoadingScreen';
import { WalletLabel } from '@/types/wallet';


export default function AppPage() {
  const { isConnected, address } = useAccount()
  const { data: profile } = trpc.resolver.reverse.useQuery(
    { address: address as string },
    {
      enabled: !!address,
    }
  )

  const { data: tokenAssets } = trpc.assets.getTokenAssets.useQuery(
    { address: address as string, walletlabel: profile?.wallets[0]?.label as WalletLabel },
    {
      enabled: isConnected && !!address && !!profile?.wallets[0]?.label,
      refetchOnWindowFocus: true,
    }
  )
  
  const { data: nftAssets } = trpc.assets.getNFTAssets.useQuery( 
    { 
      address: address as string, 
      walletlabel: profile?.wallets[0]?.label as WalletLabel,
      pageSize: 100
    },
    {
      enabled: isConnected && !!address && !!profile?.wallets[0]?.label,
      refetchOnWindowFocus: true,
    }
  )
  
  if(!tokenAssets || !nftAssets) { 
    return <LoadingScreen fullScreen/>
  }

  return (
    <section className="w-full flex justify-center items-center">
      <PortfolioView tokenAssets={tokenAssets} nftAssets={nftAssets} /> 
    </section>
  )
}