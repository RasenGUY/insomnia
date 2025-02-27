'use client'
import React from "react";
import SendTransactionForm from "@/components/features/send";
import { useAccount } from "wagmi";
import { trpc } from "@/server/client";
import { WalletLabel } from "@/types/wallet";

const SendPage = () => {
  const { address } = useAccount();
  const { data: profile } = trpc.resolver.reverse.useQuery({ address: address as string }, { enabled: !!address }); 

  return (
    <section className="mt-[3rem] w-full flex justify-center items-center">
      <SendTransactionForm fromAddress={address} walletLabel={profile?.wallets[0]?.label as WalletLabel}/>
    </section>
  );
};
export default SendPage;