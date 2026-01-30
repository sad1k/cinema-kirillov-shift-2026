import { z } from 'zod'

export interface Seat {
  row: number
  column: number
  type: string
  price: number
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
  firstname: z.string().min(1, 'enter_name'),
  lastname: z.string().min(1, 'enter_surname'),
  middlename: z.string().optional(),
  phone: z.string().min(10, 'enter_phone'),
})

export type UserDetails = z.infer<typeof userDetailsSchema>

export const paymentSchema = z.object({
  pan: z.string().min(16, 'card_number_error'),
  expireDate: z.string().regex(/^\d{2}\/\d{2}$/, 'card_expire_error'),
  cvv: z.string().regex(/^\d{3,4}$/, 'card_cvv_error'),
})

export type PaymentDetails = z.infer<typeof paymentSchema>
