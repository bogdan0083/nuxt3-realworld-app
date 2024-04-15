import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import { BASE_API_URL } from '../constants'

export function apiFetch<T>(url: string, options?: NitroFetchOptions<NitroFetchRequest>): Promise<T> {
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`
  const fullUrl = `${BASE_API_URL}${normalizedUrl}`
  return $fetch(fullUrl, {
    ...options,
    async onRequest(ctx) {
      const token = useCookie('token').value

      if (ctx.options.headers === undefined)
        ctx.options.headers = {}

      if (token)
        (ctx.options.headers as Record<string, string>).Authorization = `Token ${token}`

      return options?.onRequest?.(ctx)
    },
    onResponse(ctx) {
      // @NOTE This is a workaround for the to catch data from `registerEndpoint` in mocks/.../endpoints.ts
      if (ctx.response._data?.data?.errors)
        ctx.response._data.errors = ctx.response._data.data.errors

      return options?.onResponse?.(ctx)
    },
  })
}
