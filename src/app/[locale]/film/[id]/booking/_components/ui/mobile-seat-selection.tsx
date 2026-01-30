'use client'

import type { Seat } from '../../types'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import {
  DrawerSelect,
  DrawerSelectContent,
  DrawerSelectItem,
  DrawerSelectTrigger,
} from '@/shared/components/ui/drawer-select'
import { useTypedI18n } from '@/shared/i18n/client'

interface MobileSeatSelectionProps {
  seats: Seat[][]
  selectedSeats: Seat[]
  onChange: (seats: Seat[]) => void
}

interface TicketItem {
  id: string
  seat: Seat | null
  row: string
  col: string
}

export function MobileSeatSelection({ seats, selectedSeats, onChange }: MobileSeatSelectionProps) {
  const { t } = useTypedI18n('seats')
  const [items, setItems] = useState<TicketItem[]>(() => {
    if (selectedSeats.length > 0) {
      return selectedSeats.map(s => ({
        id: crypto.randomUUID(),
        seat: s,
        row: s.row.toString(),
        col: s.column.toString(),
      }))
    }
    return [{ id: crypto.randomUUID(), seat: null, row: '', col: '' }]
  })

  const updateParent = (newItems: TicketItem[]) => {
    const validSeats = newItems
      .map(item => item.seat)
      .filter((seat): seat is Seat => seat !== null)
    onChange(validSeats)
  }

  const handleAddTicket = () => {
    const newItem: TicketItem = { id: crypto.randomUUID(), seat: null, row: '', col: '' }
    const newItems = [...items, newItem]
    setItems(newItems)
  }

  const handleDeleteTicket = (id: string) => {
    const newItems = items.filter(item => item.id !== id)
    const finalItems = newItems.length === 0
      ? [{ id: crypto.randomUUID(), seat: null, row: '', col: '' }]
      : newItems

    setItems(finalItems)
    updateParent(finalItems)
  }

  const handleRowChange = (id: string, rowVal: string) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, row: rowVal, col: '', seat: null }
      }
      return item
    })
    setItems(newItems)
    updateParent(newItems)
  }

  const handleSeatChange = (id: string, colVal: string) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        const rowIdx = Number.parseInt(item.row) - 1
        const seatObj = seats[rowIdx]?.find(s => s.column === Number.parseInt(colVal)) || null
        return { ...item, col: colVal, seat: seatObj }
      }
      return item
    })
    setItems(newItems)
    updateParent(newItems)
  }

  const rows = seats.map((_, index) => (index + 1).toString())

  const getAvailableSeats = (rowStr: string, currentItemId: string) => {
    if (!rowStr) {
      return []
    }
    const rowIdx = Number.parseInt(rowStr) - 1
    const rowSeats = seats[rowIdx] || []

    return rowSeats.filter((s) => {
      const isTakenByOther = items.some(item =>
        item.id !== currentItemId
        && item.seat?.row === s.row
        && item.seat?.column === s.column,
      )
      return !isTakenByOther
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((item, index) => {
        const availableSeats = getAvailableSeats(item.row, item.id)

        return (
          <div key={item.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t('ticket')}
                {' '}
                {index + 1}
              </span>
              {index > 0 && (
                <button
                  onClick={() => handleDeleteTicket(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-5" />
                </button>
              )}
              {index === 0 && items.length > 1 && (
                <button
                  onClick={() => handleDeleteTicket(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('row')}</label>
                <DrawerSelect
                  value={item.row}
                  onValueChange={val => handleRowChange(item.id, val)}
                >
                  <DrawerSelectTrigger placeholder={t('select')} />
                  <DrawerSelectContent title={t('selectRow')}>
                    {rows.map(row => (
                      <DrawerSelectItem key={row} value={row}>
                        {row}
                      </DrawerSelectItem>
                    ))}
                  </DrawerSelectContent>
                </DrawerSelect>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('seat')}</label>
                <DrawerSelect
                  value={item.col}
                  onValueChange={val => handleSeatChange(item.id, val)}
                >
                  <DrawerSelectTrigger
                    placeholder={t('select')}
                    className={!item.row ? 'opacity-50 pointer-events-none' : ''}
                  />
                  <DrawerSelectContent title={t('selectSeat')}>
                    {availableSeats.map(seat => (
                      <DrawerSelectItem key={seat.column} value={seat.column.toString()}>
                        <span className="text-paragraph-16">
                          {seat.column}
                          ,
                          {' '}
                          <span className="text-content-05 pl-2">
                            {seat.price}
                            {' '}
                            ₽
                          </span>
                        </span>
                      </DrawerSelectItem>
                    ))}
                  </DrawerSelectContent>
                </DrawerSelect>
              </div>
            </div>
          </div>
        )
      })}

      <Button
        variant="outline"
        className="w-full"
        onClick={handleAddTicket}
      >
        {t('moreTicket')}
      </Button>

    </div>
  )
}
