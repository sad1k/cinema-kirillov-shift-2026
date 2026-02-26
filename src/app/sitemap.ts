/* eslint-disable node/prefer-global/process */
import type { MetadataRoute } from 'next'
import { getApiCinemaFilms } from '@/shared/api/generated'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
const locales = ['ru', 'en'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })
  }

  try {
    const response = await getApiCinemaFilms()
    const films = response.data.films

    for (const film of films) {
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/film/${film.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
  }
  catch {
    // If API is unavailable, return entries without films
  }

  return entries
}
