import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { createQueryClientCallStore } from './sessionCallproviderStore'
import { type SessionQueryClientCallProviderState } from 'types/session'


export const SessionCallContext = createContext<ReturnType<typeof createQueryClientCallStore> | null>(null)

export function useSessionCall<T>(
  selector: (state: SessionQueryClientCallProviderState) => T
): T {
  const store = useContext(SessionCallContext)
  if (!store) {
    throw new Error('Missing SessionCallProvider')
  }
  return useStore(store, selector)
}
