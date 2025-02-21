import { WalletLabel } from "@/types/wallet";
import { SUPPORTED_CHAINS } from "./supported-chains";

export interface NativeToken {
  chainId: number;
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
}

export const NATIVE_TOKENS: Record<number, NativeToken> = {
  1: {
    chainId: 1,
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    logoURI: 'https://static.cx.metamask.io/api/v1/tokenIcons/1/0x0000000000000000000000000000000000000000.png',
  },
  137: {
    chainId: 137,
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
    logoURI: 'https://static.cx.metamask.io/api/v1/tokenIcons/137/0x0000000000000000000000000000000000000000.png',
  },
  56: {
    chainId: 56,
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
    logoURI: 'https://static.cx.metamask.io/api/v1/tokenIcons/56/0x0000000000000000000000000000000000000000.png',
  },
};

export function getNativeToken(chainId: number): NativeToken | undefined {
  return NATIVE_TOKENS[chainId];
}