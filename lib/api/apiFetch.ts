import { type FetchOptions, createFetch } from 'ofetch'
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
} as FetchOptions

export const apiFetch = $fetch.create({ ...defaults })
