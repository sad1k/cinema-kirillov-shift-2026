import type { I18nReturn, I18TFunction, Translations } from '../i18n.types'
import { useTranslations } from 'next-intl'

export function useTypedI18n<Ns extends keyof Translations>(
  ns: Ns,
): I18nReturn<Ns> {
  // assertion here reduces ts load of native next-intl types
  const t = useTranslations(ns)

  return {
    t: t as unknown as I18TFunction<Ns>,
  }
}
