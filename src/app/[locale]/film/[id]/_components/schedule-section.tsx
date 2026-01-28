'use client'

import type { FilmSchedule, FilmScheduleSeance } from '@/shared/api/generated'

import { useEffect, useState } from 'react'

import { useGetApiCinemaFilmByFilmIdScheduleQuery } from '@/shared/api/generated/hooks/cinema/useGetApiCinemaFilmByFilmIdScheduleQuery.gen'
import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group'
import { useTypedI18n } from '@/shared/i18n/client'

interface ScheduleSectionProps {
  filmId: string
}

function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split('.')
  const fullYear = year.length === 2 ? `20${year}` : year
  const date = new Date(`${fullYear}-${month}-${day}`)

  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

function groupSeancesByHall(seances: FilmScheduleSeance[]) {
  const grouped: Record<string, FilmScheduleSeance[]> = {}

  seances.forEach((seance) => {
    const hallName = seance.hall.name
    if (!grouped[hallName]) {
      grouped[hallName] = []
    }
    grouped[hallName].push(seance)
  })

  return grouped
}

const HALL_ORDER = ['Красный зал', 'Синий зал', 'Фиолетовый зал']

export function ScheduleSection({ filmId }: ScheduleSectionProps) {
  const { t: tFilms } = useTypedI18n('films')
  const { t: tCommon } = useTypedI18n('common')
  const [selectedSeance, setSelectedSeance] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)

  const { data: scheduleResponse } = useGetApiCinemaFilmByFilmIdScheduleQuery({
    request: {
      path: { filmId },
    },
  })

  const schedules = scheduleResponse?.data?.schedules
  const hasSchedules = !!schedules?.length

  useEffect(() => {
    if (hasSchedules && !selectedDate && schedules[0]?.date) {
      setSelectedDate(schedules[0].date)
    }
  }, [hasSchedules, selectedDate, schedules])

  const activeDate = selectedDate || (hasSchedules ? schedules[0]?.date : undefined)
  const activeSchedule = schedules?.find(s => s.date === activeDate) || (hasSchedules ? schedules[0] : null)

  if (!hasSchedules) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-title-h3">
          {tFilms('schedule')}
        </h2>
        <p className="text-paragraph-14 text-muted-foreground">
          {tFilms('noSessions')}
        </p>
      </div>
    )
  }

  if (!activeSchedule) {
    return null
  }

  const currentSchedule = activeSchedule as unknown as FilmSchedule
  const groupedSeances = currentSchedule.seances ? groupSeancesByHall(currentSchedule.seances) : {}
  const sortedHallNames = Object.keys(groupedSeances).sort((a, b) => {
    const indexA = HALL_ORDER.indexOf(a)
    const indexB = HALL_ORDER.indexOf(b)
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
  })

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-title-h3">
        {tFilms('schedule')}
      </h2>

      <Tabs
        value={activeDate}
        onValueChange={setSelectedDate}
        className="w-full"
      >
        <TabsList className="mb-6 flex-wrap h-auto">
          {schedules.map(scheduleItem => (
            <TabsTrigger
              key={scheduleItem.date}
              value={scheduleItem.date}
            >
              {formatDate(scheduleItem.date)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-6">
        {sortedHallNames.map(hallName => (
          <div key={hallName} className="flex flex-col gap-4">
            <span className="text-paragraph-14 text-muted-foreground ml-1">
              {tFilms(hallName as 'Red' | 'Blue' | 'Purple')}
            </span>

            <ToggleGroup
              type="single"
              variant="outline"
              spacing={2}
              value={selectedSeance || ''}
              onValueChange={(val) => {
                if (val) {
                  setSelectedSeance(val)
                }
              }}
            >
              {groupedSeances[hallName].map(seance => (
                <ToggleGroupItem
                  key={seance.time + hallName}
                  value={`${seance.time}-${hallName}`}
                  className="w-[102px]"
                >
                  {seance.time}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        ))}

        {sortedHallNames.length === 0 && (
          <p className="text-paragraph-14 text-muted-foreground">
            {tFilms('noSessionsOnDate')}
          </p>
        )}
      </div>

      <Button size="lg" className="w-full md:w-[300px]" disabled={!selectedSeance}>
        {tCommon('continue')}
      </Button>
    </div>
  )
}
