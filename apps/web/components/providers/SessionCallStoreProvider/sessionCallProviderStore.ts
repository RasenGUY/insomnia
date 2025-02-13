'strict true'
import { QueryClient } from "@tanstack/react-query";
import { createStore } from "zustand/vanilla";
import { CallStoreState, CallStoreStates, SessionQueryClientCallProviderState } from "@/types/session";
import { Address, ProviderConnectInfo, ProviderMessage } from "viem";
import { Connection } from "wagmi";
import { combine, persist } from "zustand/middleware";
import { validateSession } from "utils/auth";
import { parseSessionState } from "utils/session";
import { immer } from "zustand/middleware/immer";
import { getSessionQuery } from "api/queries/session";
 

export const createQueryClientCallStore = (walletConnection: Connection) => {
  if (typeof window !== 'undefined') {
    const sessionQueryClient = new QueryClient()
    const newSessionStore = createStore(
      combine({ 
          sessionClient: sessionQueryClient,
          walletConnection: walletConnection, 
          callStoreState: CallStoreStates.Empty as CallStoreState,
          sessionState: null as SessionQueryClientCallProviderState['sessionState']
        } as SessionQueryClientCallProviderState,
        immer(
          persist(
            (set, get) => ({        
              sessionClient: sessionQueryClient,
              walletConnection: walletConnection, 
              callStoreState: CallStoreStates.Empty as CallStoreState,
              sessionState: null as SessionQueryClientCallProviderState['sessionState'],
              hydrateCallStore: async () => {
                try {
                  const sessionData = await get().sessionClient.fetchQuery(getSessionQuery);
                  console.log(sessionData);
                  const session = parseSessionState(sessionData);
                  const isValid = session ? validateSession(session, {
                    address: get().walletConnection.accounts[0] as Address,
                    chainId: get().walletConnection.chainId
                  }) : false
                  set({ 
                    callStoreState: CallStoreStates.Hydrated,
                    sessionState: session ? { ...session, isValid } : null,
                  });
                } catch (error) {
                  console.debug({
                    message: 'Failed to load session',
                    error
                  });
                  set({ 
                    callStoreState: CallStoreStates.Empty,
                    sessionState: null,
                  });
                }
              },
              clearSession: () => set({
                callStoreState: CallStoreStates.Empty, 
                sessionState: null, 
                walletConnection: undefined,
                sessionClient: undefined
              }),
              configureWalletConnectionHooks: () => {
                const connection = walletConnection; 
    
                connection.connector.onAccountsChanged = (accounts: Address[]) => {
                  console.debug({
                    message: 'Hydrating Session Accounts changed',
                    accounts
                  });
                  newSessionStore.getState().hydrateCallStore()
                };
    
                connection.connector.onChainChanged = (chainId: string) => {
                  console.debug({
                    message: 'Hydrating Session on Chain Changed',
                    chainId
                  });
                  newSessionStore.getState().hydrateCallStore();
                };
    
                connection.connector.onDisconnect = (error?: Error) => {
                  console.debug({
                    message: 'Hydrating Session on error',
                    error
                  });
                  newSessionStore.getState().clearSession();
                };
    
                connection.connector.onConnect = (connectInfo: ProviderConnectInfo) => {
                  console.debug({
                    message: 'Hydrating Session on Connect',
                    connectInfo
                  });
                  console.debug('Wallet connected:', connectInfo);
                  newSessionStore.getState().hydrateCallStore();
                  newSessionStore.getState().configureWalletConnectionHooks();
                };
  
                connection.connector.onMessage = (message: ProviderMessage) => {
                  console.debug({
                    message: 'Clearing Session on Disconnect',
                    providerMessage: message
                  });
                  newSessionStore.getState().clearSession();
                };
              },
            }),
            {
              name: 'sessionStore',
              partialize: (state) => ({ 
                sessionState: state.sessionState,
                callStoreState: CallStoreStates.Empty as CallStoreState,
              })
            }
          )
        )
      )    
    );
    return newSessionStore
  }
}
