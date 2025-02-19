'use client'
import React, { useEffect } from 'react'
import { ConnectWalletSection } from '@/components/features/connect/ConnectWalletSection'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation';

export default function AppPage() {
  const router = useRouter();
  const { isConnected } = useAccount()
  
  // useEffect(() => {
  //   if(isConnected) 
  //     router.push('/auth/verify')
  // }, [isConnected, router])

  return (
    <section className="w-full flex justify-center items-center min-h-screen">
      <ConnectWalletSection />
    </section>
  )
}