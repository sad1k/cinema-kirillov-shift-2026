'use client'

import type { Film } from '@/shared/api/generated'

import { useState } from 'react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { FilmPoster } from '@/shared/components/ui/film-poster'
import { Rating } from '@/shared/components/ui/rating'
import { env } from '@/shared/config/env'
import { AGE_RATING_MAP } from '@/shared/constants/age-rating-map'
import { useTypedI18n } from '@/shared/i18n/client'
import { cn, parseYear } from '@/shared/lib/utils'

interface FilmHeaderProps {
  film: Film
}

export function FilmHeader({ film }: FilmHeaderProps) {
  const { t } = useTypedI18n('common')
  const [isExpanded, setIsExpanded] = useState(false)

  const ageRating = AGE_RATING_MAP[film.ageRating]
  const releaseYear = parseYear(film.releaseDate)
  const kinopoiskRating = Number.parseFloat(film.userRatings.kinopoisk)
  const starsValue = kinopoiskRating / 2

  return (
    <div className="flex flex-col gap-6 md:grid md:grid-cols-[300px_1fr] md:gap-8">
      <div className="mx-auto w-full max-w-[300px] md:mx-0">
        <div className="relative h-[300px] w-[300px]">
          <FilmPoster
            src={`${env.NEXT_PUBLIC_API_URL}/api${film.img}`}
            alt={film.name}
            genre={film.genres[0]}
            country={film.country?.name}
            year={String(releaseYear || '')}
            className="h-full w-full"
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

        <div className="flex flex-col gap-2">
          <Rating value={starsValue} size="lg" />
          <span className="text-paragraph-14 text-muted-foreground">
            Kinopoisk -
            {' '}
            {film.userRatings.kinopoisk}
          </span>
        </div>

        <div className="relative">
          <p
            className={cn(
              'text-paragraph-14 leading-relaxed transition-all duration-300',
              !isExpanded && 'line-clamp-3',
            )}
          >
            {film.description}
            {!isExpanded && (
              <span className="bg-background/80 absolute right-0 bottom-0 pl-1 backdrop-blur-sm">
                ....
                {' '}
                <Button
                  variant="link"
                  className="text-paragraph-14 h-auto p-0 text-gray-400 decoration-0 hover:no-underline"
                  onClick={() => setIsExpanded(true)}
                >
                  {t('expand')}
                </Button>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
