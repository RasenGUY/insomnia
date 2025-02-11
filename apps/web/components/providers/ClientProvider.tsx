'use client'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import log from 'loglevel'
import { SessionProvider } from 'next-auth/react'
import { config } from 'config/configClient'


const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  if (config.env === 'development') {
    log.setLevel('debug')
  } else {
    log.setLevel('info')
  }

  return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
            >
            {children}
        </NextThemesProvider>
    )
}

export default ClientProviders
