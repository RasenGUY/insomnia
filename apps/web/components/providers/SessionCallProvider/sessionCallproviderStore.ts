'strict true'
import { QueryClient } from "@tanstack/react-query";
import { createStore } from "zustand/vanilla";
import { CallState, CallStates, SESSION_QUERY_KEY, SessionQueryClientCallProviderState, SessionState } from "@/types/session";
import { Address, getAddress, ProviderConnectInfo, ProviderMessage } from "viem";
import { Connection } from "wagmi";
import { combine } from "zustand/middleware";
import { validateSession } from "utils/auth";
import { parseSessionState } from "utils/session";
import { produce } from "immer";   
import { config } from "config/configClient";
 

export const createQueryClientCallStore = (
    walletConnection: Connection,
  ) => {
  const sessionQueryClient = new QueryClient()
  // 1. create the session store with zustand
  const newSessionStore = createStore(
    combine(
      {
          sessionClient: sessionQueryClient,
          walletConnection: walletConnection, 
          callState: CallStates.Empty as CallState,
          sessionState: null as SessionQueryClientCallProviderState['sessionState'],
      } as SessionQueryClientCallProviderState,
      (set, get) => ({
              
              sessionClient: sessionQueryClient,
              walletConnection: walletConnection, 
              callState: CallStates.Empty as CallState,
              sessionState: null as SessionQueryClientCallProviderState['sessionState'],
              isValid: null as SessionQueryClientCallProviderState['isValid'],

              storeSession: async () => {
                const sessionData = await get().sessionClient.fetchQuery({
                  queryKey: SESSION_QUERY_KEY,
                  queryFn: async () => {
                    try {
                      const response = await fetch(config.api.rest.url.concat('/auth/session'), {
                        method: 'GET',
                        credentials: 'include',
                      });
                      console.log({ dataFromServer: await response.json() });
                      const { data: session } = await response.json();
                      const connector = get().walletConnection.connector;
                      const connectedAccounts = await connector.getAccounts(); 
                      const parsedSession = parseSessionState(session);
                      const connectedAccount = connectedAccounts[0];
                      const chainId = (await connector.getChainId());
                    
                      set(produce((state) => ({
                            ...state,
                            callState: CallStates.Hydrated, 
                            sessionState: parsedSession,
                            isValid: validateSession(session, {
                              address: getAddress(connectedAccount as string),
                              chainId: chainId
                            })
                          })
                        )
                      );
                    } catch (error) {
                    console.debug('Failed to load session:', error);
                    set(produce((state) => ({ sessionState: null, callState: CallStates.Empty, isValid: false })));
                  }
                },
              });
              
            },
            clearSession: () => set(produce((state) => ({
              callState: CallStates.Empty, 
              sessionState: null, 
              isValid: false,
              walletConnection: undefined,
              sessionClient: undefined
            }))),
            validateSession: async (session: SessionState) => {
              if(!session) {
                console.debug('Session is empty')
                return null 
              };
              const connector = get().walletConnection.connector;
              const currentAccount = (await connector.getAccounts())[0];
              const currentChainId = (await connector.getChainId());
              const isValid = validateSession(session, {
                address: getAddress(currentAccount as string),
                chainId: currentChainId
              });
              return isValid;
            },
            setupConnectionHooks: () => {
                // 3. Set up event listeners for account and chain changes
                const connection = walletConnection; 
  
                // These are the functions that Wagmi will call
                connection.connector.onAccountsChanged = (accounts: Address[]) => {
                  console.debug('Accounts changed:', accounts);
                  set({ 
                    sessionState: null,
                    isValid: false,
                  });
                  if (accounts.length === 0) {
                    newSessionStore.getState().clearSession();
                  } else {
                    
                  }
                };

                connection.connector.onChainChanged = (chainId: string) => {
                  console.debug('Chain changed:', chainId);
                  newSessionStore.getState().getServerSession();
                };

                connection.connector.onDisconnect = (error?: Error) => {
                  console.debug('Wallet disconnected:', error?.message);
                  newSessionStore.getState().clearSession();
                };

                connection.connector.onConnect = (connectInfo: ProviderConnectInfo) => {
                  console.debug('Wallet connected:', connectInfo);

                  newSessionStore.getState().getServerSession();
                };

                connection.connector.onMessage = (message: ProviderMessage) => {
                  console.debug('Wallet message:', message);
                  if (message.type === 'connecting') {
                    // Handle connecting state
                  }
                };
            } 
        }
      )
    )    
  );

  // 2. Define a function to synchronize the session with the wallet
  const syncSessionWithWallet = async () => {
    try {
      const session = await newSessionStore.getState().getServerSession();
      if (session) {
        const isValid = await newSessionStore.getState().validateSession(session);
        newSessionStore.setState({
          callState: CallStates.Hydrated,
          sessionState: session,
          isValid
        });
        // console.log('Session synced with wallet');
      } else {
        newSessionStore.getState().clearSession();
      }
    } catch (error) {
      console.debug('Failed to load session:', error);
      newSessionStore.getState().clearSession();
    }
  };
  

  
  return newSessionStore;
}


