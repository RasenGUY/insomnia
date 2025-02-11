import { Geist, Geist_Mono } from "next/font/google"
import { PublicEnvScript } from 'next-runtime-env'
import "@workspace/ui/globals.css"

import { SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar"

import ClientProvider from "components/providers/ClientProvider"
import Navbar from "components/features/navigation/Navbar"
import AppSidebar from "components/features/navigation/AppSidebar"
import { CustomTrigger } from "@/components/features/navigation/AppSidebar/components/CustomTrigger"

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
              "--sidebar-width": "7.5rem",
              "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties}>
            <AppSidebar />
            <div className="w-full"> {/* sidebar container */}
              <Navbar />
              <main>
                {children}
                {/* <section>Hi</section> */}
              </main>
            </div>
          </SidebarProvider>
        </ClientProvider>
      </body>
    </html>
  )
}
