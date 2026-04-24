'use client'

import type { CinemaOrder } from '@/shared/api/generated'
import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { Loader2, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { HeaderController } from '@/app/_components/header-controller'
import { useGetApiCinemaOrdersQuery } from '@/shared/api/generated/hooks/cinema/useGetApiCinemaOrdersQuery.gen'
import { Button } from '@/shared/components/ui/button'
import { useTypedI18n } from '@/shared/i18n/client'
import { Link } from '@/shared/i18n/i18n.routing'
import { AcceptIcon } from '@/shared/icons/accept-icon'

function CloseButton() {
  const router = useRouter()
  return (
    <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
      <X className="size-6" />
    </Button>
  )
}

export default function SuccessOrderPage() {
  const { t } = useTypedI18n('booking')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const { data, isLoading: isQueryLoading } = useGetApiCinemaOrdersQuery()
  const [savedOrder, setSavedOrder] = useState<CinemaOrder>()

  useEffect(() => {
    const saved = sessionStorage.getItem('last_order')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed._id === orderId) {
          setSavedOrder(parsed)
        }
      }
      catch (e) {
        console.error('Failed to parse saved order', e)
      }
    }
  }, [orderId])

  const order = useMemo(() => {
    if (savedOrder && savedOrder._id === orderId) {
      return savedOrder
    }
    return data?.data?.orders.find(order => order._id === orderId)
  }, [data, orderId, savedOrder])

  if (isQueryLoading && !savedOrder) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return <Loader2 className="animate-spin text-primary" />
  }

  const { film, tickets, orderNumber } = order
  const firstTicket = tickets[0]
  const { date, time } = firstTicket.seance
  const rows = Array.from(new Set(tickets.map(t => t.row))).join(', ')
  const seats = tickets.map(t => t.column).join(', ')

  const [day, month, year] = date.split('.')
  const fullYear = year.length === 2 ? `20${year}` : year
  const dateFnsLocale = locale === 'ru' ? ru : enUS
  const formattedDate = format(new Date(`${fullYear}-${month}-${day}T${time}`), 'd MMMM HH:mm', {
    locale: dateFnsLocale,
  })

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[800px] flex-col justify-center p-4 md:items-center">
      <HeaderController title="" rightAction={<CloseButton />} />
      <div className="relative flex w-full flex-col md:p-10">

        <div className="mb-8 flex flex-col items-center md:mb-10 md:flex-row md:gap-6">
          <AcceptIcon className="size-14 md:size-16" />
          <h1 className="mt-6 text-title-h2 text-center md:mt-0 md:text-left">
            {t('successTitle')}
          </h1>
        </div>

        <div className="w-full rounded-2xl border border-borderextralight px-12 py-6 mb-8 grid gap-6 pb-8 md:mb-12 md:max-w-[400px]">
          <div>
            <div className="mb-1 text-paragraph-12 text-gray-500">{t('orderNumber')}</div>
            <div className="text-paragraph-16">{orderNumber}</div>
          </div>

          <div>
            <div className="mb-1 text-paragraph-12 text-gray-500">{t('film')}</div>
            <div className="text-paragraph-16">{film.name}</div>
          </div>

          <div>
            <div className="mb-1 text-paragraph-12 text-gray-500">{t('dateAndTime')}</div>
            <div className="text-paragraph-16">{formattedDate}</div>
          </div>

          <div>
            <div className="mb-1 text-paragraph-12 text-gray-500">{t('row')}</div>
            <div className="text-paragraph-16">{rows}</div>
          </div>

          <div>
            <div className="mb-1 text-paragraph-12 text-gray-500">{t('seat')}</div>
            <div className="text-paragraph-16">{seats}</div>
          </div>

          <div className="text-paragraph-12 text-gray-400">
            {t('successMessage')}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <Link href="/profile/tickets" className="w-full md:w-auto">
            <Button
              variant="outline"
              className="w-full md:w-auto"
            >
              {t('orderNumber')}
            </Button>
          </Link>
          <Link href="/" className="w-full md:w-auto">
            <Button
              className="w-full md:w-auto"
            >
              {t('goToMain')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
