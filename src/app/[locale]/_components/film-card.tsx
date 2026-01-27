import type { Film } from '@/shared/api/generated'

import Image from 'next/image'

import { Button } from '@/shared/components/ui/button'
import { Rating } from '@/shared/components/ui/rating'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { Link } from '@/shared/i18n/i18n.routing'
import { parseYear } from '@/shared/lib/utils'

const AGE_RATING_MAP: Record<Film['ageRating'], string> = {
  G: '0+',
  PG: '6+',
  PG13: '12+',
  R: '16+',
  NC17: '18+',
}

interface FilmCardProps {
  film: Film
}

export function FilmCard({ film }: FilmCardProps) {
  const { t } = useTypedI18n('common')
  const releaseYear = parseYear(film.releaseDate)
  const ageRating = AGE_RATING_MAP[film.ageRating]
  const kinopoiskRating = Number.parseFloat(film.userRatings.kinopoisk)
  const starsValue = kinopoiskRating / 2

  return (
    <article className="flex h-full flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl rounded-br-xs">
        <Image
          src={`https://shift-intensive.ru/api${film.img}`}
          alt={film.name}
          width={300}
          height={300}
          className="h-[300px] w-full object-cover rounded-2xl"
        />

        <div
          className="absolute bottom-0 right-0 flex flex-col items-center gap-0.5 bg-secondary px-4 py-2 rounded-br-xs rounded-tl-xs"
        >
          <span className="text-sm font-medium leading-[14px]">
            {film.genres[0]}
          </span>
          <span className="text-sm font-normal leading-[14px]">
            {film.country?.name}
            ,
            {' '}
            {releaseYear}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-title-h3">
          {film.name}
          {' '}
          (
          {ageRating}
          )
        </h3>

        <span className="text-paragraph-14 text-muted-foreground">
          {t('film')}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Rating value={starsValue} size="md" />
        <span className="text-paragraph-14 text-muted-foreground">
          {t('kinopoisk')}
          {' '}
          -
          {' '}
          {film.userRatings.kinopoisk}
        </span>
      </div>

      <Button asChild className="mt-auto w-full">
        <Link href={`/film/${film.id}`}>
          {t('details')}
        </Link>
      </Button>
    </article>
  )
}
