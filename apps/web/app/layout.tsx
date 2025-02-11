import { Geist, Geist_Mono } from "next/font/google"
import { PublicEnvScript } from 'next-runtime-env'
import "@workspace/ui/globals.css"

import { SidebarProvider } from "@workspace/ui/components/sidebar"
import ClientProvider from "components/providers/ClientProvider"
import AppSidebar from "components/features/navigation/AppSidebar"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased w-full`}
      >
        <ClientProvider>
          <SidebarProvider 
            style={{
              "--sidebar-width": "10rem",
              "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties}>
            <AppSidebar>
               {children}
            </AppSidebar>
          </SidebarProvider>
        </ClientProvider>
      </body>
    </html>
  )
}
