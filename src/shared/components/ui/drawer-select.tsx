'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'

interface DrawerSelectContextValue {
  value: string | undefined
  onValueChange: (value: string) => void
  onClose: () => void
}

const DrawerSelectContext = React.createContext<DrawerSelectContextValue | null>(null)

function useDrawerSelectContext() {
  const context = React.useContext(DrawerSelectContext)
  if (!context) {
    throw new Error('DrawerSelect compound components must be used within DrawerSelect')
  }
  return context
}

interface DrawerSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

function DrawerSelect({ value, onValueChange, children }: DrawerSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      onValueChange?.(newValue)
      setOpen(false)
    },
    [onValueChange],
  )

  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange: handleValueChange,
      onClose: () => setOpen(false),
    }),
    [value, handleValueChange],
  )

  return (
    <DrawerSelectContext.Provider value={contextValue}>
      <Drawer open={open} onOpenChange={setOpen}>
        {children}
      </Drawer>
    </DrawerSelectContext.Provider>
  )
}

// Trigger component
interface DrawerSelectTriggerProps {
  placeholder?: string
  className?: string
  children?: React.ReactNode
}

function DrawerSelectTrigger({
  placeholder = 'Выбрать',
  className,
  children,
}: DrawerSelectTriggerProps) {
  const { value } = useDrawerSelectContext()

  return (
    <DrawerTrigger asChild>
      <button
        type="button"
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-xs border border-border bg-background py-2 pr-2 pl-3 text-left text-paragraph-16 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        <span className={cn(!value && !children && 'text-muted-foreground')}>
          {children ?? value ?? placeholder}
        </span>
        <ChevronDown className="size-5 shrink-0 text-muted-foreground" />
      </button>
    </DrawerTrigger>
  )
}

interface DrawerSelectContentProps {
  title?: string
  className?: string
  children: React.ReactNode
}

function DrawerSelectContent({ title, className, children }: DrawerSelectContentProps) {
  return (
    <DrawerContent className={className}>
      {title && (
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-title-h3">{title}</DrawerTitle>
        </DrawerHeader>
      )}
      <div className="flex flex-col overflow-y-auto pb-6">{children}</div>
    </DrawerContent>
  )
}

interface DrawerSelectItemProps {
  value: string
  children: React.ReactNode
  description?: string
  className?: string
}

function DrawerSelectItem({
  value: itemValue,
  children,
  description,
  className,
}: DrawerSelectItemProps) {
  const { value, onValueChange } = useDrawerSelectContext()
  const isSelected = value === itemValue

  return (
    <DrawerClose asChild>
      <button
        type="button"
        onClick={() => onValueChange(itemValue)}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
          'hover:bg-accent focus-visible:bg-accent focus-visible:outline-none',
          isSelected && 'bg-accent',
          className,
        )}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-paragraph-16 text-foreground">{children}</span>
          {description && (
            <span className="text-paragraph-14 text-muted-foreground">{description}</span>
          )}
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
      </button>
    </DrawerClose>
  )
}

export {
  DrawerSelect,
  DrawerSelectContent,
  DrawerSelectItem,
  DrawerSelectTrigger,
}
