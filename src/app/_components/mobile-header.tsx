'use client'

import { ChevronLeft, X } from 'lucide-react'
import React from 'react'

import { Button } from '@/shared/components/ui/button'
import { useMobileHeader } from '@/shared/context/mobile-header-context'
import { useRouter } from '@/shared/i18n/i18n.routing'
import { cn } from '@/shared/lib/utils'

export function MobileHeader() {
  const { title, leftAction, rightAction, onLeftClick, variant, className, isVisible } = useMobileHeader()
  const router = useRouter()

  const handleLeftClick = () => {
    if (onLeftClick) {
      onLeftClick()
      return
    }

    if (leftAction === 'back') {
      router.back()
    }
  }

  if (!isVisible) {
    return null
  }

  if (variant === 'transparent' && !title && !leftAction && !rightAction) {
    return null
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-background py-3 px-4 md:hidden',
        variant === 'transparent' && 'bg-transparent',
        className,
      )}
    >
      <div className="flex items-center justify-start text-indicator-light mr-8">
        {leftAction === 'back' && (
          <Button variant="ghost" size="icon" onClick={handleLeftClick} className="-ml-2">
            <ChevronLeft className="size-6 " />
          </Button>
        )}
        {leftAction === 'close' && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
            <X className="size-6" />
          </Button>
        )}
        {React.isValidElement(leftAction) && leftAction}
      </div>

      <div className="flex-1">
        {typeof title === 'string'
          ? (
              <h2 className="text-title-h2">{title}</h2>
            )
          : (
              title
            )}
      </div>

      <div className="flex w-10 items-center justify-end">
        {rightAction}
      </div>
    </header>
  )
}
