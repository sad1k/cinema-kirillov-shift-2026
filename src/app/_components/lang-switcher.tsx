'use client'

import { useLocale } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { usePathname, useRouter } from '@/shared/i18n/i18n.routing'

export function LangSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const onValueChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <Select value={locale} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 w-[60px] border-none bg-transparent px-2 shadow-none focus:ring-0">
        <SelectValue placeholder={locale.toUpperCase()}>
          {locale.toUpperCase()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ru">RU</SelectItem>
        <SelectItem value="en">EN</SelectItem>
      </SelectContent>
    </Select>
  )
}
