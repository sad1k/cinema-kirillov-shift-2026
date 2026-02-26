import type { Metadata } from 'next'
import type { I18nLocale } from '@/shared/i18n'
import { redirect } from 'next/navigation'
import { getTypedServerI18n } from '@/shared/i18n/server'
import { BookingStepsContainer } from './_components/booking-steps-container'

interface BookingPageProps {
  params: Promise<{
    locale: I18nLocale
    id: string
  }>
  searchParams: Promise<{
    date?: string
    time?: string
    hall?: string
  }>
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTypedServerI18n(locale, 'common')

  return {
    title: t('buyTicket'),
    robots: { index: false, follow: false },
  }
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { id } = await params
  const { date, time, hall } = await searchParams

  if (!date || !time || !hall) {
    redirect(`/film/${id}`)
  }

  return (
    <main className="container pb-8 md:pb-12 pt-8">
      <div className="mx-auto">
        <BookingStepsContainer
          filmId={id}
          date={date}
          time={time}
          hall={hall}
        />
      </div>
    </main>
  )
}
