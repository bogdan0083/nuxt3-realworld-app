import { type GetTags200Response, TagsApi } from '~/lib/api/__generated__'
import { apiFetch } from '~/lib/api/apiFetch'

export async function useTagsQuery() {
  const response = await useLazyAsyncData<void, unknown, GetTags200Response>('tags', () =>
    apiFetch('/tags', { method: 'GET' }))
  return response
}
