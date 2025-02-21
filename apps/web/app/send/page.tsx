'use client'
import React from "react";
import SendTransactionForm from "@/components/features/send";
import { useAccount } from "wagmi";
const SendPage = () => {
  const { address } = useAccount();
  return (
    <section className="w-full flex justify-center items-center min-h-screen">
      <SendTransactionForm fromAddress={address}/>
    </section>
  );
};
export default SendPage;