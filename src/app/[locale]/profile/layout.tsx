import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Suspense } from 'react'
import ProfileLoadingSkeleton from './loading'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ProfileLoadingSkeleton />}>
      {children}
    </Suspense>
  )
}
