import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'

import { routing } from '@/shared/i18n/i18n.routing'

const nextMiddleware = createIntlMiddleware(routing)

const handleNextMiddleware = (request: NextRequest): NextResponse => {
  const response = nextMiddleware(request)
  return response
}

export default async function middleware(
  request: NextRequest,
): Promise<NextResponse | void> {
  const token = request.cookies.get('token')
  const isAuth = !!token

  const { pathname } = request.nextUrl

  const isProtectedRoute = /\/(?:en|ru)\/profile/.test(pathname)

  if (isProtectedRoute && !isAuth) {
    const locale = pathname.split('/')[1] || 'ru'
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
  }

  return handleNextMiddleware(request)
}

export const config = {
  matcher: ['/', '/(en|ru)/:path*'],
}
