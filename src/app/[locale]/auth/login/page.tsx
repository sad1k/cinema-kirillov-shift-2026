'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { postApiAuthOtp, postApiUsersSignin } from '@/shared/api/generated'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { useSession } from '@/shared/session/session-provider'

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
})

const otpSchema = z.object({
  phone: z.string(),
  code: z.coerce.number().min(1000, 'Code must be at least 4 digits'),
})

type Step = 'PHONE' | 'OTP'

export default function LoginPage() {
  const { t } = useTypedI18n('common')
  const router = useRouter()
  const { login } = useSession()
  const [step, setStep] = useState<Step>('PHONE')

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step === 'PHONE' ? phoneSchema : otpSchema),
    defaultValues: {
      phone: '',
      code: '',
    },
  })

  const { mutate: sendOtp, isPending: isSendingOtp, error: otpError } = useMutation({
    mutationFn: (phone: string) => postApiAuthOtp({ body: { phone } }),
    onSuccess: (response) => {
      if (response.data.success) {
        setStep('OTP')
      }
    },
  })

  const { mutate: signIn, isPending: isSigningIn, error: signInError } = useMutation({
    mutationFn: (data: { phone: string, code: number }) =>
      postApiUsersSignin({ body: data }),
    onSuccess: (response) => {
      if (response.data.success && response.data.token && response.data.user) {
        login(response.data.token, response.data.user)
        router.push('/profile')
      }
    },
  })

  const onSubmit = (data: { phone: string, code: string | number }) => {
    if (step === 'PHONE') {
      sendOtp(data.phone)
    }
    else {
      signIn({ phone: data.phone, code: Number(data.code) })
    }
  }

  const handleRetry = () => {
    sendOtp(getValues('phone'))
  }

  return (
    <div className="mx-auto mt-20 max-w-[400px]">
      <div className="mb-8">
        <h1 className="mb-2 text-heading-2 font-bold">{t('login')}</h1>
        {step === 'OTP' && (
          <p className="text-paragraph-14 text-muted-foreground">
            Введите проверочный код для входа в личный кабинет
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <Input
            {...register('phone')}
            placeholder="Телефон"
            disabled={step === 'OTP'}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{String(errors.phone.message)}</p>
          )}

          {step === 'OTP' && (
            <>
              <Input
                {...register('code')}
                placeholder="Проверочный код"
                type="number"
              />
              {errors.code && (
                <p className="text-sm text-destructive">{String(errors.code.message)}</p>
              )}
            </>
          )}
        </div>

        {(otpError || signInError) && (
          <p className="text-sm text-destructive">
            {otpError?.message || signInError?.message || 'Произошла ошибка'}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-brand hover:bg-brand/90"
          disabled={isSendingOtp || isSigningIn}
        >
          {step === 'PHONE' ? t('continue') : t('login')}
        </Button>

        {step === 'OTP' && (
          <button
            type="button"
            onClick={handleRetry}
            className="text-paragraph-14 text-muted-foreground underline hover:text-foreground"
          >
            Отправить ещё раз
          </button>
        )}
      </form>
    </div>
  )
}
