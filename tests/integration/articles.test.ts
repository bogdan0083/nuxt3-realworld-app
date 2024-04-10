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

describe('articles', async () => {
  registerArticlesEndpoints()
  registerTagsEndpoints()
  registerAuthEndpoints()

  describe('unauthenticated', () => {
    it('should display list of articles', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })

      await flushPromises()
      const articles = await wrapper.findAll('.article-preview')

      expect(articles).toHaveLength(10)
    })
    it('should handle pagination', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })
      const paginationLinkClass = '.pagination .page-link'

      await flushPromises()

      let paginationLinks = await wrapper.findAll(paginationLinkClass)
      const firstLinkParentClass = (paginationLinks[0].element?.parentNode as Element).getAttribute('class')

      expect(firstLinkParentClass).toBe('page-item active')

      // trigger click on last pagination link
      await fireEvent.click(paginationLinks[2].element)

      await wait(100)

      const articles = await wrapper.findAll('.article-preview')

      await nextTick()
      paginationLinks = await wrapper.findAll(paginationLinkClass)
      const secondLinkParentClass = (paginationLinks[2].element?.parentNode as Element).getAttribute('class')
      expect(articles).toHaveLength(2)
      expect(paginationLinks).toHaveLength(3)
      expect(secondLinkParentClass).toBe('page-item active')
    })
    it('should handle tag filtering', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })

      await flushPromises()

      const tagPills = await wrapper.findAll('.sidebar .tag-list .tag-pill')
      expect(tagPills).toHaveLength(10)

      await fireEvent.click(tagPills[0].element)
      await wait(100)

      const articles = await wrapper.findAll('.article-preview')
      expect(articles).toHaveLength(1)
    })
    it('should render article page', async () => {
      const wrapper = await mountSuspended(App, { route: '/article/slug-1' })

      await flushPromises()

      expect(wrapper.find('.article-page').exists()).toBe(true)
      expect(wrapper.find('.banner h1').text()).toContain('title-1')
      expect(wrapper.find('.article-content').text()).toContain('description-1')
      expect(wrapper.find('.article-content').text()).toContain('body-1')
      expect(wrapper.find('.article-content .tag-list').text()).toContain('tag-1')
    })
    it('should redirect on login page when editor page is accessed', async () => {
      const _ = await mountSuspended(App, { route: '/editor' })

      await flushPromises()
      const nuxtApp = useNuxtApp()
      const currentRoutePath = nuxtApp.$router.currentRoute.value.path

      expect(currentRoutePath).toBe('/login')
    })
  })
  describe('authenticated', () => {
    beforeEach(async () => {
      await logout()
    })

    it('should have my feed tab with articles', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })
      await login(wrapper)
      const feedTabs = await wrapper.findAll('.feed-toggle .nav-link')

      expect(feedTabs).toHaveLength(2)

      // when we logged in we are on "your feed" feed by default and have 6 articles
      expect(await wrapper.findAll('.article-preview')).toHaveLength(6)

      await fireEvent.click(feedTabs[1].element)
      await wait(100)

      // now we on the global feed and should have 10 articles
      expect(await wrapper.findAll('.article-preview')).toHaveLength(10)
    })

    it('should create article', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })
      await login(wrapper)
      await navigateTo('/editor')
      await flushPromises()

      const nuxtApp = useNuxtApp()

      const currentRoutePath = nuxtApp.$router.currentRoute.value.path

      expect(currentRoutePath).toBe('/editor')

      const form = await wrapper.find('form')
      const titleInput = await wrapper.find('input[name="title"]')
      const descriptionInput = await wrapper.find('input[name="description"]')
      const bodyInput = await wrapper.find('textarea[name="body"]')
      const tagInput = await wrapper.find('input[name="tags"]')

      await fireEvent.submit(form.element)
      await wait(200)

      expect(wrapper.html()).toContain('title can\'t be blank')

      await titleInput.setValue('new-article-title')
      await descriptionInput.setValue('new article description')
      await bodyInput.setValue('new article body')
      await tagInput.setValue('some-tag')
      await fireEvent.keyDown(tagInput.element, { key: 'Enter' })

      await fireEvent.submit(form.element)
      await wait(300)

      const articlePage = await wrapper.find('.article-page')
      expect(articlePage.exists()).toBe(true)

      const banner = await wrapper.find('.banner')
      expect(banner.text()).toContain('myAwesomeLogin')

      const bannerTitle = await wrapper.find('.banner h1')
      expect(bannerTitle.text()).toContain('new-article-title')

      const articleContent = await wrapper.find('.article-content')

      expect(articleContent.text()).toContain('new article description')
      expect(articleContent.text()).toContain('new article body')
    })

    it('should update article', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })
      await login(wrapper)
      await navigateTo('/editor')
      await flushPromises()
      const form = await wrapper.find('form')
      const titleInput = await wrapper.find('input[name="title"]')
      const descriptionInput = await wrapper.find('input[name="description"]')
      const bodyInput = await wrapper.find('textarea[name="body"]')
      const tagInput = await wrapper.find('input[name="tags"]')

      await titleInput.setValue('updated-article-title')
      await descriptionInput.setValue('updated article description')
      await bodyInput.setValue('updated article body')
      await tagInput.setValue('updated-tag')
      await fireEvent.keyDown(tagInput.element, { key: 'Enter' })

      await fireEvent.submit(form.element)
      await wait(300)
      await flushPromises()

      const nuxtApp = useNuxtApp()
      expect(nuxtApp.$router.currentRoute.value.path).toBe('/article/updated-article-title')

      // @NOTE: Test fails here if we don't add timeout to login (wtf?)
      expect(wrapper.find('.banner').text()).toContain('myAwesomeLogin')
      expect(wrapper.find('.banner h1').text()).toContain('updated-article-title')
      expect(wrapper.find('.article-content').text()).toContain('updated article description')
      expect(wrapper.find('.article-content').text()).toContain('updated article body')
    })
  })
})
