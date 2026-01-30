'use client'

import { LogIn, LogOut, Ticket, User } from 'lucide-react'

import { LangSwitcher } from '@/app/_components/lang-switcher'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { Link, usePathname } from '@/shared/i18n/i18n.routing'
import { LogoCinema } from '@/shared/icons/logo-cinema'
import { cn } from '@/shared/lib/utils'
import { useSession } from '@/shared/providers/session/session-provider'
import { ThemeToggle } from '@/shared/providers/theme/theme-toggle'

export function Header() {
  const { t } = useTypedI18n('common')
  const { isAuth, logout, isLoading } = useSession()
  const pathname = usePathname()

  return (
    <header className="hidden w-full border-b border-border py-4 md:block">
      <div className="mx-auto flex max-w-[960px] items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-brand">
            <LogoCinema className="h-[34px] w-[118px]" />
          </Link>

          {isLoading
            ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              )
            : isAuth && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className={cn(pathname === '/profile' && 'text-brand')}
                >
                  <Link href="/profile">
                    <User className="size-5" />
                    <span className="hidden md:inline">{t('profile')}</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className={cn(pathname === '/profile/tickets' && 'text-brand')}
                >
                  <Link href="/profile/tickets">
                    <Ticket className="size-5" />
                    <span className="hidden md:inline">{t('tickets')}</span>
                  </Link>
                </Button>
              </div>
            )}
        </div>

        <div className="flex items-center gap-2">
          {isLoading
            ? <Skeleton className="h-10 w-24" />
            : isAuth
              ? (
                  <Button variant="ghost" onClick={logout}>
                    <LogOut className="size-5" />
                    <span className="hidden md:inline">{t('logout')}</span>
                  </Button>
                )
              : (
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">
                      <LogIn className="size-5" />
                      <span className="hidden md:inline">{t('login')}</span>
                    </Link>
                  </Button>
                )}
          <LangSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
