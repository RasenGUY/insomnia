import { z } from "zod";
import { AssetType } from "@/types/assets";
import { isAddress } from "viem";

// Base schema for common fields
const baseFormSchema = z.object({
  fromAddress: z.string().min(1, "Sender address is required"),
  toAddress: z
    .string()
    .min(1, "Recipient address is required")
    .refine(
      (val) => {
        return isAddress(val)
      },
      { message: "Invalid address format" }
    ),
});

// Schema for token-specific fields
const tokenAssetSchema = z.object({
  type: z.enum([AssetType.NATIVE, AssetType.ERC20]),
  contractAddress: z.string(),
  chainId: z.number(),
  balance: z.string(),
  meta: z.object({
    decimals: z.number(),
    symbol: z.string(),
    name: z.string(),
    logo: z.string().optional(),
  }).optional(),
  price: z.string().optional(),
});

const nftAssetSchema = z.object({
  type: z.enum([AssetType.ERC721, AssetType.ERC1155]),
  address: z.string(),
  chainId: z.number(),
  balance: z.string(),
  tokenId: z.string().optional(),
  meta: z.object({
    name: z.string(),
    description: z.string(),
    image: z.string(),
    symbol: z.string().nullable(),
  }).optional(),
  image: z.object({
    thumbnailUrl: z.string().nullable(),
    originalUrl: z.string().nullable(),
  }),
  collection: z.object({
    name: z.string(),
    slug: z.string(),
  }).optional(),
});

export const tokenSendFormSchema = baseFormSchema.extend({
  asset: tokenAssetSchema,
  amount: z.string()
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, { message: "Amount must be greater than 0" })
});

export const nftSendFormSchema = baseFormSchema.extend({
  asset: nftAssetSchema,
  amount: z.string().optional()
}).refine(data => {
  
  if (data.asset?.type === AssetType.ERC721) {
    return data.amount === "1";
  }
  
  const amount = parseFloat(data.amount ?? "0");
  return !isNaN(amount) && amount > 0;
}, {
  message: "Invalid amount for NFT type",
  path: ["amount"]
});

export type TokenSendFormValues = z.infer<typeof tokenSendFormSchema>;
export type NFTSendFormValues = z.infer<typeof nftSendFormSchema>;