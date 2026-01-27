import fetches from '@siberiacancode/fetches'

import { env } from '../config/env'

export const instance = fetches.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
