'use client'
import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation';

export default function AppPage() {
  const router = useRouter();
  const { isConnected } = useAccount()
  
  useEffect(() => {
    if(isConnected)  router.push('/auth/register')
  }, [isConnected, router])

  return (
    <section className="w-full flex justify-center items-center min-h-screen">
      <h1>Welcome to my home page, dashboard</h1>
    </section>
  )
}