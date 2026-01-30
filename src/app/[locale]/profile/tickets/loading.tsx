import { Skeleton } from '@/shared/components/ui/skeleton'
import { TicketCardSkeleton } from './_components/ticket-card-skeleton'

export default function TicketsLoading() {
  return (
    <div className="mx-auto mt-8 pb-20">
      <Skeleton className="mb-6 h-8 w-48" />

      <div className="space-y-6">
        <div className="w-full">
          <div className="flex bg-muted p-1 rounded-lg">
            <Skeleton className="h-8 flex-1 rounded-sm" />
            <Skeleton className="h-8 flex-1 rounded-sm ml-1" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <TicketCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
