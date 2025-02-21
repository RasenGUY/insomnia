import { getSupportedChainByWalletLabel, WalletLabel } from "@/lib/constants/supported-chains";

export enum AssetType {
  ERC20 = "erc20",
  ERC721 = "erc721",
  ERC1155 = "erc1155",
  NATIVE = "native"
}

export interface TokenMetadata {
  decimals: number;
  logo: string;
  name: string;
  symbol: string;
} 

export interface Asset {
  type: AssetType;
  contractAddress: string;
  tokenId?: string;
  balance: string;
  symbol?: string;
  imageUrl?: string;
  chainId: number;
  meta?: TokenMetadata
}

export const tokens: Asset[] = [
  { 
    type: AssetType.NATIVE,
    contractAddress: "0x0000000000000000000000000000000000000000",
    chainId: getSupportedChainByWalletLabel(WalletLabel.POLYGON).id,
    balance: "0.033",
    meta: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
      logo: "https://static.cx.metamask.io/api/v1/tokenIcons/1/0x0000000000000000000000000000000000000000.png"
    }
  },
  {
    type: AssetType.ERC20,
    chainId: WalletLabel.POLYGON,
    contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    balance: "1,000.00",
    meta: {
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin",
      logo: "https://static.cx.metamask.io/api/v1/tokenIcons/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
    }
  }
];

export const nfts: Asset[] = [
  {
    chainId: WalletLabel.POLYGON,
    type: AssetType.ERC721,
    contractAddress: "0x0e7f79e89ba8c4a13431129fb2db0d4f444b5b9a",
    symbol: "BAYC",
    balance: "1",
    imageUrl: "/api/placeholder/200/200",
    tokenId: "1234"
  },
  {
    type: AssetType.ERC1155,
    contractAddress: "0x0000000000000000000000000000000000000000",
    chainId: WalletLabel.POLYGON,
    symbol: "DOODLE",
    balance: "3",
    imageUrl: "/api/placeholder/200/200",
    tokenId: "5678"
  }
];