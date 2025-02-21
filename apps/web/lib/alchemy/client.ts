// app/services/alchemy.service.ts
import { 
  AlchemyErc20TokenBalance, 
  AlchemyTokenMetadata,
  AlchemyErc20TokenBalanceResult
} from './types';
import { config } from '@/config/configClient';

export class AlchemyClient {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = config.ethereum.providerUrl;
  }

  /**
   * Fetches token balances for a given address
   * @param address Wallet address
   * @returns Promise with token balances
   */
  async getTokenBalances(address: string): Promise<AlchemyErc20TokenBalance[]> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getTokenBalances',
          params: [address]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const result = data.result as AlchemyErc20TokenBalanceResult;
      return result.tokenBalances || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch token balances: ${error.message}`);
    }
  }

  /**
   * Fetches token balances for a given address
   * @param address Wallet address
   * @returns Promise with token balances
   */
  async getEthBalance(address: string): Promise<bigint> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: [
            address,
            'latest'
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return BigInt(data.result as string);;
    } catch (error: any) {
      throw new Error(`Failed to fetch token balances: ${error.message}`);
    }
  }

  /**
   * Fetches token metadata for a given contract address
   * @param contractAddress Token contract address
   * @returns Promise with token metadata
   */
  async getTokenMetadata(contractAddress: string): Promise<AlchemyTokenMetadata> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getTokenMetadata',
          params: [contractAddress]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result as AlchemyTokenMetadata;
    } catch (error: any) {
      throw new Error(`Failed to fetch token metadata: ${error.message}`);
    }
  }
}