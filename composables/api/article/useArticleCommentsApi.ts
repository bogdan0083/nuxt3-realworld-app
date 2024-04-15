import type { NuxtError } from '#app'
import { apiFetch } from '~/lib/api/apiFetch'
import type { GetArticleComments200Response } from '~/lib/api/__generated__'

export default async function useArticleCommentsApi({ slug }: { slug: string }) {
  const response = useLazyAsyncData<unknown, NuxtError, GetArticleComments200Response>(`get-article-comments-${slug}`, async () => {
    return apiFetch(`/articles/${slug}/comments`)
  })

  return response
}
