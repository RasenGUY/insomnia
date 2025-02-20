'use client'
import React from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation';
import PortfolioView from '@/components/features/dashboard'


export default function AppPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount()
    
  return (
    <section className="w-full flex justify-center items-center min-h-screen">
      <PortfolioView />
    </section>
  )
}