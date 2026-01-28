import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { ProfileSkeleton } from './_components/profile-skeleton'

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      {children}
    </Suspense>
  )
}
