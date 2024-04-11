import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { getQuery, readBody } from 'h3'
import { type ArticleWithStringDates, generateArticles } from './generator'
import type { CreateArticleRequest, GetArticlesRequest } from '~/lib/api/__generated__'
import { ARTICLES_PER_PAGE, BASE_API_URL } from '~/lib/constants'

const articles = generateArticles(22)

export function registerArticlesEndpoints() {
  // @TODO: Couldn't find a way to make /articles/:slug/favorite work
  // hardcoding the slug for now
  registerEndpoint(`${BASE_API_URL}/articles/slug-5/favorite`, {
    method: 'POST',
    handler: async () => {
      // set favorite to true
      const articleIndex = articles.findIndex(a => a.slug === 'slug-5')
      if (articleIndex === -1)
        throw createError({ status: 404, data: { errors: { body: ['Not found'] } } })

      articles[articleIndex].favorited = true
      articles[articleIndex].favoritesCount += 1
      return { article: articles[articleIndex] }
    },
  })

  // @TODO: Couldn't find a way to make /articles/:slug/favorite work
  // hardcoding the slug for now
  registerEndpoint(`${BASE_API_URL}/articles/slug-5/favorite`, {
    method: 'DELETE',
    handler: async () => {
      // set favorite to true
      const article = articles.find(a => a.slug === 'slug-5')
      if (!article)
        throw createError({ status: 404, data: { errors: { body: ['Not found'] } } })

      article.favorited = false
    },
  })
  registerEndpoint(`${BASE_API_URL}/articles/feed`, () => {
    return {
      articles: articles.slice(10, 16),
      articlesCount: 6,
    }
  })

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

  registerEndpoint(`${BASE_API_URL}/articles/new-article-title`, {
    method: 'PUT',
    handler: async (event) => {
      const body = await readBody<CreateArticleRequest>(event)

      if (!body.article?.title)
        throw createError({ status: 422, data: { errors: { title: ['can\'t be blank'] } } })
      if (!body.article?.description)
        throw createError({ status: 422, data: { errors: { description: ['can\'t be blank'] } } })
      if (!body.article?.body)
        throw createError({ status: 422, data: { errors: { body: ['can\'t be blank'] } } })

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

      const existingArticleIndex = articles.findIndex(a => a.slug === 'new-article-title')
      if (existingArticleIndex === -1)
        throw createError({ status: 422, data: { errors: { body: ['Not found'] } } })

      articles[existingArticleIndex] = article
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
  registerEndpoint(`${BASE_API_URL}/articles/updated-article-title`, () => {
    const slug = 'updated-article-title'

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

    if (query.favorited) {
      const filterFunction = (article: any) => article.favorited === true
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
