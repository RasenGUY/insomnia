'use client'
import { RegisterModal } from '@/components/features/auth/RegisterModal'

export default function Page() {
  // if the user has no account then we show the register modal
  // if the user has an account then we redirect to the home page (dashboard)
  return <RegisterModal isOpen={true} handleRegister={async () => {}} isRegistering={false} error={''} />
}
