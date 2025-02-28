import { polygon, bsc, mainnet, Chain } from "viem/chains";

export enum WalletLabel {
  POLYGON = "POLYGON",
  ETHEREUM = "ETHEREUM",
  BSC = "BSC",
}

export const SUPPORTED_CHAINS: Record<WalletLabel, Chain> = {
  [WalletLabel.POLYGON]: polygon,
  [WalletLabel.BSC]: bsc,
  [WalletLabel.ETHEREUM]: mainnet
};

export const SUPPORTED_EXPLORERS: Record<WalletLabel, string> = {
  [WalletLabel.POLYGON]: "https://polygonscan.com", // tx/0x7d34e708c390f0ec523691d18415a7bf5c6bd43b48ab2688e218d1728f7f0923
  [WalletLabel.BSC]: "https://bscscan.com", 
  [WalletLabel.ETHEREUM]: "https://etherscan.io"
};

export const CHAINID_TO_LABEL: Record<string, WalletLabel> = { 
  [polygon.id]: WalletLabel.POLYGON,
  [bsc.id]: WalletLabel.BSC,
  [mainnet.id]: WalletLabel.ETHEREUM
};

export const SUPPORTED_NETWORKS: Record<WalletLabel, string> = {
  [WalletLabel.POLYGON]: "polygon-mainnet",
  [WalletLabel.BSC]: "bsc-mainnet",
  [WalletLabel.ETHEREUM]: "eth-mainnet"
};

export function getSupportedChainByWalletLabel(walletLabel: WalletLabel): Chain {
  return SUPPORTED_CHAINS[walletLabel];
}

export function getSupportedNetworkByWalletLabel(walletLabel: WalletLabel): string {  
  return SUPPORTED_NETWORKS[walletLabel];
}

