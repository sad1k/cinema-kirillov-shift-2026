import type { Metadata } from 'next'
import type { I18nLocale } from '@/shared/i18n'

import { HeaderController } from '@/app/_components/header-controller'

import { LangSwitcher } from '@/app/_components/lang-switcher'
import { getApiCinemaFilms } from '@/shared/api/generated'
import { getTypedServerI18n } from '@/shared/i18n/server'
import { ThemeToggle } from '@/shared/providers/theme/theme-toggle'
import { generateHomeMetadata } from '@/shared/seo/metadata'
import { FilmGrid } from './_components/film-grid'

interface HomePageProps {
  params: Promise<{ locale: I18nLocale }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  const { t } = await getTypedServerI18n(locale, 'main')

  const response = await getApiCinemaFilms()

  return (
    <>
      <HeaderController
        title={t('home.title')}
        leftAction="back"
        rightAction={(
          <div className="flex items-center gap-1">
            <LangSwitcher />
            <ThemeToggle />
          </div>
        )}
      />
      <FilmGrid films={response.data.films} locale={locale} />
    </>
  )
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  return generateHomeMetadata(locale)
}
