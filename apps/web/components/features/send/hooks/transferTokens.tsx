import { useSendTransaction, useWriteContract } from 'wagmi'
import { Address, erc20Abi } from 'viem'
import { web3Config as config } from '@/components/providers/Web3Provider'
import { AssetType } from '@/types/assets'

type TransferTokenAssetReturn = {
  transferTokenAsset: (params: {
    type: AssetType;
    contractAddress?: Address;
    to: Address;
    amount: bigint;
  }) => Promise<Address>; 
  isSuccess: boolean;
  isPending: boolean;
  isError: boolean;
  isIdle: boolean;
  isPaused: boolean;
  error: any;
  reset: () => void;
}

export function useTransferTokenAsset(): TransferTokenAssetReturn {
  const tokenMutation = useSendTransaction({
    config,
  })
  const erc20Mutation = useWriteContract({
    config,
  })

  const transferTokenAsset = ({
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
    if(type === AssetType.ERC20 && contractAddress) {
      return erc20Mutation.writeContractAsync({
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
          to,
          amount,
        ],
      })
    } 
    return tokenMutation.sendTransactionAsync({
      to,
      value: amount,
    })
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
