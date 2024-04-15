import type { CookieRef } from '#app'
import type { User } from '~/lib/api/__generated__'

export function useAuthUser() {
  const userCookie = useCookie('user')
  return userCookie as CookieRef<User | undefined>
}
