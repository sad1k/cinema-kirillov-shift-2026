/* eslint-disable node/prefer-global/process */
import type { Metadata } from 'next'
import type { Film } from '@/shared/api/generated'

import { AGE_RATING_MAP } from '../constants/age-rating-map'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

export interface FilmMetadataParams {
  film: Film
  locale: string
}

export function generateFilmMetadata({ film, locale }: FilmMetadataParams): Metadata {
  const posterUrl = `${SITE_URL}/api${film.img}`
  const filmUrl = `${SITE_URL}/${locale ?? 'ru'}/film/${film.id}`

  const ageRating = AGE_RATING_MAP[film.ageRating]
  const releaseYear = film.releaseDate ? new Date(film.releaseDate).getFullYear() : ''

  const description = `${film.name} (${film.originalName}) — ${ageRating}. ${film.country?.name || ''}, ${releaseYear}. ${film.description.slice(0, 160)}`

  return {
    title: locale === 'ru'
      ? `${film.name} (${film.originalName}) — купить билет`
      : `${film.name} (${film.originalName}) — buy ticket`,
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

  const title = locale === 'ru'
    ? 'SHIFT CINEMA — Афиша'
    : 'SHIFT CINEMA — Schedule'
  const description = locale === 'ru'
    ? 'Смотрите лучшие фильмы в кинотеатре ШИФТ CINEMA. Купить билеты онлайн, расписание сеансов.'
    : 'Watch the best movies at SHIFT CINEMA. Buy tickets online, session schedule.'

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale,
      url: siteUrl,
      title,
      description,
      siteName: 'SHIFT CINEMA',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

export function generateFilmJsonLd(film: Film) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    'name': film.name,
    'alternateName': film.originalName,
    'description': film.description,
    'image': `${SITE_URL}/api${film.img}`,
    'datePublished': film.releaseDate,
    'duration': `PT${film.runtime}M`,
    'contentRating': AGE_RATING_MAP[film.ageRating],
    'genre': film.genres,
    'director': film.directors.map(d => ({
      '@type': 'Person',
      'name': d.fullName,
    })),
    'actor': film.actors.map(a => ({
      '@type': 'Person',
      'name': a.fullName,
    })),
    ...(film.country?.name && {
      countryOfOrigin: {
        '@type': 'Country',
        'name': film.country.name,
      },
    }),
    ...(film.userRatings?.kinopoisk && {
      aggregateRating: {
        '@type': 'AggregateRating',
        'ratingValue': film.userRatings.kinopoisk,
        'bestRating': 10,
      },
    }),
  }
}
