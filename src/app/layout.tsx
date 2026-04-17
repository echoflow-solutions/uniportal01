import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ClientProviders } from '@/components/providers/ClientProviders'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
})

const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-sans',
  display: 'swap',
  weight: '100 900',
  preload: true,
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-mono',
  display: 'swap',
  weight: '100 900',
  preload: false,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf7f2' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'UniPortal — Verify understanding, not just sources',
    template: '%s · UniPortal',
  },
  description:
    'UniPortal verifies what students actually understand. An AI-era academic integrity platform that captures authorship evidence and confirms comprehension — built for institutions.',
  keywords: [
    'academic integrity',
    'AI detection alternative',
    'student authorship',
    'comprehension verification',
    'university platform',
    'TipTap editor',
    'TrueLearn',
    'APIC',
  ],
  authors: [{ name: 'Asia Pacific International College' }],
  creator: 'UniPortal',
  publisher: 'Asia Pacific International College',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    title: 'UniPortal — Verify understanding, not just sources',
    description:
      'Detection was the old war. UniPortal captures how work is actually made, and verifies that the student can teach what they submitted.',
    siteName: 'UniPortal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniPortal — Verify understanding, not just sources',
    description:
      'AI-era academic integrity, built around evidence and verified comprehension.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--paper)]"
        >
          Skip to content
        </a>
        <ClientProviders>{children}</ClientProviders>
        <Analytics />
      </body>
    </html>
  )
}
