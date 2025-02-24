'use client'
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { AssetSelector } from "./AssetSelector";
import { RecipientInput } from "./RecipientInput";
import { AmountInput } from "./AmountInput";
import { NFTDetails } from "./NFTDetails";
import { AssetType } from "@/types/assets";
import { useAssetLoader } from "./hooks";
import { 
  TokenSendFormValues, 
  NFTSendFormValues, 
  tokenSendFormSchema, 
  nftSendFormSchema 
} from "@/lib/validations/sendForm";
import { Address } from "viem";

interface SendTransactionFormProps {
  fromAddress: Address | undefined;
}

export default function SendTransactionForm({
  fromAddress
}: Readonly<SendTransactionFormProps>) {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const { selectedAsset, setSelectedAsset, tokenAssets, nftAssets } = useAssetLoader(fromAddress);

  // Determine which schema to use based on selected asset type
  const isNFT = selectedAsset?.type === AssetType.ERC721 || selectedAsset?.type === AssetType.ERC1155;
  const resolver = isNFT ? zodResolver(nftSendFormSchema) : zodResolver(tokenSendFormSchema); 
  
  const { 
    register, 
    control, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors, isValid }, 
    getValues,
    reset 
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

  // Watch form values
  const selectedFormAsset = watch("asset");

  // Handle asset selection
  const handleAssetSelect = (asset: typeof selectedAsset) => {
    if (!asset) return;

    setSelectedAsset(asset);
    setValue("asset", asset, { shouldValidate: true });
    setIsAssetModalOpen(false);

    // Set default amount for NFTs
    if (asset.type === AssetType.ERC721) {
      setValue("amount", "1", { shouldValidate: true });
    }
  };

  // Handle form submission
  const onSubmit = async (data: TokenSendFormValues | NFTSendFormValues) => {
    try {
      // Here you would:
      // 1. Prepare the transaction
      // 2. Get user confirmation
      // 3. Send the transaction
      // 4. Handle the response
      console.log("Transaction data:", data);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
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

          {/* To Address */}
          <RecipientInput
            value={getValues('toAddress')}
            onChange={(value) => setValue('toAddress', value, { shouldValidate: true })}
            error={errors.toAddress?.message}
          />

          {/* Asset Selector */}
          <AssetSelector
            value={selectedFormAsset}
            onChange={handleAssetSelect}
            isModalOpen={isAssetModalOpen}
            setIsModalOpen={setIsAssetModalOpen}
            tokenAssets={tokenAssets || []}
            nftAssets={nftAssets || []}
            error={errors.asset?.message}
          />

          {/* Amount Input - hide for ERC721 NFTs */}
          {(!selectedFormAsset || selectedFormAsset.type !== AssetType.ERC721) && (
            <AmountInput
              value={getValues('amount') || ''}
              onChange={(value) => setValue('amount', value, { shouldValidate: true })}
              asset={selectedFormAsset}
              error={errors.amount?.message}
              disabled={selectedFormAsset?.type === AssetType.ERC721}
            />
          )}

          {/* NFT Details */}
          {selectedFormAsset && (selectedFormAsset.type === AssetType.ERC721 || selectedFormAsset.type === AssetType.ERC1155) && (
            <NFTDetails asset={selectedFormAsset} />
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid}
          >
            Review Send
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}