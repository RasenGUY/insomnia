import { from, Observable, of, forkJoin } from 'rxjs';
import { map, mergeMap, filter, toArray, catchError, switchMap } from 'rxjs/operators';
import {  AlchemyErc20TokenBalance } from '@/lib/alchemy/types';
import { AlchemyClient } from '@/lib/alchemy/client';
import { Asset, AssetType } from '@/types/assets';
import { WalletLabel } from '../types/wallet';
import { getNativeToken } from '@/lib/constants/native-tokens';
import { getSupportedChainByWalletLabel } from '@/lib/constants/supported-chains';

export class TokenAssetMapper {
  private readonly alchemyClient: AlchemyClient; 
  
  constructor() {
    this.alchemyClient = new AlchemyClient();
  }

  getTokenAssets(address: string, walletLabel: WalletLabel): Observable<Asset[]> {
    return from(this.alchemyClient.getTokenBalances(address)).pipe(
      map(tokenBalances => this.mapToTokenAssets(tokenBalances, walletLabel)),
      mergeMap(assets => this.enrichWithMetadata(assets)), 
      map(assets => this.enrichWithFormattedBalances(assets)),
      mergeMap(tokens => this.filterTokenAssets(tokens)),
      switchMap((filteredTokens: Asset[]) => {
        return this.getNativeAssets(address, walletLabel).pipe(
          map(additionalTokens => [...filteredTokens, ...additionalTokens]),
        )
      }),
      catchError(error => {
        console.error('Error fetching token assets:', error);
        return of([]);
      })
    );
  }

  getNativeAssets(address: string, walletLabel: WalletLabel): Observable<Asset[]>{
    return from(this.alchemyClient.getEthBalance(address)).pipe(
      map(balance => this.mapToNativeAssets(balance, walletLabel))
    )
  }

  private mapToNativeAssets(
    balance: bigint,
    walletLabel: WalletLabel
  ): Asset[] {
    const chain = getSupportedChainByWalletLabel(walletLabel)
    const nativeToken = getNativeToken(chain.id)
    if(!nativeToken) return []
    return this.enrichWithFormattedBalances([
      {
        type: AssetType.NATIVE,
        contractAddress: nativeToken.address,
        chainId: chain.id,
        symbol: chain.nativeCurrency.symbol,
        balance: balance.toString(),  
        meta: {
          decimals: chain.nativeCurrency.decimals,
          logo: nativeToken.logoURI,
          name: chain.nativeCurrency.name,
          symbol: chain.nativeCurrency.symbol
        }
      }
    ])
  }

  private mapToTokenAssets(tokenBalances: AlchemyErc20TokenBalance[], walletLabel: WalletLabel): Asset[] {
    return tokenBalances.map(token => ({
      type: AssetType.ERC20,
      contractAddress: token.contractAddress,
      balance: token.tokenBalance,
      chainId: getSupportedChainByWalletLabel(walletLabel).id,
      meta: undefined
    }))
  }


  private enrichWithMetadata(assets: Asset[]): Observable<Asset[]> { 
    if (assets.length === 0) {
      return of([]);
    }

    const metadataRequests = assets.map(token => {
      return from(this.alchemyClient.getTokenMetadata(token.contractAddress)).pipe(
        map(metadata => ({
          ...token,
          meta: {
            ...metadata
          }
        })),
        catchError(error => {
          console.error(`Error fetching metadata for ${token.contractAddress}:`, error);
          return of(null);
        }),
        toArray()
      );
    });

    return forkJoin(metadataRequests).pipe(
      map(results => results.flat()),
      map(results => results.filter(result => result !== null) as Asset[]),
      catchError(error => {
        console.error('Error enriching with metadata:', error);
        return of([]);
      })
    );
  }


  private filterTokenAssets(tokenAssets: Asset[]): Observable<Asset[]> {
    return from(tokenAssets).pipe(
      filter(asset => this.hasNonZeroBalance(asset)), 
      filter(asset => this.hasNonEmptyLogos(asset)),
      toArray()
    );
  }

  private hasNonZeroBalance(asset: Asset): boolean {
    const balanceBigInt = BigInt(asset.balance);
    const threshold = BigInt(1000000000000000); // 0.001 * 10^18
    return balanceBigInt > threshold;
  }
    
  private hasNonEmptyLogos(asset: Asset): boolean {
    return (asset.meta?.logo as string).length > 0;
  }

  private enrichWithFormattedBalances(assets: Asset[]): Asset[] {
    return assets.map(asset => ({
      ...asset,
      balance: this.formatBalance(asset)
    }))
  }

  private formatBalance(token: Asset): string {
    const balanceWei = BigInt(token.balance);
    const decimals = token.meta?.decimals as number;
    const divisor = BigInt(10) ** BigInt(decimals);
    const balanceDecimal = Number(balanceWei) / Number(divisor);
    const formattedBalance = balanceDecimal.toFixed(6);
    return formattedBalance
  }

  static async map(address: string, walletLabel: WalletLabel): Promise<Asset[]> {
    const mapper = new TokenAssetMapper();
    return new Promise((resolve, reject) => {
      mapper.getTokenAssets(address, walletLabel).subscribe({
        next: (assets) => resolve(assets),
        error: (err) => reject(err)
      });
    });
  }
}