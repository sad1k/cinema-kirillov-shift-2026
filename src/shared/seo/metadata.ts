import type { Metadata } from 'next'
import type { Film } from '@/shared/api/generated'

import { env } from '@/shared/config/env'
import { AGE_RATING_MAP } from '../constants/age-rating-map'

const SITE_URL = env.NEXT_PUBLIC_SITE_URL

export interface FilmMetadataParams {
  film: Film
  locale: string
}

export function generateFilmMetadata({ film, locale }: FilmMetadataParams): Metadata {
  const posterUrl = `${SITE_URL}/api${film.img}`
  const filmUrl = `${SITE_URL}/${locale}/film/${film.id}`

  const ageRating = AGE_RATING_MAP[film.ageRating]
  const releaseYear = film.releaseDate ? new Date(film.releaseDate).getFullYear() : ''

  const description = locale === 'ru'
    ? `${film.name} (${film.originalName}) — ${ageRating}. ${film.country?.name || ''}, ${releaseYear}. ${film.description.slice(0, 200)}`
    : `${film.name} (${film.originalName}) — ${ageRating}. ${film.country?.name || ''}, ${releaseYear}. ${film.description.slice(0, 200)}`

  return {
    title: locale === 'ru'
      ? `${film.name} (${film.originalName}) — купить билет | SHIFT CINEMA`
      : `${film.name} (${film.originalName}) — buy ticket | SHIFT CINEMA`,
    description,
    openGraph: {
      type: 'video.movie',
      locale,
      url: filmUrl,
      title: film.name,
      description,
      images: [
        {
          url: posterUrl,
          width: 600,
          height: 900,
          alt: film.name,
        },
      ],
      siteName: 'SHIFT CINEMA',
    },
    twitter: {
      card: 'summary_large_image',
      title: film.name,
      description,
      images: [posterUrl],
    },
    alternates: {
      canonical: filmUrl,
      languages: {
        ru: `${SITE_URL}/ru/film/${film.id}`,
        en: `${SITE_URL}/en/film/${film.id}`,
      },
    },
  }
}

export function generateHomeMetadata(locale: string): Metadata {
  const siteUrl = `${SITE_URL}/${locale}`

  return {
    title: locale === 'ru'
      ? 'SHIFT CINEMA — Афиша'
      : 'SHIFT CINEMA — Schedule',
    description: locale === 'ru'
      ? 'Смотрите лучшие фильмы в кинотеатре ШИФТ CINEMA. Купить билеты онлайн, расписание сеансов.'
      : 'Watch the best movies at SHIFT CINEMA. Buy tickets online, session schedule.',
    openGraph: {
      type: 'website',
      locale,
      url: siteUrl,
      title: locale === 'ru' ? 'SHIFT CINEMA — Афиша' : 'SHIFT CINEMA — Schedule',
      description: locale === 'ru'
        ? 'Смотрите лучшие фильмы в кинотеатре ШИФТ CINEMA. Купить билеты онлайн, расписание сеансов.'
        : 'Watch the best movies at SHIFT CINEMA. Buy tickets online, session schedule.',
      siteName: 'SHIFT CINEMA',
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        ru: `${SITE_URL}/ru`,
        en: `${SITE_URL}/en`,
      },
    },
  }
}
