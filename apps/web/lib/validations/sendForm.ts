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

export const tokenSendFormSchema = baseFormSchema.extend({
  type: z.string(),
  amount: z.string()
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, { message: "Amount must be greater than 0" })
});

export const nftSendFormSchema = baseFormSchema.extend({
  type: z.string(), 
  amount: z.string()
}).refine(data => {
  
  if (data.type === AssetType.ERC721) {
    return data.amount === "1";
  }
  
  const amount = parseInt(data.amount ?? "0");
  return !isNaN(amount) && amount > 0 && Number.isInteger(amount);
}, {
  message: "Amount must be a whole number greater than 0",
  path: ["amount"]
});

export type TokenSendFormValues = z.infer<typeof tokenSendFormSchema>;
export type NFTSendFormValues = z.infer<typeof nftSendFormSchema>;