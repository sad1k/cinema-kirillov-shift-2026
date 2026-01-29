'use client'

import type { Seat } from '../../types'
import type { FilmPlace, FilmSchedule, FilmScheduleSeance } from '@/shared/api/generated'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useGetApiCinemaFilmByFilmIdScheduleQuery } from '@/shared/api/generated'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useTypedI18n } from '@/shared/i18n/client'
import { SeatMap } from '../ui/seat-map'
import { SeatSelectForm } from '../ui/seat-select-form'

interface BookingStepOneProps {
  filmId: string
  date: string
  time: string
  hall: string
  selectedSeats: Seat[]
  onChange: (seats: Seat[]) => void
  handleNext: () => void
  handleBack: () => void
}

// Helper to cast API unknown type to our Seat type
// Assumption: FilmPlace has type, price, etc.
// Since API types are unknown, we mock mapping for now or try to infer
// function mapPlacesToSeats(places: unknown[][]): Seat[][] {
//   return places.map((row, rowIndex) =>
//     row.map((place: any, colIndex) => ({
//       row: rowIndex + 1,
//       column: colIndex + 1,
//       type: place.type || 'ECONOM',
//       price: place.price || 300,
//       isAvailable: !place.isBooked, // Assumption
//     })),
//   )
// }

export function BookingStepOne({ filmId, date, time, hall, selectedSeats, onChange, handleNext, handleBack }: BookingStepOneProps) {
  const { t } = useTypedI18n('common')

  const { data, isLoading } = useGetApiCinemaFilmByFilmIdScheduleQuery({
    request: { path: { filmId } },
  })

  // Find the specific seance
  const schedule = data?.data?.schedules?.find(s => s.date === date)
  const seance = schedule?.seances?.find(s => s.time === time && s.hall.name === hall)

  // Memoized seats grid
  const [seats, setSeats] = useState<Seat[][]>([])

  useEffect(() => {
    if (seance?.hall?.places) {
      // Temporary mock mapping until real data structure is confirmed
      // Simulating some unavailable seats for testing
      const mapped = seance.hall.places.map((row: any, rIdx) =>
        row.map((col: any, cIdx) => ({
          row: rIdx + 1,
          column: cIdx + 1,
          type: (col?.type as any) || 'ECONOM',
          price: (col?.price as number) || 300 + (rIdx * 50),
          isAvailable: true, // Default to true if unknown
        })),
      ) as Seat[][]
      setSeats(mapped)
    }
  }, [seance])

  const toggleSeat = (seat: Seat) => {
    const exists = selectedSeats.some(s => s.row === seat.row && s.column === seat.column)
    if (exists) {
      onChange(selectedSeats.filter(s => !(s.row === seat.row && s.column === seat.column)))
    }
    else {
      onChange([...selectedSeats, seat])
    }
  }

  const addSeat = (seat: Seat) => {
    const exists = selectedSeats.some(s => s.row === seat.row && s.column === seat.column)
    if (!exists) {
      onChange([...selectedSeats, seat])
    }
  }

  if (isLoading) { return <Skeleton className="w-full h-[400px] rounded-xl" /> }

  if (!seance) { return <div>Сеанс не найден</div> }

  const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Desktop View */}
      <div className="hidden md:block">
        <SeatMap
          seats={seats}
          selectedSeats={selectedSeats}
          onToggleSeat={toggleSeat}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <SeatSelectForm seats={seats} onAddSeat={addSeat} />
      </div>

      {/* Selected Tickets Summary */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Билет
            {selectedSeats.length || ''}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedSeats.map(seat => (
            <div key={`${seat.row}-${seat.column}`} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm">
              <span>
                {seat.row}
                {' '}
                ряд,
                {' '}
                {seat.column}
                {' '}
                место
              </span>
              <span className="font-bold text-primary">
                {seat.price}
                {' '}
                ₽
              </span>
              <button
                onClick={() => toggleSeat(seat)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {selectedSeats.length === 0 && (
            <p className="text-muted-foreground text-sm">Выберите места на схеме</p>
          )}
        </div>

        {selectedSeats.length > 0 && (
          <div className="text-xl font-bold mt-2">
            Сумма:
            {' '}
            {totalPrice}
            {' '}
            ₽
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          {t('back')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedSeats.length === 0}
        >
          {t('continue')}
        </Button>
      </div>
    </div>
  )
}
