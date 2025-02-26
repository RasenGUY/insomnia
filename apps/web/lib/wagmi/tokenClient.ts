import { Address, erc20Abi, TransactionReceipt } from "viem";
import { Config, simulateContract, sendTransaction, prepareTransactionRequest } from "@wagmi/core";
import WagmiBaseClient from "./wagmiBaseClient";
import { AssetType  } from "@/types/assets";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export class WagmiTokenClient extends WagmiBaseClient {
  private readonly erc20Abi: typeof erc20Abi = erc20Abi;
    
  constructor(config: Config) {
    super(config);
  }

  transferERC20(
    tokenAddress: Address, 
    recipientAddress: Address, 
    amount: bigint
  ): Observable<TransactionReceipt> {
    return from(simulateContract(this.config, {
      address: tokenAddress,
      abi: this.erc20Abi,
      functionName: 'transfer',
      args: [recipientAddress, amount],
    })).pipe(
      map(({ request }) => request),
      switchMap(request => from(this.handleContractWrite(this.config, request))),
      catchError(error => {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error during ERC20 transfer';
        return throwError(() => new Error(`ERC20 transfer failed: ${errorMessage}`));
      })
    );
  }

  transferETH(
    recipientAddress: Address, 
    amount: bigint
  ): Observable<TransactionReceipt> {
    return from(prepareTransactionRequest(this.config, {
      to: recipientAddress,
      value: amount,
    })).pipe(
      switchMap(request => from(sendTransaction(this.config, request))),
      switchMap(hash => from(this.waitForTransactionReceipt(this.config, { hash }))),
      map(receipt => {
        if (!receipt) {
          throw new Error('Transaction failed to be confirmed');
        }
        return receipt;
      }),
      catchError(error => {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error during ETH transfer';
        return throwError(() => new Error(`ETH transfer failed: ${errorMessage}`));
      })
    );
  }

  static transfer( 
    config: Config,
    {
      address,
      type,
      to,
      amount,
    }: {
      address: Address,
      type: AssetType,
      to: Address,
      amount: bigint,
    }
  ): Promise<TransactionReceipt> {
    const client = new WagmiTokenClient(config);
    if(type === AssetType.NATIVE) {
      return new Promise((resolve, reject) => {
        client.transferETH(
          to, 
          amount
        ).subscribe({
          next: (receipt) => resolve(receipt),
          error: (err) => reject(err instanceof Error ? err : new Error(String(err)))
        });
      });
    }
    return new Promise((resolve, reject) => {
      client.transferERC20(
        address, 
        to, 
        amount
      ).subscribe({
        next: (receipt) => resolve(receipt),
        error: (err) => reject(err instanceof Error ? err : new Error(String(err)))
      });
    });
  }
}