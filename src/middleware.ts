import type { NextRequest } from 'next/server'
import { deleteCookie } from 'cookies-next'
import createIntlMiddleware from 'next-intl/middleware'

import { NextResponse } from 'next/server'
import { routing } from '@/shared/i18n/i18n.routing'
import { env } from './shared/config/env'

const nextMiddleware = createIntlMiddleware(routing)

const handleNextMiddleware = (request: NextRequest): NextResponse => {
  const response = nextMiddleware(request)
  return response
}

export default async function middleware(
  request: NextRequest,
): Promise<NextResponse | void> {
  const { pathname } = request.nextUrl

  const isProtectedRoute = /\/(?:en|ru)\/profile/.test(pathname)

  if (isProtectedRoute) {
    const token = request.cookies.get('token')
    try {
      // THROUGH fetches it doesnt work and have 401 errors
      await fetch(`${env.NEXT_PUBLIC_API_URL}/api/users/session`, {
        headers: {
          authorization: `Bearer ${token?.value}`,
        },
      })
    }
    catch (error) {
      console.error(error)
      deleteCookie('token', {
        path: '/',
      })
      const locale = pathname.split('/')[1] || 'ru'
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
    }
  }

  return handleNextMiddleware(request)
}

export const config = {
  matcher: ['/', '/(en|ru)/:path*'],
}
