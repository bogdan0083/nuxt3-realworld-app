import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { createError, readBody } from 'h3'
import type { Article, GetArticlesRequest, Login200Response, LoginUser, User } from '~/lib/api/__generated__'
import { ARTICLES_PER_PAGE, BASE_API_URL } from '~/lib/constants'

export function registerAuthEndpoints() {
  registerEndpoint(`${BASE_API_URL}/users/login`, ({
    method: 'POST',
    handler: async (event) => {
      const body = await readBody<{ user: LoginUser }>(event)
      if (!body.user.email) {
        // console.log('throwing email error')
        // console.log('body', body)
        throw createError({ status: 422, data: { errors: { email: ['can\'t be blank'] } } })
      }

      if (!body.user.password)
        throw createError({ status: 422, data: { errors: { password: ['can\'t be blank'] } } })

      const user = {
        email: body.user.email,
        token: 'token',
        username: 'myAwesomeLogin',
        bio: '',
        image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
      } as User
      return { user }
    },
  }))
}
