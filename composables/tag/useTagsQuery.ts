import { TagsApi } from '~/lib/api/__generated__'

export async function useTagsQuery() {
  const api = new TagsApi()

  const response = await useAsyncData('tags', () => api.getTags())
  return response
}
