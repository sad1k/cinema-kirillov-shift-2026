import type { ReactNode } from 'react'
import { Suspense } from 'react'
import ProfileLoadingSkeleton from './loading'

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ProfileLoadingSkeleton />}>
      {children}
    </Suspense>
  )
}
