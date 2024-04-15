import { apiFetch } from '~/lib/api/apiFetch'
import type { GetTags200Response } from '~/lib/api/__generated__'

export async function useGetTagsApi() {
  const response = await useLazyAsyncData<void, unknown, GetTags200Response>('tags', () =>
    apiFetch('/tags', { method: 'GET' }))
  return response
}
