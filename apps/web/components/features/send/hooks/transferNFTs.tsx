import { useWriteContract } from 'wagmi'
import { Address, erc721Abi } from 'viem'
import erc1155Artifact from '@/lib/blockchain/artifacts/ERC1155.json'
import { web3Config as config } from '@/components/providers/Web3Provider'
import { AssetType } from '@/types/assets'

type TransferNFTAssetReturn = {
  transferNFTAsset: (params: {
    type: AssetType;
    contractAddress: Address;
    to: Address;
    from: Address;
    tokenId: bigint;
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

export function useTransferNFTAsset(): TransferNFTAssetReturn {
  const erc721Mutation = useWriteContract({
    config,
  })
  const erc1155Mutation = useWriteContract({
    config,
  })

  const transferNFTAsset = ({
    type,
    contractAddress,
    to,
    from,
    tokenId,
    amount,
  }: {
    contractAddress: Address,
    type: AssetType,
    from: Address,
    to: Address,
    tokenId: bigint,
    amount: bigint,
  }) => {
    if(type === AssetType.ERC721) {
      return erc721Mutation.writeContractAsync({
        address: contractAddress,
        abi: erc721Abi,
        functionName: 'safeTransferFrom',
        args: [
          from,
          to,
          tokenId,
        ],
      })
    } 
    return erc1155Mutation.writeContractAsync({
      address: contractAddress,
      abi: erc1155Artifact.abi,
      functionName: 'safeTransferFrom',
      args: [
        from,
        to,
        tokenId,
        amount,
        ""
      ],
    })
  }

  return {
    transferNFTAsset,
    isSuccess: erc721Mutation.isSuccess || erc1155Mutation.isSuccess,
    isError: erc721Mutation.isError || erc1155Mutation.isError,
    isIdle: erc721Mutation.isIdle || erc1155Mutation.isIdle,
    isPaused: erc721Mutation.isPaused || erc1155Mutation.isPaused,
    isPending: erc721Mutation.isPending || erc1155Mutation.isPending,
    error: erc721Mutation.error ?? erc1155Mutation.error,
    reset: erc721Mutation.reset || erc1155Mutation.reset,
  }
}
