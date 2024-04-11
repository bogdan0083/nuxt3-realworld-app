// @vitest-environment nuxt
// ~/tests/e2e/articles.test.ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { login, logout, wait } from '../utils'
import App from '~/app.vue'
import { registerArticlesEndpoints } from '~/mocks/articles/endpoints'
import { registerAuthEndpoints } from '~/mocks/auth/endpoints'
import { registerTagsEndpoints } from '~/mocks/tags/endpoints'

describe('favorites', async () => {
  registerArticlesEndpoints()
  registerTagsEndpoints()
  registerAuthEndpoints()

  describe('unauthenticated', () => {
    beforeEach(async () => {
      await logout()
      await wait(100)
    })
    it('should redirect on login page', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })
      await flushPromises()

      const articles = await wrapper.findAll('.article-preview')

      const article = articles.find(article => article.text().includes('title-5')) as any

      await fireEvent.click(article?.find('button')?.element)
      await flushPromises()
      await wait(50)

      const nuxtApp = useNuxtApp()
      expect(nuxtApp.$router.currentRoute.value.path).toBe('/login')
    })
  })
  describe('authenticated', () => {
    it('should favorite/unfavorite an article', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })
      await login(wrapper)
      await navigateTo({ path: '/', force: true, replace: true })
      await flushPromises()
      await wait(100)
      await flushPromises()

      const articles = await wrapper.findAll('.article-preview')

      const article = articles.find(article => article.text().includes('title-5')) as any
      const articleFavoriteButton = article?.find('button')

      await fireEvent.click(articleFavoriteButton.element)
      await wait(300)
      await flushPromises()

      await navigateTo('/profile/myAwesomeLogin/favorites')
      await flushPromises()
      await wait(100)

      expect(await wrapper.findAll('.article-preview')).toHaveLength(1)

      await navigateTo({ path: '/', force: true, replace: true })
    })
  })
})
