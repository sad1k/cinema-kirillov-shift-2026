import type { PaymentDetails, Seat, UserDetails } from '../types'
import { useState } from 'react'
import { usePostApiCinemaPaymentMutation } from '@/shared/api/generated'
import { useRouter } from '@/shared/i18n/i18n.routing'
import { cn } from '@/shared/lib/utils'
import { BookingStepOne } from './steps/booking-step-one'
import { BookingStepThree } from './steps/booking-step-three'
import { BookingStepTwo } from './steps/booking-step-two'

interface BookingStepsContainerProps {
  filmId: string
  date: string
  time: string
  hall: string
}

export function BookingStepsContainer({ filmId, date, time, hall }: BookingStepsContainerProps) {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

  const { mutate: pay, isPending } = usePostApiCinemaPaymentMutation()

  const handleBack = () => {
    if (currentStep === 1) {
      router.back()
    }
    else {
      setCurrentStep(prev => (prev - 1) as 1 | 2 | 3)
    }
  }

  const handleStepTwoSubmit = (data: UserDetails) => {
    setUserDetails(data)
    setCurrentStep(3)
  }

  const handlePayment = (paymentData: PaymentDetails) => {
    if (!userDetails || selectedSeats.length === 0) { return }

    pay({
      body: {
        filmId,
        person: {
          firstname: userDetails.firstname,
          lastname: userDetails.lastname,
          middlename: userDetails.middlename || '-',
          phone: userDetails.phone,
        },
        debitCard: {
          pan: paymentData.pan,
          expireDate: paymentData.expireDate,
          cvv: paymentData.cvv,
        },
        seance: {
          date,
          time,
        },
        tickets: selectedSeats.map(s => ({
          row: s.row,
          column: s.column,
        })),
      },
    }, {
      onSuccess: () => {
        router.push('/profile/tickets')
      },
      onError: () => {
        // alert('Ошибка при оплате')
      },
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-title-h2">Выбор места</h1>
        <div className="flex items-center gap-2">
          <div className={cn('h-1 flex-1 rounded-full', currentStep >= 1 ? 'bg-primary' : 'bg-muted')} />
          <div className={cn('h-1 flex-1 rounded-full', currentStep >= 2 ? 'bg-primary' : 'bg-muted')} />
          <div className={cn('h-1 flex-1 rounded-full', currentStep >= 3 ? 'bg-primary' : 'bg-muted')} />
        </div>
        <p className="text-paragraph-14 text-muted-foreground">
          Шаг
          {' '}
          {currentStep}
          {' '}
          из 3
        </p>
      </div>

      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <BookingStepOne
            filmId={filmId}
            date={date}
            time={time}
            hall={hall}
            selectedSeats={selectedSeats}
            onChange={setSelectedSeats}
            handleNext={() => setCurrentStep(2)}
            handleBack={handleBack}
          />
        )}

        {currentStep === 2 && (
          <BookingStepTwo
            onSubmit={handleStepTwoSubmit}
            handleNext={() => setCurrentStep(3)}
            handleBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <BookingStepThree
            onSubmit={handlePayment}
            onBack={handleBack}
            isLoading={isPending}
          />
        )}
      </div>
    </div>
  )
}
