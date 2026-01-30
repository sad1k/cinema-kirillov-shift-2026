'use client'

import type { PaymentDetails } from '../../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useTypedI18n } from '@/shared/i18n/client'

import { paymentSchema } from '../../types'

interface BookingStepThreeProps {
  onSubmit: (data: PaymentDetails) => void
  onBack: () => void
  isLoading?: boolean
}

export function BookingStepThree({ onSubmit, onBack, isLoading }: BookingStepThreeProps) {
  const { t } = useTypedI18n('booking')
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentDetails>({
    resolver: zodResolver(paymentSchema),
  })

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">{t('enterCardData')}</h2>

      <form id="step-3-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-secondary p-6 rounded flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="pan">
              {t('number')}
              *
            </Label>
            <Input
              id="pan"
              placeholder="0000 0000 0000 0000"
              className="bg-background"
              {...register('pan')}
              maxLength={19}
            />
            {errors.pan && (
              <span className="text-xs text-destructive">{errors.pan.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 md:w-[350px]">
            <div className="space-y-2">
              <Label htmlFor="expireDate">
                {t('expire')}
                *
              </Label>
              <Input
                id="expireDate"
                placeholder="00/00"
                className="bg-background"
                {...register('expireDate')}
                maxLength={5}
              />
              {errors.expireDate && (
                <span className="text-xs text-destructive">{errors.expireDate.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">
                {t('cvv')}
                *
              </Label>
              <Input
                id="cvv"
                placeholder="0000"
                className="bg-background"
                {...register('cvv')}
                maxLength={4}
                type="password"
              />
              {errors.cvv && (
                <span className="text-xs text-destructive">{errors.cvv.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
            {t('back')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('paying') : t('pay')}
          </Button>
        </div>
      </form>
    </div>
  )
}
