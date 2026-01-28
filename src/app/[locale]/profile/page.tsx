'use client'

import type { I18KeyType } from '@/shared/i18n'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { z } from 'zod'
import { ProfileSkeleton } from '@/app/[locale]/profile/_components/profile-skeleton'
import { getApiUsersSessionOptions, useGetApiUsersSessionSuspenseQuery, usePatchApiUsersProfileMutation } from '@/shared/api/generated'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { useRouter } from '@/shared/i18n/i18n.routing'
import { useSession } from '@/shared/session/session-provider'

const createProfileSchema = (t: (key: I18KeyType<'common'>) => string) => z.object({
  lastname: z.string().min(1, t('required')),
  firstname: z.string().min(1, t('required')),
  middlename: z.string().min(1, t('required')),
  phone: z.string(),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().optional(),
})

type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>

export default function ProfilePage() {
  const { t } = useTypedI18n('profile')
  const { t: tCommon } = useTypedI18n('common')
  const { data: userRaw, isLoading } = useGetApiUsersSessionSuspenseQuery()
  const { logout } = useSession()
  const router = useRouter()

  const isAuth = userRaw?.data.success
  const user = userRaw?.data.user

  const queryClient = useQueryClient()

  const schema = createProfileSchema(tCommon)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lastname: user?.lastname || '',
      firstname: user?.firstname || '',
      middlename: user?.middlename || '',
      phone: user?.phone || '',
      email: user?.email || '',
      city: user?.city || '',
    },
  })

  const { mutate: updateProfile, isPending } = usePatchApiUsersProfileMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries(getApiUsersSessionOptions())
      },
    },
  })

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile({
      body: {
        profile: {
          lastname: data.lastname,
          firstname: data.firstname,
          middlename: data.middlename,
          email: data.email || undefined,
          city: data.city || undefined,
        },
        phone: data.phone,
      },
    })
  }

  const onLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!isAuth || !user) {
    return null
  }

  return (
    <div className="mx-auto mt-8 max-w-[600px] px-4">
      <h2 className="mb-6 text-2xl font-bold text-foreground">{tCommon('profile')}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lastname">
              {t('lastname')}
              *
            </Label>
            <Input id="lastname" {...register('lastname')} placeholder={t('lastname')} />
            {errors.lastname && (
              <p className="text-sm text-destructive">
                {errors.lastname.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstname">
              {t('firstname')}
              *
            </Label>
            <Input id="firstname" {...register('firstname')} placeholder={t('firstname')} />
            {errors.firstname && (
              <p className="text-sm text-destructive">
                {errors.firstname.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="middlename">
              {t('middlename')}
              *
            </Label>
            <Input id="middlename" {...register('middlename')} placeholder={t('middlename')} />
            {errors.middlename && (
              <p className="text-sm text-destructive">
                {errors.middlename.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              {t('phone')}
              *
            </Label>
            <Input id="phone" {...register('phone')} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              {t('email')}
            </Label>
            <Input id="email" {...register('email')} placeholder={t('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">
              {t('city')}
            </Label>
            <Input id="city" {...register('city')} placeholder={t('city')} />
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" type="button" onClick={onLogout}>
            {tCommon('logout')}
          </Button>
          <Button type="submit" className="flex-1 bg-brand hover:bg-brand/90" disabled={isPending}>
            {t('update_data')}
          </Button>
        </div>
      </form>
    </div>
  )
}
