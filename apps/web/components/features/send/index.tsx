'use client'
import { useState } from "react";
import { Resolver, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Address } from "viem";
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
import { AssetType } from "@/types/assets";
import { useAssetLoader } from "./hooks";
import { trpc } from "@/server/client";
import { WalletLabel } from "@/lib/constants/supported-chains";
import WagmiBaseClient from "@/lib/wagmi/wagmiBaseClient";

interface SendTransactionFormProps {
  fromAddress: Address | undefined;
  walletLabel: WalletLabel; // Added wallet label prop for explorer links
}

export default function SendTransactionForm({
  fromAddress,
  walletLabel
}: Readonly<SendTransactionFormProps>) {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const { selectedAsset, setSelectedAsset, tokenAssets, nftAssets } = useAssetLoader(fromAddress);
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
      const asset = data.asset;
      const toAddress = data.toAddress as Address;
      
      // Display confirmation toast
      toast.info("Processing transaction...", {
        duration: 2000,
      });
      
      if (asset.type === AssetType.ERC721 || asset.type === AssetType.ERC1155) {
        // Handle NFT transfer
        const nftData = data as NFTSendFormValues;
        const amount = asset.type === AssetType.ERC721 ? 1n : BigInt(nftData.amount || "1");
        
        transferNFTAsset({
          address: asset.address as Address,
          type: asset.type,
          walletlabel: walletLabel,
          from: fromAddress,
          tokenId: BigInt(asset.tokenId || "0"),
          to: toAddress,
          amount: amount
        });
      } else {
        // Handle Token transfer (ERC20 or Native)
        const tokenData = data as TokenSendFormValues;
        const amount = BigInt(tokenData.amount) * (10n ** BigInt(asset?.meta?.decimals ?? 18)); 
        
        transferTokenAsset({
          address: asset.,
          type: asset.type,
          walletlabel: walletLabel,
          from: fromAddress,
          to: toAddress,
          amount: amount
        });
      }
    } catch (error) {
      console.error("Transaction preparation failed:", error);
      toast.error("Failed to prepare transaction", {
        duration: 3000,
      });
      setIsSubmitting(false);
    }
  };

  const isLoading = isTransferringTokenAsset || isTransferringNFTAsset || isSubmitting;

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