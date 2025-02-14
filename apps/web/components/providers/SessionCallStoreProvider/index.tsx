'use client'

import React, { useEffect, useRef } from 'react'
import { getConnections } from 'wagmi/actions'
import { createQueryClientCallStore } from './sessionCallProviderStore'
import { SessionCallContext, defaultState } from './context'
import { web3Config } from '../Web3Provider'
import { useAccount } from 'wagmi'
import { createStore } from 'zustand/vanilla'

interface SessionCallProviderProps {
  children: React.ReactNode
}

export function SessionCallStoreProvider({ children }: Readonly<SessionCallProviderProps>) {
  const storeRef = useRef<ReturnType<typeof createQueryClientCallStore> | null>(null)
  const { isConnected } = useAccount()

  useEffect(() => {
    if (isConnected) {
      const connections = getConnections(web3Config)
      if (connections.length > 0 && !storeRef.current) {
        const connection = connections[0]
        if (connection) {
          storeRef.current = createQueryClientCallStore(connection)
        }
      }
      if (storeRef.current) {
        storeRef.current.getState().hydrateCallStore()
        storeRef.current.getState().configureWalletConnectionHooks()
      } else {
        console.error('No connections found, but isConnected is true')
      }
    }
    return () => {
      if (storeRef.current) {
        storeRef.current.getState().clearSession()
        // storeRef.current = null
      }
    }
  }, [isConnected]) // Only depends on isConnected

  const contextValue = storeRef.current ?? createStore(() => defaultState);

  return (
    <SessionCallContext.Provider value={contextValue}>
      {children}
    </SessionCallContext.Provider>
  )
}
