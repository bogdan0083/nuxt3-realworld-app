import { apiFetch } from '~/lib/api/apiFetch'
import type { Article } from '~/lib/api/__generated__'

interface Options {
  article?: MaybeRefOrGetter<Article>
}

export default function useFavoriteArticleApi(opts: Options) {
  const response = useLazyAsyncData<Article, Error>(
    () => {
      let article = toValue(opts.article) as Article
      const previousArticle = article
      return apiFetch(`/articles/${article.slug}/favorite`, {
        method: article.favorited ? 'DELETE' : 'POST',
        body: { slug: article.slug },
        onRequest: () => {
          if (article) {
            article.favorited = !article.favorited
            article.favoritesCount += article.favorited ? 1 : -1
          }
        },
        onRequestError: () => {
          article = previousArticle
        },
      })
    },
    { immediate: false, deep: false },
  )

  return response
}
