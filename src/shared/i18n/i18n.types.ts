import type { JSX } from 'react'
import type { Join, PathsToStringProps } from '../utility-types'

export type I18nLocale = 'en' | 'ru'

export type LangAll = typeof import('./messages/en/_common.json')
  & typeof import('./messages/en/_main.json')
  & typeof import('./messages/en/_films.json')
  & typeof import('./messages/en/_profile.json')

export type FlatLangAll = TranslationsStr<TranslationsTuple<LangAll>>
export type Translations = FlatLangAll

// Cleaned translation
type TranslationsTuple<Translation> = {
  [K in keyof Translation]: PathsToStringProps<Translation[K]>;
}

type TranslationsStr<Translation> = {
  [K in keyof Translation]: Translation[K] extends string[]
  ? Join<Translation[K], '.'>
  : Translation[K];
}

export type I18KeyType<Ns extends keyof Translations> = Translations[Ns]

export type I18TFunction<
  Ns extends keyof Translations,
  Key = I18KeyType<Ns>,
> = ((key: Key, params?: object) => string) & {
  rich: (
    key: Key,
    params: { [key: string]: (chunks: string) => JSX.Element },
  ) => JSX.Element
  raw: (key: Key) => string
}

export interface I18nReturn<Ns extends keyof Translations> {
  t: I18TFunction<Ns>
}

declare global {
  // Use type safe message keys with `next-intl`

  interface IntlMessages extends LangAll { }
}
