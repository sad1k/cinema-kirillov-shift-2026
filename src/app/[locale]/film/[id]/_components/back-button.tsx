'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/shared/components/ui/button'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'

export function BackButton() {
  const router = useRouter()
  const { t } = useTypedI18n('common')

  return (
    <Button
      variant="ghost"
      className="gap-2 px-0 text-paragraph-16 hover:bg-transparent"
      onClick={() => router.back()}
    >
      <ChevronLeft className="size-5" />
      {t('back')}
    </Button>
  )
}
