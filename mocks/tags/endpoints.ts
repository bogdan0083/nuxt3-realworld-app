import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { type GetTags200Response, TagsApi } from '~/lib/api/__generated__'
import { BASE_API_URL } from '~/lib/constants'

export function registerTagsEndpoints() {
  registerEndpoint(`${BASE_API_URL}/tags`, () => ({
    tags: ['tag-1', 'tag-2', 'tag-3', 'tag-4', 'tag-5', 'tag-6', 'tag-7', 'tag-8', 'tag-9', 'tag-10'],
  }))
}
