import { useMutation } from '@tanstack/react-query'
import { useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'

import type { VerifyResponse, RegistrationResponse, NonceResponse, SessionResponseData } from 'types/auth'


const fetchNonce = async (): Promise<string> => {
  const res = await fetch('/api/auth/nonce')
  const data: NonceResponse = await res.json()
  if (!data.success) throw new Error('Failed to get nonce')
  return data.data.nonce
}

const verifySiwe = async (params: { message: string; signature: string }): Promise<VerifyResponse['data']> => {
  const res = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  const data: VerifyResponse = await res.json()
  if (!data.success) throw new Error('Verification failed')
  return data.data as SessionResponseData
}

const registerUser = async (params: { address: string; username: string }): Promise<RegistrationResponse['data']> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  const data: RegistrationResponse = await res.json()
  if (!data.success) throw new Error('Registration failed')
  return data.data
}

export const useNonce = () => {
  return useMutation({
    mutationFn: fetchNonce
  })
}

export const useVerify = () => {
  const { signMessageAsync } = useSignMessage()
  
  return useMutation({
    mutationFn: async ({ address, chainId }: { address: string; chainId: number }) => {
      // 1. Get nonce
      const nonce = await fetchNonce()

      // 2. Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with you wallet.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce
      })

      // 3. Sign message
      const signature = await signMessageAsync({
        message: message.prepareMessage()
      })

      // 4. Verify signature
      return verifySiwe({
        message: message.prepareMessage(),
        signature
      })
    }
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser
  })
}