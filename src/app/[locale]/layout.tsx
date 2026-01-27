import type { ReactNode } from 'react'
import type { I18nLocale } from '@/shared/i18n'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
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
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <div className="overflow-y-auto">
      <NextIntlClientProvider messages={messages}>
        <LayoutClient>{children}</LayoutClient>
      </NextIntlClientProvider>
    </div>
  )
}
