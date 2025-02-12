import { Address } from "viem";
import { QueryClient } from "@tanstack/react-query"
import { Connection } from "wagmi"


export const SESSION_STORAGE_KEY = "session-storage";
export const SESSION_QUERY_KEY = ['session'];


export type SessionState = {
  address: Address;
  chainId: number;
  domain: string;
  issuedAt: Date;
  expirationTime: Date;
};
export type SessionResponseData = {
  address: Address;
  chainId: number;
  domain: string;
  issuedAt: string;
  expirationTime: string;
};

export type SessionActions = {
  setSession: (session: Partial<SessionState>) => void;
  clearSession: () => void;
  checkSession: () => void;
};

export const CallStates = {
  Empty: 'empty',
  Hydrated: 'hydrated',
} as const;

export type CallState = typeof CallStates[keyof typeof CallStates];

export interface SessionQueryClientCallProviderState {
  sessionClient: QueryClient
  walletConnection: Connection
  callState: CallState
  sessionState: SessionState | null
  isValid: boolean | null
  validateSession: (session: SessionState) => Promise<void>
  clearSession: () => Promise<void>
  getSession: () => Promise<void>
  configureWalletConnectionHooks: () => void
}