'use client'

import type { UserDetails } from '../../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useTypedI18n } from '@/shared/i18n/client'
import { useSession } from '@/shared/session/session-provider'
import { userDetailsSchema } from '../../types'

interface BookingStepTwoProps {
  onSubmit: (data: UserDetails) => void
  handleNext: () => void
  handleBack: () => void
}

export function BookingStepTwo({ onSubmit, handleNext, handleBack }: BookingStepTwoProps) {
  const { user } = useSession()
  const { t } = useTypedI18n('common')

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
      <h2 className="text-xl font-semibold">Введите ваши данные</h2>

      <form id="step-2-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lastname">Фамилия*</Label>
          <Input
            id="lastname"
            placeholder="Фамилия"
            {...register('lastname')}
          />
          {errors.lastname && (
            <span className="text-xs text-destructive">{errors.lastname.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstname">Имя*</Label>
          <Input
            id="firstname"
            placeholder="Имя"
            {...register('firstname')}
          />
          {errors.firstname && (
            <span className="text-xs text-destructive">{errors.firstname.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="middlename">Отчество</Label>
          <Input
            id="middlename"
            placeholder="Отчество"
            {...register('middlename')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Номер телефона*</Label>
          <Input
            id="phone"
            placeholder="Телефон"
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
            onClick={handleNext}
            disabled={Object.keys(errors).length > 0}
          >
            {t('continue')}
          </Button>
        </div>
      </form>
    </div>
  )
}
