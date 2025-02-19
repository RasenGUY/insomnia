export interface Wallet {
  address: string;
  label: WalletLabel;
  profileId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum WalletLabel {
  POLYGON = 0,
  ETHEREUM = 1,
  BSC = 2,
}