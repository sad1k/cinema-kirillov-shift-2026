import { Skeleton } from '@/shared/components/ui/skeleton'

export function FilmCardSkeleton() {
  return (
    <article className="flex h-full flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl rounded-br-xs">
        <Skeleton className="h-[300px] w-full rounded-2xl" />

        <div className="absolute bottom-0 right-0 flex h-[30px] w-24 gap-0.5 rounded-br-xs rounded-tl-xs bg-secondary">
          <Skeleton className="h-full w-full" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-4 w-1/3" />
      </div>

      <Skeleton className="mt-auto h-10 w-full rounded-md" />
    </article>
  )
}
