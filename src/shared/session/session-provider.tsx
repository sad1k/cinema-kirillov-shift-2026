'use client'

import type { PropsWithChildren } from 'react'
import type { User } from '@/shared/api/generated'
import { useQuery } from '@tanstack/react-query'
import { deleteCookie, setCookie } from 'cookies-next'
import { createContext, useContext, useEffect, useState } from 'react'
import { getApiUsersSession } from '@/shared/api/generated'

interface SessionContextValue {
  isAuth: boolean
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuth, setIsAuth] = useState(false)

  const { data, isSuccess } = useQuery({
    queryKey: ['session'],
    queryFn: () => getApiUsersSession({}),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (isSuccess && data?.data.success && data.data.user) {
      setUser(data.data.user)
      setIsAuth(true)
    }
  }, [isSuccess, data])

  const login = (token: string, newUser: User) => {
    setCookie('token', token)
    setUser(newUser)
    setIsAuth(true)
  }

  const logout = () => {
    deleteCookie('token')
    setUser(null)
    setIsAuth(false)
  }

  return (
    <SessionContext.Provider value={{ isAuth, user, login, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
