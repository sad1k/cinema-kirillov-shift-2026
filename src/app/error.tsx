'use client'
import { Button } from '@/shared/components/ui/button'
import { useTypedI18n } from '@/shared/i18n/client'

// Error boundaries must be Client Components

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  const { t } = useTypedI18n('common')

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <h2>{t('error')}</h2>
      <Button
        onClick={
          () => reset?.()
        }
      >
        {t('try_again')}
      </Button>
    </div>
  )
}
