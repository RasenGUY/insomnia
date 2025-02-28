import { SUPPORTED_EXPLORERS, WalletLabel } from "@/lib/constants/supported-chains";

export function createExplorerTxHashUrl(walletLabel: WalletLabel, txHash: string): string { 
  const baseUrl = SUPPORTED_EXPLORERS[walletLabel]; 
  return `${baseUrl}/tx/${txHash}`;
}