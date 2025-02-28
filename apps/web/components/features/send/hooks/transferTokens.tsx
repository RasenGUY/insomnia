import * as React from 'react'
import { useSendTransaction, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { Address, erc20Abi, TransactionReceipt } from 'viem'
import { web3Config as config } from '@/components/providers/Web3Provider'
import { AssetType } from '@/types/assets'
import { trpc } from '@/server/client'
import { toast } from '@workspace/ui/components/sonner'
import { createExplorerTxHashUrl } from '@/utils/transaction'
import { WalletLabel } from '@/types/wallet'

type TransferTokenReturn = {
  transferTokenAsset: (params: {
    type: AssetType;
    contractAddress?: Address;
    to: Address;
    amount: bigint;
  }) => Promise<any>; 
  isSuccess: boolean;
  isPending: boolean;
  isError: boolean;
  isIdle: boolean;
  isPaused: boolean;
  error: any;
  reset: () => void;
}

export function useTransferToken(confirmations: number = 1): TransferTokenReturn {
  const utils = trpc.useUtils()
  const tokenMutation = useSendTransaction({
    config,
  })
  const erc20Mutation = useWriteContract({
    config,
  })
  const transferTokenAsset = async ({
    type,
    contractAddress,
    to,
    amount,
  }: {
    contractAddress?: Address,
    type: AssetType,
    to: Address,
    amount: bigint,
  }) => {
    let hash: Address;
    if(type === AssetType.ERC20 && contractAddress) {
      hash = await erc20Mutation.writeContractAsync({
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
          to,
          amount,
        ],
      })
    } else {
      hash = await tokenMutation.sendTransactionAsync({
        to,
        value: amount,
      })
    }
    waitForTx(hash)
  }

  const waitForTx = async (hash: Address) => {
    try { 
      await waitForTransactionReceipt(config, {
        hash,
        confirmations
      })
      utils.assets.getTokenAssets.invalidate()
      toast.success(
        <div className="flex flex-col gap-2">
          <span>Transfer confirmed!</span>
        </div>,
        {
          duration: 1500,
        }
      );
    } catch (error: any) {
      toast.error(
        <div className="flex flex-col gap-2">
          <span>Transaction failed</span>
          <span className="text-sm text-red-400">{error.message}</span>
        </div>,
        {
          duration: 1500,
        }
      );
    }
  }

  return {
    transferTokenAsset,
    isSuccess: tokenMutation.isSuccess || erc20Mutation.isSuccess,
    isError: tokenMutation.isError || erc20Mutation.isError,
    isIdle: tokenMutation.isIdle || erc20Mutation.isIdle,
    isPaused: tokenMutation.isPaused || erc20Mutation.isPaused,
    isPending: tokenMutation.isPending || erc20Mutation.isPending,
    error: tokenMutation.error ?? erc20Mutation.error,
    reset: tokenMutation.reset || erc20Mutation.reset,
  }
}
