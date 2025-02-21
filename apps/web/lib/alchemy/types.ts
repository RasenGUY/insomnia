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

export interface GetTokenBalancesResponse extends ApiSuccessResponseBase<AlchemyErc20TokenBalance[]> {} 
export interface GetTokenMetadataRessponse extends ApiSuccessResponseBase<AlchemyTokenMetadata> {}  