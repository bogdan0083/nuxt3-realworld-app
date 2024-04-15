import type { NuxtError } from '#app'
import { apiFetch } from '~/lib/api/apiFetch'

interface Options {
  slug: string
}

export default async function useDeleteArticleApi(opts: Options) {
  return useLazyAsyncData<unknown, NuxtError, unknown>(`delete-article-${opts.slug}`, async () => {
    return apiFetch(`/articles/${opts.slug}`, {
      method: 'DELETE',
    })
  }, { immediate: false })
}
