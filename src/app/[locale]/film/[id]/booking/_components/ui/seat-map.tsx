'use client'

import type { Seat } from '../../types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { cn } from '@/shared/lib/utils'

interface SeatMapProps {
  seats: Seat[][]
  selectedSeats: Seat[]
  onToggleSeat: (seat: Seat) => void
}

export function SeatMap({ seats, selectedSeats, onToggleSeat }: SeatMapProps) {
  const isSelected = (seat: Seat) =>
    selectedSeats.some(s => s.row === seat.row && s.column === seat.column)

  return (
    <div className="flex flex-col gap-4 items-center overflow-x-auto p-4 bg-muted/20 rounded-xl">
      <div className="w-full max-w-2xl h-8 bg-muted rounded-lg mb-8 relative flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Экран</span>
      </div>

      <div className="flex flex-col gap-2">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 items-center">
            <span className="w-6 text-sm text-muted-foreground">{rowIndex + 1}</span>
            <div className="flex gap-2">
              {row.map((seat, colIndex) => {
                const selected = isSelected(seat)
                const available = seat.isAvailable

                return (
                  <TooltipProvider key={colIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          disabled={!available}
                          onClick={() => onToggleSeat(seat)}
                          className={cn(
                            'w-8 h-8 rounded-lg transition-colors flex items-center justify-center text-xs',
                            available ? 'hover:scale-110 active:scale-95' : 'opacity-30 cursor-not-allowed',
                            seat.type === 'VIP' && 'rounded-full',
                            selected
                              ? 'bg-primary text-primary-foreground'
                              : available
                                ? 'bg-secondary hover:bg-primary/20'
                                : 'bg-muted text-muted-foreground',
                            seat.type === 'VIP' && !selected && available && 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50',
                          )}
                        >
                          {/* {seat.column} */}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {seat.row}
                          {' '}
                          ряд,
                          {' '}
                          {seat.column}
                          {' '}
                          место
                        </p>
                        <p className="font-bold">
                          {seat.price}
                          {' '}
                          ₽
                        </p>
                        <p className="text-xs text-muted-foreground">{seat.type}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
            <span className="w-6 text-sm text-muted-foreground text-right">{rowIndex + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
