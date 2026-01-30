import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseYear(dateString: string): number | null {
  if (!dateString) {
    return null
  }

  const yearMatch = dateString.match(/\b(\d{4})\b/)
  if (yearMatch) {
    return Number.parseInt(yearMatch[1], 10)
  }

  return null
}
