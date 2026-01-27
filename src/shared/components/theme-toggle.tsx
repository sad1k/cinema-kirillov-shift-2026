'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useRef } from 'react'
import { flushSync } from 'react-dom'

import { Button } from '@/shared/components/ui/button'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    const root = document.documentElement

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || !document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    const button = buttonRef.current
    if (!button) {
      setTheme(newTheme)
      return
    }

    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    root.dataset.themeTransition = newTheme === 'light' ? 'to-light' : 'to-dark'

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme)
      })
    })

    const clipKeyframes = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${maxRadius}px at ${x}px ${y}px)`,
    ]

    const fullyOpenClip = { clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` }

    const animationOptions: KeyframeAnimationOptions = {
      duration: 400,
      easing: 'ease-in-out',
      fill: 'forwards' as const,
    }

    transition.ready.then(() => {
      if (newTheme === 'light') {
        root.animate(
          { clipPath: clipKeyframes },
          { ...animationOptions, pseudoElement: '::view-transition-new(root)' },
        )
        root.animate(
          fullyOpenClip,
          { ...animationOptions, pseudoElement: '::view-transition-old(root)' },
        )
      }
      else {
        root.animate(
          { clipPath: [...clipKeyframes].reverse() },
          { ...animationOptions, pseudoElement: '::view-transition-old(root)' },
        )
        root.animate(
          fullyOpenClip,
          { ...animationOptions, pseudoElement: '::view-transition-new(root)' },
        )
      }
    })

    transition.finished.finally(() => {
      delete root.dataset.themeTransition
    })
  }, [resolvedTheme, setTheme])

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
      aria-label="Toggle theme"
    >
      <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
