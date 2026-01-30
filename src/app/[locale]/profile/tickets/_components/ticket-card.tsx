'use client'

import type { CinemaOrder } from '@/shared/api/generated'
import { useQueryClient } from '@tanstack/react-query'

import { useState } from 'react'
import { getApiCinemaOrdersOptions, usePutApiCinemaOrdersCancelMutation } from '@/shared/api/generated'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { RefundDialog } from './refund-dialog'

interface TicketCardProps {
  order: CinemaOrder
  variant: 'active' | 'history'
}

export function TicketCard({ order, variant }: TicketCardProps) {
  const { t } = useTypedI18n('tickets')
  const [isRefundOpen, setIsRefundOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate, isPending } = usePutApiCinemaOrdersCancelMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries(getApiCinemaOrdersOptions())
        setIsRefundOpen(false)
      },
      onError: () => {
        setIsRefundOpen(false)
      },
    },
  })

  const filmName = order.film.name
  const ticket = order.tickets[0]
  if (!ticket) {
    return null
  }

  const seanceDate = ticket.seance.date
  const seanceTime = ticket.seance.time

  const row = order.tickets[0].row
  const seats = order.tickets.map(t => t.column).join(', ')
  const placesText = `${row} ${t('row')}, ${seats} ${t('seats')}`

  const isCancelled = order.status === 'CANCELED'

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    mutate({
      body: { orderId: order._id },
    })
  }

  return (
    <>
      <Card>
        <CardContent className="w-full">
          <div className="mb-4 flex justify-between text-sm text-muted-foreground">
            <span>{seanceDate}</span>
            <span>{seanceTime}</span>
          </div>

          <h3 className="mb-2 text-lg font-bold leading-tight text-center">{filmName}</h3>

          <p className="mb-4 text-sm text-muted-foreground text-center">
            {placesText}
          </p>

          <div className="flex items-center justify-between">
            <div>
              {variant === 'active'
                ? (
                    <Badge variant="success">
                      {t('paid')}
                    </Badge>
                  )
                : (
                    <Badge variant={isCancelled ? 'error' : 'success'}>
                      {isCancelled ? t('cancelled') : t('paid')}
                    </Badge>
                  )}
            </div>

            <div className="text-xs text-muted-foreground">
              {t('ticket_code')}
              {' '}
              {order.orderNumber}
            </div>
          </div>

          {variant === 'active' && (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setIsRefundOpen(true)}
            >
              {t('refund_ticket')}
            </Button>
          )}
        </CardContent>
      </Card>

      <RefundDialog
        open={isRefundOpen}
        onOpenChange={setIsRefundOpen}
        onConfirm={handleConfirm}
        isLoading={isPending}
      />
    </>
  )
}
