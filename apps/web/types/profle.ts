import { Wallet } from "./wallet";

export interface Profile {
  username: string;
  wallets: Wallet[];
  createdAt: string;
  updatedAt: string;
}