import { Profile, Wallet } from "@prisma/client"

export type ProfileWithWallets = Profile & { wallets: Wallet[] }