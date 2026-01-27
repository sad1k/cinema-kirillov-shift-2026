import type { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/shared/i18n/i18n.routing'

const nextMiddleware = createIntlMiddleware(routing)

const handleNextMiddleware = (request: NextRequest): NextResponse => {
  const response = nextMiddleware(request)
  return response
}

export default async function middleware(
  request: NextRequest,
): Promise<NextResponse | void> {
  if (request.cookies.get('app.at')) {
    // noop, just example
  }

  // console.log(request.headers.get('user-agent'));

  return handleNextMiddleware(request)
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|ru)/:path*'],
}
