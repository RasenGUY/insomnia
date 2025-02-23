import { 
  AlchemyErc20TokenBalance, 
  AlchemyTokenMetadata,
  AlchemyErc20TokenBalanceResult,
  AlchemyTokenPriceData,
  GetTokenPriceResponse
} from './types';
import { config } from '@/config/configServer';

export class AlchemyTokenClient {
  private readonly tokenApiUrl: string;
  private readonly priceApiUrl: string;

  constructor() {
    this.tokenApiUrl = config.api.token.url;
    this.priceApiUrl = config.api.price.url;
  }

  async getTokenBalances(address: string): Promise<AlchemyErc20TokenBalance[]> {
    try {
      const response = await fetch(this.tokenApiUrl, {
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

  async getEthBalance(address: string): Promise<bigint> {
    try {
      const response = await fetch(this.tokenApiUrl, {
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

  async getTokenMetadata(contractAddress: string): Promise<AlchemyTokenMetadata> {
    try {
      const response = await fetch(this.tokenApiUrl, {
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

  async getTokenPriceByAddress(addresses: { address: string, network: string }[]): Promise<AlchemyTokenPriceData[]> {  
    try {
      const response = await fetch(this.priceApiUrl.concat('/tokens/by-address'), {
        method: 'POST',
        headers: {
          accept: 'application/json', 
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          addresses
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GetTokenPriceResponse = await response.json();
      return result.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch token prices: ${error.message}`);
    }
  }
  
  async getTokenPriceBySymbol(symbols: string[]): Promise<AlchemyTokenPriceData[]> {  
    try {
      const symbolsParams = symbols.map(symbol => `symbols=${symbol}`).join('&');
      const response = await fetch(this.priceApiUrl.concat(`/tokens/by-symbol?${symbolsParams}`), {
        method: 'GET',
        headers: {
          accept: 'application/json', 
          'content-type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: GetTokenPriceResponse = await response.json();
      return result.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch token prices: ${error.message}`);
    }
  }
}