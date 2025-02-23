import { Address } from "viem";
import { ApiSuccessResponseBase } from "@/lib/fetch/types";

export type Session = {
  address: Address;
  chainId: number;
  domain: string;
  issuedAt: Date;
  isValid: boolean;
};

export type SessionResponseData = {
  address: Address;
  chainId: number;
  domain: string;
  issuedAt: string;
};

export interface SessionResponse extends ApiSuccessResponseBase<SessionResponseData> {}

