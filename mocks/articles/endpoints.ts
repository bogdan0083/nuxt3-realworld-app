import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { getQuery } from 'h3'
import { generateArticles } from './generator'
import type { Article, GetArticlesRequest } from '~/lib/api/__generated__'
import { ARTICLES_PER_PAGE, BASE_API_URL } from '~/lib/constants'

const articles = generateArticles(22)

export function registerArticlesEndpoints() {
  registerEndpoint(`${BASE_API_URL}/articles`, (event) => {
    const query = getQuery<GetArticlesRequest>(event)
    const queryLimit = query.limit || ARTICLES_PER_PAGE

    let slicedArticles = [...articles]

    if (query.tag) {
      const filterFunction = (article: any) => article.tagList.includes(query.tag as string)
      slicedArticles = slicedArticles.filter(filterFunction)
    }

    if (query.author) {
      const filterFunction = (article: any) => article.author.username === query.author
      slicedArticles = slicedArticles.filter(filterFunction)
    }

    return {
      articles: slicedArticles.slice(
        query.offset || 0,
        query.offset ? query.offset + queryLimit : queryLimit,
      ),
      articlesCount: slicedArticles.length,
    }
  })
}
