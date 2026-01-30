'use client'

import type { I18KeyType } from '@/shared/i18n/client'
import { useEffect } from 'react'
import { useMobileHeader } from '@/shared/context/mobile-header-context'
import { useTypedI18n } from '@/shared/i18n/client'

export interface HeaderControllerProps {
  title?: React.ReactNode
  titleKey?: string
  leftAction?: 'back' | 'close' | 'none' | React.ReactNode
  rightAction?: React.ReactNode
  onLeftClick?: () => void
  variant?: 'default' | 'transparent'
  className?: string
}

export function HeaderController(props: HeaderControllerProps) {
  const { setHeader, resetHeader } = useMobileHeader()
  const { t } = useTypedI18n('main')

  useEffect(() => {
    const title = props.titleKey ? t(props.titleKey as I18KeyType<'main'>) : props.title
    setHeader({
      ...props,
      title,
    })

    return () => {
      resetHeader()
    }
  }, [props, setHeader, resetHeader, t])

  useEffect(() => {
    if (props.onLeftClick) {
      setHeader({ onLeftClick: props.onLeftClick })
    }
  }, [props.onLeftClick, setHeader])

  return null
}
