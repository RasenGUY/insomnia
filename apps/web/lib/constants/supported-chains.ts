import { polygon, bsc, mainnet, Chain } from "viem/chains";

export enum WalletLabel {
  POLYGON = 0,
  ETHEREUM = 1,
  BSC = 2,
}

export const SUPPORTED_CHAINS: Record<WalletLabel, Chain> = {
  [WalletLabel.POLYGON]: polygon,
  [WalletLabel.BSC]: bsc,
  [WalletLabel.ETHEREUM]: mainnet
};

export function getSupportedChainByWalletLabel(walletLabel: WalletLabel): Chain {
  return SUPPORTED_CHAINS[walletLabel];
}