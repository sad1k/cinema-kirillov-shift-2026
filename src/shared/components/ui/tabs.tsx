'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'bg-secondary inline-flex h-auto w-fit items-center justify-start gap-0 rounded-[14px] p-[2px]',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'text-content-05 text-paragraph-14 data-[state=active]:bg-background data-[state=active]:text-foreground relative flex h-10 w-[95px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] px-4 py-2.5 font-normal transition-all outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-md [&:not(:last-child):not([data-state=active])]:after:absolute [&:not(:last-child):not([data-state=active])]:after:right-0 [&:not(:last-child):not([data-state=active])]:after:h-5 [&:not(:last-child):not([data-state=active])]:after:w-[1px] [&:not(:last-child):not([data-state=active])]:after:bg-gray-300 [&:not(:last-child):not([data-state=active])]:after:content-[""]',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
