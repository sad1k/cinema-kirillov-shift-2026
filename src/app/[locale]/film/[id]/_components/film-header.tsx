import type { Film } from '@/shared/api/generated'

import Image from 'next/image'

import { Badge } from '@/shared/components/ui/badge'
import { Rating } from '@/shared/components/ui/rating'
import { parseYear } from '@/shared/lib/utils'

const AGE_RATING_MAP: Record<Film['ageRating'], string> = {
  G: '0+',
  PG: '6+',
  PG13: '12+',
  R: '16+',
  NC17: '18+',
}

interface FilmHeaderProps {
  film: Film
}

export function FilmHeader({ film }: FilmHeaderProps) {
  const ageRating = AGE_RATING_MAP[film.ageRating]
  const releaseYear = parseYear(film.releaseDate)
  const kinopoiskRating = Number.parseFloat(film.userRatings.kinopoisk)
  const starsValue = kinopoiskRating / 2

  return (
    <div className="flex flex-col gap-6 md:grid md:grid-cols-[300px_1fr] md:gap-8">
      <div className="mx-auto w-full max-w-[300px] md:mx-0">
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl">
          <Image
            src={`https://shift-intensive.ru/api${film.img}`}
            alt={film.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-title-h2">
            {film.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-paragraph-14 text-muted-foreground">
              (
              {film.originalName}
              )
            </span>
            <Badge variant="secondary">{ageRating}</Badge>
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-2">
          <Rating value={starsValue} size="lg" />
          <span className="text-paragraph-14 text-muted-foreground">
            Кинопоиск —
            {' '}
            {film.userRatings.kinopoisk}
          </span>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-paragraph-14 text-muted-foreground">
          <span>{film.country?.name}</span>
          <span>{releaseYear}</span>
          <span>{film.genres.join(', ')}</span>
        </div>

        {/* Description */}
        <p className="text-paragraph-14 leading-relaxed">
          {film.description}
        </p>
      </div>
    </div>
  )
}
