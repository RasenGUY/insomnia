import { useSessionCallStore } from "components/providers/SessionCallStoreProvider/context"

export function useSessionState() {
    return useSessionCallStore(state => state.sessionState)
}

export function useSessionValidity() {
  return useSessionCallStore(state => state.sessionState?.isValid)
}

export function useSessionActions() {
  return useSessionCallStore(state => ({
    clearSession: state.clearSession,
    session: state.sessionState,
    hydrate: state.hydrateCallStore,
  }))
}