'use client'
import { useEffect, useState } from "react";
import { Resolver, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Address, parseUnits } from "viem";
import { toast } from "@workspace/ui/components/sonner";
import { Loader2 } from "lucide-react";

import { 
  TokenSendFormValues, 
  NFTSendFormValues, 
  tokenSendFormSchema, 
  nftSendFormSchema 
} from "@/lib/validations/sendForm";
import { AssetSelector } from "./AssetSelector";
import { RecipientInput } from "./RecipientInput";
import { AmountInput } from "./AmountInput";
import { NFTDetails } from "./NFTDetails";
import { AssetType, NFTAsset, TokenAsset } from "@/types/assets";
import { useAssetLoader } from "./hooks";
import { trpc } from "@/server/client";
import { WalletLabel } from "@/lib/constants/supported-chains";
import WagmiBaseClient from "@/lib/wagmi/wagmiBaseClient";
import { web3Config } from "@/components/providers/Web3Provider";

interface SendTransactionFormProps {
  fromAddress: Address | undefined;
  walletLabel: WalletLabel;
}

export default function SendTransactionForm({
  fromAddress,
  walletLabel
}: Readonly<SendTransactionFormProps>) {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const { 
    selectedAsset, 
    setSelectedAsset,
    tokenAssets,
    nftAssets
  } = useAssetLoader(fromAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNFT = selectedAsset?.type === AssetType.ERC721 || selectedAsset?.type === AssetType.ERC1155;
  const resolver = isNFT ? zodResolver(nftSendFormSchema) : zodResolver(tokenSendFormSchema); 
  
  const { 
    register, 
    control, 
    handleSubmit, 
    watch, 
    setValue, 
    reset,
    formState: { errors, isValid, dirtyFields }, 
  } = useForm({
    resolver: resolver as Resolver<any>,
    mode: "onChange",
    defaultValues: {
      fromAddress: fromAddress,
      toAddress: "",
      asset: null,
      amount: isNFT ? "1" : ""
    }
  });

  const selectedFormAsset = watch("asset");
  
  const handleAssetSelect = (asset: typeof selectedAsset) => {
    if (!asset) return;
    setSelectedAsset(asset);
    setValue("asset", asset, { shouldValidate: true });
    setIsAssetModalOpen(false);
    if (asset.type === AssetType.ERC721) {
      setValue("amount", "1", { shouldValidate: true });
    }
  };

  const trpcUtils = trpc.useUtils();
  const {
    mutate: transferTokenAsset,
    isPending: isTransferringTokenAsset,
    isSuccess: isTokenAssetTransferred,
    isError: isTokenAssetTransferError,
    error: tokenAssetTransferError,
    reset: resetTokenAssetTransfer,
  } = trpc.assets.transferTokenAsset.useMutation({
    onSuccess: (data) => {
      resetNFTAssetTransfer();
      resetTokenAssetTransfer();
      trpcUtils.assets.invalidate();
      
      const explorerUrl = WagmiBaseClient.createExplorerTxHashUrl(walletLabel, data.transactionHash);
      
      toast.success(
        <div className="flex flex-col gap-2">
          <span>Transaction sent successfully!</span>
          <a 
            href={explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View on blockchain explorer
          </a>
        </div>,
        {
          duration: 5000,
        }
      );
      
      // Reset form after successful transaction
      reset();
      setSelectedAsset(null);
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(
        <div className="flex flex-col gap-2">
          <span>Transaction failed</span>
          <span className="text-sm text-red-400">{error.message}</span>
        </div>,
        {
          duration: 5000,
        }
      );
      setIsSubmitting(false);
    }
  });
  
  const {
    mutate: transferNFTAsset,
    isPending: isTransferringNFTAsset,
    isSuccess: isNFTAssetTransferred,
    isError: isNFTAssetTransferError,
    error: nftAssetTransferError,
    reset: resetNFTAssetTransfer,
  } = trpc.assets.transferNFTAsset.useMutation({
    onSuccess: (data) => {
      resetNFTAssetTransfer();
      resetTokenAssetTransfer();
      trpcUtils.assets.invalidate();
      
      const explorerUrl = WagmiBaseClient.createExplorerTxHashUrl(walletLabel, data.transactionHash);
      
      toast.success(
        <div className="flex flex-col gap-2">
          <span>NFT sent successfully!</span>
          <a 
            href={explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View on blockchain explorer
          </a>
        </div>,
        {
          duration: 5000,
        }
      );
      
      // Reset form after successful transaction
      reset();
      setSelectedAsset(null);
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(
        <div className="flex flex-col gap-2">
          <span>NFT transfer failed</span>
          <span className="text-sm text-red-400">{error.message}</span>
        </div>,
        {
          duration: 5000,
        }
      );
      setIsSubmitting(false);
    }
  });
  
  const onSubmit = async (data: TokenSendFormValues | NFTSendFormValues) => {
    if (!fromAddress || !data.asset || !data.toAddress) return;
    
    setIsSubmitting(true);
    
    try {
      const assetType = data.asset.type;
      const toAddress = data.toAddress as Address;
      
      toast.info("Processing transaction...", {
        duration: 1000,
      });
      
      if (assetType === AssetType.ERC721 || assetType === AssetType.ERC1155) { 
        const nftData = data as NFTSendFormValues;
        const nftAsset = data.asset as NFTAsset;
        const amount = assetType === AssetType.ERC721 ? 1n : BigInt(nftData.amount as string);
        
        transferNFTAsset({
          web3Config,
          address: nftAsset.address as Address,
          type: assetType,
          walletlabel: walletLabel,
          from: fromAddress,
          tokenId: BigInt(nftAsset.tokenId as string),
          to: toAddress,
          amount: amount
        });

      } else {
        const tokenAsset = data.asset as TokenAsset 
        const tokenData = data as TokenSendFormValues;
        const amount = parseUnits(tokenData.amount.toString(), tokenAsset.meta?.decimals as number);  

        transferTokenAsset({
          web3Config,
          address: tokenAsset.contractAddress,
          type: assetType,
          walletlabel: walletLabel,
          from: fromAddress,
          to: toAddress,
          amount
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        <div className="flex flex-col gap-2">
          <span>Transaction failed</span>
          <span className="text-sm text-red-400">{error?.message}</span>
        </div>, {
        duration: 3000,
      });
      
      setIsSubmitting(false);
    }
  };

  const isLoading = isTransferringTokenAsset || isTransferringNFTAsset || isSubmitting;

  useEffect(() => {
    if(selectedAsset) handleAssetSelect(selectedAsset);
  },[selectedAsset])

  return (
    <Card className="w-full max-w-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="p-0 space-y-6">
          {/* From Address */}
          <div className="space-y-2">
            <p className="font-semibold">From</p>
            <Input
              disabled
              {...register('fromAddress')}
              defaultValue={fromAddress}
              className="h-12 bg-accent"
            />
          </div>

          {/* To Address - Using Controller with RecipientInput */}
          <Controller
            control={control}
            name="toAddress"
            render={({ field }) => (
              <RecipientInput
                value={field.value}
                onChange={field.onChange}
                isDirty={dirtyFields['toAddress']}
                setValue={(value: string) => field.onChange(value)}
                error={errors.toAddress?.message as string}
              />
            )}
          />

          {/* Asset Selector */}
          <AssetSelector
            value={selectedFormAsset}
            onChange={handleAssetSelect}
            isModalOpen={isAssetModalOpen}
            setIsModalOpen={setIsAssetModalOpen}
            tokenAssets={tokenAssets || []}
            nftAssets={nftAssets || []}
            error={errors.asset?.message as string}
          />

          {/* Amount Input - hide for ERC721 NFTs */}
          {(!selectedFormAsset || selectedFormAsset.type !== AssetType.ERC721) && (
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <AmountInput
                  value={field.value}
                  onChange={field.onChange}
                  asset={selectedFormAsset}
                  disabled={selectedFormAsset?.type === AssetType.ERC721}
                  error={errors.amount?.message as string}
                />
              )}
            />
          )}

          {/* NFT Details */}
          {selectedFormAsset && (selectedFormAsset.type === AssetType.ERC721 || selectedFormAsset.type === AssetType.ERC1155) && (
            <NFTDetails asset={selectedFormAsset} />
          )}

          {/* Submit Button with Loading State */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Send"
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}