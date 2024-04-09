import type { FetchOptions } from 'ofetch'
import { BASE_API_URL } from '../constants'

const defaults = {
  baseURL: BASE_API_URL,
  async onRequest({ options }) {
    const token = useCookie('token').value

    if (options.headers === undefined)
      options.headers = {}

    if (token)
      (options.headers as Record<string, string>).Authorization = `Token ${token}`
  },
  onResponseError({ response }) {
    // @NOTE This is a workaround for the to catch data from `registerEndpoint` in mocks/users/endpoints.ts
    if (response._data?.data?.errors)
      response._data.errors = response._data.data.errors
  },
} as FetchOptions

export const apiFetch = $fetch.create({ ...defaults })
