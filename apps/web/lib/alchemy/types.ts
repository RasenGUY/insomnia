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

export interface AlchemyNFTTokenMetadata {
  name: string | null;
  description: string | null;
  image: string | null;
  external_url?: string;
  attributes?: Array<{
    display_type?: string;
    value: string | number;
    trait_type: string;
  }>;
}

export interface AlchemyNFTImageData {
  cachedUrl: string | null;
  thumbnailUrl: string | null;
  pngUrl: string | null;
  contentType: string | null;
  size: number | null;
  originalUrl: string | null;
}

export interface AlchemyNFTOpenSeaMetadata {
  floorPrice: number | null;
  collectionName: string | null;
  collectionSlug: string | null;
  safelistRequestStatus: string | null;
  imageUrl: string | null;
  description: string | null;
  externalUrl: string | null;
  twitterUsername: string | null;
  discordUrl: string | null;
  bannerImageUrl: string | null;
  lastIngestedAt: string;
}

export interface AlchemyNFTContractInfo {
  address: string;
  name: string;
  symbol: string | null;
  totalSupply: string | null;
  tokenType: 'ERC721' | 'ERC1155';
  contractDeployer: string;
  deployedBlockNumber: number;
  openSeaMetadata: AlchemyNFTOpenSeaMetadata;
  isSpam: boolean;
  spamClassifications: string[];
}

export interface AlchemyNFTCollectionInfo {
  name: string | null;
  slug: string | null;
  externalUrl: string | null;
  bannerImageUrl: string | null;
}

export interface AlchemyNFTMintInfo {
  mintAddress: string | null;
  blockNumber: number | null;
  timestamp: string | null;
  transactionHash: string | null;
}

export interface AlchemyOwnedNFT {
  contract: AlchemyNFTContractInfo;
  tokenId: string;
  tokenType: 'ERC721' | 'ERC1155';
  name: string | null;
  description: string | null;
  tokenUri: string | null;
  image: AlchemyNFTImageData;
  raw: {
    tokenUri: string | null;
    metadata: AlchemyNFTTokenMetadata;
    error: string | null;
  };
  collection: AlchemyNFTCollectionInfo | null;
  mint: AlchemyNFTMintInfo;
  owners: any | null;
  timeLastUpdated: string;
  balance: string;
  acquiredAt: {
    blockTimestamp: string | null;
    blockNumber: number | null;
  };
}

export interface ValidAt {
  blockNumber: number;
  blockHash: string;
  blockTimestamp: string;
}

export interface GetNFTsForOwnerResponseData {
  ownedNfts: AlchemyOwnedNFT[];
  totalCount: number;
  validAt: ValidAt;
  pageKey?: string;
}

export interface GetTokenBalancesResponse extends ApiSuccessResponseBase<AlchemyErc20TokenBalance[]> {} 
export interface GetTokenMetadataRessponse extends ApiSuccessResponseBase<AlchemyTokenMetadata> {}  
export interface GetTokenPriceResponse extends ApiSuccessResponseBase<AlchemyTokenPriceData[]> {} 

