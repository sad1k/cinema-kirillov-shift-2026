import type { User } from '../api/generated'

export interface SessionContextValue {
  isAuth: boolean
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}
