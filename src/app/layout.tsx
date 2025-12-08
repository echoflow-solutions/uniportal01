import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "@/components/providers/ClientProviders"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "UniPortal - Academic Integrity Platform",
  description: "A comprehensive academic integrity platform for educational institutions",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
