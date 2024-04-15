import { apiFetch } from '~/lib/api/apiFetch'
import type { CreateArticle201Response, CreateArticleRequest, NewArticle } from '~/lib/api/__generated__'
import type { NuxtErrorWithRecord } from '~/lib/types'

interface Options {
  article: MaybeRefOrGetter<NewArticle>
  slug: string
}

export default function useUpdateArticleApi(opts: Options) {
  return useLazyAsyncData<CreateArticleRequest, NuxtErrorWithRecord, CreateArticle201Response>('create-article', () => {
    const article = toValue(opts.article)
    return apiFetch(`/articles/${opts.slug}`, {
      method: 'PUT',
      body: { article },
    })
  }, { immediate: false })
}
