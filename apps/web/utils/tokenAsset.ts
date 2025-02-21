import { from, Observable, of, forkJoin } from 'rxjs';
import { map, mergeMap, filter, toArray, catchError } from 'rxjs/operators';
import {  AlchemyErc20TokenBalance, AlchemyTokenMetadata } from '@/lib/alchemy/types';
import { AlchemyClient } from '@/lib/alchemy/client';
import { Asset, AssetType } from '@/types/assets';
import { WalletLabel } from '../types/wallet';

export class TokenAssetMapper {
  private readonly alchemyClient: AlchemyClient; 
  
  constructor() {
    this.alchemyClient = new AlchemyClient();
  }

  /**
   * Maps token balances and metadata to Asset objects
   * @param address Wallet address to fetch tokens for
   * @returns Observable of Asset array
   */
  getTokenAssets(address: string): Observable<Asset[]> {
    return this.getFilteredTokenBalances(address).pipe(
      mergeMap(tokenBalances => this.enrichWithMetadata(tokenBalances)),
      map(tokens => this.filterTokensWithImages(tokens)),
      catchError(error => {
        console.error('Error fetching token assets:', error);
        return of([]);
      })
    );
  }

  /**
   * Gets token balances and filters for non-zero balances
   * @param address Wallet address
   * @returns Observable of filtered token balances
   */
  private getFilteredTokenBalances(address: string): Observable<AlchemyErc20TokenBalance[]> {
    return from(this.alchemyService.getTokenBalances(address)).pipe(
      mergeMap(tokenBalances => from(tokenBalances)),
      filter(token => this.hasNonZeroBalance(token)),
      toArray(),
      catchError(error => {
        console.error('Error filtering token balances:', error);
        return of([]);
      })
    );
  }

  /**
   * Checks if token has balance greater than 0 (considering up to 3 decimals)
   * @param token Token balance to check
   * @returns Boolean indicating if balance is greater than 0
   */
  private hasNonZeroBalance(token: AlchemyErc20TokenBalance): boolean {
    const balanceHex = token.tokenBalance;
    // Convert hex to decimal, assuming it's a hex string that includes '0x'
    const balanceBigInt = BigInt(balanceHex);
    
    // Minimum threshold (0.001 tokens in wei format)
    // For simplicity, we're assuming a common 18 decimals for ERC20 tokens
    // In a real implementation, we would get the actual decimals from metadata
    const threshold = BigInt(1000000000000000); // 0.001 * 10^18
    
    return balanceBigInt > threshold;
  }

  /**
   * Enriches token balances with metadata
   * @param tokenBalances Filtered token balances
   * @returns Observable of partial Asset objects with metadata
   */
  private enrichWithMetadata(tokenBalances: AlchemyErc20TokenBalance[]): Observable<Partial<Asset>[]> {
    if (tokenBalances.length === 0) {
      return of([]);
    }

    const metadataRequests = tokenBalances.map(token => {
      return from(this.alchemyService.getTokenMetadata(token.contractAddress)).pipe(
        map(metadata => ({
          contractAddress: token.contractAddress,
          balance: token.tokenBalance,
          metadata
        })),
        catchError(error => {
          console.error(`Error fetching metadata for ${token.contractAddress}:`, error);
          return of(null);
        })
      );
    });

    return forkJoin(metadataRequests).pipe(
      map(results => results.filter(Boolean)),
      catchError(error => {
        console.error('Error enriching with metadata:', error);
        return of([]);
      })
    );
  }

  /**
   * Filters tokens to only include those with image URLs
   * @param tokens Partial Asset objects with metadata
   * @returns Array of partial Asset objects with images
   */
  private filterTokensWithImages(tokens: Partial<Asset>[]): Asset[] {
    return tokens
      .filter(token => token.metadata?.logo !== null && token.metadata?.logo !== undefined)
      .map(token => this.mapToAsset(token));
  }

  /**
   * Maps the enriched token data to an Asset object
   * @param token Partial Asset with metadata
   * @returns Complete Asset object
   */
  private mapToAsset(token: any): Asset {
    // Check if it's a native token (can be identified by a special address)
    const isNative = token.contractAddress === '0x0000000000000000000000000000000000000000';
    
    // Format balance from hex string (wei) to decimal string
    // For a real implementation, we would use the actual decimals from metadata
    const balanceWei = BigInt(token.balance);
    const decimals = token.metadata.decimals || 18;
    const divisor = BigInt(10) ** BigInt(decimals);
    const balanceDecimal = Number(balanceWei) / Number(divisor);
    const formattedBalance = balanceDecimal.toFixed(6);

    return {
      type: isNative ? AssetType.NATIVE : AssetType.ERC20,
      symbol: token.metadata.symbol,
      name: token.metadata.name,
      balance: formattedBalance,
      imageUrl: token.metadata.logo,
      network: WalletLabel.POLYGON,
      networkImageUrl: isNative 
        ? "https://static.cx.metamask.io/api/v1/tokenIcons/10/0x0000000000000000000000000000000000000000.png"
        : undefined,
      meta: {
        decimals: String(token.metadata.decimals),
        logo: token.metadata.logo,
        name: token.metadata.name,
        symbol: token.metadata.symbol
      }
    };
  }

  /**
   * Static method to map assets (convenience wrapper)
   * @param data Address to fetch assets for
   * @returns Promise of Asset array
   */
  static async map(address: string): Promise<Asset[]> {
    const mapper = new AlchemyAssetMapper();
    return new Promise((resolve, reject) => {
      mapper.getTokenAssets(address).subscribe({
        next: (assets) => resolve(assets),
        error: (err) => reject(err)
      });
    });
  }
}