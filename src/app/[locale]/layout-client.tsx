'use client'

import type { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { getQueryClient } from '@/shared/api/query-client'
import { MobileHeaderProvider } from '@/shared/context/mobile-header-context'
import { SessionProvider } from '@/shared/providers/session/session-provider'

export function LayoutClient({ children, hasToken }: PropsWithChildren<{ hasToken: boolean }>) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider hasToken={hasToken}>
        <MobileHeaderProvider>
          {children}
        </MobileHeaderProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
