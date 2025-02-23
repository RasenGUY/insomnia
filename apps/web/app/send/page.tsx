'use client'
import React from "react";
import SendTransactionForm from "@/components/features/send";
import { useAccount } from "wagmi";
const SendPage = () => {
  const { address } = useAccount();
  return (
    <section className="mt-[3rem] w-full flex justify-center items-center">
      <SendTransactionForm fromAddress={address}/>
    </section>
  );
};
export default SendPage;