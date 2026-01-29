import { z } from 'zod'

export interface Seat {
  row: number
  column: number
  type: 'BLOCKED' | 'ECONOM' | 'VIP' | 'COMFORT'
  price: number
  isAvailable: boolean
}

export interface BookingState {
  currentStep: 1 | 2 | 3
  selectedSeats: Seat[]
  filmId: string
  seanceParams: {
    date: string
    time: string
    hall: string
  }
}

export const userDetailsSchema = z.object({
  firstname: z.string().min(1, 'Введите имя'),
  lastname: z.string().min(1, 'Введите фамилию'),
  middlename: z.string().optional(),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
})

export type UserDetails = z.infer<typeof userDetailsSchema>

export const paymentSchema = z.object({
  pan: z.string().min(16, 'Некорректный номер карты'),
  expireDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Формат MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, '3 или 4 цифры'),
})

export type PaymentDetails = z.infer<typeof paymentSchema>
