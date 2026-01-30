'use client'

import type { Seat } from '../../types'

import { useLocale } from 'next-intl'
import { useState } from 'react'
import { useGetApiCinemaFilmByFilmIdScheduleSuspenseQuery, useGetApiCinemaFilmByFilmIdSuspenseQuery } from '@/shared/api/generated'
import { Button } from '@/shared/components/ui/button'

import { useTypedI18n } from '@/shared/i18n/client'
import { MobileSeatSelection } from '../ui/mobile-seat-selection'
import { SeatMap } from '../ui/seat-map'

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

export function BookingStepOne({ filmId, date, time, hall, selectedSeats, onChange, handleNext, handleBack }: BookingStepOneProps) {
  const { t } = useTypedI18n('booking')
  const locale = useLocale()
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false)

  const { data: filmData } = useGetApiCinemaFilmByFilmIdSuspenseQuery({
    request: { path: { filmId } },
  })
  const film = filmData?.data?.film

  const { data } = useGetApiCinemaFilmByFilmIdScheduleSuspenseQuery({
    request: { path: { filmId } },
  })

  const schedule = data?.data?.schedules?.find(s => s.date === date)
  const seance = schedule?.seances?.find(s => s.time === time && s.hall.name === hall)

  const seats = seance?.hall.places.map((row, rIdx) =>
    row.map((col, cIdx) => ({
      row: rIdx + 1,
      column: cIdx + 1,
      type: col.type,
      price: col.price,
      isAvailable: true,
    })),
  ) ?? [[]]

  const toggleSeat = (seat: Seat) => {
    const exists = selectedSeats.some(s => s.row === seat.row && s.column === seat.column)
    if (exists) {
      onChange(selectedSeats.filter(s => !(s.row === seat.row && s.column === seat.column)))
    }
    else {
      onChange([...selectedSeats, seat])
    }
  }

  if (!seance) {
    return <div>{t('sessionNotFound')}</div>
  }

  const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0)

  const [day, month, shortYear] = date.split('.')
  const year = `20${shortYear}`
  const isoDate = `${year}-${month}-${day}`
  const formattedDate = new Date(isoDate).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
  })

  const SummaryContent = () => (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">
        {film.name}
        {' '}
        (
        {film.ageRating}
        +)
      </h2>
      <div>
        <div className="text-sm text-muted-foreground">{t('hall')}</div>
        <div>{seance.hall.name}</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{t('dateAndTime')}</div>
        <div>
          {formattedDate}
          {' '}
          {seance.time}
        </div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{t('seat')}</div>
        <div>
          {selectedSeats.map((s, i) => (
            <span key={`${s.row}-${s.column}`}>
              {s.row}
              {' '}
              {t('row')}
              {' '}
              -
              {' '}
              {s.column}
              {i < selectedSeats.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>
      <div className="text-xl font-bold mt-2">
        {t('sum')}
        :
        {' '}
        {totalPrice}
        {' '}
        ₽
      </div>
    </div>
  )

  if (isMobileSummaryOpen && film && seance) {
    return (
      <div className="flex flex-col gap-6 md:hidden">
        <SummaryContent />

        <Button onClick={handleNext} className="w-full">
          {t('buy')}
        </Button>
        <Button variant="ghost" onClick={() => setIsMobileSummaryOpen(false)} className="w-full">
          {t('back')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="hidden md:block">
        <SeatMap
          seats={seats}
          selectedSeats={selectedSeats}
          onToggleSeat={toggleSeat}
        />
      </div>

      <div className="md:hidden overflow-y-auto max-h-[300px]">
        <MobileSeatSelection seats={seats} selectedSeats={selectedSeats} onChange={onChange} />
      </div>

      <div className="hidden md:block mt-4">
        {selectedSeats.length > 0
          ? (
              <SummaryContent />
            )
          : (
              <p className="text-muted-foreground text-sm">{t('chooseSeats')}</p>
            )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className="hidden md:flex">
          {t('back')}
        </Button>

        <Button
          onClick={() => setIsMobileSummaryOpen(true)}
          disabled={selectedSeats.length === 0}
          className="md:hidden w-full"
        >
          {t('continue')}
        </Button>

        <Button
          onClick={handleNext}
          disabled={selectedSeats.length === 0}
          className="hidden md:flex"
        >
          {t('continue')}
        </Button>
      </div>
    </div>
  )
}
