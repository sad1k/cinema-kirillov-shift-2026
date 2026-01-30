'use client'

import { Film, Ticket, User } from 'lucide-react'
import React from 'react'

import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { Link, usePathname } from '@/shared/i18n/i18n.routing'
import { cn } from '@/shared/lib/utils'

export function MobileBottomMenu() {
  const tCommon = useTypedI18n('common')
  const tMain = useTypedI18n('main')
  const pathname = usePathname()

  const showMenu = pathname === '/' || pathname === '/profile' || pathname === '/profile/tickets'

  if (!showMenu) {
    return null
  }

  const items = [
    {
      href: '/',
      icon: Film,
      label: tMain.t('home.title'),
      isActive: pathname === '/',
    },
    {
      href: '/profile/tickets',
      icon: Ticket,
      label: tCommon.t('tickets'),
      isActive: pathname === '/profile/tickets',
    },
    {
      href: '/profile',
      icon: User,
      label: tCommon.t('profile'),
      isActive: pathname === '/profile',
    },
  ]

  return (
    <>
      <div className="h-16 w-full md:hidden" />
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary',
              item.isActive && 'text-primary',
            )}
          >
            <item.icon className="size-6" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
