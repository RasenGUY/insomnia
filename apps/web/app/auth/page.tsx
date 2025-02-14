'use client'
import React from 'react'
import type { Metadata } from 'next'
import { config } from '@/config/configClient'
import { useSessionValidity } from '@/hooks/session'

const metadata: Metadata = {
  title: `Auth - ${config.name}`,
  description: 'Authentication insomnia wallet',
}
interface AuthenticationPageProps {
  isConnected: boolean
}
// loads session,
  // checks if session is valid
  // if session is valid then redirect to dashboard
  // if session is not valid then redirect to register
const AuthenticationPage: React.FC<AuthenticationPageProps> = ({ isConnected }) => {
  const isvalidSession = useSessionValidity()
  console.log(isvalidSession)
  return <>Authentication Page</>
}

export default AuthenticationPage
