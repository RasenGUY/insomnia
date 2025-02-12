'use client'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import log from 'loglevel'
import { config } from 'config/configClient'
import { Web3Provider } from "./Web3Provider"


const ClientProviders = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  if (config.env === 'development') {
    log.setLevel('debug')
  } else {
    log.setLevel('info')
  }

  return (
    <Web3Provider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
        >
          {children}  
      </NextThemesProvider>
    </Web3Provider>
  )
}

export default ClientProviders
