import fetches from '@siberiacancode/fetches'
import { getCookie } from 'cookies-next'

import { env } from '../config/env'

export const instance = fetches.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  const token = getCookie('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
