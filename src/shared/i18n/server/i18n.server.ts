import type {
  I18nLocale,
  I18nReturn,
  I18TFunction,
  Translations,
} from '../i18n.types'
import { getTranslations } from 'next-intl/server'
import { cache } from 'react'
import { routing } from '../i18n.routing'

export const getCachedDictionaries = cache(
  async (locale: I18nLocale): Promise<Array<{ [key: string]: string }>> =>
    Promise.all([
      import(`../messages/${locale}/_common.json`),
      import(`../messages/${locale}/_main.json`),
    ]).then((data: Array<{ default: { [key: string]: string } }>) => {
      return data.map(x => x.default)
    }),
)

export async function i18nServer<Ns extends keyof Translations>(
  locale: string,
  namespace: Ns,
): Promise<I18TFunction<Ns>> {
  const t = await getTranslations({ locale, namespace })
  return t as unknown as I18TFunction<Ns>
}

export async function getTypedServerI18n<Ns extends keyof Translations>(
  locale: I18nLocale,
  ns: Ns,
): Promise<I18nReturn<Ns>> {
  const t = await getTranslations({ locale, namespace: ns })

  return {
    t: t as unknown as I18TFunction<Ns>,
  }
}

export async function getRequestConfig({
  requestLocale,
}: {
  requestLocale: Promise<I18nLocale>
}) {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale
  }

  const dictionaries: Array<{ [key: string]: string }>
    = await getCachedDictionaries(locale)

  return {
    locale,
    messages: dictionaries.reduce((acc, x) => {
      Object.assign(acc, x)
      return acc
    }, {}),
  }
}

export default getRequestConfig
