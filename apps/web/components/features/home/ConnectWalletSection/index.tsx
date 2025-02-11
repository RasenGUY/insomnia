'use client'
import React from 'react';
import ConnectButton from 'components/features/wallet/ConnectButton';

export function ConnectWalletSection() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-lg max-w-md w-full border-[1px] border-secondary-500">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-100">Insomnia Wallet</h1>
          
          <div className="text-center space-y-2">
            <p className="text-gray-300">Your Gateway to NFT Trading on Polygon</p>
            <p className="text-sm text-gray-400">Connect your wallet to start sending and receiving NFTs</p>
          </div>

          <div className="w-full space-y-4">
            <ConnectButton className="w-full" />
          </div>

          <p className="text-xs text-gray-500 text-center">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}