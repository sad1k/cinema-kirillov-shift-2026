import type { Film } from '@/shared/api/generated'

import type { I18nLocale } from '@/shared/i18n'
import { getTypedServerI18n } from '@/shared/i18n/server'
import { FilmCard } from './film-card'

interface FilmGridProps {
  films: Film[]
  locale: I18nLocale
}

export async function FilmGrid({ films, locale }: FilmGridProps) {
  const { t } = await getTypedServerI18n(locale, 'main')

  return (
    <section className="flex flex-col gap-6">
      <h2 className="my-6 text-title-h2">{t('home.title')}</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {films.map(film => (
          <FilmCard key={film.id} film={film} locale={locale} />
        ))}
      </div>
    </section>
  )
}
