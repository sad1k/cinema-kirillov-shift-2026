/* eslint-disable node/prefer-global/process */
import type { Metadata } from 'next'
import type { Film } from '@/shared/api/generated'

import { getTranslations } from 'next-intl/server'
import { AGE_RATING_MAP } from '../constants/age-rating-map'
import { locales } from '../i18n/i18n.consts'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

function buildAlternates(path: string, canonicalLocale: string) {
  const languages = Object.fromEntries(
    locales.map(l => [l, `${SITE_URL}/${l}${path}`]),
  )

  return {
    canonical: `${SITE_URL}/${canonicalLocale}${path}`,
    languages,
  }
}

export interface FilmMetadataParams {
  film: Film
  locale: string
}

export async function generateFilmMetadata({ film, locale }: FilmMetadataParams): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'films' })

  const posterUrl = `${SITE_URL}/api${film.img}`
  const filmUrl = `${SITE_URL}/${locale}/film/${film.id}`

  const ageRating = AGE_RATING_MAP[film.ageRating]
  const releaseYear = film.releaseDate ? new Date(film.releaseDate).getFullYear() : ''

  const title = `${film.name} (${film.originalName}) — ${t('meta.titleSuffix')}`
  const description = `${film.name} (${film.originalName}) — ${ageRating}. ${film.country?.name || ''}, ${releaseYear}. ${film.description.slice(0, 160)}`

  return {
    title,
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
    alternates: buildAlternates(`/film/${film.id}`, locale),
  }
}

export async function generateHomeMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'main' })

  const siteUrl = `${SITE_URL}/${locale}`
  const title = t('home.meta.title')
  const description = t('home.meta.description')

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
    alternates: buildAlternates('', locale),
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
