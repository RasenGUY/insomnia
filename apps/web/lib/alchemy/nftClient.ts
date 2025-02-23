import { GetNFTsForOwnerResponseData, getNFTsForOwnerResponse } from './types';
import { config } from '@/config/configServer';

export class AlchemyNFTClient {
  private readonly nftApiUrl: string;

  constructor() {
    this.nftApiUrl = config.api.nft.url;
  }

  async getNFTsForOwner(
    owner: string, 
    pageSize: number = 10, 
    pageKey?: string,
  ): Promise<GetNFTsForOwnerResponseData> { 
    const response = await fetch(
      this.nftApiUrl.concat(`/getNFTsForOwner?
        owner=${owner}&
        orderBy=transferTime&
        withMetadata=true&
        pageSize=${pageSize}${pageKey ? `&pageKey=${pageKey}` : ''}`), 
      { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: getNFTsForOwnerResponse = await response.json();
    return result.data as GetNFTsForOwnerResponseData;
  }
}