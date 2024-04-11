import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { readBody } from 'h3'
import { testArticles } from '../articles/endpoints'
import type { GetProfileByUsername200Response, UpdateCurrentUserRequest } from '~/lib/api/__generated__'
import { BASE_API_URL } from '~/lib/constants'

export const testCurrentUser = {
  email: 'email@gmail.com',
  username: 'myAwesomeLogin',
  bio: '',
  token: 'token',
  image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
  password: 'password',
} as UpdateCurrentUserRequest['user']

export function registerUsersEndpoints() {
  registerEndpoint(`${BASE_API_URL}/user`, {
    method: 'PUT',
    handler: async (event) => {
      const body = await readBody<UpdateCurrentUserRequest>(event)

      testCurrentUser.bio = body.user.bio || testCurrentUser.bio
      testCurrentUser.image = body.user.image || testCurrentUser.image
      testCurrentUser.email = body.user.email || testCurrentUser.email
      testCurrentUser.username = body.user.username || testCurrentUser.username
      testCurrentUser.password = body.user.password || testCurrentUser.password
      return { user: testCurrentUser }
    },
  })
  registerEndpoint(`${BASE_API_URL}/user`, async () => {
    return {
      user: { ...testCurrentUser, password: undefined },
    }
  })

  // @TODO: Couldn't find a way to make /profiles/:username/favorite work
  // hardcoding the slug for now
  registerEndpoint(`${BASE_API_URL}/profiles/username-1/follow`, {
    method: 'POST',
    handler: async () => {
      // set following to true
      const idx = testArticles.findIndex(a => a.author.username === 'username-1')
      if (idx === -1)
        throw createError({ status: 404, data: { errors: { body: ['Not found'] } } })

      testArticles[idx].author.following = true
      return { profile: testArticles[idx].author }
    },
  })

  // @TODO: Couldn't find a way to make /profiles/:username/favorite work
  // hardcoding the slug for now
  registerEndpoint(`${BASE_API_URL}/profiles/username-1/follow`, {
    method: 'DELETE',
    handler: async () => {
      // set following to false
      const idx = testArticles.findIndex(a => a.author.username === 'username-1')
      if (idx === -1)
        throw createError({ status: 404, data: { errors: { body: ['Not found'] } } })

      testArticles[idx].author.following = false
      return { profile: testArticles[idx].author }
    },
  })
  registerEndpoint(`${BASE_API_URL}/profiles/username-1`, () => {
    return {
      profile: {
        username: 'username-1',
        bio: '',
        image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
        following: false,
      },
    } as GetProfileByUsername200Response
  })
  registerEndpoint(`${BASE_API_URL}/profiles/myAwesomeLogin`, () => {
    return {
      profile: testCurrentUser,
    } as GetProfileByUsername200Response
  })
}
