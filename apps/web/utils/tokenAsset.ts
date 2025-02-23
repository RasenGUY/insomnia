import { from, Observable, of, forkJoin } from 'rxjs';
import { map, mergeMap, filter, toArray, catchError, switchMap } from 'rxjs/operators';
import {  AlchemyErc20TokenBalance, AlchemyTokenPriceData } from '@/lib/alchemy/types';
import { AlchemyClient } from '@/lib/alchemy/client';
import { Asset, AssetType } from '@/types/assets';
import { WalletLabel } from '../types/wallet';
import { getNativeToken } from '@/lib/constants/native-tokens';
import { getSupportedChainByWalletLabel, getSupportedNetworkByWalletLabel } from '@/lib/constants/supported-chains';
import { parseUnits } from 'viem';
import { groupBy, flatten } from 'lodash';

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
      mergeMap(assets => this.enrichWithPrices(assets, walletLabel)),
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

  private enrichWithPrices(assets: Asset[], walletLabel: WalletLabel): Observable<Asset[]> {
    if (assets.length === 0) {
      return of([]);
    }

    const { nativeTokens, erc20Tokens } = groupBy(assets, asset => 
      asset.type === AssetType.NATIVE ? 'nativeTokens' : 'erc20Tokens'
    );

    const priceRequests: Observable<AlchemyTokenPriceData[]>[] = [];

    if (nativeTokens && nativeTokens?.length > 0) {
      const nativeSymbols = nativeTokens.map(token => token.meta?.symbol).filter(Boolean) as string[];
      if (nativeSymbols.length > 0) {
        priceRequests.push(from(this.alchemyClient.getTokenPriceBySymbol(nativeSymbols)));
      }
    }

    if (erc20Tokens && erc20Tokens.length > 0) {
      const network = getSupportedNetworkByWalletLabel(walletLabel);
      const tokenAddresses = erc20Tokens.map(token => ({
        address: token.contractAddress,
        network
      }));
      
      if (tokenAddresses.length > 0) {
        priceRequests.push(from(this.alchemyClient.getTokenPriceByAddress(tokenAddresses)));
      }
    }

    if (priceRequests.length === 0) {
      return of(assets);
    }

    return forkJoin(priceRequests).pipe(
      map((priceResults: (AlchemyTokenPriceData[])[]) => {
        const priceMap = new Map<string, string>();
        
        flatten(priceResults).forEach(priceData => {
          if(priceData.symbol) {
            priceMap.set(priceData.symbol, priceData.prices[0]?.value ?? '0');
          } else {
            priceMap.set(priceData?.address?.toLowerCase() as string, priceData.prices[0]?.value ?? '0');
          }
        });
        return assets.map(asset => {
          const lookupKey = asset.type === AssetType.NATIVE 
            ? asset.meta?.symbol?.toUpperCase()
            : asset.contractAddress.toLowerCase();
          
          return {
            ...asset,
            price: lookupKey ? priceMap.get(lookupKey) : undefined
          };
        });
      }),
      catchError(error => {
        console.error('Error enriching with prices:', error);
        return of(assets); 
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

  private hasNonZeroBalance(formattedAsset: Asset): boolean {
    const balanceBigInt = parseUnits(formattedAsset.balance, formattedAsset.meta?.decimals as number);
    const threshold = parseUnits('0.001', formattedAsset.meta?.decimals as number);
    return balanceBigInt > threshold;
  }
    
  private hasNonEmptyLogos(asset: Asset): boolean {
    return !!asset.meta?.logo;
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
