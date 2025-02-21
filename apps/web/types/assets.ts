export enum AssetType {
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
  NATIVE = "NATIVE"
}

export interface Asset {
  id: string;
  type: AssetType;
  symbol: string;
  name: string;
  balance: string;
  balanceUsd?: string;
  imageUrl: string;
  networkImageUrl?: string;
  contractAddress?: string;
  tokenId?: string;
}

// Sample tokens data
export const tokens: Asset[] = [
  { 
    id: "eth-1", 
    type: AssetType.NATIVE,
    symbol: "ETH", 
    name: "Ether",
    balance: "0.033",
    balanceUsd: "90.62",
    imageUrl: "https://static.cx.metamask.io/api/v1/tokenIcons/1/0x0000000000000000000000000000000000000000.png",
    networkImageUrl: "https://static.cx.metamask.io/api/v1/tokenIcons/10/0x0000000000000000000000000000000000000000.png"
  },
  {
    id: "usdc-1",
    type: AssetType.ERC20,
    symbol: "USDC",
    name: "USD Coin",
    balance: "1,000.00",
    balanceUsd: "1,000.00",
    imageUrl: "https://static.cx.metamask.io/api/v1/tokenIcons/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
  }
];

// Sample NFTs data
export const nfts: Asset[] = [
  {
    id: "bayc-1234",
    type: AssetType.ERC721,
    symbol: "BAYC",
    name: "Bored Ape #1234",
    balance: "1",
    imageUrl: "/api/placeholder/200/200",
    contractAddress: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    tokenId: "1234"
  },
  {
    id: "doodle-5678",
    type: AssetType.ERC1155,
    symbol: "DOODLE",
    name: "Doodle #5678",
    balance: "3",
    imageUrl: "/api/placeholder/200/200",
    contractAddress: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
    tokenId: "5678"
  }
];