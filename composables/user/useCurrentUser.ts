import type { CookieRef } from '#app'
import type { User } from '~/lib/api/__generated__'

export function useCurrentUser() {
  const userCookie = useCookie('user')
  return userCookie as CookieRef<User | undefined>
}
