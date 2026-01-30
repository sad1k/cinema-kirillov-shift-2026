import { Skeleton } from '@/shared/components/ui/skeleton'

export function ScheduleSectionSkeleton() {
  return (
    <div className="flex flex-col gap-6 mt-5">
      <Skeleton className="h-9 w-40" />

      <div className="mb-6 flex w-full flex-nowrap gap-2 overflow-hidden px-4 md:mx-0 md:w-fit md:flex-wrap md:px-[2px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-sm" />
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="ml-1 h-5 w-20" />

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-[38px] w-[102px] rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="h-10 w-full rounded-md md:w-[300px]" />
    </div>
  )
}
