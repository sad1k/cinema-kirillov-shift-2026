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
import { useStepper } from './use-stepper'

interface StepConfig {
  titleKey: 'step1Title' | 'step2Title' | 'step3Title'
  component: React.ReactNode
}

interface BookingStepsContainerProps {
  filmId: string
  date: string
  time: string
  hall: string
}

export function BookingStepsContainer({ filmId, date, time, hall }: BookingStepsContainerProps) {
  const { t } = useTypedI18n('booking')
  const router = useRouter()

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

  const { mutate: pay, isPending } = usePostApiCinemaPaymentMutation()

  const { currentStep, totalSteps, progress, goNext, goBack, goTo } = useStepper({
    totalSteps: 3,
  })

  const handleBack = () => {
    const shouldExit = goBack()
    if (shouldExit) {
      router.back()
    }
  }

  const handleStepTwoSubmit = (data: UserDetails) => {
    setUserDetails(data)
    goTo(3)
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
        sessionStorage.setItem('last_order', JSON.stringify(data.data.order))
        router.push(`/film/${filmId}/booking/success?orderId=${data.data.order._id}`)
      },
    })
  }

  const steps: StepConfig[] = [
    {
      titleKey: 'step1Title',
      component: (
        <Suspense fallback={<BookingStepSkeleton />}>
          <BookingStepOne
            filmId={filmId}
            date={date}
            time={time}
            hall={hall}
            selectedSeats={selectedSeats}
            onChange={setSelectedSeats}
            handleNext={goNext}
            handleBack={handleBack}
          />
        </Suspense>
      ),
    },
    {
      titleKey: 'step2Title',
      component: (
        <BookingStepTwo
          onSubmit={handleStepTwoSubmit}
          handleBack={handleBack}
        />
      ),
    },
    {
      titleKey: 'step3Title',
      component: (
        <BookingStepThree
          onSubmit={handlePayment}
          onBack={handleBack}
          isLoading={isPending}
        />
      ),
    },
  ]

  const currentStepConfig = steps[currentStep - 1]

  return (
    <div className="flex flex-col gap-8 w-full md:w-fit">
      <HeaderController
        title={t(currentStepConfig.titleKey)}
        leftAction="back"
        onLeftClick={handleBack}
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-title-h2">{t(currentStepConfig.titleKey)}</h1>
        <div className="flex items-center gap-2">
          <Progress value={progress} />
        </div>
        <p className="text-paragraph-14 text-muted-foreground">
          {t('step')}
          {' '}
          {currentStep}
          {' '}
          {t('of')}
          {' '}
          {totalSteps}
        </p>
      </div>

      <div className="min-h-[400px]">
        {currentStepConfig.component}
      </div>
    </div>
  )
}
