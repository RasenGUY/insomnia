"use client"

import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "config/configClient";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

export const web3Config = createConfig(
  getDefaultConfig({
    chains: [
        polygon
    ],
    transports: {
      [polygon.id]: http(config.ethereum.providerUrl),
    },
    walletConnectProjectId: config.ethereum.walletConnectId,
    appName: "Insomnia Wallet",
    appDescription: "Welcome to Insomnia Wallet, the best wallet for your crypto needs!",
    appUrl: "https://localhost.com", // your app's url
    appIcon: 'https://postimg.cc/rD5H7bsL', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
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