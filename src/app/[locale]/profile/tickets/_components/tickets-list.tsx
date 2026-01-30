'use client'

import type { CinemaOrder } from '@/shared/api/generated'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { TicketCard } from './ticket-card'

interface TicketsListProps {
  orders: CinemaOrder[]
}

export function TicketsList({ orders }: TicketsListProps) {
  const { t } = useTypedI18n('tickets')
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')

  const filteredOrders = orders.filter((order) => {
    const seanceDateStr = order.tickets[0]?.seance.date
    const seanceTimeStr = order.tickets[0]?.seance.time

    if (!seanceDateStr || !seanceTimeStr) {
      return false
    }

    const isPayed = order.status === 'PAYED'
    const isCanceled = order.status === 'CANCELED' || order.tickets.some(t => t.status === 'CANCELED')

    if (activeTab === 'active') {
      return isPayed && !isCanceled
    }
    else {
      return isCanceled
    }
  })

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'active' | 'history')} className="w-full">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="active" className="flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-all w-[162px]">
            {t('active')}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-all w-[162px]">
            {t('history')}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map(order => (
          <TicketCard
            key={order._id}
            order={order}
            variant={activeTab}
          />
        ))}
        {filteredOrders.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {activeTab === 'active' ? t('no_active_tickets') : t('no_history_tickets')}
          </div>
        )}
      </div>
    </div>
  )
}
