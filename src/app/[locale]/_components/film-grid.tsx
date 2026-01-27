import type { Film } from '@/shared/api/generated'

import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'

import { FilmCard } from './film-card'

interface FilmGridProps {
  films: Film[]
}

export function FilmGrid({ films }: FilmGridProps) {
  const { t } = useTypedI18n('main')

  return (
    <section className="flex flex-col gap-6">
      <h2 className="ml-4 text-title-h2">{t('home.title')}</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {films.map(film => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </section>
  )
}
