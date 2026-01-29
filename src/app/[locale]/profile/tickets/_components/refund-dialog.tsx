'use client'

import { X } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/ui/alert-dialog'
import { Button } from '@/shared/components/ui/button'
import { useTypedI18n } from '@/shared/i18n/client/use-typed-i18n'
import { AcceptIcon } from '@/shared/icons/AcceptIcon'

interface RefundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading: boolean
}

export function RefundDialog({ open, onOpenChange, onConfirm, isLoading }: RefundDialogProps) {
  const { t } = useTypedI18n('tickets')
  const { t: tCommon } = useTypedI18n('common')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px] flex flex-col items-center justify-center p-18 text-center">
        <Button
          onClick={() => onOpenChange(false)}
          variant="ghost"
          size="icon-xs"
          className="absolute right-4 top-4"
        >
          <X />
          <span className="sr-only">{tCommon('close')}</span>
        </Button>
        <AlertDialogHeader className="flex flex-col items-center mb-10">
          <div className="mb-4 self-center">
            <AcceptIcon />
          </div>
          <AlertDialogTitle className="text-xl font-bold">{t('return_ticket_q')}</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            {t('return_ticket_q')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full flex-col gap-2">
          <AlertDialogCancel className="w-full" disabled={isLoading}>
            {t('refund')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="w-full" disabled={isLoading}>
            {tCommon('cancel')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
