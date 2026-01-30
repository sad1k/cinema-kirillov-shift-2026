import { Skeleton } from '@/shared/components/ui/skeleton'

export function BookingStepSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-[350px]">
      <div className="hidden md:block">
        <Skeleton className="w-full h-[400px] rounded-xl" />
      </div>

      <div className="md:hidden">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-10 w-24 hidden md:block" />
        <Skeleton className="h-10 w-full md:hidden" />
        <Skeleton className="h-10 w-24 hidden md:block" />
      </div>
    </div>
  )
}
