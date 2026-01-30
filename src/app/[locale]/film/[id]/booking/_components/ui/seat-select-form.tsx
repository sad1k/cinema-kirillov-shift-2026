'use client'

import type { Seat } from '../../types'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import {
  DrawerSelect,
  DrawerSelectContent,
  DrawerSelectItem,
  DrawerSelectTrigger as DrawerSelectTriggerComp,
} from '@/shared/components/ui/drawer-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useTypedI18n } from '@/shared/i18n/client'

interface SeatSelectFormProps {
  seats: Seat[][]
  onAddSeat: (seat: Seat) => void
}

export function SeatSelectForm({ seats, onAddSeat }: SeatSelectFormProps) {
  const { t } = useTypedI18n('seats')
  const [selectedRow, setSelectedRow] = useState<string>('')
  const [selectedSeat, setSelectedSeat] = useState<string>('')

  const rows = seats.map((_, index) => (index + 1).toString())

  const currentRowSeats = selectedRow
    ? seats[Number.parseInt(selectedRow) - 1]
    : []

  const availableSeats = currentRowSeats.filter(s => s.price > 0)

  const handleAdd = () => {
    if (selectedRow && selectedSeat) {
      const rowIdx = Number.parseInt(selectedRow) - 1
      const seat = seats[rowIdx].find(s => s.column === Number.parseInt(selectedSeat))

      if (seat) {
        onAddSeat(seat)
        setSelectedSeat('')
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('row')}</label>
          <div className="hidden md:block">
            <Select
              value={selectedRow}
              onValueChange={(val) => {
                setSelectedRow(val)
                setSelectedSeat('')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('select')} />
              </SelectTrigger>
              <SelectContent>
                {rows.map(row => (
                  <SelectItem key={row} value={row}>{row}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="block md:hidden">
            <DrawerSelect
              value={selectedRow}
              onValueChange={(val) => {
                setSelectedRow(val)
                setSelectedSeat('')
              }}
            >
              <DrawerSelectTriggerComp placeholder={t('select')} />
              <DrawerSelectContent title={t('selectRow')}>
                {rows.map(row => (
                  <DrawerSelectItem key={row} value={row}>
                    {row}
                  </DrawerSelectItem>
                ))}
              </DrawerSelectContent>
            </DrawerSelect>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('seat')}</label>
          <div className="hidden md:block">
            <Select
              value={selectedSeat}
              onValueChange={setSelectedSeat}
              disabled={!selectedRow}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('select')} />
              </SelectTrigger>
              <SelectContent>
                {availableSeats.map(seat => (
                  <SelectItem key={seat.column} value={seat.column.toString()}>
                    {seat.column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="block md:hidden">
            <DrawerSelect
              value={selectedSeat}
              onValueChange={setSelectedSeat}
            >
              <DrawerSelectTriggerComp
                placeholder={t('select')}
                className={!selectedRow ? 'opacity-50 pointer-events-none' : ''}
              />
              <DrawerSelectContent title={t('selectSeat')}>
                {availableSeats.map(seat => (
                  <DrawerSelectItem key={seat.column} value={seat.column.toString()}>
                    <span className="text-paragraph-16">
                      {seat.column}
                      ,
                      <span className="text-content-05 pl-2">
                        {seat.price}
                        {'  '}
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

      <Button
        variant="outline"
        className="w-full"
        disabled={!selectedRow || !selectedSeat}
        onClick={handleAdd}
      >
        {t('moreTicket')}
      </Button>
    </div>
  )
}
