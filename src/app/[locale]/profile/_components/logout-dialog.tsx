'use client'

import { X } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/ui/alert-dialog'
import { Button } from '@/shared/components/ui/button'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { QuestionIcon } from '@/shared/icons/question-icon'

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function LogoutDialog({ open, onOpenChange, onConfirm }: LogoutDialogProps) {
  const { t } = useTypedI18n('profile')
  const { t: tCommon } = useTypedI18n('common')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="fixed top-auto bottom-0 left-0 right-0 w-full max-w-full translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none border-b-0 sm:top-[50%] sm:left-[50%] sm:w-full sm:max-w-[400px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:border flex flex-col items-center justify-center p-6 sm:p-18 text-center">
        <Button
          onClick={() => onOpenChange(false)}
          variant="ghost"
          size="icon-xs"
          className="absolute right-4 top-4 hidden sm:inline-flex"
        >
          <X />
          <span className="sr-only">{tCommon('close')}</span>
        </Button>
        <AlertDialogHeader className="flex flex-col items-center mb-6 sm:mb-10">
          <div className="mb-4 self-center">
            <QuestionIcon />
          </div>
          <AlertDialogTitle className="text-xl font-bold">{t('logout_confirmation')}</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            {t('logout_confirmation')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full flex-col gap-2">
          <AlertDialogCancel className="w-full">
            {tCommon('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="w-full">
            {tCommon('logout')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
