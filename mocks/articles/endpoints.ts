import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { getQuery, getRouterParams, readBody } from 'h3'
import { type ArticleWithStringDates, generateArticles } from './generator'
import type { Article, CreateArticleRequest, GetArticlesRequest } from '~/lib/api/__generated__'
import { ARTICLES_PER_PAGE, BASE_API_URL } from '~/lib/constants'

const articles = generateArticles(22)

export function registerArticlesEndpoints() {
  registerEndpoint(`${BASE_API_URL}/articles`, {
    method: 'POST',
    handler: async (event) => {
      const body = await readBody<CreateArticleRequest>(event)

      if (!body.article?.title)
        throw createError({ status: 422, data: { errors: { title: ['can\'t be blank'] } } })
      if (!body.article?.description)
        throw createError({ status: 422, data: { errors: { description: ['can\'t be blank'] } } })
      if (!body.article?.body)
        throw createError({ status: 422, data: { errors: { body: ['can\'t be blank'] } } })
      //   if (!body.article.tagList)
      //     throw createError({ status: 422, data: { errors: { tagList: ['can\'t be blank'] } } })

      const article = {
        title: body.article.title,
        description: body.article.description,
        body: body.article.body,
        tagList: body.article.tagList || [],
        slug: `${body.article.title}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'myAwesomeLogin',
          bio: '',
          image: 'image',
          email: 'email@gmail.com',
          following: false,
        },
      } as ArticleWithStringDates

      articles.push(article)
      return { article }
    },
  })

  // @TODO: Couldn't find a way to make /articles/:slug work
  // hardcoding the slug for now
  registerEndpoint(`${BASE_API_URL}/articles/slug-1`, () => {
    const slug = 'slug-1'

    const article = articles.find(a => a.slug === slug)
    if (!article)
      return { errors: { body: ['Not found'] } }

    return { article }
  })

  // @TODO: Couldn't find a way to make /articles/:slug work
  // hardcoding the slug for now
  registerEndpoint(`${BASE_API_URL}/articles/new-article-title`, () => {
    const slug = 'new-article-title'

    const article = articles.find(a => a.slug === slug)
    if (!article)
      return { errors: { body: ['Not found'] } }

    return { article }
  })

  registerEndpoint(`${BASE_API_URL}/articles/feed`, () => {
    return {
      articles: articles.slice(10, 16),
      articlesCount: 2,
    }
  })

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
