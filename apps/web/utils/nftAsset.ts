import { AlchemyNFTClient } from "@/lib/alchemy/nftClient";
import { AlchemyNFTTokenMetadata, AlchemyOwnedNFT } from "@/lib/alchemy/types";
import { getSupportedChainByWalletLabel } from "@/lib/constants/supported-chains";
import { AssetType, NFTAsset, NFTAttribute } from "@/types/assets";
import { WalletLabel } from "@/types/wallet";
import { catchError, filter, from, mergeMap, Observable, of, toArray } from "rxjs";
const OPENSEA_SAFE_LIST_REQUEST_STATUS_VERIFIED = 'verified';

export class NFTAssetMapper {
  private readonly alchemyClient: AlchemyNFTClient;
  
  constructor() {
    this.alchemyClient = new AlchemyNFTClient();
  }

  getNFTAssets(
    address: string,
    walletLabel: WalletLabel,
    pageSize: number,
    pageKey?: string,
  ): Observable<NFTAsset[]> { 
    return from(this.alchemyClient.getNFTsForOwner(address, pageSize, pageKey)).pipe(
      catchError(error => {
        console.error('Error fetching nft assets:', error);
        return of({ ownedNfts: [] });
      }),
      mergeMap(data => this.filterResponseData(data.ownedNfts)),
      mergeMap(data => this.mapToNFTAssets(data, walletLabel)),
    );
  }

  filterResponseData(ownedNFTs: AlchemyOwnedNFT[]): Observable<AlchemyOwnedNFT[]> {
    return from(ownedNFTs).pipe(
      filter(asset => !this.classifiedAsSpam(asset)),
      filter(asset => this.isSafeListed(asset)), 
      toArray()
    ) 
  }

  isSafeListed(asset: AlchemyOwnedNFT): boolean {
    return asset.contract.openSeaMetadata.safelistRequestStatus === OPENSEA_SAFE_LIST_REQUEST_STATUS_VERIFIED;
  }

  classifiedAsSpam(asset: AlchemyOwnedNFT): boolean {
    if(
      asset.contract.isSpam || 
      asset.contract.spamClassifications.length > 0
    ) return true; 
    if(this.nameIsSpammy(asset.name ?? '')) return true;
    if(this.nameIsSpammy(asset.description ?? '')) return true;
    return false;
  }

  nameIsSpammy(name: string): boolean {
    if(name.length === 0) return true; 
    const spammyNames = [
      'claim',
      'airdrop',
      'giveaway',
      'prize',
      'reward',
      'bonus',
      'win',
    ];
  
    const normalizedName = name.toLowerCase();
    
    return spammyNames.some(spamWord => 
      normalizedName.includes(spamWord)
    );
  }

  mapToNFTAssets(ownedNFTs: AlchemyOwnedNFT[], walletLabel: WalletLabel): Observable<NFTAsset[]> {
    return of(ownedNFTs.map(
      nft => {
        return ({ 
          type: this.getAssetTypeFromTokenType(nft.tokenType),
          address: nft.contract.address,
          chainId: getSupportedChainByWalletLabel(walletLabel).id,
          balance: nft.balance,
          floorPrice: (nft.contract.openSeaMetadata.floorPrice ?? 0).toString(),
          tokenId: nft.tokenId,
          meta: {
            name: nft.name ?? '',
            description: nft.description ?? '',
            image: nft.image.cachedUrl ?? '',
            externalUrl: nft.contract.openSeaMetadata.externalUrl,
            attributes: this.formatNFTAttributes(nft.raw.metadata.attributes),
            symbol: nft.contract.symbol,
            collectionName: nft.contract.openSeaMetadata.collectionName,
          },
          collection: {
            name: nft.collection?.name as string,
            slug: nft.collection?.slug as string,
            externalUrl: nft.collection?.externalUrl as string,
            bannerImageUrl: nft.collection?.bannerImageUrl as string,
          },
          image: {
            cachedUrl: nft.image.cachedUrl,
            pngUrl: nft.image.pngUrl,
            thumbnailUrl: nft.image.thumbnailUrl,
            contentType: nft.image.contentType,
            size: nft.image.size,
            originalUrl: nft.image.originalUrl,
          },
          aquiredAt: {
            blockNumber: nft.acquiredAt.blockNumber as number,
            blockTimestamp: nft.acquiredAt.blockTimestamp as string,
          }
        })
      }
    ))
  }

  getAssetTypeFromTokenType(tokenType: string): NFTAsset['type'] {
    switch (tokenType) {
      case 'ERC721':
        return AssetType.ERC721;
      case 'ERC1155':
        return AssetType.ERC1155;
      default:
        throw new Error(`Invalid token type: ${tokenType}`);
    }
  }

  formatNFTAttributes(attributes: AlchemyNFTTokenMetadata['attributes']): NFTAttribute[] {
    if(!attributes) return [] as NFTAttribute[]; 
    return attributes.map(attribute => ({
      traitType: attribute.trait_type,
      value: attribute.value,
      displayType: attribute.display_type,
    }));
  }

  static async map(
    address: string, 
    walletLabel: WalletLabel,
    pageSize: number = 100,
    pageKey?: string,
  ): Promise<NFTAsset[]> {
    const mapper = new NFTAssetMapper();
    return new Promise((resolve, reject) => {
      mapper.getNFTAssets(address, walletLabel, pageSize, pageKey).subscribe({
        next: (assets) => resolve(assets),
        error: (err) => reject(err instanceof Error ? err : new Error(String(err)))
      });
    });
  }
}