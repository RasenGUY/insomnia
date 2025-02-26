import { Geist, Geist_Mono } from "next/font/google"
import { PublicEnvScript } from 'next-runtime-env'
import "@workspace/ui/globals.css"
import { Toaster } from "@workspace/ui/components/sonner"

import AppProviders from "@/components/providers"
import AppSidebar from "@/components/features/navigation/AppSidebar"
import AuthenticationLayout  from "@/components/features/auth"


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
        <AppProviders>
          <AppSidebar>
            <AuthenticationLayout>
              {children}
            </AuthenticationLayout>
          </AppSidebar>
        </AppProviders>
        <Toaster />
      </body>
    </html>
  )
}
