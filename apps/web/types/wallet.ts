import { WalletLabel } from "@/lib/constants/supported-chains";

export interface Wallet {
  address: string;
  label: WalletLabel;
  profileId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export { WalletLabel };

