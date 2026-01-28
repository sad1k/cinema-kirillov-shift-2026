import fetches from '@siberiacancode/fetches'
import { getCookie } from 'cookies-next'

import { env } from '../config/env'

export const instance = fetches.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
})

instance.interceptors.request.use((config) => {
  const token = getCookie('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.headers) {
    const contentType = config.headers['Content-Type'] || config.headers['content-type']
    if (contentType) {
      delete config.headers['content-type']
      config.headers['Content-Type'] = contentType
    }
  }

  if (
    config.body
    && typeof config.body === 'object'
    && !(config.body instanceof FormData)
    && config.headers?.['Content-Type'] === 'application/json'
  ) {
    config.body = JSON.stringify(config.body)
  }

  return config
})
