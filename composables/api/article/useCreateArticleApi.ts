import { apiFetch } from '~/lib/api/apiFetch'
import type { CreateArticle201Response, CreateArticleRequest, NewArticle } from '~/lib/api/__generated__'
import type { NuxtErrorWithRecord } from '~/lib/types'

interface Options {
  article: MaybeRefOrGetter<NewArticle>
}
export default function useCreateArticleApi(opts: Options) {
  return useLazyAsyncData<CreateArticleRequest, NuxtErrorWithRecord, CreateArticle201Response>('create-article', () => {
    const article = toValue(opts.article)
    return apiFetch('/articles', {
      method: 'POST',
      body: { article },
    })
  })
}
