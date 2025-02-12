'use client'

import React, { useEffect, useRef } from 'react'
import { getConnections } from 'wagmi/actions'
import { createQueryClientCallStore } from './sessionCallproviderStore'
import { SessionCallContext, useSessionCall } from './context.'
import { web3Config } from '../Web3Provider'
import { useAccount } from 'wagmi'
interface SessionCallProviderProps {
  children: React.ReactNode
}

export function SessionCallProvider({
  children
}: Readonly<SessionCallProviderProps>) {
  const storeRef = useRef<ReturnType<typeof createQueryClientCallStore> | null>(null)
  const { isConnected } = useAccount()
  useEffect(() => {
    if (isConnected) {
      const connections = getConnections(web3Config)
      if(connections.length > 0 && !storeRef.current) {
        const connection = connections[0]
        if(connection)
          storeRef.current = createQueryClientCallStore(connection)
      }      
    }

    return () => {
      if (storeRef.current) {
        storeRef.current.getState().clearSession()
        storeRef.current = null
      }
    }
  },[isConnected])

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.getState().getServerSession()
    }
  }, [])

  return !storeRef.current ? <>{children} </> : (
    <SessionCallContext.Provider value={storeRef.current}>
      {children}
    </SessionCallContext.Provider>
  )
}

// Type-safe hooks for accessing specific session state
export function useSessionState() {
  return useSessionCall(state => state.sessionState)
}

export function useSessionValidity() {
  return useSessionCall(state => state.isValid)
}

export function useSessionActions() {
  return useSessionCall(state => ({
    clearSession: state.clearSession,
    validateSession: state.validateSession,
    getServerSession: state.getServerSession
  }))
}