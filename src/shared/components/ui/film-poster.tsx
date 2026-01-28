import type { ComponentProps } from 'react'
import Image from 'next/image'

import { cn } from '@/shared/lib/utils'

interface FilmPosterProps extends ComponentProps<'div'> {
  src: string
  alt: string
  genre: string
  country?: string
  year: string
  priority?: boolean
}

export function FilmPoster({
  src,
  alt,
  genre,
  country,
  year,
  className,
  priority = false,
  ...props
}: FilmPosterProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl rounded-br-xs',
        className,
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-2xl"
        priority={priority}
      />

      <div className="bg-secondary absolute right-0 bottom-0 flex flex-col items-center gap-0.5 rounded-br-xs rounded-tl-xs px-4 py-2">
        <span className="text-sm font-medium leading-[14px]">
          {genre}
        </span>
        <span className="text-sm font-normal leading-[14px]">
          {country}
          ,
          {' '}
          {year}
        </span>
      </div>
    </div>
  )
}
