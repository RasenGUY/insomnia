import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { createQueryClientCallStore } from './sessionCallProviderStore'
import { CallStoreStates, type SessionQueryClientCallProviderState } from 'types/session'


export const defaultState: SessionQueryClientCallProviderState = {
  sessionClient: null,
  walletConnection: null,
  callStoreState: CallStoreStates.Empty,
  sessionState: null,
  hydrateCallStore: async () => {},
  clearSession: () => {},
  configureWalletConnectionHooks: () => {},
}

export const SessionCallContext = createContext<ReturnType<typeof createQueryClientCallStore> | null>(null)

export function useSessionCallStore<T>(
  selector: (state: SessionQueryClientCallProviderState) => T
): T {
  const store = useContext(SessionCallContext)
  if (!store) {
    throw new Error('Missing SessionCallProvider')
  }
  return useStore(store, selector)
}
