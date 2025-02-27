import { Address, erc721Abi, TransactionReceipt } from "viem";
import erc1155Abi from './artifacts/ERC1155.json';
import { Config, simulateContract } from "@wagmi/core";
import { from, Observable, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import WagmiBaseClient from "./wagmiBaseClient";
import { AssetType } from "@/types/assets";

export class WagmiNFTClient extends WagmiBaseClient {
  private readonly erc721Abi: typeof erc721Abi = erc721Abi;
  private readonly erc1155Abi: typeof erc1155Abi.abi = erc1155Abi.abi;
  
  constructor(config: Config) {
    super(config);
  }

  transferERC721(
    contractAddress: Address,
    fromAddress: Address,
    to: Address,
    tokenId: bigint,
    options?: {
      safe?: boolean
    }
  ): Observable<TransactionReceipt> {
    const functionName = options?.safe !== false 
      ? 'safeTransferFrom' 
      : 'transferFrom';
    
    return from(simulateContract(this.config, {
      address: contractAddress,
      abi: this.erc721Abi,
      functionName,
      args: [fromAddress, to, tokenId] as const,
    })).pipe(
      map(({ request }) => request),
      switchMap((request) => from(this.handleContractWrite(request))),
      catchError(error => {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error during ERC721 transfer';
        
        throw new Error(`ERC721 transfer failed (Token ID: ${tokenId.toString()}): ${errorMessage}`);
      })
    );
  }

  transferERC1155(
    contractAddress: Address,
    fromAddress: Address,
    to: Address,
    tokenId: bigint,
    amount: bigint,
    options?: {
      data?: Address
    }
  ): Observable<TransactionReceipt> {
    const data = options?.data ?? '';
    
    return from(simulateContract(this.config, {
      address: contractAddress,
      abi: this.erc1155Abi,
      functionName: 'safeTransferFrom',
      args: [fromAddress, to, tokenId, amount, data],
    })).pipe(
      map(({ request }) => request),
      switchMap((request) => this.handleContractWrite(request)),
      catchError(error => {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error during ERC1155 transfer';
        
        throw new Error(`ERC1155 transfer failed (Token ID: ${tokenId.toString()}): ${errorMessage}`);
      })
    );
  }

  static transfer( 
    config: Config,
    {    
      address,
      tokenId,
      from,
      to,
      amount,
      type
    }: {
      address: Address,
      type: AssetType,
      tokenId: bigint,
      from: Address,
      to: Address,
      amount: bigint,
    }): Promise<TransactionReceipt> {
    const client = new WagmiNFTClient(config);
    if(type !== AssetType.ERC1155 && type !== AssetType.ERC721) 
      throw new Error('Invalid asset type');
    
    if(type === AssetType.ERC721) {
      return new Promise((resolve, reject) => {
        client.transferERC721(
          address,
          from,
          to, 
          tokenId,
          { safe: true }
        ).subscribe({
          next: (receipt) => resolve(receipt),
          error: (err) => reject(err instanceof Error ? err : new Error(String(err)))
        });
      });
    }

    return new Promise((resolve, reject) => {
      client.transferERC1155(
        address, 
        from,
        to, 
        tokenId,
        amount
      ).subscribe({
        next: (receipt) => resolve(receipt),
        error: (err) => reject(err instanceof Error ? err : new Error(String(err)))
      });
    });
  }
}