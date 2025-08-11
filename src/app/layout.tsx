import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://openqr.dev'),
  title: 'OpenQR - The Best QR Code Generator',
  description: 'Create beautiful, customizable QR codes instantly. Free, open-source, and feature-rich QR code generator.',
  keywords: ['QR code', 'QR generator', 'custom QR', 'beautiful QR', 'best QR generator', 'open source'],
  authors: [{ name: 'Dipesh Mahat' }],
  creator: 'Dipesh Mahat',
  openGraph: {
    title: 'OpenQR - The Best QR Code Generator',
    description: 'Create beautiful, customizable QR codes instantly.',
    url: 'https://openqr.dev',
    siteName: 'OpenQR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OpenQR - The Best QR Code Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenQR - The Best QR Code Generator',
    description: 'Create beautiful, customizable QR codes instantly.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
