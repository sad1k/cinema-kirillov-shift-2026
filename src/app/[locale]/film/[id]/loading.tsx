import { HeaderController } from '@/app/_components/header-controller'
import { FilmHeaderSkeleton } from './_components/film-header-skeleton'
import { ScheduleSectionSkeleton } from './_components/schedule-section-skeleton'

export default function FilmLoading() {
  return (
    <>
      <main className="container pb-8 md:pb-12">
        <HeaderController title="" leftAction="close" />

        <div>
          <FilmHeaderSkeleton />
          <ScheduleSectionSkeleton />
        </div>
      </main>
    </>
  )
}
