import { ApiSuccessResponseBase } from "@/lib/fetch/types";

export interface AlchemyErc20TokenBalance {
  contractAddress: string;
  tokenBalance: string;
}

export interface AlchemyErc20TokenBalanceResult {
  address: string;
  tokenBalances: AlchemyErc20TokenBalance[]; 
}

export interface AlchemyTokenMetadata {
  decimals: number,
  logo: string | null,
  name: string,
  symbol: string
}

export interface AlchemyTokenPrice {
  currency: string,
  value: string,
  lastUpdatedAt: string
}

export interface AlchemyTokenPriceData {
  network?: number,
  address?: string,
  symbol?: string,
  prices: AlchemyTokenPrice[]
}

export interface AlchemyTokenPriceHistory {
  symbol: string,
  currency: string,
  data: {
    value: number,
    timestamp: string
  }
}

export interface GetTokenBalancesResponse extends ApiSuccessResponseBase<AlchemyErc20TokenBalance[]> {} 
export interface GetTokenMetadataRessponse extends ApiSuccessResponseBase<AlchemyTokenMetadata> {}  
export interface GetTokenPriceResponse extends ApiSuccessResponseBase<AlchemyTokenPriceData[]> {} 
