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