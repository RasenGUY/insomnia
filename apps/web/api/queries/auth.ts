import { FetchQueryOptions, useMutation } from '@tanstack/react-query'
import { useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'

import { config } from 'config/configClient'
import type { 
  VerifyResponse, 
  RegistrationResponse, 
  NonceResponse, 
  SessionResponseData 
} from 'types/auth'

const API_URL = config.api.rest.url.concat('/auth')

export const VERIFY_SIWE_QUERY_KEY = ['verify']
export const FETCH_NONCE_KEY = ['fetchNonce']
export const REGISTER_USER_KEY = ['registerUser']

export const fetchNonce: FetchQueryOptions<string, Error> = {
  queryKey: FETCH_NONCE_KEY,
  queryFn: async (): Promise<string> => {
    const res = await fetch(API_URL.concat('/nonce'), {
      method: 'GET',
      credentials: 'include',
    })
    const data: NonceResponse = await res.json()
    if (!data.success) throw new Error('Failed to get nonce')
    return data.data.nonce
  },
}

export const verifySiwe: FetchQueryOptions<VerifyResponse['data'], Error> = {
  queryKey: VERIFY_SIWE_QUERY_KEY,
  queryFn: async (params: { message: string; signature: string }): Promise<VerifyResponse['data']> => {
    const res = await fetch(API_URL.concat('/verify'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(params)
    })
    const data: VerifyResponse = await res.json()
    if (!data.success) throw new Error('Verification failed')
    return data.data as SessionResponseData
  },
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



export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser
  })
}