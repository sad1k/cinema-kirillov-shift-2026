/* eslint-disable node/prefer-global/process */
import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile/', '/auth/', '/*booking*'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
