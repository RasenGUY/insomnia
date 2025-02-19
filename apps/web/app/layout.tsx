import { Geist, Geist_Mono } from "next/font/google"
import { PublicEnvScript } from 'next-runtime-env'
import "@workspace/ui/globals.css"
import AppProviders from "@/components/AppProviders"
import AppSidebar from "@/components/features/navigation/AppSidebar"
import { AuthenticationWrapper } from "@/components/features/auth/AuthenticationWrapper"


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
            <AuthenticationWrapper>
              {children}
            </AuthenticationWrapper>
          </AppSidebar>
        </AppProviders>
      </body>
    </html>
  )
}
