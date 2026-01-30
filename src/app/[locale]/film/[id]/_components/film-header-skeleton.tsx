import { Skeleton } from '@/shared/components/ui/skeleton'

export function FilmHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-6 md:grid md:grid-cols-[300px_1fr] md:gap-8 mt-12">
      <div className="mx-auto w-full max-w-[300px] md:mx-0">
        <div className="relative h-[300px] w-[300px]">
          <Skeleton className="h-full w-full rounded-2xl md:rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-3/4 rounded-md" />
          {' '}
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-1/2 rounded-md" />
            {' '}
            <Skeleton className="h-6 w-10 rounded-full" />
            {' '}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-6 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-5 w-40 rounded-md" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  )
}
