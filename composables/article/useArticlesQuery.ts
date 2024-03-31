import { ArticlesApi, type GetArticlesRequest } from '~/lib/api/__generated__'

export async function useArticlesQuery(opts: GetArticlesRequest) {
  const api = new ArticlesApi()

  const response = useAsyncData('articles', () => api.getArticles(opts))

  return response
}
