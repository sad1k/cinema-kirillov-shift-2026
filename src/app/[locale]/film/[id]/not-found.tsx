import { getTypedServerI18n } from '@/shared/i18n/server'

export default async function NotFound() {
  const { t } = await getTypedServerI18n('ru', 'common')

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <h1 className="text-title-h2 mb-2">{t('notFound')}</h1>
        <p className="text-paragraph-14 text-muted-foreground">
          {t('notFoundDescription')}
        </p>
      </div>
    </div>
  )
}
