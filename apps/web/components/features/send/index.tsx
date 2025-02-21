// components/features/send/SendTransactionForm.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { AssetSelector } from "./AssetSelector";
import { Asset, AssetType } from "@/types/assets";
import { FromAddressSelector } from "./FromAddressSelector";
import { RecipientInput } from "./RecipientInput";
import { AmountInput } from "./AmountInput";
import { NFTDetails } from "./NFTDetails";

// Form validation schema using zod
const sendFormSchema = z.object({
  fromAddress: z.string().min(1, "Sender address is required"),
  toAddress: z
    .string()
    .min(1, "Recipient address is required")
    .refine(
      (val) => /^0x[a-fA-F0-9]{40}$/.test(val) || val.endsWith('.eth'),
      { message: "Invalid address format" }
    ),
  asset: z.object({
    id: z.string(),
    type: z.enum(["NATIVE", "ERC20", "ERC721", "ERC1155"]),
    symbol: z.string(),
    name: z.string(),
    balance: z.string(),
    imageUrl: z.string(),
    networkImageUrl: z.string().optional(),
    contractAddress: z.string().optional(),
    tokenId: z.string().optional(),
    balanceUsd: z.string().optional(),
  }).optional().nullable(),
  amount: z.string().optional()
}).refine(data => {
  // Skip amount validation for ERC721
  if (data.asset?.type === "ERC721") return true;
  
  // For other asset types, amount is required and must be a valid number
  if (!data.amount) return false;
  const numAmount = parseFloat(data.amount);
  return !isNaN(numAmount) && numAmount > 0;
}, {
  message: "Amount is required and must be greater than 0",
  path: ["amount"]
});

type SendFormValues = z.infer<typeof sendFormSchema>;

export default function SendTransactionForm() {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  
  const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<SendFormValues>({
    resolver: zodResolver(sendFormSchema),
    mode: "onChange",
    defaultValues: {
      fromAddress: "0xC2FD...867A44", // Pre-populate with connected wallet
      toAddress: "",
      asset: null,
      amount: ""
    }
  });
  
  const selectedAsset = watch("asset");
  
  // Handle asset selection
  const handleAssetSelect = (asset: Asset) => {
    setValue("asset", asset, { shouldValidate: true });
    setIsAssetModalOpen(false);
    
    // If ERC721, set amount to 1
    if (asset.type === AssetType.ERC721) {
      setValue("amount", "1", { shouldValidate: true });
    }
  };
  
  // Handle form submission
  const onSubmit = (data: SendFormValues) => {
    console.log("Transaction data:", data);
    
    // Here you would connect to wallet provider and send the transaction
    // const txHash = await sendTransaction(data);
  };
  
  return (
    <Card className="rounded-2xl w-full max-w-md p-6 bg-card">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="p-0 space-y-6">
          {/* From Address Selector */}
          <Controller
            name="fromAddress"
            control={control}
            render={({ field }) => (
              <FromAddressSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.fromAddress?.message}
              />
            )}
          />
          
          {/* To Address Input */}
          <Controller
            name="toAddress"
            control={control}
            render={({ field }) => (
              <RecipientInput
                value={field.value}
                onChange={field.onChange}
                error={errors.toAddress?.message}
              />
            )}
          />
          
          {/* Asset Selector */}
          <Controller
            name="asset"
            control={control}
            render={({ field }) => (
              <AssetSelector
                value={field.value as Asset}
                onChange={handleAssetSelect}
                isModalOpen={isAssetModalOpen}
                setIsModalOpen={setIsAssetModalOpen}
                error={errors.asset?.message}
              />
            )}
          />
          
          {/* Amount Input - hide for ERC721 NFTs */}
          {(!selectedAsset || selectedAsset.type !== AssetType.ERC721) && (
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <AmountInput
                  value={field.value || ""}
                  onChange={field.onChange}
                  asset={selectedAsset as Asset}
                  error={errors.amount?.message}
                  disabled={selectedAsset?.type === AssetType.ERC721}
                />
              )}
            />
          )}
          
          {/* NFT Details - show for NFTs */}
          {selectedAsset && (selectedAsset.type === AssetType.ERC721 || selectedAsset.type === AssetType.ERC1155) && (
            <NFTDetails asset={selectedAsset as Asset} />
          )}
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={!isValid}
          >
            Send
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}