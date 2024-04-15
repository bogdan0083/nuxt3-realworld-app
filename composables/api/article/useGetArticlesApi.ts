import type { NuxtError } from '#app'
import { apiFetch } from '~/lib/api/apiFetch'
import type { GetArticlesFeed200Response, GetArticlesRequest } from '~/lib/api/__generated__'

interface Options {
  tag?: MaybeRefOrGetter<string>
  offset?: MaybeRefOrGetter<number>
  feed?: MaybeRefOrGetter<boolean>
  author?: MaybeRefOrGetter<string>
  favorited?: MaybeRefOrGetter<string>
}

export default async function useGetArticlesApi(opts: Options) {
  const watchSources = Object.values(opts) as MaybeRefOrGetter<any>[]

  const response = await useLazyAsyncData<GetArticlesRequest, NuxtError, GetArticlesFeed200Response>('articles', () => {
    const url = toValue(opts.feed) ? '/articles/feed' : '/articles'
    const query = {
      tag: toValue(opts.tag),
      offset: toValue(opts.offset),
      author: toValue(opts.author),
      favorited: toValue(opts.favorited),
    }
    return apiFetch(url, { query })
  }, { watch: watchSources })
  return response
}
