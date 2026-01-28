import { Star } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

interface RatingProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
}

export function Rating({ value, max = 5, size = 'md', className }: RatingProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const starValue = i + 1
    const isFilled = starValue <= Math.floor(value)
    const isPartial = !isFilled && starValue <= Math.ceil(value) && value % 1 > 0

    return (
      <span key={i} className="relative inline-block">
        <Star
          className={cn(
            sizeClasses[size],
            'fill-indicator-light text-indicator-light',
            className,
          )}
        />
        {(isFilled || isPartial) && (
          <Star
            className={cn(
              sizeClasses[size],
              'absolute inset-0 fill-indicator-attention text-indicator-attention',
              isPartial && 'clip-path-half',
            )}
            style={isPartial ? { clipPath: `inset(0 ${100 - (value % 1) * 100}% 0 0)` } : undefined}
          />
        )}
      </span>
    )
  })

  return (
    <div className={cn('flex items-center gap-0.5', className)} role="img" aria-label={`Rating: ${value} out of ${max} stars`}>
      {stars}
    </div>
  )
}
