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
import { registerUsersEndpoints } from '~/mocks/users/endpoints'

// @TODO: add tests to unfavorite articles
// @TODO: add tests to check favoriting article page
describe('users', async () => {
  registerArticlesEndpoints()
  registerTagsEndpoints()
  registerAuthEndpoints()
  registerUsersEndpoints()

  describe('unauthenticated', () => {
    it('shows user profile', async () => {
      const wrapper = await mountSuspended(App, {
        route: '/profile/username-1',
      })
      await flushPromises()
      await wait(100)
      expect(wrapper.find('.user-info').text()).toContain('username-1')
    })
    it('displays `My Articles` and `Favorited Articles` tabs', async () => {
      const wrapper = await mountSuspended(App, {
        route: '/profile/username-1',
      })
      await flushPromises()
      await wait(100)
      expect(wrapper.find('.nav-pills').text()).toContain('My Articles')
      expect(wrapper.find('.nav-pills').text()).toContain('Favorited Articles')
    })
    it('redirect user to login on `follow` click', async () => {
      const wrapper = await mountSuspended(App, {
        route: '/profile/username-1',
      })
      await wait(100)
      const followButton = wrapper.find('.user-info button')
      await fireEvent.click(followButton.element)
      await wait(100)
      const nuxtApp = useNuxtApp()
      expect(nuxtApp.$router.currentRoute.value.path).toBe('/login')
    })
    it('redirects user to login on accessing /settings page', async () => {
      await mountSuspended(App, { route: '/settings' })
      await wait(100)
      const nuxtApp = useNuxtApp()
      expect(nuxtApp.$router.currentRoute.value.path).toBe('/login')
    })
  })
  describe('authenticated', () => {
    beforeEach(async () => {
      await logout()
      await wait(100)
    })
    it('should display /settings link', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })
      await login(wrapper)
      await navigateTo({
        path: '/profile/myAwesomeLogin',
        force: true,
        replace: true,
      })
      await wait(100)
      await flushPromises()

      expect(wrapper.find('.user-info').text()).toContain(
        'Edit Profile Settings',
      )
    })
    it('should follow user', async () => {
      const wrapper = await mountSuspended(App, {
        route: '/profile/username-1',
      })
      await login(wrapper)
      await navigateTo({
        path: '/profile/username-1',
        force: true,
        replace: true,
      })
      await wait(100)
      await flushPromises()

      const followButton = wrapper.find('.user-info button')
      await fireEvent.click(followButton.element)
      await wait(100)
      await flushPromises()
      // go to /feed and check that we have 1 article from username-1
      await navigateTo({ path: '/feed', force: true, replace: true })
      await wait(100)
      await flushPromises()
      expect(await wrapper.findAll('.article-preview')).toHaveLength(1)
    })
    it('renders /settings page', async () => {
      const wrapper = await mountSuspended(App, { route: '/settings' })
      await login(wrapper)
      await wait(100)
      await navigateTo({ path: '/settings', force: true, replace: true })
      await wait(100)
      expect(wrapper.find('.settings-page').exists()).toBe(true)
      expect(
        (wrapper.find('[name="username"]').element as HTMLInputElement).value,
      ).toBe('myAwesomeLogin')
      expect(
        (wrapper.find('[name="email"]').element as HTMLInputElement).value,
      ).toBe('email@gmail.com')
    })
    it('updates bio in settings', async () => {
      const wrapper = await mountSuspended(App, { route: '/settings' })
      await login(wrapper)
      await wait(100)
      await navigateTo({ path: '/settings', force: true, replace: true })
      await wait(100)
      const bioInput = wrapper.find('[name="bio"]')
      await bioInput.setValue('new bio')
      await wait(100)
      const form = wrapper.find('form')
      await fireEvent.submit(form.element)
      await wait(100)
      await flushPromises()
      await navigateTo({
        path: '/profile/myAwesomeLogin',
        force: true,
        replace: true,
      })
      await wait(100)
      await flushPromises()
      expect(wrapper.find('.user-info').text()).toContain('new bio')
    })
  })
})
