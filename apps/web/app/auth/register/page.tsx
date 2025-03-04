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
  const utils = trpc.useUtils()
  const { data: profile, isLoading: isCheckingProfile } = trpc.resolver.reverse.useQuery(
    { address: address as string },
    {
      enabled: !!address,
    }
  )

  const register = trpc.auth.register.useMutation({
    onSuccess: () => {
      router.push('/')
      utils.resolver.reverse.invalidate({ address: address as string })
    }
  })

  useEffect(() => {
    if (profile) {
      router.push('/')
    }
  }, [profile, router, address])

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