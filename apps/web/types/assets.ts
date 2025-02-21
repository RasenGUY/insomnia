import { ApiSuccessResponseBase } from "./api";
import { WalletLabel } from "./wallet";

export enum AssetType {
  ERC20 = "erc20",
  ERC721 = "erc721",
  ERC1155 = "erc1155",
  NATIVE = "native"
}


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

// Sample tokens data
export interface Asset {
  type: AssetType;
  symbol: string;
  name: string;
  tokenId?: string;
  balance: string;
  imageUrl?: string;
  network: number;
  networkImageUrl?: string;
  meta?: {
    decimals: string;
    logo: string;
    name: string;
    symbol: string;
  }
}

export const tokens: Asset[] = [
  { 
    type: AssetType.NATIVE,
    network: WalletLabel.POLYGON,
    symbol: "ETH", 
    name: "Ether",
    balance: "0.033",
    imageUrl: "https://static.cx.metamask.io/api/v1/tokenIcons/1/0x0000000000000000000000000000000000000000.png",
    networkImageUrl: "https://static.cx.metamask.io/api/v1/tokenIcons/10/0x0000000000000000000000000000000000000000.png"
  },
  {
    type: AssetType.ERC20,
    network: WalletLabel.POLYGON,
    symbol: "USDC",
    name: "USD Coin",
    balance: "1,000.00",
    imageUrl: "https://static.cx.metamask.io/api/v1/tokenIcons/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
  }
];

// Sample NFTs data
export const nfts: Asset[] = [
  {
    network: WalletLabel.POLYGON,
    type: AssetType.ERC721,
    symbol: "BAYC",
    name: "Bored Ape #1234",
    balance: "1",
    imageUrl: "/api/placeholder/200/200",
    tokenId: "1234"
  },
  {
    type: AssetType.ERC1155,
    network: WalletLabel.POLYGON,
    symbol: "DOODLE",
    name: "Doodle #5678",
    balance: "3",
    imageUrl: "/api/placeholder/200/200",
    tokenId: "5678"
  }
];