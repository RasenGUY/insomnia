'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { RegisterModal } from '@/components/features/auth/RegisterModal'
import { trpc } from '@/server/client'
import { LoadingScreen } from '@/components/features/common/LoadingScreen'

export default function RegisterPage() {
  const router = useRouter()
  const { address } = useAccount()

  const { data: profile, isLoading: isCheckingProfile } = trpc.resolver.reverse.useQuery(
    { address: address as string },
    {
      enabled: !!address,
      retry: false,
    }
  )

  const register = trpc.auth.register.useMutation({
    onSuccess: () => {
      router.push('/')
    }
  })

  useEffect(() => {
    if (profile) {
      router.push('/')
    }
  }, [profile, router])

  const handleRegister = async (username: string) => {
    if (address) {
      await register.mutateAsync({
        username,
        address,
      })
    }
  }

  if (isCheckingProfile) {
    return <LoadingScreen fullScreen/>
  }

  return (
    <RegisterModal
      isOpen={!profile}
      handleRegister={handleRegister}
      isRegistering={register.isPending}
      error={register.error?.message}
    />
  )
}