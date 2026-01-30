'use client'

import type { UserDetails } from '../../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useTypedI18n } from '@/shared/i18n/client'
import { useSession } from '@/shared/providers/session/session-provider'
import { userDetailsSchema } from '../../types'

interface BookingStepTwoProps {
  onSubmit: (data: UserDetails) => void
  handleBack: () => void
}

export function BookingStepTwo({ onSubmit, handleBack }: BookingStepTwoProps) {
  const { user } = useSession()
  const { t } = useTypedI18n('booking')

  const { register, handleSubmit, formState: { errors } } = useForm<UserDetails>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      middlename: user?.middlename || '',
      phone: user?.phone || '',
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">{t('enterData')}</h2>

      <form id="step-2-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lastname">
            {t('lastname')}
            *
          </Label>
          <Input
            id="lastname"
            placeholder={t('lastname')}
            {...register('lastname')}
          />
          {errors.lastname && (
            <span className="text-xs text-destructive">{errors.lastname.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstname">
            {t('firstname')}
            *
          </Label>
          <Input
            id="firstname"
            placeholder={t('firstname')}
            {...register('firstname')}
          />
          {errors.firstname && (
            <span className="text-xs text-destructive">{errors.firstname.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="middlename">{t('middlename')}</Label>
          <Input
            id="middlename"
            placeholder={t('middlename')}
            {...register('middlename')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            {t('phone')}
            *
          </Label>
          <Input
            id="phone"
            placeholder={t('phone')}
            {...register('phone')}
          />
          {errors.phone && (
            <span className="text-xs text-destructive">{errors.phone.message}</span>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            {t('back')}
          </Button>
          <Button
            type="submit"
            disabled={Object.keys(errors).length > 0}
          >
            {t('continue')}
          </Button>
        </div>
      </form>
    </div>
  )
}
