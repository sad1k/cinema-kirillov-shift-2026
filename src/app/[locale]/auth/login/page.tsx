'use client'

import type { ResponseError } from '@siberiacancode/fetches'
import type { I18KeyType } from '@/shared/i18n'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { usePostApiAuthOtpMutation, usePostApiUsersSigninMutation } from '@/shared/api/generated'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { useRouter } from '@/shared/i18n/i18n.routing'
import { useSession } from '@/shared/session/session-provider'

const createOtpSchema = (tAuth: (key: I18KeyType<'auth'>) => string) => z.object({
  phone: z.string(),
  code: z.coerce.number({ message: tAuth('code_error') }).optional(),
})

export default function LoginPage() {
  const { t } = useTypedI18n('common')
  const { t: tAuth } = useTypedI18n('auth')
  const router = useRouter()
  const { login } = useSession()
  const [otpSent, setOtpSent] = useState(false)

  const otpSchema = createOtpSchema(tAuth)

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      phone: '',
      code: undefined,
    },
  })

  const { mutate: sendOtp, isPending: isSendingOtp, data: dataOtp } = usePostApiAuthOtpMutation({
    params: {
      onSuccess: (response) => {
        const data = response.data
        if (data.success) {
          setOtpSent(true)
        }
      },
    },
  })

  const otpError = dataOtp && !dataOtp?.data?.success

  const { mutate: signIn, isPending: isSigningIn, data: dataSignIn } = usePostApiUsersSigninMutation({
    params: {
      onSuccess: (response) => {
        const data = response.data
        if (data.success && data.token && data.user) {
          login(data.token, data.user)
          router.push('/')
        }
      },
      onError: (error: ResponseError) => {
        if (error.response?.data?.reason) {
          setError('code', {
            type: 'server',
            message: error.response.data.reason,
          })
        }
      },
    },
  })

  const signInError = dataSignIn && !dataSignIn?.data?.success

  const onSubmit = (data: { phone: string, code?: string | number }) => {
    if (!otpSent) {
      sendOtp({ body: { phone: data.phone } })
    }
    else {
      signIn({ body: { phone: data.phone, code: Number(data.code) } })
    }
  }

  const handleRetry = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    sendOtp({ body: { phone: getValues('phone') } })
  }

  return (
    <div className="mx-auto mt-20 max-w-[400px]">
      <div className="mb-8">
        <h1 className="mb-2 text-heading-2 font-bold">{tAuth('authorization')}</h1>
        {otpSent && (
          <p className="text-paragraph-14 text-muted-foreground">
            {tAuth('auth_tooltip')}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <Input
            {...register('phone')}
            placeholder="Телефон"
            disabled={otpSent}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{String(errors.phone.message)}</p>
          )}

          {otpSent && (
            <>
              <Input
                {...register('code')}
                placeholder="Проверочный код"
                type="number"
              />
              {errors?.code && (
                <p className="text-sm text-destructive">{String(errors?.code?.message)}</p>
              )}
            </>
          )}
        </div>

        {(otpError || signInError) && (
          <p className="text-sm text-destructive">
            {t('error')}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-brand hover:bg-brand/90"
          disabled={isSendingOtp || isSigningIn}
        >
          {otpSent ? t('login') : t('continue')}
        </Button>

        {otpSent && (
          <Button
            type="button"
            onClick={handleRetry}
            variant="link"
            className="text-paragraph-14 text-muted-foreground underline hover:text-foreground p-0"
          >
            {t('retry')}
          </Button>
        )}
      </form>
    </div>
  )
}
