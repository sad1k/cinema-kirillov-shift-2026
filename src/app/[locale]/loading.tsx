import type { I18nLocale } from '@/shared/i18n/server'
import { HeaderController } from '@/app/_components/header-controller'
import { getTypedServerI18n } from '@/shared/i18n/server'
import { FilmCardSkeleton } from './_components/film-card-skeleton'

export default async function HomeLoading() {
  const { t } = await getTypedServerI18n('ru', 'main')
  return (
    <>
      <HeaderController title={t('home.title')} leftAction="back" />
      <section className="flex flex-col gap-6">
        <div className="hidden h-[34px] w-32 md:block">
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <FilmCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </>
  )
}
