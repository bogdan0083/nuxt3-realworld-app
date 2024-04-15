import type { NuxtError } from '#app'
import { apiFetch } from '~/lib/api/apiFetch'
import type { CreateArticle201Response, GetArticleRequest } from '~/lib/api/__generated__'

interface Options {
  slug?: string
}
export default async function useArticleApi(opts: Options) {
  return useLazyAsyncData<GetArticleRequest, NuxtError, CreateArticle201Response>(`get-article-${opts.slug}`, async () => {
    return apiFetch(`/articles/${opts.slug}`)
  }, { immediate: !!opts.slug })
}
