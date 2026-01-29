'use client'

import type { Seat } from '../../types'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useTypedI18n } from '@/shared/i18n/client'

interface SeatSelectFormProps {
  seats: Seat[][]
  onAddSeat: (seat: Seat) => void
}

export function SeatSelectForm({ seats, onAddSeat }: SeatSelectFormProps) {
  const { t } = useTypedI18n('common')
  const [selectedRow, setSelectedRow] = useState<string>('')
  const [selectedSeat, setSelectedSeat] = useState<string>('')

  // Valid rows are indices (0-based) from seats array
  const rows = seats.map((_, index) => (index + 1).toString())

  // Get seats for the selected row
  const currentRowSeats = selectedRow
    ? seats[Number.parseInt(selectedRow) - 1]
    : []

  // Filter available seats in the row
  const availableSeats = currentRowSeats.filter(s => s.isAvailable)

  const handleAdd = () => {
    if (selectedRow && selectedSeat) {
      const rowIdx = Number.parseInt(selectedRow) - 1
      const seat = seats[rowIdx].find(s => s.column === Number.parseInt(selectedSeat))

      if (seat) {
        onAddSeat(seat)
        setSelectedSeat('')
        // Optionally reset row or keep it
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ряд</label>
          <Select
            value={selectedRow}
            onValueChange={(val) => {
              setSelectedRow(val)
              setSelectedSeat('')
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выбрат.." />
            </SelectTrigger>
            <SelectContent>
              {rows.map(row => (
                <SelectItem key={row} value={row}>{row}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Место</label>
          <Select
            value={selectedSeat}
            onValueChange={setSelectedSeat}
            disabled={!selectedRow}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выбрать..." />
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
      </div>

      <Button
        variant="outline"
        className="w-full"
        disabled={!selectedRow || !selectedSeat}
        onClick={handleAdd}
      >
        Ещё билет
      </Button>
    </div>
  )
}
