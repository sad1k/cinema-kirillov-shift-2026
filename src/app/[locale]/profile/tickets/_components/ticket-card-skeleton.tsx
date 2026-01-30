import { Card, CardContent } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function TicketCardSkeleton() {
  return (
    <Card>
      <CardContent className="w-full">
        <div className="mb-4 flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>

        <div className="mb-2 flex justify-center">
          <Skeleton className="h-7 w-3/4" />
        </div>

        <div className="mb-4 flex justify-center">
          <Skeleton className="h-5 w-1/2" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <Skeleton className="mt-4 h-10 w-full" />
      </CardContent>
    </Card>
  )
}
