import { GetNFTsForOwnerResponseData } from './types';
import { config } from '@/config/configServer';

export class AlchemyNFTClient {
  private readonly nftApiUrl: string;

  constructor() {
    this.nftApiUrl = config.api.nft.url;
  }

  async getNFTsForOwner(
    owner: string, 
    pageSize: number = 100, 
    pageKey?: string,
  ): Promise<GetNFTsForOwnerResponseData> { 
    let urlConcat = `/getNFTsForOwner?owner=${owner}&orderBy=transferTime&withMetadata=true&pageSize=${pageSize}${pageKey ? `&pageKey=${pageKey}` : ''}` 
    const response = await fetch(
      this.nftApiUrl.concat(urlConcat), 
      { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: GetNFTsForOwnerResponseData = await response.json();
    return result as GetNFTsForOwnerResponseData;
  }
}