/* eslint-disable node/prefer-global/process */
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import type { I18nLocale } from '@/shared/i18n'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header } from '@/app/_components/header'
import { MobileBottomMenu } from '@/app/_components/mobile-bottom-menu'
import { MobileHeader } from '@/app/_components/mobile-header'
import Error from '@/app/error'
import { routing } from '@/shared/i18n/i18n.routing'
import { ThemeProvider } from '@/shared/providers/theme/theme-provider'

import { LayoutClient } from './layout-client'

import '@/app/globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common.metadata' })

  return {
    metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
    title: {
      default: t('title'),
      template: `%s | SHIFT CINEMA`,
    },
    description: t('description'),
    openGraph: {
      type: 'website',
      locale,
      siteName: 'SHIFT CINEMA',
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      languages: {
        ru: `${SITE_URL}/ru`,
        en: `${SITE_URL}/en`,
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as I18nLocale)) {
    notFound()
  }

  const messages = await getMessages()
  const cookieStore = await cookies()
  const hasToken = cookieStore.has('token')

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundary errorComponent={Error}>
              <div className="overflow-y-auto">
                <LayoutClient hasToken={hasToken}>
                  <Header />
                  <MobileHeader />
                  <main className="mx-auto max-w-[960px] px-4">
                    {children}
                  </main>
                  <MobileBottomMenu />
                </LayoutClient>
              </div>
            </ErrorBoundary>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
