"use client"

import { WagmiProvider, createConfig, http, Config } from "wagmi";
import { polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "config/configClient";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

export const web3Config: Config = createConfig(
  getDefaultConfig({
    chains: [
      polygon
    ],
    transports: {
      [polygon.id]: http(config.wallet.providerUrl),
    },
    walletConnectProjectId: config.wallet.walletConnectId,
    appName: "Insomnia Wallet",
    appDescription: "Welcome to Insomnia Wallet, the best wallet for your crypto needs!",
    appUrl: "https://localhost.com",
    appIcon: 'https://postimg.cc/rD5H7bsL',
  }),
);
export const Web3Provider = ({ queryClient, children }: Readonly<{ queryClient: QueryClient, children: React.ReactNode }>) => {
  return (
    <WagmiProvider config={web3Config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme={"auto"} mode={"dark"}>
            {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};