'use client'
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Address, parseUnits } from "viem";
import { toast } from "@workspace/ui/components/sonner";
import { Loader2 } from "lucide-react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { trpc } from "@/server/client";
import { useRouter } from "next/navigation";

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
import { useAssetLoader } from "./hooks/assetLoader";
import { WalletLabel } from "@/lib/constants/supported-chains";
import { 
  useTransferNFTAsset,
  useTransferTokenAsset,
} from "./hooks";
import { createExplorerTxHashUrl } from "@/utils/transaction";
import { web3Config as config } from "@/components/providers/Web3Provider";
import { LoadingScreen } from "@/components/features/common/LoadingScreen";
import { SendTransactionFormPlaceholder } from "./FormPlaceholder";

interface SendTransactionFormProps {
  fromAddress: Address;
  walletLabel: WalletLabel;
}

export default function SendTransactionForm({
  fromAddress,
  walletLabel
}: Readonly<SendTransactionFormProps>) {
  const router = useRouter();
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const { 
    selectedTokenAsset, 
    selectedNFTAsset,
    setSelectedTokenAsset,
    setSelectedNFTAsset,
    selectedAssetType,
    setSelectedAssetType,
    tokenAssets,
    nftAssets,
    isLoading: isAssetLoading,
  } = useAssetLoader(fromAddress);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = trpc.useUtils();
  const isNFT = selectedAssetType === AssetType.ERC721 || selectedAssetType === AssetType.ERC1155;
  const resolver = isNFT ? 
    zodResolver(nftSendFormSchema): 
    zodResolver(tokenSendFormSchema);

  const defaultValues = {
    type: selectedAssetType ?? "",
    fromAddress: fromAddress,
    toAddress: "" as Address,
    amount: ""
  }

  const { 
    register, 
    control, 
    handleSubmit, 
    setValue, 
    reset,
    formState: { errors, isValid, dirtyFields }, 
  } = useForm({
    resolver: resolver,
    mode: "onChange",
    defaultValues
  });

  const handleNFTAssetSelect = (asset: NFTAsset) => {
    if (!asset) return;
    setSelectedNFTAsset(asset);
    if(asset.type === AssetType.ERC721) { 
      setValue("amount", "1", { shouldValidate: true });
    }
    setSelectedAssetType(asset.type);
    setSelectedTokenAsset(null);
  };

  const handleTokenAssetSelect = (asset: TokenAsset) => {
    if (!asset) return;
    setSelectedTokenAsset(asset);
    setSelectedAssetType(asset.type);
    setSelectedNFTAsset(null);
  };

  const {
    transferTokenAsset,
    reset: resetTokenAssetTransfer,
    isPending: isTransferringTokenAsset,
  } = useTransferTokenAsset();
  const handleTransferTokenAsset = async (asset: TokenAsset, data: TokenSendFormValues) => {
    const amount = parseUnits(data.amount.toString(), asset.meta?.decimals as number);           
    return transferTokenAsset({
      type: asset.type,
      contractAddress: asset.contractAddress as Address,
      to: data.toAddress,
      amount
    })
  }

  const {
    transferNFTAsset,
    reset: resetNFTAssetTransfer,
    isPending: isTransferringNFTAsset,
  } = useTransferNFTAsset();
  const handleTransferNFTAsset = async (asset: NFTAsset, data: NFTSendFormValues) => {
    const amount = data.type !== AssetType.ERC721 ? BigInt(data.amount as string) : 1n;           
    return transferNFTAsset({
      type: asset.type,
      contractAddress: asset.address as Address,
      from: data.fromAddress as Address,
      tokenId: BigInt(asset.tokenId), 
      to: data.toAddress,
      amount
    })
  }
  
  const onSubmit = async (data: TokenSendFormValues | NFTSendFormValues) => {
    if(!selectedAssetType) return;
    setIsSubmitting(true);
    toast.info("Processing transaction...", {
      duration: 1000,
    });

    try {
      
      let hash: Address;
      let explorerUrl: string;
      if(selectedAssetType === AssetType.ERC20 || selectedAssetType === AssetType.NATIVE) {
        if(!selectedTokenAsset) return;
        hash = await handleTransferTokenAsset(selectedTokenAsset, data);
        explorerUrl = createExplorerTxHashUrl(walletLabel, hash);
        await waitForTransactionReceipt(config, { hash, confirmations: 1 });
        setSelectedTokenAsset(null);
        triggerTransferSuccessToast(explorerUrl);
        resetTokenAssetTransfer();
        utils.assets.getTokenAssets.invalidate();
      } else if (selectedAssetType === AssetType.ERC721 || selectedAssetType === AssetType.ERC1155) { 
        if(!selectedNFTAsset) return;
        hash = await handleTransferNFTAsset(selectedNFTAsset, data);
        explorerUrl = createExplorerTxHashUrl(walletLabel, hash);
        await waitForTransactionReceipt(config, { hash, confirmations: 1 });
        setSelectedNFTAsset(null);
        triggerTransferSuccessToast(explorerUrl);
        resetNFTAssetTransfer();
        utils.assets.getNFTAssets.invalidate();
      }
      
      setIsSubmitting(false);
      reset();
      router.replace(window.location.pathname);
    } catch (error: any) {
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

  const isTransferringAsset = isTransferringTokenAsset || isTransferringNFTAsset || isSubmitting;

  if(isAssetLoading) return <SendTransactionFormPlaceholder />;

  return (
    <Card className="p-6 min-w-[27.5rem]">
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
                isDirty={dirtyFields['toAddress'] as boolean}
                setValue={(value: string) => field.onChange(value)}
                error={errors.toAddress?.message as string}
              />
            )}
          />

          {/* Asset Selector */}
          <AssetSelector
            value={selectedTokenAsset || selectedNFTAsset}
            onChange={(asset: TokenAsset | NFTAsset) => {
              if(asset.type === AssetType.ERC721 || asset.type === AssetType.ERC1155) return handleNFTAssetSelect(asset as NFTAsset);
              return handleTokenAssetSelect(asset as TokenAsset);
            }}
            isModalOpen={isAssetModalOpen}
            setIsModalOpen={setIsAssetModalOpen}
            tokenAssets={tokenAssets || []}
            nftAssets={nftAssets || []}
          />

          {/* Amount Input - hide for ERC721 NFTs */}
          {(selectedTokenAsset || selectedNFTAsset)  && ( 
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <AmountInput
                  value={field.value}
                  onChange={field.onChange}
                  asset={selectedTokenAsset || selectedNFTAsset}
                  disabled={selectedAssetType === AssetType.ERC721}
                  error={errors.amount?.message as string}
                />
              )}
            />
          )}

          {/* NFT Details */}
          {selectedNFTAsset && !selectedTokenAsset && (
            <NFTDetails asset={selectedNFTAsset} />
          )}

          {/* Submit Button with Loading State */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isTransferringAsset}
          >
            {isTransferringAsset ? (
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

const triggerTransferSuccessToast = (explorerUrl: string) => toast.success(
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
    duration: 3000,
  }
);