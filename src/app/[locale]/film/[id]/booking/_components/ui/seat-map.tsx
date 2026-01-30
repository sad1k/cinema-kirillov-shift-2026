'use client'

import type { Seat } from '../../types'
import { Button } from '@/shared/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { useTypedI18n } from '@/shared/i18n/client'
import { cn } from '@/shared/lib/utils'

interface SeatMapProps {
  seats: Seat[][]
  selectedSeats: Seat[]
  onToggleSeat: (seat: Seat) => void
}

export function SeatMap({ seats, selectedSeats, onToggleSeat }: SeatMapProps) {
  const { t } = useTypedI18n('seats')
  const isSelected = (seat: Seat) =>
    selectedSeats.some(s => s.row === seat.row && s.column === seat.column)

  return (
    <div className="flex flex-col gap-4 items-center overflow-x-auto p-4 bg-muted/20 rounded-xl">
      <span className="text-xs text-muted-foreground">{t('screen')}</span>
      <div className="w-full max-w-2xl h-8 bg-muted rounded-lg mb-8 relative flex items-center justify-center">
      </div>

      <div className="flex flex-col gap-2">
        <span>{t('row')}</span>
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 items-center">
            <span className="w-6 text-sm text-muted-foreground">{rowIndex + 1}</span>
            <div className="flex gap-2">
              {row.map((seat, colIndex) => {
                const selected = isSelected(seat)

                return (
                  <TooltipProvider key={colIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          disabled={seat.price === 0}
                          onClick={() => onToggleSeat(seat)}
                          className={cn(
                            'size-4 rounded-xxs flex items-center justify-center text-xs transition-all m-3',
                            selected && 'size-10 rounded-sm m-0',
                          )}
                          size="icon-xs"
                        >
                          {selected && seat.column}
                        </Button>

                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-paragraph-12 font-bold text-background">
                          {seat.price}
                          {' '}
                          ₽
                        </p>
                        <p className="text-paragraph-12 text-content-05">
                          {seat.row}
                          {' '}
                          {t('row')}
                          ,
                          {' '}
                          {seat.column}
                          {' '}
                          {t('seatNumber')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
