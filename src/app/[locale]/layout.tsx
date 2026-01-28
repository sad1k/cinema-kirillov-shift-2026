import type { ReactNode } from 'react'
import type { I18nLocale } from '@/shared/i18n'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Header } from '@/app/_components/header'
import { routing } from '@/shared/i18n/i18n.routing'

import { LayoutClient } from './layout-client'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: I18nLocale }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <div className="overflow-y-auto">
      <NextIntlClientProvider messages={messages}>
        <LayoutClient>
          <Header />
          <main className="mx-auto max-w-[960px] px-4">
            {children}
          </main>
        </LayoutClient>
      </NextIntlClientProvider>
    </div>
  )
}
