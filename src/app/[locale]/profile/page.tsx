'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LogoutDialog } from '@/app/[locale]/profile/_components/logout-dialog'
import { HeaderController } from '@/app/_components/header-controller'
import { getApiUsersSessionOptions, useGetApiUsersSessionSuspenseQuery, usePatchApiUsersProfileMutation } from '@/shared/api/generated'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { useRouter } from '@/shared/i18n/i18n.routing'
import { useSession } from '@/shared/providers/session/session-provider'

const profileSchema = z.object({
  lastname: z.string().min(1, 'required'),
  firstname: z.string().min(1, 'required'),
  middlename: z.string().min(1, 'required'),
  phone: z.string(),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { t } = useTypedI18n('profile')
  const { t: tCommon } = useTypedI18n('common')
  const { data: userRaw } = useGetApiUsersSessionSuspenseQuery()
  const { logout } = useSession()
  const router = useRouter()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const isAuth = userRaw?.data.success
  const user = userRaw?.data.user

  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
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

  const onLogoutClick = () => {
    setIsLogoutModalOpen(true)
  }

  const onLogoutConfirm = () => {
    logout()
    router.push('/')
  }

  if (!isAuth || !user) {
    return null
  }

  return (
    <div className="mt-0 max-w-[600px] md:mt-4">
      <HeaderController
        title="Профиль"
        rightAction={(
          <Button variant="ghost" size="icon" onClick={onLogoutClick} className="-ml-2">
            <LogOut className="size-5 text-brand" />
          </Button>
        )}
      />
      <h2 className="mb-4 text-2xl font-bold text-foreground hidden md:inline-block">{tCommon('profile')}</h2>

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

        <div className="flex flex-col md:flex-row gap-4">
          <Button variant="outline" type="button" onClick={onLogoutClick}>
            {tCommon('logout')}
          </Button>
          <Button type="submit" className="flex-1 bg-brand hover:bg-brand/90" disabled={isPending}>
            {t('update_data')}
          </Button>
        </div>
      </form>
      <LogoutDialog
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={onLogoutConfirm}
      />
    </div>
  )
}
