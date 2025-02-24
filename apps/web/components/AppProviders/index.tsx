"use client"
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Web3Provider } from "@/components/AppProviders/Web3Provider";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { getQueryClient } from "@/utils/query-client";
import { TRPCProvider } from "@/components/AppProviders/TRPCProvider";

export const queryClient = getQueryClient();

type AppProvidersProps = React.PropsWithChildren

const AppProviders: React.FC<AppProvidersProps> = (props) => {   
  return (
    <Web3Provider queryClient={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <TRPCProvider queryClient={queryClient}>
          <SidebarProvider>
            {props.children}
          </SidebarProvider>
        </TRPCProvider>
      </NextThemesProvider>
    </Web3Provider>
  )
}

export default AppProviders