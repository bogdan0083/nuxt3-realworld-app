import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { getQuery, getRouterParams, readBody } from 'h3'
import type { Article, CreateArticleRequest, GetArticlesRequest } from '~/lib/api/__generated__'
import { ARTICLES_PER_PAGE, BASE_API_URL } from '~/lib/constants'

// export const registerProfilesEndpoints = () => {
// }
