import type { Metadata } from 'next'
import type { I18nLocale } from '@/shared/i18n'
import { getTranslations } from 'next-intl/server'

import { getApiCinemaFilmByFilmId } from '@/shared/api/generated'
import { generateFilmMetadata } from '@/shared/seo/metadata'
import { BackButton } from './_components/back-button'
import { FilmHeader } from './_components/film-header'
import { ScheduleSection } from './_components/schedule-section'

interface FilmPageProps {
  params: Promise<{
    locale: I18nLocale
    id: string
  }>
}

export async function generateMetadata({ params }: FilmPageProps): Promise<Metadata> {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'films' })

  const response = await getApiCinemaFilmByFilmId({
    path: { filmId: id },
  })

  if (!response.data.success || !response.data.film) {
    return {
      title: t('notFound'),
    }
  }

  return generateFilmMetadata({ film: response.data.film, locale })
}

export default async function FilmPage({ params }: FilmPageProps) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'films' })

  const response = await getApiCinemaFilmByFilmId({
    path: { filmId: id },
  })

  if (!response.data.success || !response.data.film) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h1 className="text-title-h2 mb-2">{t('notFound')}</h1>
          <p className="text-paragraph-14 text-muted-foreground">
            {t('notFoundDescription')}
          </p>
        </div>
      </div>
    )
  }

  const { film } = response.data

  return (
    <>
      <main className="container pb-8 md:pb-12">
        <div>
          <BackButton />
        </div>

        <div className="mx-auto space-y-12">
          <FilmHeader film={film} />
          <ScheduleSection filmId={film.id} />
        </div>
      </main>
    </>
  )
}
