'use client'

import { useEffect } from 'react'
import { useGetApiCinemaOrdersSuspenseQuery } from '@/shared/api/generated'
import { useMobileHeader } from '@/shared/context/mobile-header-context'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { TicketsList } from './_components/tickets-list'

export default function TicketsPage() {
  const { t } = useTypedI18n('tickets')
  const { data } = useGetApiCinemaOrdersSuspenseQuery()
  const { setHeader } = useMobileHeader()

  useEffect(() => {
    setHeader({
      isVisible: false,
    })
  }, [])

  return (
    <div className="mx-auto mt-8 pb-20">
      <h2 className="mb-6 text-2xl font-bold text-foreground">
        {t('title')}
      </h2>
      <TicketsList orders={data.data.orders} />
    </div>
  )
}
