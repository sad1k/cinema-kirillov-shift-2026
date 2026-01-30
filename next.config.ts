import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// eslint-disable-next-line node/prefer-global/process
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const nextConfig: NextConfig = {

  experimental: {
    viewTransition: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shift-intensive.ru',
        pathname: '/api/**',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/server/i18n.server.ts')

export default withNextIntl(nextConfig)
