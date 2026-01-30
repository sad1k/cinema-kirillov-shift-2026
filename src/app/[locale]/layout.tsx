import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import type { I18nLocale } from '@/shared/i18n'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Header } from '@/app/_components/header'
import { MobileBottomMenu } from '@/app/_components/mobile-bottom-menu'
import { MobileHeader } from '@/app/_components/mobile-header'
import { routing } from '@/shared/i18n/i18n.routing'

import { LayoutClient } from './layout-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common.metadata' })

  return {
    title: t('title'),
    description: t('description'),
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
    <div className="overflow-y-auto">
      <NextIntlClientProvider messages={messages}>
        <LayoutClient hasToken={hasToken}>
          <Header />
          <MobileHeader />
          <main className="mx-auto max-w-[960px] px-4">
            {children}
          </main>
          <MobileBottomMenu />
        </LayoutClient>
      </NextIntlClientProvider>
    </div>
  )
}
