import type { Metadata } from 'next'
import type { I18nLocale } from '@/shared/i18n/server'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { HeaderController } from '@/app/_components/header-controller'
import { getApiCinemaFilmByFilmId } from '@/shared/api/generated'
import { getTypedServerI18n } from '@/shared/i18n/server'
import { generateFilmJsonLd, generateFilmMetadata } from '@/shared/seo/metadata'
import { BackButton } from './_components/back-button'
import { FilmHeader } from './_components/film-header'
import { ScheduleSection } from './_components/schedule-section'
import { ScheduleSectionSkeleton } from './_components/schedule-section-skeleton'

interface FilmPageProps {
  params: Promise<{
    id: string
    locale: string
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
  const { id, locale } = await params

  const { t } = await getTypedServerI18n(locale as I18nLocale, 'main')

  const response = await getApiCinemaFilmByFilmId({
    path: { filmId: id },
  })

  if (response.status === 404) {
    notFound()
  }

  const { film } = response.data

  const jsonLd = generateFilmJsonLd(film)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container pb-8 md:pb-12">
        <HeaderController title={t('home.about')} leftAction="close" />
        <div className="hidden md:block">
          <BackButton />
        </div>

        <div>
          <FilmHeader film={film} />
          <Suspense fallback={<ScheduleSectionSkeleton />}>
            <ScheduleSection filmId={film.id} />
          </Suspense>
        </div>
      </main>
    </>
  )
}
