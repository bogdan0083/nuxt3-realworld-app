import { apiFetch } from '~/lib/api/apiFetch'
import type { CreateUserRequest, Login200Response, NewUser } from '~/lib/api/__generated__'
import type { NuxtErrorWithRecord } from '~/lib/types'

interface Options {
  user: MaybeRefOrGetter<NewUser>
}

export default function useCreateUserApi(opts: Options) {
  return useLazyAsyncData<CreateUserRequest, NuxtErrorWithRecord, Login200Response>('create-user', () => {
    const user = toValue(opts.user)
    return apiFetch('/users', {
      method: 'POST',
      body: { user },
    })
  }, { immediate: false })
}
