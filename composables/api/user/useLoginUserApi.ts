import { apiFetch } from '~/lib/api/apiFetch'
import type { Login200Response, LoginUser } from '~/lib/api/__generated__'
import type { NuxtErrorWithRecord } from '~/lib/types'

interface Options {
  user: MaybeRefOrGetter<LoginUser>
}

export default function useLoginUserApi(opts: Options) {
  return useLazyAsyncData<LoginUser, NuxtErrorWithRecord, Login200Response>('login-user', () => {
    const user = toValue(opts.user)
    return apiFetch('/users/login', {
      method: 'POST',
      body: { user },
    })
  }, { immediate: false })
}
