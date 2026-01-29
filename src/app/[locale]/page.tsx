import type { Metadata } from 'next'
import type { I18nLocale } from '@/shared/i18n'
import { getTranslations } from 'next-intl/server'

import { getApiCinemaFilms } from '@/shared/api/generated'

import { FilmGrid } from './_components/film-grid'

interface HomePageProps {
  params: Promise<{ locale: I18nLocale }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'main' })

  const response = await getApiCinemaFilms()

  if (!response.data.success) {
    return (
      <div className="text-center text-muted-foreground">
        {t('home.error')}
      </div>
    )
  }

  return <FilmGrid films={response.data.films} locale={locale} />
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'main' })

  return {
    title: t('home.meta.title'),
    description: t('home.meta.description'),
  }
}
