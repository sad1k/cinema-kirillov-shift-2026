'use client'

import type { FilmScheduleSeance } from '@/shared/api/generated'

import { useLocale } from 'next-intl'

import { useState } from 'react'
import { useGetApiCinemaFilmByFilmIdScheduleSuspenseQuery } from '@/shared/api/generated/hooks/cinema/useGetApiCinemaFilmByFilmIdScheduleSuspenseQuery.gen'
import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group'
import { useTypedI18n } from '@/shared/i18n/client'
import { useRouter } from '@/shared/i18n/i18n.routing'
import { useSession } from '@/shared/providers/session/session-provider'

interface ScheduleSectionProps {
  filmId: string
}

function formatDate(dateString: string, locale: string): string {
  const [day, month, year] = dateString.split('.')
  const fullYear = year.length === 2 ? `20${year}` : year
  const date = new Date(`${fullYear}-${month}-${day}`)

  return new Intl.DateTimeFormat(locale, {
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

export function ScheduleSection({ filmId }: ScheduleSectionProps) {
  const { t: tFilms } = useTypedI18n('films')
  const { t: tCommon } = useTypedI18n('common')
  const { isAuth } = useSession()
  const router = useRouter()
  const locale = useLocale()
  const [selectedSeance, setSelectedSeance] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>()

  const { data: scheduleResponse } = useGetApiCinemaFilmByFilmIdScheduleSuspenseQuery({
    request: {
      path: { filmId },
    },
  })

  const schedules = scheduleResponse?.data?.schedules
  const hasSchedules = !!schedules?.length

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

  const currentSchedule = activeSchedule
  const groupedSeances = currentSchedule.seances ? groupSeancesByHall(currentSchedule.seances) : {}
  const hallNames = Object.keys(groupedSeances)

  const handleContinue = () => {
    if (!isAuth) {
      router.push('/auth/login')
      return
    }
    if (selectedSeance && (selectedDate || activeDate)) {
      const [time, hall] = selectedSeance.split('-')
      router.push({
        pathname: `/film/${filmId}/booking`,
        query: {
          date: selectedDate ?? activeDate,
          time,
          hall,
        },
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 mt-5">
      <h2 className="text-title-h3">
        {tFilms('schedule')}
      </h2>

      <Tabs
        value={activeDate}
        onValueChange={setSelectedDate}
        className="w-full"
        defaultValue={schedules[0]?.date}
      >
        <TabsList className="mb-6 h-auto  w-[calc(100%+32px)] px-4 flex-nowrap md:mx-0 md:w-fit md:px-[2px] md:flex-wrap">
          {schedules.map(scheduleItem => (
            <TabsTrigger
              key={scheduleItem.date}
              value={scheduleItem.date}
            >
              {formatDate(scheduleItem.date, locale)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-6">
        {hallNames.map(hallName => (
          <div key={hallName} className="flex flex-col gap-4">
            <span className="text-paragraph-14 text-muted-foreground ml-1">
              {tFilms(hallName as 'Red' | 'Blue' | 'Purple')}
            </span>

            <ToggleGroup
              type="single"
              variant="outline"
              spacing={2}
              value={selectedSeance || ''}
              className="flex-wrap"
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

        {hallNames.length === 0 && (
          <p className="text-paragraph-14 text-muted-foreground">
            {tFilms('noSessionsOnDate')}
          </p>
        )}
      </div>

      <Button
        className="w-full md:w-[300px]"
        disabled={!selectedSeance}
        onClick={handleContinue}
      >
        {tCommon('continue')}
      </Button>
    </div>
  )
}
