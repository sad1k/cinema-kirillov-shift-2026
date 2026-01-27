import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {}

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/server/i18n.server.ts')

export default withNextIntl(nextConfig)
