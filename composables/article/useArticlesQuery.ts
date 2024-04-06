import { ArticlesApi, type GetArticlesFeed200Response, type GetArticlesRequest } from '~/lib/api/__generated__'
import { apiFetch } from '~/lib/api/apiFetch'

export async function useArticlesQuery(opts: ComputedRef<GetArticlesRequest & { feed?: boolean }>) {
  const response = await useLazyAsyncData<GetArticlesRequest, Error, GetArticlesFeed200Response>('articles', () =>
    apiFetch(opts.value.feed ? '/articles/feed' : '/articles', { method: 'GET', query: opts.value }), { watch: [opts] })

  return response
}
