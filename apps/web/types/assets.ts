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

export interface NFTAttribute {
  traitType: string;
  value: string | number;
  displayType?: string;
}

export interface NFTMetadata {
  name: string ;
  description: string;
  image: string;
  externalUrl: string | null;
  attributes: NFTAttribute[];
  symbol: string | null;
} 

export interface NFTImage {
  cachedUrl: string | null;
  pngUrl: string | null;
  thumbnailUrl: string | null;
  contentType: string | null;
  size: number | null;
  originalUrl: string | null;
}

export interface TokenAsset {
  type: AssetType.ERC20 | AssetType.NATIVE;
  contractAddress: string;
  chainId: number;
  balance: string;
  price?: string;
  meta?: TokenMetadata;
}

export interface NFTAsset {
  type: AssetType.ERC721 | AssetType.ERC1155;
  address: string;
  chainId: number;
  balance: string;
  floorPrice?: string;
  tokenId?: string;
  meta?: NFTMetadata;
  image: NFTImage;
  aquiredAt?: {
    blockNumber: number;
    blockTimestamp: string;
  }
  collection?: {
    name: string; 
    slug: string;
    externalUrl: string;
    bannerImageUrl: string;
  }
}

export const tokens: TokenAsset[] = [
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
    chainId: getSupportedChainByWalletLabel(WalletLabel.POLYGON).id,
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

export const nfts: NFTAsset[] = [
  {
        type: AssetType.ERC721,
        address: "0x0e7f79e89ba8c4a13431129fb2db0d4f444b5b9a",
        chainId: getSupportedChainByWalletLabel(WalletLabel.POLYGON).id,
        balance: "1",
        tokenId: "1234",
        image: {
            cachedUrl: "",
            thumbnailUrl: "",
            pngUrl: "",
            contentType: "",
            size: 0,
            originalUrl: "",
        },
        meta: {
            name: "BAYC",
            description: "",
            image: "",
            externalUrl: "",
            attributes: [],
            symbol: "BAYC",
        },
        floorPrice: "0.001",
        aquiredAt: {
            blockNumber: 0,
            blockTimestamp: "",
        }
    },
    {
      type: AssetType.ERC1155,
      chainId: getSupportedChainByWalletLabel(WalletLabel.POLYGON).id,
      address: "0x0000000000000000000000000000000000000000",
      balance: "3",
      tokenId: "5678",
      image: {
        cachedUrl: "",
        thumbnailUrl: "",
        pngUrl: "",
        contentType: "",
        size: 0,
        originalUrl: "",
      },
      meta: {
          name: "DOODLE",
          description: "",
          image: "",
          externalUrl: "",
          attributes: [],
          symbol: "BAYC",
      },
      floorPrice: "0.001",
      aquiredAt: {
          blockNumber: 0,
          blockTimestamp: "",
      }
    }
];


// https://polygon-mainnet.g.alchemy.com/nft/v3/klVWXL5JvdvsukcrZwvFAEnHKOAGPwJj/getNFTsForOwner?owner=0x0454aC70f0D87441923dE185BCEDe7691B222fF6&withMetadata=true&orderBy=transferTime&pageSize=5&pageKey=3459903a-2a7f-439c-898a-6122d12d6a98