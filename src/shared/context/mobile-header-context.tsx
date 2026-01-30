'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface MobileHeaderState {
  title: React.ReactNode
  leftAction: 'back' | 'close' | 'none' | React.ReactNode
  rightAction: React.ReactNode
  onLeftClick?: () => void
  variant: 'default' | 'transparent'
  className?: string
  isVisible: boolean
}

export interface MobileHeaderContextType extends MobileHeaderState {
  setHeader: (config: Partial<MobileHeaderState>) => void
  resetHeader: () => void
}

const initialState: MobileHeaderState = {
  title: '',
  leftAction: 'none',
  rightAction: null,
  onLeftClick: undefined,
  variant: 'default',
  className: '',
  isVisible: true,
}

const MobileHeaderContext = createContext<MobileHeaderContextType | undefined>(undefined)

export function MobileHeaderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MobileHeaderState>(initialState)

  const setHeader = useCallback((config: Partial<MobileHeaderState>) => {
    setState(prev => ({ ...prev, ...config }))
  }, [])

  const resetHeader = useCallback(() => {
    setState(initialState)
  }, [])

  const value = useMemo(() => ({
    ...state,
    setHeader,
    resetHeader,
  }), [state, setHeader, resetHeader])

  return (
    <MobileHeaderContext.Provider value={value}>
      {children}
    </MobileHeaderContext.Provider>
  )
}

export function useMobileHeader() {
  const context = useContext(MobileHeaderContext)
  if (context === undefined) {
    throw new Error('useMobileHeader must be used within a MobileHeaderProvider')
  }
  return context
}
