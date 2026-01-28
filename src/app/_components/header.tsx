import { LogIn, LogOut, Ticket, User } from 'lucide-react'

import { ThemeToggle } from '@/shared/components/theme-toggle'
import { Button } from '@/shared/components/ui/button'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { Link } from '@/shared/i18n/i18n.routing'
import { useSession } from '@/shared/session/session-provider'

import { LogoCinema } from './icons/logo-cinema'

export function Header() {
  const { t } = useTypedI18n('common')
  const { isAuth, logout } = useSession()

  return (
    <header className="w-full border-b border-border py-4">
      <div className="mx-auto flex max-w-[960px] items-center justify-between px-4">
        <Link href="/" className="text-brand">
          <LogoCinema className="h-[34px] w-[118px]" />
        </Link>

        <div className="flex items-center gap-2">
          {isAuth
            ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/profile">
                      <User className="size-5" />
                      {t('profile')}
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/profile/tickets">
                      <Ticket className="size-5" />
                      {t('tickets')}
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={logout}>
                    <LogOut className="size-5" />
                    {t('logout')}
                  </Button>
                </>
              )
            : (
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">
                    <LogIn className="size-5" />
                    {t('login')}
                  </Link>
                </Button>
              )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
