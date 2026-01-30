'use client'
import type { PaymentDetails, Seat, UserDetails } from '../types'
import { Suspense, useState } from 'react'
import { HeaderController } from '@/app/_components/header-controller'
import { usePostApiCinemaPaymentMutation } from '@/shared/api/generated'
import { Progress } from '@/shared/components/ui/progress'
import { useTypedI18n } from '@/shared/i18n/client'
import { useRouter } from '@/shared/i18n/i18n.routing'
import { BookingStepOne } from './steps/booking-step-one'
import { BookingStepSkeleton } from './steps/booking-step-skeleton'
import { BookingStepThree } from './steps/booking-step-three'

import { BookingStepTwo } from './steps/booking-step-two'

interface BookingStepsContainerProps {
  filmId: string
  date: string
  time: string
  hall: string
}

export function BookingStepsContainer({ filmId, date, time, hall }: BookingStepsContainerProps) {
  const { t } = useTypedI18n('booking')
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
    if (!userDetails || selectedSeats.length === 0) {
      return
    }
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
      onSuccess: (data) => {
        router.push(`/film/${filmId}/booking/success?orderId=${data.data.order._id}`)
      },
    })
  }

  return (
    <div className="flex flex-col gap-8 w-full md:w-fit">
      {currentStep === 1 && (
        <HeaderController title={t('step1Title')} leftAction="back" onLeftClick={handleBack} />
      )}
      {currentStep === 2 && (
        <HeaderController title={t('step2Title')} leftAction="back" onLeftClick={handleBack} />
      )}
      {currentStep === 3 && (
        <HeaderController title={t('step3Title')} leftAction="back" onLeftClick={handleBack} />
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-title-h2">{t('step1Title')}</h1>
        <div className="flex items-center gap-2">
          <Progress value={currentStep * 100 / 3} />
        </div>
        <p className="text-paragraph-14 text-muted-foreground">
          {t('step')}
          {' '}
          {currentStep}
          {' '}
          {t('of')}
          {' '}
          3
        </p>
      </div>

      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <Suspense fallback={<BookingStepSkeleton />}>
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
          </Suspense>
        )}

        {currentStep === 2 && (
          <BookingStepTwo
            onSubmit={handleStepTwoSubmit}
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
