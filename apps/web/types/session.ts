import { Address } from "viem";
import { Connection } from "wagmi"


export const SESSION_STORAGE_KEY = "session-storage";
export const SESSION_QUERY_KEY = ['session'];


export type SessionState = {
  address: Address;
  chainId: number;
  domain: string;
  issuedAt: Date;
  expirationTime: Date;
  isValid: boolean;
};

export type Session = {
  address: Address;
  chainId: number;
  domain: string;
  issuedAt: Date;
  expirationTime: Date;
  isValid: boolean;
};

export const CallStoreStates = {
  Empty: 'empty',
  Hydrated: 'hydrated',
} as const;

export type CallStoreState = typeof CallStoreStates[keyof typeof CallStoreStates];

export interface SessionQueryClientCallProviderState {
  walletConnection: Connection | null
  callStoreState: CallStoreState
  sessionState: SessionState | null
  hydrateCallStore: () => Promise<void>
  clearSession: () => void
  configureWalletConnectionHooks: () => void
}

export type GetSessionResponseData = {
  address: Address;
  chainId: number;
  domain: string;
  issuedAt: string;
  expirationTime: string;
  resources: string[];
};
