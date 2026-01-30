import { NextIntlClientProvider } from 'next-intl'

import { ErrorBoundary } from 'next/dist/client/components/error-boundary'

import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/shared/providers/theme/theme-provider'
import Error from './error'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          <NextIntlClientProvider>
            <ErrorBoundary errorComponent={Error}>
              {children}
            </ErrorBoundary>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
