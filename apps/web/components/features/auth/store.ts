import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'

// Types for our session state
interface SessionState {
  address: string | null
  chainId: number | null
  domain: string | null
  issuedAt: string | null
  expirationTime: string | null
  resources: string[] | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Types for our session actions
interface SessionActions {
  setSession: (session: Partial<SessionState>) => void
  clearSession: () => void
  loadSession: () => Promise<void>
}

// Initial state
const initialState: SessionState = {
  address: null,
  chainId: null,
  domain: null,
  issuedAt: null,
  expirationTime: null,
  resources: null,
  isAuthenticated: false,
  isLoading: true,
}

// Create the store
export const useSessionStore = create<SessionState & SessionActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setSession: (session) => 
          set((state) => ({ 
            ...state, 
            ...session,
            isAuthenticated: true,
            isLoading: false
          })),

        clearSession: () => 
          set(() => ({ 
            ...initialState, 
            isLoading: false 
          })),

        loadSession: async () => {
          try {
            const response = await fetch('/api/auth/session')
            if (!response.ok) {
              throw new Error('Failed to load session')
            }
            
            const data = await response.json()
            if (data.success && data.data) {
              set((state) => ({
                ...state,
                ...data.data,
                isAuthenticated: true,
                isLoading: false
              }))
            } else {
              set((state) => ({ 
                ...initialState,
                isLoading: false
              }))
            }
          } catch (error) {
            console.error('Failed to load session:', error)
            set((state) => ({ 
              ...initialState,
              isLoading: false 
            }))
          }
        },
      }),
      {
        name: 'session-storage',
        partialize: (state) => ({
          address: state.address,
          chainId: state.chainId,
          domain: state.domain,
          issuedAt: state.issuedAt,
          expirationTime: state.expirationTime,
          resources: state.resources,
        }),
      }
    )
  )
)
