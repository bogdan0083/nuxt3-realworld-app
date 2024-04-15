import { apiFetch } from '~/lib/api/apiFetch'
import type { GetProfileByUsername200Response, GetProfileByUsernameRequest } from '~/lib/api/__generated__'
import type { NuxtErrorWithRecord } from '~/lib/types'

interface Options {
  username: string
}

export default async function useGetUserApi(opts: Options) {
  return await useLazyAsyncData<GetProfileByUsernameRequest, NuxtErrorWithRecord, GetProfileByUsername200Response>(() => {
    return apiFetch(`/profiles/${opts.username}`)
  })
}
